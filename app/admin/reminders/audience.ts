import { Prisma } from '@prisma/client';
import type { ReminderKind } from '@/lib/statusEmails';

/**
 * Prisma WHERE clause for a reminder kind — shared by the page's counts and the
 * bulk send. Counts every applicant in the matching payment status.
 */
export function reminderWhere(kind: ReminderKind): Prisma.ApplicationWhereInput {
  if (kind === 'not_paid') {
    // Owes the full fee; exclude full-scholarship applicants (they owe nothing).
    return { paymentStatus: 'Pending', NOT: { needsAid: true, aidLevel: 'full' } };
  }
  if (kind === 'closing_notice') {
    // Anyone with an outstanding fee: fully unpaid (not full-scholarship) or part-paid.
    return {
      OR: [
        { paymentStatus: 'Pending', NOT: { needsAid: true, aidLevel: 'full' } },
        { paymentStatus: 'Partial' },
      ],
    };
  }
  return { paymentStatus: 'Partial' };
}
