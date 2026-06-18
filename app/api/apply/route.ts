import { Resend } from 'resend';
import { put } from '@vercel/blob';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { logEmail } from '@/lib/emailLog';
import { buildHtml, buildApplicantHtml } from '@/lib/applyEmails';
import {
  APPLICATION_FEE_KOBO,
  APPLICATION_FEE_NAIRA,
  buildReference,
  initializeTransaction,
  siteUrl,
} from '@/lib/paystack';


type ParsedPayload = {
  fields: Record<string, string>;
  consents: { truth: boolean; contact: boolean; terms: boolean };
  files: File[];
};

async function parseRequest(request: Request): Promise<ParsedPayload> {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('multipart/form-data')) {
    const fd = await request.formData();
    const fields: Record<string, string> = {};
    const files: File[] = [];
    for (const [key, value] of fd.entries()) {
      if (value instanceof File) {
        if (value.size > 0) files.push(value);
      } else {
        fields[key] = String(value);
      }
    }
    return {
      fields,
      consents: {
        truth: fields.consentTruth === 'true',
        contact: fields.consentContact === 'true',
        terms: fields.consentTerms === 'true',
      },
      files,
    };
  }

  const body = await request.json();
  const fields: Record<string, string> = {};
  for (const [k, v] of Object.entries(body)) {
    if (typeof v === 'boolean') fields[k] = v ? 'true' : 'false';
    else fields[k] = v == null ? '' : String(v);
  }
  return {
    fields,
    consents: {
      truth: !!body.consentTruth,
      contact: !!body.consentContact,
      terms: !!body.consentTerms,
    },
    files: [],
  };
}

