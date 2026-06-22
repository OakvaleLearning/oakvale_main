import { Resend } from 'resend';
import { logEmail } from '@/lib/emailLog';

const TRACK_NAMES: Record<string, string> = {
  A: 'Track A — Clinical Enterprise',
  B: 'Track B — Health Systems Leadership',
  C: 'Track C — Digital Health Innovation',
};

const C = {
  forest: '#0A3D2B',
  gold: '#C8881A',
  cream: '#F7F3EC',
  charcoal: '#1C1C1C',
  muted: '#5A5A5A',
  red: '#9a1d1d',
  border: '#e8e2da',
};

type Accent = 'gold' | 'red';

const LEARNING_PLATFORM_URL = 'https://oakvale-learning.mn.co/collections/3101470';

function accentColor(accent: Accent): string {
  return accent === 'red' ? C.red : C.gold;
}

/** Shared themed HTML shell — navy header, white card on cream, navy footer. */
function renderShell({
  badge,
  heading,
  accent,
  bodyHtml,
}: {
  badge: string;
  heading: string;
  accent: Accent;
  bodyHtml: string;
}): string {
  const eyebrow = accentColor(accent);
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${C.cream};font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};padding:32px 0;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:6px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <tr>
          <td style="background:${C.forest};padding:28px 32px;">
            <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${eyebrow};margin-bottom:6px;font-family:Arial,sans-serif;">${badge}</div>
            <div style="font-size:22px;font-weight:400;color:#ffffff;font-family:Georgia,serif;line-height:1.3;">${heading}</div>
          </td>
        </tr>
        ${bodyHtml}
        <tr>
          <td style="background:${C.forest};padding:16px 32px;text-align:center;">
            <div style="font-size:11px;color:rgba(255,255,255,0.55);font-family:Arial,sans-serif;">
              OAKVALE LEARNING · hello@oakvaleltd.com · www.oakvaleltd.com
            </div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function paragraph(html: string): string {
  return `<tr><td style="padding:0 32px 16px;font-size:14px;color:${C.charcoal};line-height:1.7;font-family:Arial,sans-serif;">${html}</td></tr>`;
}

function greeting(firstName: string): string {
  return `<tr><td style="padding:26px 32px 16px;font-size:14px;color:${C.charcoal};line-height:1.7;font-family:Arial,sans-serif;">Dear ${firstName},</td></tr>`;
}

function signoff(): string {
  return `<tr><td style="padding:8px 32px 32px;font-size:14px;color:${C.charcoal};line-height:1.7;font-family:Arial,sans-serif;">Warm regards,<br><strong>Sitasri De</strong><br>Programme Co-ordinator<br>Oakvale Learning</td></tr>`;
}

function callout({ accent, html }: { accent: Accent; html: string }): string {
  const eyebrow = accentColor(accent);
  return `<tr><td style="padding:4px 32px 20px;">
    <div style="background:${C.cream};border:1px solid ${C.border};border-left:4px solid ${eyebrow};border-radius:6px;padding:18px 22px;font-size:13px;color:${C.charcoal};line-height:1.7;font-family:Arial,sans-serif;">${html}</div>
  </td></tr>`;
}

function reference(applicationId: string): string {
  return paragraph(`Your application reference is <strong>${applicationId}</strong>. Please keep this for your records.`);
}

/** Reassurance shown beneath a payment button — link freshness fallback. */
function linkFreshnessNote(): string {
  return paragraph(`If the payment link above no longer works, simply reply to this email and we'll send you a fresh one.`);
}

export type ApplicantContext = {
  firstName: string;
  lastName: string;
  trackFirst: string;
  applicationId: string;
  amountPaidNaira?: number;
  balanceDueNaira?: number;
  completePaymentUrl?: string | null;
};

type Built = { subject: string; html: string };

function trackLabel(trackFirst: string): string {
  return TRACK_NAMES[trackFirst] || (trackFirst ? `Track ${trackFirst}` : 'your chosen track');
}

function formatNaira(naira: number): string {
  return `₦${Math.round(naira).toLocaleString('en-NG')}`;
}

// ─── Payment templates ──────────────────────────────────────────────

