import { Resend } from 'resend';

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
  return `<tr><td style="padding:8px 32px 32px;font-size:14px;color:${C.charcoal};line-height:1.7;font-family:Arial,sans-serif;">Warm regards,<br><strong>The Oakvale Learning Team</strong></td></tr>`;
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

export type ApplicantContext = {
  firstName: string;
  trackFirst: string;
  applicationId: string;
};

type Built = { subject: string; html: string };

function trackLabel(trackFirst: string): string {
  return TRACK_NAMES[trackFirst] || (trackFirst ? `Track ${trackFirst}` : 'your chosen track');
}

// ─── Payment templates ──────────────────────────────────────────────

function paymentPaid({ firstName, applicationId }: ApplicantContext): Built {
  const body =
    greeting(firstName) +
    paragraph(`We're delighted to confirm that we have <strong>received your application fee</strong> for the Oakvale Summer Intensive 2026. Thank you.`) +
    paragraph(`Your application is now complete and has entered our review pool. Applications are assessed on a rolling basis, and we will be in touch with a decision soon.`) +
    reference(applicationId) +
    paragraph(`If you have any questions in the meantime, simply reply to this email.`) +
    signoff();
  return {
    subject: 'Payment confirmed — Oakvale Summer Intensive 2026',
    html: renderShell({ badge: 'Oakvale Learning · Summer Intensive 2026', heading: 'Payment confirmed ✓', accent: 'gold', bodyHtml: body }),
  };
}

function paymentWaived({ firstName, applicationId }: ApplicantContext): Built {
  const body =
    greeting(firstName) +
    paragraph(`Good news — your <strong>application fee has been waived</strong> for the Oakvale Summer Intensive 2026. No payment is required from you.`) +
    callout({ accent: 'gold', html: `Your application is now complete and will be reviewed alongside all other completed applications. There is nothing further you need to do at this stage.` }) +
    reference(applicationId) +
    paragraph(`If you have any questions, simply reply to this email.`) +
    signoff();
  return {
    subject: 'Your application fee has been waived — Oakvale Summer Intensive 2026',
    html: renderShell({ badge: 'Oakvale Learning · Summer Intensive 2026', heading: 'Your fee has been waived', accent: 'gold', bodyHtml: body }),
  };
}

function paymentRejected({ firstName, applicationId }: ApplicantContext): Built {
  const body =
    greeting(firstName) +
    paragraph(`We're writing about your application to the Oakvale Summer Intensive 2026. Unfortunately, there is currently an <strong>issue with your application fee</strong> and it has not been accepted.`) +
    callout({ accent: 'gold', html: `To keep your application active, please contact us so we can help you resolve this. Reply to this email or write to <a href="mailto:hello@oakvaleltd.com" style="color:${C.forest};">hello@oakvaleltd.com</a> and our team will assist you.` }) +
    reference(applicationId) +
    signoff();
  return {
    subject: 'Action needed on your application fee — Oakvale Summer Intensive 2026',
    html: renderShell({ badge: 'Oakvale Learning · Summer Intensive 2026', heading: 'Action needed on your fee', accent: 'red', bodyHtml: body }),
  };
}

// ─── Application status templates ───────────────────────────────────

function statusUnderReview({ firstName, trackFirst, applicationId }: ApplicantContext): Built {
  const body =
    greeting(firstName) +
    paragraph(`Thank you for applying to the Oakvale Summer Intensive 2026. We wanted to let you know that your application for <strong>${trackLabel(trackFirst)}</strong> is now <strong>under review</strong>.`) +
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
    paragraph(`We are thrilled to tell you that you have been <strong>accepted</strong> into the Oakvale Healthcare Leadership and Innovation Summer Intensive 2026, in <strong>${trackLabel(trackFirst)}</strong>. Congratulations — this is a genuine achievement.`) +
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
    paragraph(`Thank you for applying to the Oakvale Summer Intensive 2026, and for the time and thought you put into your application.`) +
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
  Waived: paymentWaived,
  Rejected: paymentRejected,
};

const STATUS_TEMPLATES: Record<string, ((ctx: ApplicantContext) => Built) | undefined> = {
  UnderReview: statusUnderReview,
  Accepted: statusAccepted,
  Declined: statusDeclined,
};

export type StatusEmailField = 'payment' | 'application';

/**
 * Send the themed status-change email to an applicant. No-ops for default
 * statuses (Pending/Submitted) or when email is not configured. Never throws —
 * an email failure must not break the status update.
 */
export async function sendStatusEmail({
  field,
  value,
  application,
}: {
  field: StatusEmailField;
  value: string;
  application: { email: string; firstName: string; trackFirst: string; id: string };
}): Promise<void> {
  try {
    const builder = field === 'payment' ? PAYMENT_TEMPLATES[value] : STATUS_TEMPLATES[value];
    if (!builder) return;

    if (!process.env.RESEND_KEY || !process.env.EMAIL_FROM) {
      console.warn('[statusEmails] RESEND_KEY/EMAIL_FROM not configured — skipping email');
      return;
    }

    const { subject, html } = builder({
      firstName: application.firstName,
      trackFirst: application.trackFirst,
      applicationId: application.id,
    });

    const resend = new Resend(process.env.RESEND_KEY);
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: application.email,
      subject,
      html,
    });
  } catch (err) {
    console.error('[statusEmails] failed to send status email:', err);
  }
}
