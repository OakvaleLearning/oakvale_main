'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth, signIn, signOut } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendStatusEmail } from '@/lib/statusEmails';
import {
  APPLICATION_FEE_KOBO,
  buildReference,
  initializeTransaction,
  siteUrl,
} from '@/lib/paystack';

const PAYMENT_VALUES = ['Pending', 'Paid', 'Partial', 'Waived', 'Rejected'] as const;
const STATUS_VALUES = ['Submitted', 'UnderReview', 'Accepted', 'Declined'] as const;

type PaymentStatus = (typeof PAYMENT_VALUES)[number];
type ApplicationStatus = (typeof STATUS_VALUES)[number];

export async function loginAction(_prev: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  try {
    await signIn('credentials', { email, password, redirectTo: '/admin' });
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (message.includes('NEXT_REDIRECT')) throw err;
    return { error: 'Invalid email or password.' };
  }
  return {};
}

export async function logoutAction() {
  await signOut({ redirectTo: '/admin/login' });
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');
}

export async function updatePaymentStatus(id: string, value: string, amountPaidNaira?: number) {
  await requireAdmin();
  if (!PAYMENT_VALUES.includes(value as PaymentStatus)) return;

  const current = await prisma.application.findUnique({
    where: { id },
    select: {
      paymentStatus: true, email: true, firstName: true, lastName: true, trackFirst: true,
      payments: { where: { status: 'Success' }, select: { amount: true } },
    },
  });
  if (!current) return;

  const application = { id, email: current.email, firstName: current.firstName, lastName: current.lastName, trackFirst: current.trackFirst };

  if (value === 'Partial') {
    // Amount paid so far: admin-entered value wins, else sum of successful payments.
    const paidSoFarKobo = current.payments.reduce((sum, p) => sum + p.amount, 0);
    const amountPaidKobo =
      typeof amountPaidNaira === 'number' && amountPaidNaira > 0
        ? Math.round(amountPaidNaira * 100)
        : paidSoFarKobo;
    const balanceKobo = Math.max(0, APPLICATION_FEE_KOBO - amountPaidKobo);

    await prisma.application.update({
      where: { id },
      data: { paymentStatus: 'Partial', amountPaidKobo },
    });

    // Generate a fresh Paystack link for the remaining balance.
    let completePaymentUrl: string | null = null;
    if (balanceKobo > 0 && process.env.PAYSTACK_SECRET_KEY) {
      try {
        const reference = buildReference(id);
        const init = await initializeTransaction({
          email: current.email,
          amountKobo: balanceKobo,
          reference,
          callbackUrl: `${siteUrl()}/apply/payment/success`,
          metadata: { applicationId: id, kind: 'balance' },
        });
        await prisma.payment.create({
          data: {
            applicationId: id,
            reference: init.reference,
            amount: balanceKobo,
            authorizationUrl: init.authorization_url,
            status: 'Initialized',
          },
        });
        completePaymentUrl = init.authorization_url;
      } catch (err) {
        console.error('Paystack balance init failed (status saved without link):', err);
      }
    }

    await sendStatusEmail({
      field: 'payment',
      value,
      application,
      extra: {
        amountPaidNaira: amountPaidKobo / 100,
        balanceDueNaira: balanceKobo / 100,
        completePaymentUrl,
      },
    });
  } else {
    const changed = current.paymentStatus !== value;
    await prisma.application.update({
      where: { id },
      data: { paymentStatus: value as PaymentStatus },
    });

    if (changed) {
      await sendStatusEmail({ field: 'payment', value, application });
    }
  }

  revalidatePath(`/admin/applications/${id}`);
  revalidatePath('/admin/applications');
  revalidatePath('/admin');
}

export async function updateApplicationStatus(id: string, value: string) {
  await requireAdmin();
  if (!STATUS_VALUES.includes(value as ApplicationStatus)) return;

  const current = await prisma.application.findUnique({
    where: { id },
    select: { status: true, email: true, firstName: true, lastName: true, trackFirst: true },
  });
  if (!current) return;

  await prisma.application.update({
    where: { id },
    data: { status: value as ApplicationStatus },
  });

  if (current.status !== value) {
    await sendStatusEmail({
      field: 'application',
      value,
      application: { id, email: current.email, firstName: current.firstName, lastName: current.lastName, trackFirst: current.trackFirst },
    });
  }

  revalidatePath(`/admin/applications/${id}`);
  revalidatePath('/admin/applications');
  revalidatePath('/admin');
}

export async function updateNotes(id: string, notes: string) {
  await requireAdmin();
  await prisma.application.update({
    where: { id },
    data: { notes: notes || null },
  });
  revalidatePath(`/admin/applications/${id}`);
}
