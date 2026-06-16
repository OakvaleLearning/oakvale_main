'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth, signIn, signOut } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendStatusEmail } from '@/lib/statusEmails';

const PAYMENT_VALUES = ['Pending', 'Paid', 'Waived', 'Rejected'] as const;
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

export async function updatePaymentStatus(id: string, value: string) {
  await requireAdmin();
  if (!PAYMENT_VALUES.includes(value as PaymentStatus)) return;

  const current = await prisma.application.findUnique({
    where: { id },
    select: { paymentStatus: true, email: true, firstName: true, trackFirst: true },
  });
  if (!current) return;

  await prisma.application.update({
    where: { id },
    data: { paymentStatus: value as PaymentStatus },
  });

  if (current.paymentStatus !== value) {
    await sendStatusEmail({
      field: 'payment',
      value,
      application: { id, email: current.email, firstName: current.firstName, trackFirst: current.trackFirst },
    });
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
    select: { status: true, email: true, firstName: true, trackFirst: true },
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
      application: { id, email: current.email, firstName: current.firstName, trackFirst: current.trackFirst },
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
