'use client';

import { useTransition } from 'react';
import { Loader2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { sendPaymentLink } from '../../reminders/actions';

const C = {
  forest: '#0A3D2B',
  gold: '#C8881A',
  muted: '#5A5A5A',
};

export default function ResendPaymentLink({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function submit() {
    const toastId = toast.loading('Sending payment link…');
    startTransition(async () => {
      try {
        const res = await sendPaymentLink(id);
        if (res.sent > 0) {
          toast.success('Payment link sent', { id: toastId });
        } else if (res.skipped > 0) {
          toast.success('Nothing to send — applicant has no outstanding balance', { id: toastId });
        } else {
          toast.error('Couldn’t send the payment link. Please try again.', { id: toastId });
        }
      } catch {
        toast.error('Couldn’t send the payment link. Please try again.', { id: toastId });
      }
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <button
        type="button"
        onClick={submit}
        disabled={isPending}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          background: C.gold, color: '#fff', border: 'none', borderRadius: 4,
          padding: '8px 14px', fontSize: 13, fontWeight: 500,
          cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.6 : 1,
          alignSelf: 'flex-start',
        }}
      >
        {isPending
          ? <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} />
          : <Mail size={14} />}
        {isPending ? 'Sending…' : 'Resend payment link'}
      </button>
      <span style={{ fontSize: 12, color: C.muted }}>
        Emails the applicant a fresh Paystack link for their outstanding balance.
      </span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
