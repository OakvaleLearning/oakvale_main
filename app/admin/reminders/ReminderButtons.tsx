'use client';

import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { sendReminders } from './actions';
import type { ReminderKind } from '@/lib/statusEmails';

const C = {
  forest: '#0A3D2B',
  gold: '#C8881A',
  cream: '#F7F3EC',
  charcoal: '#1C1C1C',
  muted: '#5A5A5A',
  border: 'rgba(10,61,43,0.12)',
};

function formatLastSent(iso: string | null | undefined): string {
  if (!iso) return 'Not sent yet';
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function ReminderCard({
  kind,
  title,
  description,
  count,
  lastSent,
}: {
  kind: ReminderKind;
  title: string;
  description: string;
  count: number;
  lastSent: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const disabled = isPending || count === 0;

  function send() {
    if (count === 0) return;
    const confirmed = window.confirm(
      `Send the payment reminder to ${count} applicant${count === 1 ? '' : 's'}? This cannot be undone.`
    );
    if (!confirmed) return;

    const toastId = toast.loading(`Sending ${count} reminder${count === 1 ? '' : 's'}…`);
    startTransition(async () => {
      try {
        const { sent, failed, skipped } = await sendReminders(kind);
        const parts = [`Sent ${sent}`];
        if (failed) parts.push(`${failed} failed`);
        if (skipped) parts.push(`${skipped} skipped`);
        const message = parts.join(', ');
        if (failed) toast.error(message, { id: toastId });
        else toast.success(message, { id: toastId });
      } catch {
        toast.error('Couldn’t send reminders. Please try again.', { id: toastId });
      }
    });
  }

  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        padding: '20px 22px',
        flex: '1 1 320px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div>
        <div style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 20, color: C.forest, marginBottom: 6 }}>
          {title}
        </div>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>{description}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 32, color: C.forest }}>{count}</span>
        <span style={{ fontSize: 12, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          recipient{count === 1 ? '' : 's'}
        </span>
      </div>
      <div style={{ fontSize: 12, color: C.muted }}>
        Last sent: <strong style={{ color: C.charcoal, fontWeight: 500 }}>{formatLastSent(lastSent)}</strong>
      </div>
      <button
        type="button"
        onClick={send}
        disabled={disabled}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          alignSelf: 'flex-start',
          background: C.forest,
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          padding: '10px 18px',
          fontSize: 13,
          fontFamily: 'inherit',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.55 : 1,
        }}
      >
        {isPending && <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} />}
        {isPending ? 'Sending…' : 'Send reminders'}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function ReminderButtons({
  notPaidCount,
  partPaymentCount,
  notPaidLastSent,
  partPaymentLastSent,
}: {
  notPaidCount: number;
  partPaymentCount: number;
  notPaidLastSent: string | null;
  partPaymentLastSent: string | null;
}) {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <ReminderCard
        kind="not_paid"
        title="Payment reminder"
        description="Applicants who have not paid the application fee (excludes full-scholarship applicants). Sends the “Complete your application” email with a Pay Application Fee button for the full ₦10,000."
        count={notPaidCount}
        lastSent={notPaidLastSent}
      />
      <ReminderCard
        kind="part_payment"
        title="Balance reminder"
        description="Applicants who have paid part of the fee. Sends the “1 week left” email showing amount paid and balance remaining, with a Complete My Payment button for the outstanding balance."
        count={partPaymentCount}
        lastSent={partPaymentLastSent}
      />
    </div>
  );
}
