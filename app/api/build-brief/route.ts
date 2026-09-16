import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

function str(v: unknown): string {
  return v == null ? '' : String(v).trim();
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function escapeHtml(v: string) {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = str(body.name);
    const organisation = str(body.organisation);
    const email = str(body.email);
    const phone = str(body.phone);
    const organisationType = str(body.organisationType);
    const moduleCount = str(body.moduleCount);
    const description = str(body.description);

    if (!name) {
      return Response.json({ success: false, error: 'Please tell us your name.' }, { status: 400 });
    }
    if (!organisation) {
      return Response.json({ success: false, error: 'Please tell us your organisation.' }, { status: 400 });
    }
    if (!isEmail(email)) {
      return Response.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (!description) {
      return Response.json({ success: false, error: 'Please give a brief description of your project.' }, { status: 400 });
    }

    // Persist first. The enquiry is the thing of value; the notification is a
    // convenience on top of it, so a Resend outage must not lose the lead.
    const brief = await prisma.buildBrief.create({
      data: {
        name,
        organisation,
        email,
        phone: phone || null,
        organisationType: organisationType || null,
        moduleCount: moduleCount || null,
        description,
      },
    });

    // Notify the Oakvale team. Do not fail the submission if email fails.
    try {
      const row = (label: string, value: string) =>
        value ? `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>` : '';

      const resend = new Resend(process.env.RESEND_KEY!);
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: process.env.EMAIL_TO!,
        replyTo: email,
        subject: `Build For You brief from ${name} (${organisation})`,
        html: [
          row('Name', name),
          row('Organisation', organisation),
          row('Email', email),
          row('Phone / WhatsApp', phone),
          row('Organisation type', organisationType),
          row('Modules needed', moduleCount),
          `<p><strong>Project brief:</strong><br>${escapeHtml(description).replace(/\n/g, '<br>')}</p>`,
          `<p style="color:#666;font-size:12px">Reference: ${brief.id}</p>`,
        ].join(''),
      });
    } catch (emailError) {
      console.error('Failed to send build brief notification:', emailError);
    }

    return Response.json({ success: true, id: brief.id, message: 'Brief sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error submitting build brief:', error);
    return Response.json(
      { success: false, error: 'Failed to send your brief. Please try again later.' },
      { status: 500 },
    );
  }
}
