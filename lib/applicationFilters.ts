import type { Prisma } from '@prisma/client';

export const PAYMENT_OPTS = ['All', 'Pending', 'Paid', 'Partial', 'Waived', 'Rejected'] as const;
export const STATUS_OPTS = ['All', 'Submitted', 'UnderReview', 'Accepted', 'Declined'] as const;
export const AID_OPTS = ['All', 'Applying', 'Not applying'] as const;

export type PaymentOpt = (typeof PAYMENT_OPTS)[number];
export type StatusOpt = (typeof STATUS_OPTS)[number];
export type AidOpt = (typeof AID_OPTS)[number];

/** Normalize a raw payment query param to a valid option, defaulting to 'All'. */
export function normalizePayment(raw: string | undefined): PaymentOpt {
  return raw && PAYMENT_OPTS.includes(raw as PaymentOpt) ? (raw as PaymentOpt) : 'All';
}

/** Normalize a raw status query param to a valid option, defaulting to 'All'. */
export function normalizeStatus(raw: string | undefined): StatusOpt {
  return raw && STATUS_OPTS.includes(raw as StatusOpt) ? (raw as StatusOpt) : 'All';
}

/** Normalize a raw financial-aid query param to a valid option, defaulting to 'All'. */
export function normalizeAid(raw: string | undefined): AidOpt {
  return raw && AID_OPTS.includes(raw as AidOpt) ? (raw as AidOpt) : 'All';
}

/** Build the Prisma `where` clause shared by the applications list and the export route. */
export function buildApplicationWhere({
  payment,
  status,
  aid,
  q,
}: {
  payment: PaymentOpt;
  status: StatusOpt;
  aid: AidOpt;
  q: string;
}): Prisma.ApplicationWhereInput {
  const where: Prisma.ApplicationWhereInput = {};
  if (payment !== 'All') where.paymentStatus = payment as Prisma.ApplicationWhereInput['paymentStatus'];
  if (status !== 'All') where.status = status as Prisma.ApplicationWhereInput['status'];
  if (aid !== 'All') where.needsAid = aid === 'Applying';
  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: 'insensitive' } },
      { lastName: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { studentId: { contains: q, mode: 'insensitive' } },
    ];
  }
  return where;
}