function paymentPaid({ firstName, lastName, trackFirst }: ApplicantContext): Built {
  const fullName = `${firstName} ${lastName}`.trim();
  const track = trackLabel(trackFirst);
  const button = `<tr><td style="padding:4px 32px 24px;text-align:center;">
    <a href="${LEARNING_PLATFORM_URL}" style="display:inline-block;background:${C.forest};color:#ffffff;text-decoration:none;font-weight:500;font-size:14px;font-family:Arial,sans-serif;padding:13px 30px;border-radius:4px;">Join the Learning Platform</a>
  </td></tr>`;
  const body =
    `<tr><td style="padding:26px 32px 16px;font-size:14px;color:${C.charcoal};line-height:1.7;font-family:Arial,sans-serif;">Dear ${fullName},</td></tr>` +
    paragraph(`Wonderful news — your payment has come through, and your spot on the <strong>Healthcare Leadership and Innovation Summer Intensive 2026</strong> is officially secured. Welcome aboard.`) +
    paragraph(`You are enrolled on <strong>${track}</strong>. Over the coming weeks you will learn by doing, tackle real healthcare challenges, and grow alongside a community of motivated students — we are genuinely delighted to have you with us.`) +
    callout({
      accent: 'gold',
      html: `<div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${C.gold};margin-bottom:10px;">Your Joining Instructions</div>
        <strong>Opening Ceremony.</strong> 8 August 2026, Julius Berger Hall, University of Lagos, Yaba.<br><br>
        <strong>Online learning.</strong> 10 August to 4 September 2026, delivered on our online learning platform.<br><br>
        <strong>Showcase and Health Innovation Challenge.</strong> 5 September 2026.`,
    }) +
    paragraph(`Your first step is to join the online learning space. Tap the button below and sign in with the same email address you used to apply.`) +
    button +
    paragraph(`Once you are in, set up your profile and have a look around — your course materials, schedule, and group spaces all live there, ready for you.`) +
    paragraph(`If you have any questions, simply reply to this email or write to us at <a href="mailto:hello@oakvaleltd.com" style="color:${C.forest};">hello@oakvaleltd.com</a>. We are happy to help.`) +
    signoff();
  return {
    subject: "You're In! Welcome To The Health Leadership & Innovation Summer Intensive",
    html: renderShell({ badge: 'Oakvale Learning · Summer Intensive 2026', heading: "You're in — welcome aboard", accent: 'gold', bodyHtml: body }),
  };
}

function paymentPartial({ firstName, lastName, trackFirst, amountPaidNaira, balanceDueNaira, completePaymentUrl }: ApplicantContext): Built {
  const fullName = `${firstName} ${lastName}`.trim();
  const track = trackLabel(trackFirst);
  const button = completePaymentUrl ? `<tr><td style="padding:4px 32px 24px;text-align:center;">
    <a href="${completePaymentUrl}" style="display:inline-block;background:${C.forest};color:#ffffff;text-decoration:none;font-weight:500;font-size:14px;font-family:Arial,sans-serif;padding:13px 30px;border-radius:4px;">Complete My Payment</a>
  </td></tr>` : '';
  const moneyRow = (label: string, value: string) =>
    `<tr>
      <td style="padding:8px 0;font-size:13px;color:${C.muted};font-family:Arial,sans-serif;">${label}</td>
      <td style="padding:8px 0;font-size:14px;font-weight:700;color:${C.charcoal};text-align:right;font-family:Arial,sans-serif;">${value}</td>
    </tr>`;
  const body =
    `<tr><td style="padding:26px 32px 16px;font-size:14px;color:${C.charcoal};line-height:1.7;font-family:Arial,sans-serif;">Dear ${fullName},</td></tr>` +
    paragraph(`Thank you for your application. We have received <strong>part</strong> of your application fee for the <strong>Healthcare Leadership and Innovation Summer Intensive 2026</strong>, and your place is being held on the following track: <strong>${track}</strong>.`) +
    paragraph(`To complete your enrolment, please pay the remaining balance before the registration deadline.`) +
    callout({
      accent: 'gold',
      html: `<div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${C.gold};margin-bottom:10px;">Your Payment So Far</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          ${moneyRow('Amount paid', formatNaira(amountPaidNaira ?? 0))}
          ${moneyRow('Balance remaining', formatNaira(balanceDueNaira ?? 0))}
        </table>`,
    }) +
    paragraph(`Please complete your payment <strong>by 2 July 2026</strong>. This is the registration deadline. To keep your place, your full fee must be received on or before this date.`) +
    button +
    (completePaymentUrl ? linkFreshnessNote() : '') +
    paragraph(`Once your full payment is received, we will send your joining instructions and your link to the online learning platform. You will not be able to access the platform until your fee is paid in full.`) +
    paragraph(`If you have any questions about your payment, simply reply to this email or write to us at <a href="mailto:hello@oakvaleltd.com" style="color:${C.forest};">hello@oakvaleltd.com</a>. We are happy to help.`) +
    signoff();
  return {
    subject: 'Part Payment Received.',
    html: renderShell({ badge: 'Oakvale Learning · Summer Intensive 2026', heading: 'Part payment received — one step to go', accent: 'gold', bodyHtml: body }),
  };
}

