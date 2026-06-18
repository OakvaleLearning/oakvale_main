import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { REMINDER_AUDIENCE } from './actions';
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

  const [notPaidCount, partPaymentCount] = await Promise.all([
    prisma.application.count({ where: REMINDER_AUDIENCE.not_paid }),
    prisma.application.count({ where: REMINDER_AUDIENCE.part_payment }),
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

      <ReminderButtons notPaidCount={notPaidCount} partPaymentCount={partPaymentCount} />

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
        rather than creating a new one. Recipient counts update live from the current applicant data.
      </div>
    </div>
  );
}
