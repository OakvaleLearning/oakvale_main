import {Resend} from 'resend';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { institutionName, email } = await request.json();

    if (!institutionName || !email) {
      return Response.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }


    const existingRequest = await prisma.newInstitutionRequest.findFirst({
      where: {
        institution: institutionName,
        email: email
      },
    });

    if (existingRequest) {
      return Response.json({ success: false, error: 'This institution request has already been submitted.' }, { status: 400 });
    }
    

  let res = await prisma.newInstitutionRequest.create({
      data: {
        institution: institutionName,
        email
      },
    });

 if(res.email) {

   const resend = new Resend(process.env.RESEND_KEY!);
   
   await resend.emails.send({
     from: process.env.EMAIL_FROM!,
     to: process.env.EMAIL_TO!,
     subject: `New Instiution Request`,
     html: `<p>New institution ${institutionName}</p>`
    });
    return Response.json({ success: true, message: 'Form submitted successfully' }, { status: 200 });
  }
  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json({ success: false, error: 'Failed to Submit form. Please try again later.' }, { status: 500 });
  }
}
     