function paymentWaived({ firstName, lastName, trackFirst }: ApplicantContext): Built {
  const fullName = `${firstName} ${lastName}`.trim();
  const track = trackLabel(trackFirst);
  const body =
    `<tr><td style="padding:26px 32px 16px;font-size:14px;color:${C.charcoal};line-height:1.7;font-family:Arial,sans-serif;">Dear ${fullName},</td></tr>` +
    paragraph(`Thank you for applying to the <strong>Healthcare Leadership and Innovation Summer Intensive 2026</strong>. Your application for <strong>${track}</strong> is now complete.`) +
    paragraph(`As you have selected the scholarship option, your application has now been passed on to our scholarship review pool. There are a limited number of scholarship places, so each application is read carefully and fairly. You do not need to do anything else for now.`) +
    callout({
      accent: 'gold',
      html: `<div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${C.gold};margin-bottom:10px;">What happens next</div>
        <strong>2 July 2026</strong> — Registration closes. All scholarship applications will be reviewed together once the window has ended.<br><br>
        <strong>On or before 9 July 2026</strong> — We will email you with the outcome of your scholarship application.`,
    }) +
    paragraph(`We know waiting is not easy, so we will keep this simple: watch your inbox in early July. Please check your spam or junk folder too, just in case our message lands there.`) +
    paragraph(`If you have any questions in the meantime, simply reply to this email or write to us at <a href="mailto:hello@oakvaleltd.com" style="color:${C.forest};">hello@oakvaleltd.com</a>. We are happy to help.`) +
    signoff();
  return {
    subject: 'Your scholarship application is complete — Summer Intensive 2026',
    html: renderShell({ badge: 'Oakvale Learning · Summer Intensive 2026', heading: 'Your scholarship application is complete', accent: 'gold', bodyHtml: body }),
  };
}

function paymentRejected({ firstName, applicationId }: ApplicantContext): Built {
  const body =
    greeting(firstName) +
    paragraph(`We're writing about your application to the Healthcare Leadership and Innovation Summer Intensive 2026. Unfortunately, there is currently an <strong>issue with your application fee</strong> and it has not been accepted.`) +
    callout({ accent: 'gold', html: `To keep your application active, please contact us so we can help you resolve this. Reply to this email or write to <a href="mailto:hello@oakvaleltd.com" style="color:${C.forest};">hello@oakvaleltd.com</a> and our team will assist you.` }) +
    reference(applicationId) +
    signoff();
  return {
    subject: 'Action needed on your application fee — Oakvale Summer Intensive 2026',
    html: renderShell({ badge: 'Oakvale Learning · Summer Intensive 2026', heading: 'Action needed on your fee', accent: 'red', bodyHtml: body }),
  };
}

// ─── Bulk payment-reminder templates ───────────────────────────────

export type ReminderKind = 'not_paid' | 'part_payment';

export type ReminderContext = {
  firstName: string;
  lastName: string;
  trackFirst: string;
  feeNaira?: number;
  amountPaidNaira?: number;
  balanceDueNaira?: number;
  paymentUrl?: string | null;
};

