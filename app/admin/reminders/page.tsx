import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { reminderWhere } from './audience';
import ReminderButtons from './ReminderButtons';

const C = {
  forest: '#0A3D2B',
  gold: '#C8881A',
  muted: '#5A5A5A',
  border: 'rgba(10,61,43,0.12)',
};

export const dynamic = 'force-dynamic';

export default async function RemindersPage() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  const lastSentOf = (kind: 'not_paid' | 'part_payment') =>
    prisma.emailLog.findFirst({
      where: { type: `reminder_${kind}`, status: 'sent' },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });

  const recipientsOf = (kind: 'not_paid' | 'part_payment') =>
    prisma.application.findMany({
      where: reminderWhere(kind),
      orderBy: { createdAt: 'desc' },
      select: { id: true, firstName: true, lastName: true, email: true, institution: true, trackFirst: true },
    });

  const [notPaidRecipients, partPaymentRecipients, notPaidLast, partPaymentLast] = await Promise.all([
    recipientsOf('not_paid'),
    recipientsOf('part_payment'),
    lastSentOf('not_paid'),
    lastSentOf('part_payment'),
  ]);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 30, fontWeight: 500, color: C.forest, margin: '0 0 4px' }}>
        Payment reminders
      </h1>
      <p style={{ fontSize: 13, color: C.muted, margin: '0 0 24px', maxWidth: 640, lineHeight: 1.6 }}>
        Send a one-off reminder email to applicants with an outstanding fee. Each email includes a fresh
        Paystack payment button. Registration closes 2 July 2026.
      </p>

      <ReminderButtons
        notPaidRecipients={notPaidRecipients}
        partPaymentRecipients={partPaymentRecipients}
        notPaidLastSent={notPaidLast?.createdAt.toISOString() ?? null}
        partPaymentLastSent={partPaymentLast?.createdAt.toISOString() ?? null}
      />

      <div
        style={{
          marginTop: 24,
          background: '#fff',
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          padding: '16px 20px',
          fontSize: 12.5,
          color: C.muted,
          lineHeight: 1.7,
          maxWidth: 760,
        }}
      >
        <strong style={{ color: C.forest }}>Note:</strong> sending records each email against the
        applicant in their email history. Re-sending within 25 minutes reuses the same payment link
        rather than creating a new one. Recipient counts reflect every applicant in the matching
        payment status and update live as applicants pay.
      </div>
    </div>
  );
}
