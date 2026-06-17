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

const PAYMENT_OPTS = ['Pending', 'Paid', 'Partial', 'Waived', 'Rejected'] as const;
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

function PaymentControl({
  id,
  initial,
  paidSoFarNaira,
  feeNaira,
}: {
  id: string;
  initial: string;
  paidSoFarNaira: number;
  feeNaira: number;
}) {
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [amount, setAmount] = useState(String(paidSoFarNaira || ''));
  const [isPending, startTransition] = useTransition();

  const isPartial = value === 'Partial';
  const amountNum = Number(amount);
  const amountValid = !isPartial || (amount !== '' && amountNum > 0 && amountNum < feeNaira);
  const dirty = value !== saved || isPartial;

  function submit() {
    const toastId = toast.loading('Updating payment…');
    startTransition(async () => {
      try {
        await updatePaymentStatus(id, value, isPartial ? amountNum : undefined);
        setSaved(value);
        toast.success(`Payment updated to “${value}”`, { id: toastId });
      } catch {
        toast.error('Couldn’t update payment. Please try again.', { id: toastId });
      }
    });
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <label style={{ fontSize: 12, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Payment</label>
      <select
        value={value}
        disabled={isPending}
        onChange={(e) => setValue(e.target.value)}
        style={{ padding: '7px 10px', border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 13, opacity: isPending ? 0.6 : 1 }}
      >
        {PAYMENT_OPTS.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      {isPartial && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: C.muted }}>₦</span>
          <input
            type="number"
            min={1}
            max={feeNaira - 1}
            value={amount}
            disabled={isPending}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount paid"
            style={{ width: 120, padding: '7px 10px', border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 13 }}
          />
          <span style={{ fontSize: 11, color: C.muted }}>of ₦{feeNaira.toLocaleString('en-NG')}</span>
        </span>
      )}
      <button
        type="button"
        onClick={submit}
        disabled={isPending || !dirty || !amountValid}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: C.forest, color: '#fff', border: 'none', borderRadius: 4,
          padding: '7px 12px', fontSize: 12,
          cursor: isPending || !dirty || !amountValid ? 'not-allowed' : 'pointer',
          opacity: isPending || !dirty || !amountValid ? 0.55 : 1,
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
  paidSoFarNaira,
  feeNaira,
}: {
  id: string;
  initialPayment: string;
  initialStatus: string;
  paidSoFarNaira: number;
  feeNaira: number;
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <PaymentControl id={id} initial={initialPayment} paidSoFarNaira={paidSoFarNaira} feeNaira={feeNaira} />
      <Control
        label="Status"
        options={STATUS_OPTS}
        initial={initialStatus}
        action={(value) => updateApplicationStatus(id, value)}
      />
    </div>
  );
}