function reminderNotPaid({ firstName, lastName, trackFirst, feeNaira, paymentUrl }: ReminderContext): Built {
  const fullName = `${firstName} ${lastName}`.trim();
  const track = trackLabel(trackFirst);
  const fee = formatNaira(feeNaira ?? 0);
  const button = paymentUrl ? `<tr><td style="padding:4px 32px 24px;text-align:center;">
    <a href="${paymentUrl}" style="display:inline-block;background:${C.forest};color:#ffffff;text-decoration:none;font-weight:500;font-size:14px;font-family:Arial,sans-serif;padding:13px 30px;border-radius:4px;">Pay Application Fee</a>
  </td></tr>` : '';
  const body =
    `<tr><td style="padding:26px 32px 16px;font-size:14px;color:${C.charcoal};line-height:1.7;font-family:Arial,sans-serif;">Dear ${fullName},</td></tr>` +
    paragraph(`Thank you for your application to the <strong>Healthcare Leadership and Innovation Summer Intensive 2026</strong>. Your application for <strong>${track}</strong> has been received, but your place is not yet secure.`) +
    paragraph(`To confirm your spot in the programme, your full application fee of <strong>${fee}</strong> must be paid before registration closes. Because places are limited, we cannot hold spots for unconfirmed applications.`) +
    (paymentUrl
      ? paragraph(`Please complete your payment using the button below:`)
      : paragraph(`To complete your payment, simply reply to this email and we will send you a secure payment link.`)) +
    button +
    (paymentUrl ? linkFreshnessNote() : '') +
    callout({
      accent: 'gold',
      html: `<div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${C.gold};margin-bottom:10px;">Important Deadline</div>
        <strong>2 July 2026</strong> — Registration closes. Your payment must be received on or before this date to secure your place.`,
    }) +
    paragraph(`Once your payment is received in full, we will send over your official joining instructions and your personal link to our online learning platform.`) +
    paragraph(`If you have any questions or are facing any challenges with the payment process, simply reply to this email or write to us at <a href="mailto:hello@oakvaleltd.com" style="color:${C.forest};">hello@oakvaleltd.com</a>. We are happy to help.`) +
    signoff();
  return {
    subject: 'Action Required: Complete your application for the Health Leadership & Innovation Summer Intensive',
    html: renderShell({ badge: 'Oakvale Learning · Summer Intensive 2026', heading: 'Complete your application', accent: 'gold', bodyHtml: body }),
  };
}

function reminderPartPayment({ firstName, lastName, trackFirst, amountPaidNaira, balanceDueNaira, paymentUrl }: ReminderContext): Built {
  const fullName = `${firstName} ${lastName}`.trim();
  const track = trackLabel(trackFirst);
  const button = paymentUrl ? `<tr><td style="padding:4px 32px 24px;text-align:center;">
    <a href="${paymentUrl}" style="display:inline-block;background:${C.forest};color:#ffffff;text-decoration:none;font-weight:500;font-size:14px;font-family:Arial,sans-serif;padding:13px 30px;border-radius:4px;">Complete My Payment</a>
  </td></tr>` : '';
  const moneyRow = (label: string, value: string) =>
    `<tr>
      <td style="padding:8px 0;font-size:13px;color:${C.muted};font-family:Arial,sans-serif;">${label}</td>
      <td style="padding:8px 0;font-size:14px;font-weight:700;color:${C.charcoal};text-align:right;font-family:Arial,sans-serif;">${value}</td>
    </tr>`;
  const body =
    `<tr><td style="padding:26px 32px 16px;font-size:14px;color:${C.charcoal};line-height:1.7;font-family:Arial,sans-serif;">Dear ${fullName},</td></tr>` +
    paragraph(`Thank you for your application.`) +
    paragraph(`This is a quick reminder regarding your application for the <strong>Healthcare Leadership and Innovation Summer Intensive 2026</strong>. Your place on the <strong>${track}</strong> track is currently being held, but your enrolment is not yet complete.`) +
    paragraph(`The registration deadline is exactly one week away. To secure your spot and join us this August, please clear your outstanding balance.`) +
    callout({
      accent: 'gold',
      html: `<div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${C.gold};margin-bottom:10px;">Your Payment Status</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          ${moneyRow('Amount paid', formatNaira(amountPaidNaira ?? 0))}
          ${moneyRow('Balance remaining', formatNaira(balanceDueNaira ?? 0))}
        </table>`,
    }) +
    (paymentUrl
      ? paragraph(`Please complete your final payment by <strong>2 July 2026</strong> using the button below:`)
      : paragraph(`To complete your final payment by <strong>2 July 2026</strong>, simply reply to this email and we will send you a secure payment link.`)) +
    button +
    (paymentUrl ? linkFreshnessNote() : '') +
    paragraph(`Please note: Your full fee must be received on or before <strong>2 July 2026</strong>. You will not be able to access the online learning platform or receive your joining instructions until your balance is paid in full.`) +
    paragraph(`If you have any questions about your remaining balance, simply reply to this email or write to us at <a href="mailto:hello@oakvaleltd.com" style="color:${C.forest};">hello@oakvaleltd.com</a>. We are here to assist you.`) +
    signoff();
  return {
    subject: 'Reminder: 1 Week Left to Complete Your Payment for the Summer Intensive',
    html: renderShell({ badge: 'Oakvale Learning · Summer Intensive 2026', heading: 'One week left to complete your payment', accent: 'gold', bodyHtml: body }),
  };
}

