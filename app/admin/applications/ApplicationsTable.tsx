'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { Loader2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { getApplicationsTsv } from './actions';

const C = {
  forest: '#0A3D2B',
  gold: '#C8881A',
  cream: '#F7F3EC',
  charcoal: '#1C1C1C',
  muted: '#5A5A5A',
  border: 'rgba(10,61,43,0.12)',
};

export type Row = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  institution: string;
  trackFirst: string;
  paymentStatus: string;
  status: string;
  createdAt: string; // ISO string
};

function badge(text: string, color: string) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        background: color + '22',
        color,
      }}
    >
      {text}
    </span>
  );
}

function paymentColor(s: string) {
  return s === 'Paid'
    ? '#145C3F'
    : s === 'Partial'
      ? '#9a6510'
      : s === 'Pending'
        ? '#a06010'
        : s === 'Waived'
          ? '#1a4bcc'
          : '#9a1d1d';
}

const th: React.CSSProperties = { padding: '10px 14px' };
const td: React.CSSProperties = { padding: '12px 14px', borderTop: `1px solid ${C.border}` };

export default function ApplicationsTable({ rows }: { rows: Row[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const count = selected.size;
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      if (rows.every((r) => prev.has(r.id))) {
        const next = new Set(prev);
        for (const r of rows) next.delete(r.id);
        return next;
      }
      const next = new Set(prev);
      for (const r of rows) next.add(r.id);
      return next;
    });
  }

  function copy() {
    if (count === 0) return;
    const toastId = toast.loading(`Copying ${count} applicant${count === 1 ? '' : 's'}…`);
    startTransition(async () => {
      try {
        const tsv = await getApplicationsTsv([...selected]);
        await navigator.clipboard.writeText(tsv);
        toast.success(`Copied ${count} applicant${count === 1 ? '' : 's'} to clipboard`, { id: toastId });
      } catch {
        toast.error('Couldn’t copy to clipboard. Please try again.', { id: toastId });
      }
    });
  }

  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 14px',
          borderBottom: `1px solid ${C.border}`,
          background: C.cream,
        }}
      >
        <button
          type="button"
          onClick={copy}
          disabled={count === 0 || isPending}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            background: C.forest,
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 500,
            cursor: count === 0 || isPending ? 'not-allowed' : 'pointer',
            opacity: count === 0 || isPending ? 0.55 : 1,
          }}
        >
          {isPending
            ? <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} />
            : <Copy size={14} />}
          Copy selected{count > 0 ? ` (${count})` : ''}
        </button>
        <span style={{ fontSize: 12, color: C.muted }}>
          Tick rows, then copy as spreadsheet rows (all fields) to paste into a sheet.
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>

      {rows.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', color: C.muted, fontSize: 14 }}>
          No applications found.
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr
              style={{
                background: C.cream,
                textAlign: 'left',
                color: C.muted,
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              <th style={{ ...th, width: 36 }}>
                <input
                  type="checkbox"
                  aria-label="Select all on this page"
                  checked={allSelected}
                  onChange={toggleAll}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th style={th}>Name</th>
              <th style={th}>Institution</th>
              <th style={th}>Track</th>
              <th style={th}>Payment</th>
              <th style={th}>Status</th>
              <th style={th}>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={selected.has(r.id) ? { background: '#fffbf4' } : undefined}>
                <td style={td}>
                  <input
                    type="checkbox"
                    aria-label={`Select ${r.firstName} ${r.lastName}`}
                    checked={selected.has(r.id)}
                    onChange={() => toggle(r.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td style={td}>
                  <Link
                    href={`/admin/applications/${r.id}`}
                    style={{ color: C.forest, textDecoration: 'none', fontWeight: 500 }}
                  >
                    {r.firstName} {r.lastName}
                  </Link>
                  <div style={{ fontSize: 12, color: C.muted }}>{r.email}</div>
                </td>
                <td style={td}>{r.institution}</td>
                <td style={td}>Track {r.trackFirst}</td>
                <td style={td}>{badge(r.paymentStatus, paymentColor(r.paymentStatus))}</td>
                <td style={{ ...td, color: C.muted }}>{r.status}</td>
                <td style={{ ...td, color: C.muted }}>
                  {new Date(r.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
