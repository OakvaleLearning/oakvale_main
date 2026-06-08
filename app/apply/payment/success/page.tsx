import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { verifyTransaction } from '@/lib/paystack';

export const dynamic = 'force-dynamic';

const C = {
  forest: '#0A3D2B',
  forestMid: '#145C3F',
  gold: '#C8881A',
  cream: '#F7F3EC',
  charcoal: '#1C1C1C',
  muted: '#5A5A5A',
  border: 'rgba(10,61,43,0.12)',
};

type Outcome = {
  state: 'success' | 'pending' | 'failed' | 'error' | 'missing';
  message: string;
  paymentUrl?: string | null;
  applicationId?: string | null;
};

async function processReference(reference: string | undefined): Promise<Outcome> {
  if (!reference) {
    return { state: 'missing', message: 'No payment reference was provided.' };
  }

  try {
    const data = await verifyTransaction(reference);

    const payment = await prisma.payment.findUnique({
      where: { reference },
      include: { application: true },
    });

    if (!payment) {
      return { state: 'error', message: 'Payment reference not recognised.' };
    }

    if (data.status === 'success') {
      if (payment.status !== 'Success') {
        await prisma.$transaction([
          prisma.payment.update({
            where: { reference },
            data: {
              status: 'Success',
              paidAt: data.paid_at ? new Date(data.paid_at) : new Date(),
              paystackChannel: data.channel ?? null,
              paystackRaw: data as unknown as object,
            },
          }),
          prisma.application.update({
            where: { id: payment.applicationId },
            data: {
              paymentStatus: 'Paid',
              paystackCustomerCode: data.customer?.customer_code ?? undefined,
            },
          }),
        ]);
      }
      return {
        state: 'success',
        message: 'Payment confirmed.',
        applicationId: payment.applicationId,
      };
    }

    if (data.status === 'failed') {
      if (payment.status !== 'Failed') {
        await prisma.payment.update({
          where: { reference },
          data: { status: 'Failed', paystackRaw: data as unknown as object },
        });
      }
      return {
        state: 'failed',
        message: 'Payment was not successful.',
        paymentUrl: payment.authorizationUrl,
        applicationId: payment.applicationId,
      };
    }

    return {
      state: 'pending',
      message: 'Payment is still being processed.',
      paymentUrl: payment.authorizationUrl,
      applicationId: payment.applicationId,
    };
  } catch (err) {
    console.error('verify error:', err);
    return { state: 'error', message: 'We could not verify this payment right now.' };
  }
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const params = await searchParams;
  const reference = params.reference || params.trxref;
  const outcome = await processReference(reference);
  const ok = outcome.state === 'success';

  return (
    <div style={{ minHeight: '100vh', background: C.cream, paddingTop: 80, fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, marginBottom: 10 }}>
          Oakvale · Summer Intensive 2026
        </div>
        <h1 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 34, fontWeight: 500, color: C.forest, margin: '0 0 12px' }}>
          {ok ? 'Payment confirmed' : outcome.state === 'pending' ? 'Payment pending' : outcome.state === 'failed' ? 'Payment unsuccessful' : 'Payment not verified'}
        </h1>
        <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, margin: '0 0 24px' }}>
          {ok
            ? 'Thank you. Your application is now complete and our admissions team will be in touch within five working days.'
            : outcome.message}
        </p>

        {outcome.applicationId && (
          <div style={{ display: 'inline-block', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 6, padding: '10px 18px', fontSize: 13, color: C.charcoal, marginBottom: 18 }}>
            Application reference: <strong>{outcome.applicationId}</strong>
          </div>
        )}

        {outcome.paymentUrl && (outcome.state === 'pending' || outcome.state === 'failed') && (
          <div style={{ marginTop: 10 }}>
            <a
              href={outcome.paymentUrl}
              style={{
                display: 'inline-block',
                background: C.forest,
                color: '#fff',
                padding: '11px 26px',
                borderRadius: 4,
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              Try paying again
            </a>
          </div>
        )}

        <div style={{ marginTop: 32, fontSize: 13 }}>
          <Link href="/" style={{ color: C.gold, textDecoration: 'none' }}>← Return to oakvaleltd.com</Link>
        </div>
      </div>
    </div>
  );
}
