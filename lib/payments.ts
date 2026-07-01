import { prisma } from '@/lib/prisma';
import { APPLICATION_FEE_KOBO, verifyTransaction } from '@/lib/paystack';

export type ReconcileResult =
  | { ok: false; reason: 'unknown_reference' | 'not_successful'; paystackStatus?: string }
  | {
      ok: true;
      applicationId: string;
      status: 'Paid' | 'Partial';
      amountPaidKobo: number;
      balanceKobo: number;
      wasAlreadyProcessed: boolean;
    };

/**
 * Verify a Paystack transaction server-side and reconcile our records against
 * the amount actually paid. Shared by the webhook and the callback page so the
 * two can't drift apart.
 *
 * `Application.amountPaidKobo` is (re)computed as the sum of all `Payment` rows
 * for the application with status `Success` — the same model the admin flow in
 * `app/admin/actions.ts` uses. The application is marked `Paid` only when that
 * cumulative total covers the fee, otherwise `Partial`.
 *
 * Never throws — callers can rely on the result object.
 */
export async function reconcileSuccessfulPayment(
  reference: string
): Promise<ReconcileResult> {
  const payment = await prisma.payment.findUnique({ where: { reference } });
  if (!payment) return { ok: false, reason: 'unknown_reference' };

  // Always verify with Paystack — never trust the amount from the request body alone.
  const data = await verifyTransaction(reference);
  if (data.status !== 'success') {
    return { ok: false, reason: 'not_successful', paystackStatus: data.status };
  }

  const verifiedAmountKobo = data.amount;
  const wasAlreadyProcessed = payment.status === 'Success';

  const { amountPaidKobo } = await prisma.$transaction(async (tx) => {
    if (!wasAlreadyProcessed) {
      // Record the amount actually charged (may differ from the initialized amount).
      await tx.payment.update({
        where: { reference },
        data: {
          status: 'Success',
          amount: verifiedAmountKobo,
          paidAt: data.paid_at ? new Date(data.paid_at) : new Date(),
          paystackChannel: data.channel ?? null,
          paystackRaw: data as unknown as object,
        },
      });
    }

    const agg = await tx.payment.aggregate({
      where: { applicationId: payment.applicationId, status: 'Success' },
      _sum: { amount: true },
    });
    const paidKobo = agg._sum.amount ?? 0;

    await tx.application.update({
      where: { id: payment.applicationId },
      data: {
        amountPaidKobo: paidKobo,
        paymentStatus: paidKobo >= APPLICATION_FEE_KOBO ? 'Paid' : 'Partial',
        paystackCustomerCode: data.customer?.customer_code ?? undefined,
      },
    });

    return { amountPaidKobo: paidKobo };
  });

  return {
    ok: true,
    applicationId: payment.applicationId,
    status: amountPaidKobo >= APPLICATION_FEE_KOBO ? 'Paid' : 'Partial',
    amountPaidKobo,
    balanceKobo: Math.max(0, APPLICATION_FEE_KOBO - amountPaidKobo),
    wasAlreadyProcessed,
  };
}
