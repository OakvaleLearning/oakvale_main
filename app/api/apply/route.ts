import { Resend } from 'resend';
import { put } from '@vercel/blob';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  APPLICATION_FEE_KOBO,
  APPLICATION_FEE_NAIRA,
  buildReference,
  initializeTransaction,
  siteUrl,
} from '@/lib/paystack';

const TRACK_NAMES: Record<string, string> = {
  A: 'Track A — Clinical Enterprise',
  B: 'Track B — Health Systems Leadership',
  C: 'Track C — Digital Health Innovation',
};

const AID_NAMES: Record<string, string> = {
  full: 'Full scholarship (₦10,000 fee waived)',
  partial: 'Partial support (fee partially reduced)',
  flexible: 'Flexible payment (two instalments)',
};

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 16px;width:38%;color:#5A5A5A;font-size:13px;vertical-align:top;border-bottom:1px solid #e8e2da;font-family:Arial,sans-serif;">${label}</td>
      <td style="padding:10px 16px;color:#1C1C1C;font-size:13px;font-weight:600;border-bottom:1px solid #e8e2da;font-family:Arial,sans-serif;">${value || '—'}</td>
    </tr>`;
}

function sectionHead(title: string) {
  return `
    <tr>
      <td colspan="2" style="padding:18px 16px 6px;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#C8881A;font-family:Arial,sans-serif;border-bottom:2px solid #C8881A;">
        ${title}
      </td>
    </tr>`;
}

type EmailData = {
  firstName: string; lastName: string; email: string; phone: string; state: string;
  institution: string; discipline: string; yearOfStudy: string; studentId: string;
  trackFirst: string; trackSecond: string;
  mot1: string; mot2: string;
  needsAid: boolean; aidLevel: string; aidStatement: string;
  fileCount: number;
  applicationId: string;
};

function buildHtml(data: EmailData) {
  const {
    firstName, lastName, email, phone, state,
    institution, discipline, yearOfStudy, studentId,
    trackFirst, trackSecond,
    mot1, mot2,
    needsAid, aidLevel, aidStatement,
    fileCount, applicationId,
  } = data;

  const submitted = new Date().toLocaleString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Lagos',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F3EC;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EC;padding:32px 0;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:6px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <tr>
          <td style="background:#0A3D2B;padding:28px 32px;">
            <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#C8881A;margin-bottom:6px;font-family:Arial,sans-serif;">
              Oakvale Learning · Summer Intensive 2026
            </div>
            <div style="font-size:22px;font-weight:400;color:#ffffff;font-family:Georgia,serif;line-height:1.3;">
              New Application Received
            </div>
            <div style="margin-top:8px;font-size:13px;color:rgba(255,255,255,0.65);font-family:Arial,sans-serif;">
              Submitted ${submitted} (Lagos time) · ID ${applicationId}
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e2da;border-radius:4px;border-collapse:collapse;">
              ${sectionHead('Personal Details')}
              ${row('Full name', `${firstName} ${lastName}`)}
              ${row('Email address', email)}
              ${row('Phone (WhatsApp)', phone)}
              ${row('State of residence', state)}
              ${sectionHead('Academic Information')}
              ${row('Institution', institution)}
              ${row('Discipline', discipline)}
              ${row('Year of study', yearOfStudy)}
              ${row('Student ID', studentId)}
              ${sectionHead('Track Selection')}
              ${row('First preference', trackFirst ? TRACK_NAMES[trackFirst] : '—')}
              ${row('Second preference', trackSecond ? TRACK_NAMES[trackSecond] : 'None')}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e2da;border-radius:4px;border-collapse:collapse;">
              ${sectionHead('Motivation Statement')}
              <tr><td colspan="2" style="padding:12px 16px 4px;font-size:11px;font-weight:700;color:#5A5A5A;text-transform:uppercase;letter-spacing:0.1em;font-family:Arial,sans-serif;">Why have you chosen your track?</td></tr>
              <tr><td colspan="2" style="padding:4px 16px 14px;font-size:13px;color:#1C1C1C;line-height:1.7;border-bottom:1px solid #e8e2da;font-family:Arial,sans-serif;white-space:pre-wrap;">${mot1}</td></tr>
              <tr><td colspan="2" style="padding:12px 16px 4px;font-size:11px;font-weight:700;color:#5A5A5A;text-transform:uppercase;letter-spacing:0.1em;font-family:Arial,sans-serif;">What will you do differently as a health professional?</td></tr>
              <tr><td colspan="2" style="padding:4px 16px 14px;font-size:13px;color:#1C1C1C;line-height:1.7;font-family:Arial,sans-serif;white-space:pre-wrap;">${mot2}</td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e2da;border-radius:4px;border-collapse:collapse;">
              ${sectionHead('Financial Aid')}
              ${row('Applying for aid', needsAid ? 'Yes' : 'No')}
              ${needsAid ? row('Level of support', AID_NAMES[aidLevel] || '—') : ''}
              ${needsAid && aidStatement ? `
              <tr><td colspan="2" style="padding:12px 16px 4px;font-size:11px;font-weight:700;color:#5A5A5A;text-transform:uppercase;letter-spacing:0.1em;font-family:Arial,sans-serif;">Aid statement</td></tr>
              <tr><td colspan="2" style="padding:4px 16px 14px;font-size:13px;color:#1C1C1C;line-height:1.7;border-bottom:1px solid #e8e2da;font-family:Arial,sans-serif;white-space:pre-wrap;">${aidStatement}</td></tr>` : ''}
              ${needsAid ? row('Supporting documents', fileCount ? `${fileCount} file${fileCount !== 1 ? 's' : ''} uploaded` : 'None') : ''}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 32px;">
            <div style="background:#F7F3EC;border-radius:4px;padding:14px 16px;font-size:12px;color:#5A5A5A;line-height:1.6;font-family:Arial,sans-serif;">
              This application was submitted through the Oakvale Learning website. Reply directly to this email to contact the applicant at <strong>${email}</strong>.
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#0A3D2B;padding:16px 32px;text-align:center;">
            <div style="font-size:11px;color:rgba(255,255,255,0.55);font-family:Arial,sans-serif;">
              OAKVALE LEARNING · hello@oakvaleltd.com · www.oakvaleltd.com
            </div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildApplicantHtml(data: {
  firstName: string;
  lastName: string;
  applicationId: string;
  trackFirst: string;
  requiresPayment: boolean;
  paymentUrl: string | null;
  feeNaira: number;
  fullScholarship: boolean;
}) {
  const { firstName, lastName, applicationId, trackFirst, requiresPayment, paymentUrl, feeNaira, fullScholarship } = data;
  const fullName = `${firstName} ${lastName}`.trim();
  const trackLabel = trackFirst ? TRACK_NAMES[trackFirst] || `Track ${trackFirst}` : '';
  const feeFormatted = `₦${feeNaira.toLocaleString('en-NG')}`;

  // ─── Scholarship applicants get a dedicated email (no payment, review pool) ──
  if (fullScholarship) {
    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F7F3EC;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EC;padding:32px 0;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:6px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <tr>
          <td style="background:#0A3D2B;padding:28px 32px;">
            <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#C8881A;margin-bottom:6px;">Oakvale Learning · Summer Intensive 2026</div>
            <div style="font-size:22px;color:#ffffff;font-family:Georgia,serif;line-height:1.3;">Your scholarship application is complete</div>
          </td>
        </tr>
        <tr>
          <td style="padding:26px 32px 4px;font-size:14px;color:#1C1C1C;line-height:1.7;">
            Dear ${fullName},<br><br>
            Thank you for applying to the <strong>Healthcare Leadership and Innovation Summer Intensive 2026</strong>. Your application${trackLabel ? ` for <strong>${trackLabel}</strong>` : ''} is now complete.
            <br><br>
            As you have selected the scholarship option, your application has now been passed on to our scholarship review pool. There are a limited number of scholarship places, so each application is read carefully and fairly. You do not need to do anything else for now.
          </td>
        </tr>
        <tr>
          <td style="padding:14px 32px 0;">
            <div style="background:#F7F3EC;border:1px solid #e8e2da;border-left:4px solid #C8881A;border-radius:6px;padding:18px 22px;font-size:13px;color:#1C1C1C;line-height:1.7;font-family:Arial,sans-serif;">
              <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#C8881A;margin-bottom:10px;">What happens next</div>
              <strong>2 July 2026</strong> — Registration closes. All scholarship applications will be reviewed together once the window has ended.<br><br>
              <strong>On or before 9 July 2026</strong> — We will email you with the outcome of your scholarship application.
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 0;font-size:14px;color:#1C1C1C;line-height:1.7;">
            We know waiting is not easy, so we will keep this simple: watch your inbox in early July. Please check your spam or junk folder too, just in case our message lands there.
            <br><br>
            If you have any questions in the meantime, simply reply to this email or write to us at <a href="mailto:hello@oakvaleltd.com" style="color:#0A3D2B;">hello@oakvaleltd.com</a>. We are happy to help.
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 32px;font-size:14px;color:#1C1C1C;line-height:1.7;">
            Warm regards,<br>
            <strong>Sitasri De</strong><br>
            Programme Co-ordinator<br>
            Oakvale Learning
          </td>
        </tr>
        <tr>
          <td style="background:#0A3D2B;padding:16px 32px;text-align:center;font-size:11px;color:rgba(255,255,255,0.55);">
            OAKVALE LEARNING · hello@oakvaleltd.com · www.oakvaleltd.com
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
  }

  const payBlock = requiresPayment && paymentUrl ? `
        <tr>
          <td style="padding:8px 32px 0;">
            <div style="background:#F7F3EC;border:1px solid #e8e2da;border-radius:6px;padding:22px 24px;text-align:center;">
              <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#C8881A;margin-bottom:8px;font-family:Arial,sans-serif;">
                Application fee
              </div>
              <div style="font-size:20px;font-weight:500;color:#0A3D2B;font-family:Georgia,serif;margin-bottom:6px;">
                ${feeFormatted} — payable now
              </div>
              <div style="font-size:13px;color:#5A5A5A;line-height:1.6;font-family:Arial,sans-serif;margin-bottom:18px;">
                Complete your application by paying the non-refundable application fee through our secure Paystack checkout.
              </div>
              <a href="${paymentUrl}" style="display:inline-block;background:#0A3D2B;color:#ffffff;text-decoration:none;font-weight:500;font-size:14px;font-family:Arial,sans-serif;padding:12px 28px;border-radius:4px;">
                Pay ${feeFormatted}
              </a>
              <div style="margin-top:14px;font-size:12px;color:#5A5A5A;font-family:Arial,sans-serif;word-break:break-all;">
                Or paste this link into your browser:<br>
                <a href="${paymentUrl}" style="color:#0A3D2B;">${paymentUrl}</a>
              </div>
            </div>
          </td>
        </tr>` : '';

  const scholarshipBlock = fullScholarship ? `
        <tr>
          <td style="padding:8px 32px 0;">
            <div style="background:#F7F3EC;border:1px solid #e8e2da;border-radius:6px;padding:18px 22px;font-size:13px;color:#1C1C1C;line-height:1.7;font-family:Arial,sans-serif;">
              You have requested a <strong>Full Scholarship</strong>. Our team will review your supporting documents and contact you separately about the scholarship decision — no payment is required at this stage.
            </div>
          </td>
        </tr>` : '';

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F7F3EC;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EC;padding:32px 0;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:6px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <tr>
          <td style="background:#0A3D2B;padding:28px 32px;">
            <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#C8881A;margin-bottom:6px;">Oakvale Learning · Summer Intensive 2026</div>
            <div style="font-size:22px;color:#ffffff;font-family:Georgia,serif;line-height:1.3;">Application received</div>
          </td>
        </tr>
        <tr>
          <td style="padding:26px 32px 4px;font-size:14px;color:#1C1C1C;line-height:1.7;">
            Dear ${fullName},<br><br>
            Thank you for applying to the <strong>Healthcare Leadership and Innovation Summer Intensive 2026</strong>. We have received your application${trackLabel ? ` for <strong>${trackLabel}</strong>` : ''}.
            <br><br>
            Your application reference is <strong>${applicationId}</strong>. Please keep this for your records.
          </td>
        </tr>
        ${payBlock}
        ${scholarshipBlock}
        <tr>
          <td style="padding:20px 32px 0;font-size:13px;color:#5A5A5A;line-height:1.7;">
            Applications are reviewed on a rolling basis. If you are selected, you will hear from us within five working days of completing your application. If you have any questions, simply reply to this email.
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 32px;font-size:14px;color:#1C1C1C;line-height:1.7;">
            Warm regards,<br>
            <strong>Sitasri De</strong><br>
            Programme Co-ordinator<br>
            Oakvale Learning
          </td>
        </tr>
        <tr>
          <td style="background:#0A3D2B;padding:16px 32px;text-align:center;font-size:11px;color:rgba(255,255,255,0.55);">
            OAKVALE LEARNING · hello@oakvaleltd.com · www.oakvaleltd.com
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

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
        try {
          const resend = new Resend(process.env.RESEND_KEY);
          const existingScholarship = existing.needsAid && existing.aidLevel === 'full';
          await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: existing.email,
            subject: existingScholarship
              ? 'Your scholarship application is complete — Summer Intensive 2026'
              : 'Complete your Oakvale Summer Intensive 2026 application',
            html: buildApplicantHtml({
              firstName: existing.firstName,
              lastName: existing.lastName,
              applicationId: existing.id,
              trackFirst: existing.trackFirst,
              requiresPayment,
              paymentUrl: retryUrl,
              feeNaira: APPLICATION_FEE_NAIRA,
              fullScholarship: existingScholarship,
            }),
          });
        } catch (emailErr) {
          console.error('Retry applicant email failed:', emailErr);
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
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO,
            replyTo: fields.email,
            subject: `Application: ${fields.firstName} ${fields.lastName} — Oakvale Summer Intensive 2026`,
            html: buildHtml({
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
            }),
          });
        } catch (emailErr) {
          console.error('Admin email failed:', emailErr);
        }
      }

      // 2. Applicant acknowledgement
      try {
        const isScholarship = needsAid && fields.aidLevel === 'full';
        await resend.emails.send({
          from: process.env.EMAIL_FROM,
          to: fields.email,
          subject: isScholarship
            ? 'Your scholarship application is complete — Summer Intensive 2026'
            : 'We have received your Oakvale Summer Intensive 2026 application',
          html: buildApplicantHtml({
            firstName: fields.firstName,
            lastName: fields.lastName,
            applicationId: application.id,
            trackFirst: fields.trackFirst,
            requiresPayment,
            paymentUrl,
            feeNaira: APPLICATION_FEE_NAIRA,
            fullScholarship: isScholarship,
          }),
        });
      } catch (emailErr) {
        console.error('Applicant email failed:', emailErr);
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