export async function POST(request: Request) {
  try {
    const { fields, consents, files } = await parseRequest(request);

    const required = ['firstName', 'lastName', 'email', 'phone', 'state',
      'institution', 'discipline', 'yearOfStudy', 'studentId',
      'trackFirst', 'mot1', 'mot2'];
    for (const key of required) {
      if (!fields[key]) {
        return Response.json({ success: false, error: `Missing required field: ${key}` }, { status: 400 });
      }
    }

    fields.email = fields.email.trim().toLowerCase();
    fields.studentId = fields.studentId.trim();

    const needsAid = fields.needsAid === 'true';
    const requiresPayment = !(needsAid && fields.aidLevel === 'full');

    // ─── Duplicate check (email OR studentId)
    const existing = await prisma.application.findFirst({
      where: {
        OR: [{ email: fields.email }, { studentId: fields.studentId }],
      },
      include: { payments: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (existing) {
      if (existing.paymentStatus === 'Paid' || existing.paymentStatus === 'Waived') {
        return Response.json(
          {
            success: false,
            error: 'An application with this email or student ID has already been submitted and the fee is settled. Please contact hello@oakvaleltd.com if this looks wrong.',
          },
          { status: 409 }
        );
      }
      if (existing.paymentStatus === 'Rejected') {
        return Response.json(
          {
            success: false,
            error: 'A previous application with this email or student ID was rejected. Please contact hello@oakvaleltd.com before re-applying.',
          },
          { status: 403 }
        );
      }

      // Pending — give them a fresh pay link (or reuse a recent one)
      const latest = existing.payments[0];
      const reusable =
        latest &&
        latest.status === 'Initialized' &&
        latest.authorizationUrl &&
        Date.now() - new Date(latest.createdAt).getTime() < 25 * 60 * 1000;

      let retryUrl: string | null = null;
      let retryRef: string | null = null;

      if (reusable && latest.authorizationUrl) {
        retryUrl = latest.authorizationUrl;
        retryRef = latest.reference;
      } else if (requiresPayment && process.env.PAYSTACK_SECRET_KEY) {
        try {
          const reference = buildReference(existing.id);
          const init = await initializeTransaction({
            email: existing.email,
            amountKobo: APPLICATION_FEE_KOBO,
            reference,
            callbackUrl: `${siteUrl()}/apply/payment/success`,
            metadata: {
              applicationId: existing.id,
              firstName: existing.firstName,
              lastName: existing.lastName,
              track: existing.trackFirst,
              retry: true,
            },
          });
          await prisma.payment.create({
            data: {
              applicationId: existing.id,
              reference: init.reference,
              amount: APPLICATION_FEE_KOBO,
              authorizationUrl: init.authorization_url,
              status: 'Initialized',
            },
          });
          retryUrl = init.authorization_url;
          retryRef = init.reference;
        } catch (paystackErr) {
          console.error('Paystack re-init failed:', paystackErr);
        }
      }

      // Re-send the applicant acknowledgement so they have the fresh pay link
      if (process.env.RESEND_KEY && process.env.EMAIL_FROM) {
        const existingScholarship = existing.needsAid && existing.aidLevel === 'full';
        const retrySubject = existingScholarship
          ? 'Your scholarship application is complete — Summer Intensive 2026'
          : 'Complete your Oakvale Summer Intensive 2026 application';
        const retryHtml = buildApplicantHtml({
          firstName: existing.firstName,
          lastName: existing.lastName,
          applicationId: existing.id,
          trackFirst: existing.trackFirst,
          requiresPayment,
          paymentUrl: retryUrl,
          feeNaira: APPLICATION_FEE_NAIRA,
          fullScholarship: existingScholarship,
        });
        try {
          const resend = new Resend(process.env.RESEND_KEY);
          await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: existing.email,
            subject: retrySubject,
            html: retryHtml,
          });
          await logEmail({
            applicationId: existing.id,
            recipient: 'applicant',
            toAddress: existing.email,
            type: 'application_retry',
            subject: retrySubject,
            html: retryHtml,
          });
        } catch (emailErr) {
          console.error('Retry applicant email failed:', emailErr);
          await logEmail({
            applicationId: existing.id,
            recipient: 'applicant',
            toAddress: existing.email,
            type: 'application_retry',
            subject: retrySubject,
            html: retryHtml,
            status: 'failed',
            error: emailErr instanceof Error ? emailErr.message : String(emailErr),
          });
        }
      }

      return Response.json(
        {
          success: true,
          id: existing.id,
          requiresPayment,
          paymentUrl: retryUrl,
          reference: retryRef,
          reused: true,
        },
        { status: 200 }
      );
    }

    let aidFiles: { url: string; name: string; size: number }[] = [];
    if (needsAid && files.length > 0 && process.env.BLOB_READ_WRITE_TOKEN) {
      for (const file of files.slice(0, 3)) {
        if (file.size > 5 * 1024 * 1024) continue;
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const blob = await put(`applications/${Date.now()}-${safeName}`, file, {
          access: 'public',
          addRandomSuffix: true,
        });
        aidFiles.push({ url: blob.url, name: file.name, size: file.size });
      }
    }

    let application;
    try {
      application = await prisma.application.create({
        data: {
          firstName: fields.firstName,
          lastName: fields.lastName,
          email: fields.email,
          phone: fields.phone,
          state: fields.state,
          institution: fields.institution,
          discipline: fields.discipline,
          yearOfStudy: fields.yearOfStudy,
          studentId: fields.studentId,
          trackFirst: fields.trackFirst,
          trackSecond: fields.trackSecond || null,
          mot1: fields.mot1,
          mot2: fields.mot2,
          needsAid,
          aidLevel: needsAid ? fields.aidLevel || null : null,
          aidStatement: needsAid ? fields.aidStatement || null : null,
          aidFiles: aidFiles.length ? aidFiles : undefined,
          fileCount: files.length,
          consentTruth: consents.truth,
          consentContact: consents.contact,
          consentTerms: consents.terms,
          paymentStatus: 'Pending',
          status: 'Submitted',
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        return Response.json(
          {
            success: false,
            error: 'An application with this email or student ID already exists. Please use the original link in your email to complete payment, or contact hello@oakvaleltd.com.',
          },
          { status: 409 }
        );
      }
      throw err;
    }

    // ─── Initialize Paystack transaction (skip for full-scholarship applicants)
    let paymentUrl: string | null = null;
    let paymentReference: string | null = null;

    if (requiresPayment && process.env.PAYSTACK_SECRET_KEY) {
      try {
        const reference = buildReference(application.id);
        const init = await initializeTransaction({
          email: fields.email,
          amountKobo: APPLICATION_FEE_KOBO,
          reference,
          callbackUrl: `${siteUrl()}/apply/payment/success`,
          metadata: {
            applicationId: application.id,
            firstName: fields.firstName,
            lastName: fields.lastName,
            track: fields.trackFirst,
          },
        });
        await prisma.payment.create({
          data: {
            applicationId: application.id,
            reference: init.reference,
            amount: APPLICATION_FEE_KOBO,
            authorizationUrl: init.authorization_url,
            status: 'Initialized',
          },
        });
        paymentUrl = init.authorization_url;
        paymentReference = init.reference;
      } catch (paystackErr) {
        console.error('Paystack init failed (application saved without payment):', paystackErr);
      }
    }

    // ─── Emails
    if (process.env.RESEND_KEY && process.env.EMAIL_FROM) {
      const resend = new Resend(process.env.RESEND_KEY);

      // 1. Admin notification
      if (process.env.EMAIL_TO) {
        const adminSubject = `Application: ${fields.firstName} ${fields.lastName} — Oakvale Summer Intensive 2026`;
        const adminHtml = buildHtml({
          firstName: fields.firstName,
          lastName: fields.lastName,
          email: fields.email,
          phone: fields.phone,
          state: fields.state,
          institution: fields.institution,
          discipline: fields.discipline,
          yearOfStudy: fields.yearOfStudy,
          studentId: fields.studentId,
          trackFirst: fields.trackFirst,
          trackSecond: fields.trackSecond || '',
          mot1: fields.mot1,
          mot2: fields.mot2,
          needsAid,
          aidLevel: fields.aidLevel || '',
          aidStatement: fields.aidStatement || '',
          fileCount: files.length,
          applicationId: application.id,
        });
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO,
            replyTo: fields.email,
            subject: adminSubject,
            html: adminHtml,
          });
          await logEmail({
            applicationId: application.id,
            recipient: 'admin',
            toAddress: process.env.EMAIL_TO,
            type: 'admin_notification',
            subject: adminSubject,
            html: adminHtml,
          });
        } catch (emailErr) {
          console.error('Admin email failed:', emailErr);
          await logEmail({
            applicationId: application.id,
            recipient: 'admin',
            toAddress: process.env.EMAIL_TO,
            type: 'admin_notification',
            subject: adminSubject,
            html: adminHtml,
            status: 'failed',
            error: emailErr instanceof Error ? emailErr.message : String(emailErr),
          });
        }
      }

      // 2. Applicant acknowledgement
      const isScholarship = needsAid && fields.aidLevel === 'full';
      const applicantSubject = isScholarship
        ? 'Your scholarship application is complete — Summer Intensive 2026'
        : 'We have received your Oakvale Summer Intensive 2026 application';
      const applicantHtml = buildApplicantHtml({
        firstName: fields.firstName,
        lastName: fields.lastName,
        applicationId: application.id,
        trackFirst: fields.trackFirst,
        requiresPayment,
        paymentUrl,
        feeNaira: APPLICATION_FEE_NAIRA,
        fullScholarship: isScholarship,
      });
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM,
          to: fields.email,
          subject: applicantSubject,
          html: applicantHtml,
        });
        await logEmail({
          applicationId: application.id,
          recipient: 'applicant',
          toAddress: fields.email,
          type: isScholarship ? 'application_scholarship' : 'application_received',
          subject: applicantSubject,
          html: applicantHtml,
        });
      } catch (emailErr) {
        console.error('Applicant email failed:', emailErr);
        await logEmail({
          applicationId: application.id,
          recipient: 'applicant',
          toAddress: fields.email,
          type: isScholarship ? 'application_scholarship' : 'application_received',
          subject: applicantSubject,
          html: applicantHtml,
          status: 'failed',
          error: emailErr instanceof Error ? emailErr.message : String(emailErr),
        });
      }
    }

    return Response.json(
      {
        success: true,
        id: application.id,
        requiresPayment,
        paymentUrl,
        reference: paymentReference,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Apply route error:', error);
    return Response.json({ success: false, error: 'Failed to submit application. Please try again.' }, { status: 500 });
  }
}
