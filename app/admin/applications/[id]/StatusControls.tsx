'use client';

import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { updatePaymentStatus, updateApplicationStatus } from '../../actions';

const C = {
  forest: '#0A3D2B',
  gold: '#C8881A',
  muted: '#5A5A5A',
  border: 'rgba(10,61,43,0.12)',
};

const PAYMENT_OPTS = ['Pending', 'Paid', 'Waived', 'Rejected'] as const;
const STATUS_OPTS = ['Submitted', 'UnderReview', 'Accepted', 'Declined'] as const;

function Control({
  label,
  options,
  initial,
  action,
}: {
  label: string;
  options: readonly string[];
  initial: string;
  action: (value: string) => Promise<void>;
}) {
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [isPending, startTransition] = useTransition();

  const dirty = value !== saved;

  function submit() {
    const toastId = toast.loading(`Updating ${label.toLowerCase()}…`);
    startTransition(async () => {
      try {
        await action(value);
        setSaved(value);
        toast.success(`${label} updated to “${value}”`, { id: toastId });
      } catch {
        toast.error(`Couldn’t update ${label.toLowerCase()}. Please try again.`, { id: toastId });
      }
    });
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <label style={{ fontSize: 12, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
      <select
        value={value}
        disabled={isPending}
        onChange={(e) => setValue(e.target.value)}
        style={{ padding: '7px 10px', border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 13, opacity: isPending ? 0.6 : 1 }}
      >
        {options.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      <button
        type="button"
        onClick={submit}
        disabled={isPending || !dirty}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: C.forest, color: '#fff', border: 'none', borderRadius: 4,
          padding: '7px 12px', fontSize: 12,
          cursor: isPending || !dirty ? 'not-allowed' : 'pointer',
          opacity: isPending || !dirty ? 0.55 : 1,
        }}
      >
        {isPending && <Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} />}
        {isPending ? 'Saving…' : 'Update'}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function StatusControls({
  id,
  initialPayment,
  initialStatus,
}: {
  id: string;
  initialPayment: string;
  initialStatus: string;
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <Control
        label="Payment"
        options={PAYMENT_OPTS}
        initial={initialPayment}
        action={(value) => updatePaymentStatus(id, value)}
      />
      <Control
        label="Status"
        options={STATUS_OPTS}
        initial={initialStatus}
        action={(value) => updateApplicationStatus(id, value)}
      />
    </div>
  );
}
