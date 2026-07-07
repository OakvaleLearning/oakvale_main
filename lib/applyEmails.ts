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

export type EmailData = {
  firstName: string; lastName: string; email: string; phone: string; state: string;
  institution: string; discipline: string; yearOfStudy: string; studentId: string;
  trackFirst: string; trackSecond: string;
  mot1: string; mot2: string;
  needsAid: boolean; aidLevel: string; aidStatement: string;
  fileCount: number;
  applicationId: string;
};

export function buildHtml(data: EmailData) {
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

export function buildApplicantHtml(data: {
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
              <strong>15 July 2026</strong> — Registration closes. All scholarship applications will be reviewed together once the window has ended.<br><br>
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
              <div style="margin-top:14px;font-size:12px;color:#5A5A5A;line-height:1.6;font-family:Arial,sans-serif;">
                If this payment link no longer works, simply reply to this email and we'll send you a fresh one.
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
