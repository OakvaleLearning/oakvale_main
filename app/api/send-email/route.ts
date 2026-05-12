import {Resend} from 'resend';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, organisation, enquiryType, message } = await request.json();

    if (!firstName || !lastName || !email || !organisation || !enquiryType || !message) {
      return Response.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_KEY!);

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: process.env.EMAIL_TO!,
      subject: `New contact form submission from ${firstName} ${lastName}`,
      html: `<p><strong>Name:</strong> ${firstName} ${lastName}</p><p><strong>Email:</strong> ${email}</p><p><strong>Organisation:</strong> ${organisation}</p><p><strong>Enquiry Type:</strong> ${enquiryType}</p><p><strong>Message:</strong> ${message}</p>`,
    });

    return Response.json({ success: true, message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json({ success: false, error: 'Failed to send email. Please try again later.' }, { status: 500 });
  }
}
     