import { prisma } from '@/lib/prisma';
import { verifyWebhookSignature } from '@/lib/paystack';
import { sendStatusEmail } from '@/lib/statusEmails';

export const dynamic = 'force-dynamic';

interface PaystackEvent {
  event: string;
  data: {
    reference: string;
    status?: string;
    channel?: string;
    paid_at?: string | null;
    customer?: { email?: string; customer_code?: string };
    [key: string]: unknown;
  };
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-paystack-signature');

  if (!verifyWebhookSignature(rawBody, signature)) {
    return new Response('Invalid signature', { status: 401 });
  }

  let event: PaystackEvent;
  try {
    event = JSON.parse(rawBody) as PaystackEvent;
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  try {
    const reference = event.data?.reference;
    if (!reference) {
      return Response.json({ ok: true });
    }

    const payment = await prisma.payment.findUnique({ where: { reference } });
    if (!payment) {
      console.warn(`[paystack webhook] unknown reference ${reference}`);
      return Response.json({ ok: true });
    }

    if (event.event === 'charge.success') {
      if (payment.status !== 'Success') {
        await prisma.$transaction([
          prisma.payment.update({
            where: { reference },
            data: {
              status: 'Success',
              paidAt: event.data.paid_at ? new Date(event.data.paid_at) : new Date(),
              paystackChannel: event.data.channel ?? null,
              paystackRaw: event.data as unknown as object,
            },
          }),
          prisma.application.update({
            where: { id: payment.applicationId },
            data: {
              paymentStatus: 'Paid',
              paystackCustomerCode: event.data.customer?.customer_code ?? undefined,
            },
          }),
        ]);

        const application = await prisma.application.findUnique({
          where: { id: payment.applicationId },
          select: { id: true, email: true, firstName: true, trackFirst: true },
        });
        if (application) {
          await sendStatusEmail({ field: 'payment', value: 'Paid', application });
        }
      }
    } else if (event.event === 'charge.failed') {
      if (payment.status !== 'Failed') {
        await prisma.payment.update({
          where: { reference },
          data: {
            status: 'Failed',
            paystackRaw: event.data as unknown as object,
          },
        });
      }
    }
  } catch (err) {
    console.error('[paystack webhook] handler error:', err);
  }

  return Response.json({ ok: true });
}
