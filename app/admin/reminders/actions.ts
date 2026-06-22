'use server';

import { Resend } from 'resend';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logEmail } from '@/lib/emailLog';
import { buildReminderEmail, type ReminderKind } from '@/lib/statusEmails';
import {
  APPLICATION_FEE_KOBO,
  APPLICATION_FEE_NAIRA,
  buildReference,
  initializeTransaction,
  siteUrl,
} from '@/lib/paystack';
import { REMINDER_AUDIENCE } from './audience';

export type ReminderResult = { sent: number; failed: number; skipped: number };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');
}

const REUSE_WINDOW_MS = 25 * 60 * 1000;

type ReminderApplicant = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  trackFirst: string;
  amountPaidKobo: number | null;
  payments: { reference: string; status: string; amount: number; authorizationUrl: string | null; createdAt: Date }[];
};

/** Prisma `select` shared by the bulk and single-applicant flows. */
const APPLICANT_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  trackFirst: true,
  amountPaidKobo: true,
  payments: {
    orderBy: { createdAt: 'desc' },
    select: { reference: true, status: true, amount: true, authorizationUrl: true, createdAt: true },
  },
} as const;

/**
 * For a single applicant: work out the balance, reuse a recent payment link
 * (or initialize a fresh one), then build/send/log the reminder email.
 * Returns the outcome for the caller to tally. Never throws.
 */
async function deliverPaymentLink(
  applicant: ReminderApplicant,
  kind: ReminderKind,
  resend: Resend
): Promise<'sent' | 'failed' | 'skipped'> {
  // ─── Work out how much to charge ───────────────────────────────
  const paidKobo =
    kind === 'part_payment'
      ? applicant.amountPaidKobo ??
        applicant.payments
          .filter((p) => p.status === 'Success')
          .reduce((sum, p) => sum + p.amount, 0)
      : 0;
  const amountKobo =
    kind === 'not_paid'
      ? APPLICATION_FEE_KOBO
      : Math.max(0, APPLICATION_FEE_KOBO - paidKobo);

  if (kind === 'part_payment' && amountKobo <= 0) {
    return 'skipped';
  }

  // ─── Reuse a recent payment link, else initialize a fresh one ──
  let paymentUrl: string | null = null;
  const latest = applicant.payments[0];
  const reusable =
    latest &&
    latest.status === 'Initialized' &&
    latest.authorizationUrl &&
    latest.amount === amountKobo &&
    Date.now() - new Date(latest.createdAt).getTime() < REUSE_WINDOW_MS;

  if (reusable && latest.authorizationUrl) {
    paymentUrl = latest.authorizationUrl;
  } else if (process.env.PAYSTACK_SECRET_KEY) {
    try {
      const reference = buildReference(applicant.id);
      const init = await initializeTransaction({
        email: applicant.email,
        amountKobo,
        reference,
        callbackUrl: `${siteUrl()}/apply/payment/success`,
        metadata: { applicationId: applicant.id, kind: 'reminder', reminderKind: kind },
      });
      await prisma.payment.create({
        data: {
          applicationId: applicant.id,
          reference: init.reference,
          amount: amountKobo,
          authorizationUrl: init.authorization_url,
          status: 'Initialized',
        },
      });
      paymentUrl = init.authorization_url;
    } catch (err) {
      console.error(`[reminders] Paystack init failed for ${applicant.id}:`, err);
    }
  }

  // ─── Build, send, log ──────────────────────────────────────────
  const built = buildReminderEmail(kind, {
    firstName: applicant.firstName,
    lastName: applicant.lastName,
    trackFirst: applicant.trackFirst,
    feeNaira: APPLICATION_FEE_NAIRA,
    amountPaidNaira: paidKobo / 100,
    balanceDueNaira: amountKobo / 100,
    paymentUrl,
  });

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: applicant.email,
      subject: built.subject,
      html: built.html,
    });
    await logEmail({
      applicationId: applicant.id,
      recipient: 'applicant',
      toAddress: applicant.email,
      type: built.type,
      subject: built.subject,
      html: built.html,
    });
    return 'sent';
  } catch (err) {
    console.error(`[reminders] send failed for ${applicant.id}:`, err);
    await logEmail({
      applicationId: applicant.id,
      recipient: 'applicant',
      toAddress: applicant.email,
      type: built.type,
      subject: built.subject,
      html: built.html,
      status: 'failed',
      error: err instanceof Error ? err.message : String(err),
    });
    return 'failed';
  }
}

export async function sendReminders(kind: ReminderKind): Promise<ReminderResult> {
  await requireAdmin();

  const result: ReminderResult = { sent: 0, failed: 0, skipped: 0 };

  if (!process.env.RESEND_KEY || !process.env.EMAIL_FROM) {
    console.warn('[reminders] RESEND_KEY/EMAIL_FROM not configured — skipping send');
    return result;
  }

  const applicants = await prisma.application.findMany({
    where: REMINDER_AUDIENCE[kind],
    select: APPLICANT_SELECT,
  });

  const resend = new Resend(process.env.RESEND_KEY);

  for (const applicant of applicants) {
    result[await deliverPaymentLink(applicant, kind, resend)] += 1;
    // Throttle to stay under Resend's rate limit.
    await new Promise((r) => setTimeout(r, 250));
  }

  revalidatePath('/admin/reminders');
  return result;
}

/**
 * Send a single applicant a fresh payment link for their outstanding balance.
 * Derives the reminder kind from their payment status; no-ops (skipped) for
 * anyone who owes nothing or is on a full scholarship.
 */
export async function sendPaymentLink(applicationId: string): Promise<ReminderResult> {
  await requireAdmin();

  const result: ReminderResult = { sent: 0, failed: 0, skipped: 0 };

  if (!process.env.RESEND_KEY || !process.env.EMAIL_FROM) {
    console.warn('[reminders] RESEND_KEY/EMAIL_FROM not configured — skipping send');
    return result;
  }

  const applicant = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { ...APPLICANT_SELECT, paymentStatus: true, needsAid: true, aidLevel: true },
  });
  if (!applicant) {
    result.skipped += 1;
    return result;
  }

  const isFullScholarship = applicant.needsAid && applicant.aidLevel === 'full';
  let kind: ReminderKind;
  if (applicant.paymentStatus === 'Pending' && !isFullScholarship) {
    kind = 'not_paid';
  } else if (applicant.paymentStatus === 'Partial') {
    kind = 'part_payment';
  } else {
    result.skipped += 1;
    return result;
  }

  const resend = new Resend(process.env.RESEND_KEY);
  result[await deliverPaymentLink(applicant, kind, resend)] += 1;

  revalidatePath(`/admin/applications/${applicationId}`);
  return result;
}
