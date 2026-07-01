import { prisma } from '@/lib/prisma';
import {
  buildReference,
  initializeTransaction,
  siteUrl,
  verifyWebhookSignature,
} from '@/lib/paystack';
import { reconcileSuccessfulPayment } from '@/lib/payments';
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
      // Verify the amount with Paystack and reconcile: Paid only if the
      // cumulative amount covers the fee, otherwise Partial.
      const result = await reconcileSuccessfulPayment(reference);

      if (result.ok && !result.wasAlreadyProcessed) {
        const application = await prisma.application.findUnique({
          where: { id: result.applicationId },
          select: { id: true, email: true, firstName: true, lastName: true, trackFirst: true },
        });

        if (application) {
          if (result.status === 'Paid') {
            await sendStatusEmail({ field: 'payment', value: 'Paid', application });
          } else {
            // Under-payment — generate a fresh link for the outstanding balance
            // (mirrors app/admin/actions.ts) and send the part-payment email.
            let completePaymentUrl: string | null = null;
            if (result.balanceKobo > 0 && process.env.PAYSTACK_SECRET_KEY) {
              try {
                const balanceRef = buildReference(application.id);
                const init = await initializeTransaction({
                  email: application.email,
                  amountKobo: result.balanceKobo,
                  reference: balanceRef,
                  callbackUrl: `${siteUrl()}/apply/payment/success`,
                  metadata: { applicationId: application.id, kind: 'balance' },
                });
                await prisma.payment.create({
                  data: {
                    applicationId: application.id,
                    reference: init.reference,
                    amount: result.balanceKobo,
                    authorizationUrl: init.authorization_url,
                    status: 'Initialized',
                  },
                });
                completePaymentUrl = init.authorization_url;
              } catch (balanceErr) {
                console.error('[paystack webhook] balance link init failed:', balanceErr);
              }
            }

            await sendStatusEmail({
              field: 'payment',
              value: 'Partial',
              application,
              extra: {
                amountPaidNaira: result.amountPaidKobo / 100,
                balanceDueNaira: result.balanceKobo / 100,
                completePaymentUrl,
              },
            });
          }
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
