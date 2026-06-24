import { Prisma } from '@prisma/client';
import type { ReminderKind } from '@/lib/statusEmails';

/** Don't re-remind the same applicant within this window. */
export const REMINDER_COOLDOWN_DAYS = 3;

/**
 * Prisma WHERE clause for a reminder kind — shared by the page's counts and the
 * bulk send. Excludes applicants who already received a reminder of this kind
 * within the cooldown window (derived from their EmailLog history).
 */
export function reminderWhere(kind: ReminderKind): Prisma.ApplicationWhereInput {
  const cutoff = new Date(Date.now() - REMINDER_COOLDOWN_DAYS * 86_400_000);
  const recentlyReminded: Prisma.ApplicationWhereInput = {
    emailLogs: { some: { type: `reminder_${kind}`, status: 'sent', createdAt: { gte: cutoff } } },
  };
  if (kind === 'not_paid') {
    // Owes the full fee; exclude full-scholarship applicants and the recently reminded.
    return { paymentStatus: 'Pending', NOT: [{ needsAid: true, aidLevel: 'full' }, recentlyReminded] };
  }
  return { paymentStatus: 'Partial', NOT: [recentlyReminded] };
}
