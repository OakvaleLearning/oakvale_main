import { Resend } from 'resend';

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

function buildHtml(data: Record<string, string | boolean>) {
  const {
    firstName, lastName, email, phone, state,
    institution, discipline, yearOfStudy, studentId,
    trackFirst, trackSecond,
    mot1, mot2,
    needsAid, aidLevel, aidStatement,
    fileCount,
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

        <!-- Header -->
        <tr>
          <td style="background:#0A3D2B;padding:28px 32px;">
            <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#C8881A;margin-bottom:6px;font-family:Arial,sans-serif;">
              Oakvale Learning · Summer Intensive 2026
            </div>
            <div style="font-size:22px;font-weight:400;color:#ffffff;font-family:Georgia,serif;line-height:1.3;">
              New Application Received
            </div>
            <div style="margin-top:8px;font-size:13px;color:rgba(255,255,255,0.65);font-family:Arial,sans-serif;">
              Submitted ${submitted} (Lagos time)
            </div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:24px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e2da;border-radius:4px;border-collapse:collapse;">

              ${sectionHead('Personal Details')}
              ${row('Full name', `${firstName} ${lastName}`)}
              ${row('Email address', String(email))}
              ${row('Phone (WhatsApp)', String(phone))}
              ${row('State of residence', String(state))}

              ${sectionHead('Academic Information')}
              ${row('Institution', String(institution))}
              ${row('Discipline', String(discipline))}
              ${row('Year of study', String(yearOfStudy))}
              ${row('Student ID', String(studentId))}

              ${sectionHead('Track Selection')}
              ${row('First preference', trackFirst ? TRACK_NAMES[String(trackFirst)] : '—')}
              ${row('Second preference', trackSecond ? TRACK_NAMES[String(trackSecond)] : 'None')}

            </table>
          </td>
        </tr>

        <!-- Motivation -->
        <tr>
          <td style="padding:20px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e2da;border-radius:4px;border-collapse:collapse;">
              ${sectionHead('Motivation Statement')}
              <tr>
                <td colspan="2" style="padding:12px 16px 4px;font-size:11px;font-weight:700;color:#5A5A5A;text-transform:uppercase;letter-spacing:0.1em;font-family:Arial,sans-serif;">
                  Why have you chosen your track?
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding:4px 16px 14px;font-size:13px;color:#1C1C1C;line-height:1.7;border-bottom:1px solid #e8e2da;font-family:Arial,sans-serif;white-space:pre-wrap;">
                  ${String(mot1)}
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding:12px 16px 4px;font-size:11px;font-weight:700;color:#5A5A5A;text-transform:uppercase;letter-spacing:0.1em;font-family:Arial,sans-serif;">
                  What will you do differently as a health professional?
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding:4px 16px 14px;font-size:13px;color:#1C1C1C;line-height:1.7;font-family:Arial,sans-serif;white-space:pre-wrap;">
                  ${String(mot2)}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Financial Aid -->
        <tr>
          <td style="padding:20px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e2da;border-radius:4px;border-collapse:collapse;">
              ${sectionHead('Financial Aid')}
              ${row('Applying for aid', needsAid ? 'Yes' : 'No')}
              ${needsAid ? row('Level of support', AID_NAMES[String(aidLevel)] || '—') : ''}
              ${needsAid && aidStatement ? `
              <tr>
                <td colspan="2" style="padding:12px 16px 4px;font-size:11px;font-weight:700;color:#5A5A5A;text-transform:uppercase;letter-spacing:0.1em;font-family:Arial,sans-serif;">
                  Aid statement
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding:4px 16px 14px;font-size:13px;color:#1C1C1C;line-height:1.7;border-bottom:1px solid #e8e2da;font-family:Arial,sans-serif;white-space:pre-wrap;">
                  ${String(aidStatement)}
                </td>
              </tr>` : ''}
              ${needsAid ? row('Supporting documents uploaded', fileCount ? `${fileCount} file${Number(fileCount) !== 1 ? 's' : ''} (submitted separately)` : 'None') : ''}
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 32px 32px;">
            <div style="background:#F7F3EC;border-radius:4px;padding:14px 16px;font-size:12px;color:#5A5A5A;line-height:1.6;font-family:Arial,sans-serif;">
              This application was submitted through the Oakvale Learning website. Reply directly to this email to contact the applicant at <strong>${email}</strong>.
            </div>
          </td>
        </tr>

        <!-- Footer brand -->
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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      firstName, lastName, email,
    } = body;

    if (!firstName || !lastName || !email) {
      return Response.json({ success: false, error: 'Missing required fields.' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_KEY!);

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: process.env.EMAIL_TO!,
      replyTo: String(email),
      subject: `Application: ${firstName} ${lastName} — Oakvale Summer Intensive 2026`,
      html: buildHtml(body),
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Apply route error:', error);
    return Response.json({ success: false, error: 'Failed to send application. Please try again.' }, { status: 500 });
  }
}