const REMINDER_TEMPLATES: Record<ReminderKind, (ctx: ReminderContext) => Built> = {
  not_paid: reminderNotPaid,
  part_payment: reminderPartPayment,
};

/** Build a themed bulk-reminder email. `type` is the EmailLog key. */
export function buildReminderEmail(
  kind: ReminderKind,
  ctx: ReminderContext
): { type: string; subject: string; html: string } {
  const { subject, html } = REMINDER_TEMPLATES[kind](ctx);
  return { type: `reminder_${kind}`, subject, html };
}

// ─── Application status templates ───────────────────────────────────

function statusUnderReview({ firstName, trackFirst, applicationId }: ApplicantContext): Built {
  const body =
    greeting(firstName) +
    paragraph(`Thank you for applying to the Healthcare Leadership and Innovation Summer Intensive 2026. We wanted to let you know that your application for <strong>${trackLabel(trackFirst)}</strong> is now <strong>under review</strong>.`) +
    paragraph(`Our team is carefully reading every application. We review on a rolling basis and will write to you again as soon as a decision has been made — there is nothing further you need to do right now.`) +
    reference(applicationId) +
    signoff();
  return {
    subject: 'Your application is under review — Oakvale Summer Intensive 2026',
    html: renderShell({ badge: 'Oakvale Learning · Summer Intensive 2026', heading: 'Your application is under review', accent: 'gold', bodyHtml: body }),
  };
}

function statusAccepted({ firstName, trackFirst, applicationId }: ApplicantContext): Built {
  const body =
    greeting(firstName) +
    paragraph(`We are thrilled to tell you that you have been <strong>accepted</strong> into the Healthcare Leadership and Innovation Summer Intensive 2026, in <strong>${trackLabel(trackFirst)}</strong>. Congratulations — this is a genuine achievement.`) +
    callout({
      accent: 'gold',
      html: `<div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${C.gold};margin-bottom:10px;">What happens next</div>
        <strong>1. Onboarding.</strong> You'll receive an invitation to join the online programme platform, where you'll complete a short onboarding module and meet your track community.<br><br>
        <strong>2. Opening Ceremony.</strong> Saturday 8 August 2026, Julius Berger Hall, UNILAG Yaba Campus. Meet your cohort in person and hear from senior health system leaders.<br><br>
        <strong>3. Four weeks online.</strong> Interactive modules run from 10 August to 4 September 2026, culminating in the Oakvale Health Innovation Challenge.`,
    }) +
    reference(applicationId) +
    paragraph(`We can't wait to welcome you. If you have any questions, just reply to this email.`) +
    signoff();
  return {
    subject: '🎉 You\'re in — Oakvale Summer Intensive 2026',
    html: renderShell({ badge: 'Oakvale Learning · Summer Intensive 2026', heading: 'Congratulations — you\'re in', accent: 'gold', bodyHtml: body }),
  };
}

