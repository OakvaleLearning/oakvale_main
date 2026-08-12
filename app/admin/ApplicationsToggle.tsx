'use client';

import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { toggleApplicationsOpen } from './actions';

const C = {
  forest: '#0A3D2B',
  gold: '#C8881A',
  muted: '#5A5A5A',
  border: 'rgba(10,61,43,0.12)',
};

export default function ApplicationsToggle({ initialOpen }: { initialOpen: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  const [isPending, startTransition] = useTransition();

  function flip() {
    const next = !open;
    const toastId = toast.loading(next ? 'Reopening applications…' : 'Closing applications…');
    startTransition(async () => {
      try {
        await toggleApplicationsOpen(next);
        setOpen(next);
        toast.success(next ? 'Applications are now open' : 'Applications are now closed', { id: toastId });
      } catch {
        toast.error('Couldn’t update. Please try again.', { id: toastId });
      }
    });
  }

  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        padding: '18px 20px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>
          Applications
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: open ? '#145C3F' : '#9a1d1d',
              display: 'inline-block',
            }}
          />
          <span style={{ fontSize: 15, fontWeight: 500, color: open ? '#145C3F' : '#9a1d1d' }}>
            {open ? 'Open — accepting new applications' : 'Closed — new applications rejected'}
          </span>
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>
          Applicants who have already started can still complete payment either way.
        </div>
      </div>
      <button
        type="button"
        onClick={flip}
        disabled={isPending}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: open ? '#9a1d1d' : C.forest,
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          padding: '10px 16px',
          fontSize: 13,
          fontWeight: 500,
          cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.6 : 1,
        }}
      >
        {isPending && <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} />}
        {open ? 'Close applications' : 'Reopen applications'}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
