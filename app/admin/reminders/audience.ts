import { Prisma } from '@prisma/client';
import type { ReminderKind } from '@/lib/statusEmails';

/** Prisma WHERE clauses for each reminder audience — shared with the page's counts. */
export const REMINDER_AUDIENCE: Record<ReminderKind, Prisma.ApplicationWhereInput> = {
  // Owes the full fee. Exclude full-scholarship applicants (they owe nothing).
  not_paid: { paymentStatus: 'Pending', NOT: { needsAid: true, aidLevel: 'full' } },
  part_payment: { paymentStatus: 'Partial' },
};