function statusDeclined({ firstName, applicationId }: ApplicantContext): Built {
  const body =
    greeting(firstName) +
    paragraph(`Thank you for applying to the Healthcare Leadership and Innovation Summer Intensive 2026, and for the time and thought you put into your application.`) +
    paragraph(`This year we received many strong applications for a limited number of places, and after careful consideration we are unable to offer you a place in this cohort. This was a difficult decision and is in no way a reflection of your potential.`) +
    callout({ accent: 'gold', html: `We would warmly encourage you to stay connected with Oakvale Learning and to apply again for future programmes. We would be glad to see your application next time.` }) +
    reference(applicationId) +
    signoff();
  return {
    subject: 'Update on your Oakvale Summer Intensive 2026 application',
    html: renderShell({ badge: 'Oakvale Learning · Summer Intensive 2026', heading: 'An update on your application', accent: 'gold', bodyHtml: body }),
  };
}

// ─── Dispatcher ─────────────────────────────────────────────────────

const PAYMENT_TEMPLATES: Record<string, ((ctx: ApplicantContext) => Built) | undefined> = {
  Paid: paymentPaid,
  Partial: paymentPartial,
  Waived: paymentWaived,
  Rejected: paymentRejected,
};

const STATUS_TEMPLATES: Record<string, ((ctx: ApplicantContext) => Built) | undefined> = {
  UnderReview: statusUnderReview,
  Accepted: statusAccepted,
  Declined: statusDeclined,
};

export type StatusEmailField = 'payment' | 'application';

/** Stable log/type key for a status email, e.g. "payment_paid", "status_accepted". */
function statusEmailType(field: StatusEmailField, value: string): string {
  const snake = value.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  return `${field}_${snake}`;
}

/**
 * Build a themed status-change email without sending it. Returns null for
 * default statuses (Pending/Submitted) that have no template.
 */
export function buildStatusEmail({
  field,
  value,
  application,
  extra,
}: {
  field: StatusEmailField;
  value: string;
  application: { firstName: string; lastName: string; trackFirst: string; id: string };
  extra?: { amountPaidNaira?: number; balanceDueNaira?: number; completePaymentUrl?: string | null };
}): { type: string; subject: string; html: string } | null {
  const builder = field === 'payment' ? PAYMENT_TEMPLATES[value] : STATUS_TEMPLATES[value];
  if (!builder) return null;
  const { subject, html } = builder({
    firstName: application.firstName,
    lastName: application.lastName,
    trackFirst: application.trackFirst,
    applicationId: application.id,
    ...extra,
  });
  return { type: statusEmailType(field, value), subject, html };
}

/**
 * Send the themed status-change email to an applicant. No-ops for default
 * statuses (Pending/Submitted) or when email is not configured. Never throws —
 * an email failure must not break the status update. Records the send in EmailLog.
 */
export async function sendStatusEmail({
  field,
  value,
  application,
  extra,
}: {
  field: StatusEmailField;
  value: string;
  application: { email: string; firstName: string; lastName: string; trackFirst: string; id: string };
  extra?: { amountPaidNaira?: number; balanceDueNaira?: number; completePaymentUrl?: string | null };
}): Promise<void> {
  const built = buildStatusEmail({ field, value, application, extra });
  if (!built) return;

  if (!process.env.RESEND_KEY || !process.env.EMAIL_FROM) {
    console.warn('[statusEmails] RESEND_KEY/EMAIL_FROM not configured — skipping email');
    return;
  }

  try {
    const resend = new Resend(process.env.RESEND_KEY);
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: application.email,
      subject: built.subject,
      html: built.html,
    });
    await logEmail({
      applicationId: application.id,
      recipient: 'applicant',
      toAddress: application.email,
      type: built.type,
      subject: built.subject,
      html: built.html,
    });
  } catch (err) {
    console.error('[statusEmails] failed to send status email:', err);
    await logEmail({
      applicationId: application.id,
      recipient: 'applicant',
      toAddress: application.email,
      type: built.type,
      subject: built.subject,
      html: built.html,
      status: 'failed',
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
