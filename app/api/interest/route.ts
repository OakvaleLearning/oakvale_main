import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

const INTEREST_LABELS: Record<string, string> = {
  individual: 'Join as an individual',
  institution: 'Bring in my school',
  region: 'Come to my area',
  other: 'Something else',
};

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function str(v: unknown): string {
  return v == null ? '' : String(v).trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = str(body.name);
    const email = str(body.email);
    const state = str(body.state);
    const interestKey = str(body.interest);
    const consent = body.consent === true || body.consent === 'true';

    const discipline = str(body.discipline);
    const institutionName = str(body.institutionName);
    const cityOrArea = str(body.cityOrArea);

    // Server-side validation mirrors the client rules.
    if (!name) {
      return Response.json({ success: false, error: 'Please tell us your name.' }, { status: 400 });
    }
    if (!isEmail(email)) {
      return Response.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (!state) {
      return Response.json({ success: false, error: 'Please choose your state.' }, { status: 400 });
    }
    if (!interestKey || !INTEREST_LABELS[interestKey]) {
      return Response.json({ success: false, error: 'Please pick one option so we know how to help.' }, { status: 400 });
    }
    if (interestKey === 'individual' && !discipline) {
      return Response.json({ success: false, error: 'Please choose your field of study.' }, { status: 400 });
    }
    if (interestKey === 'institution' && !institutionName) {
      return Response.json({ success: false, error: 'Please give the name of the school or institution.' }, { status: 400 });
    }
    if (interestKey === 'region' && !cityOrArea) {
      return Response.json({ success: false, error: 'Please tell us which city or area.' }, { status: 400 });
    }
    if (!consent) {
      return Response.json({ success: false, error: 'Please tick the box so we can get back to you.' }, { status: 400 });
    }

    const interest = INTEREST_LABELS[interestKey];

    const enquiry = await prisma.interestEnquiry.create({
      data: {
        name,
        email,
        phone: str(body.phone) || null,
        state,
        interest,
        discipline: discipline || null,
        individualInstitution: str(body.individualInstitution) || null,
        yearOfStudy: str(body.yearOfStudy) || null,
        institutionName: institutionName || null,
        institutionRole: str(body.institutionRole) || null,
        cityOrArea: cityOrArea || null,
        connectedSchool: str(body.connectedSchool) || null,
        message: str(body.message) || null,
        heardVia: str(body.heardVia) || null,
      },
    });

    // Notify the Oakvale team. Do not fail the submission if email fails.
    try {
      const rows: [string, string][] = [
        ['Interest', interest],
        ['Name', name],
        ['Email', email],
        ['Phone / WhatsApp', str(body.phone)],
        ['State', state],
        ['Field of study', discipline],
        ['Institution', str(body.individualInstitution)],
        ['Year of study', str(body.yearOfStudy)],
        ['School / institution', institutionName],
        ['Role there', str(body.institutionRole)],
        ['City or area', cityOrArea],
        ['Connected school', str(body.connectedSchool)],
        ['Message', str(body.message)],
        ['Heard via', str(body.heardVia)],
      ];
      const html = `
        <h2>New interest enquiry</h2>
        <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
          ${rows
            .filter(([, v]) => v)
            .map(
              ([k, v]) =>
                `<tr><td style="border:1px solid #ddd;font-weight:600">${k}</td><td style="border:1px solid #ddd">${v}</td></tr>`,
            )
            .join('')}
        </table>`;

      const resend = new Resend(process.env.RESEND_KEY!);
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: process.env.EMAIL_TO!,
        subject: `New interest enquiry — ${interest}`,
        html,
      });
    } catch (emailError) {
      console.error('Failed to send interest enquiry email:', emailError);
    }

    return Response.json({ success: true, id: enquiry.id }, { status: 200 });
  } catch (error) {
    console.error('Error submitting interest enquiry:', error);
    return Response.json(
      { success: false, error: 'Failed to submit form. Please try again later.' },
      { status: 500 },
    );
  }
}
