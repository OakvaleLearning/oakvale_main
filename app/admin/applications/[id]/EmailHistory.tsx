'use client';

import { Fragment, useState } from 'react';

const C = {
  forest: '#0A3D2B',
  gold: '#C8881A',
  cream: '#F7F3EC',
  charcoal: '#1C1C1C',
  muted: '#5A5A5A',
  border: 'rgba(10,61,43,0.12)',
  red: '#9a1d1d',
};

const TYPE_LABELS: Record<string, string> = {
  application_received: 'Application received',
  application_scholarship: 'Scholarship application complete',
  application_retry: 'Resubmission / fresh pay link',
  admin_notification: 'Admin notification',
  payment_paid: 'Payment confirmed',
  payment_partial: 'Part payment received',
  payment_waived: 'Scholarship / fee waived',
  payment_rejected: 'Payment issue',
  status_under_review: 'Under review',
  status_accepted: 'Accepted',
  status_declined: 'Declined',
};

function typeLabel(type: string): string {
  return TYPE_LABELS[type] ?? type;
}

export type LoggedEmail = {
  id: string;
  type: string;
  recipient: string;
  toAddress: string;
  subject: string;
  status: string;
  createdAt: string;
  html: string;
};

export type TemplatePreview = {
  type: string;
  label: string;
  subject: string;
  html: string;
};

function EmailFrame({ html }: { html: string }) {
  return (
    <iframe
      title="Email preview"
      sandbox=""
      srcDoc={html}
      style={{
        width: '100%',
        height: 520,
        border: `1px solid ${C.border}`,
        borderRadius: 4,
        background: '#fff',
      }}
    />
  );
}

export default function EmailHistory({
  logged,
  previews,
}: {
  logged: LoggedEmail[];
  previews: TemplatePreview[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string>('');

  const activePreview = previews.find((p) => p.type === previewType) ?? null;

  return (
    <div>
      {/* ─── Sent emails ─────────────────────────────── */}
      {logged.length === 0 ? (
        <p style={{ fontSize: 13, color: C.muted, margin: '0 0 4px' }}>
          No emails recorded yet. Emails sent from here on will appear in this list.
        </p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: C.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <th style={{ padding: '8px 6px', borderBottom: `1px solid ${C.border}` }}>Email</th>
              <th style={{ padding: '8px 6px', borderBottom: `1px solid ${C.border}` }}>Recipient</th>
              <th style={{ padding: '8px 6px', borderBottom: `1px solid ${C.border}` }}>Status</th>
              <th style={{ padding: '8px 6px', borderBottom: `1px solid ${C.border}` }}>Date</th>
              <th style={{ padding: '8px 6px', borderBottom: `1px solid ${C.border}` }} />
            </tr>
          </thead>
          <tbody>
            {logged.map((e) => {
              const open = openId === e.id;
              return (
                <Fragment key={e.id}>
                  <tr>
                    <td style={{ padding: '10px 6px', borderBottom: `1px solid ${C.border}` }}>
                      <div style={{ fontWeight: 600, color: C.charcoal }}>{typeLabel(e.type)}</div>
                      <div style={{ color: C.muted, fontSize: 12 }}>{e.subject}</div>
                    </td>
                    <td style={{ padding: '10px 6px', borderBottom: `1px solid ${C.border}`, color: C.muted, textTransform: 'capitalize' }}>
                      {e.recipient}
                    </td>
                    <td style={{ padding: '10px 6px', borderBottom: `1px solid ${C.border}` }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: e.status === 'failed' ? C.red : C.forest,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 6px', borderBottom: `1px solid ${C.border}`, color: C.muted }}>
                      {new Date(e.createdAt).toLocaleString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    <td style={{ padding: '10px 6px', borderBottom: `1px solid ${C.border}`, textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? null : e.id)}
                        style={{
                          background: 'transparent',
                          border: `1px solid ${C.border}`,
                          borderRadius: 4,
                          padding: '5px 12px',
                          fontSize: 12,
                          color: C.forest,
                          cursor: 'pointer',
                        }}
                      >
                        {open ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>
                  {open && (
                    <tr>
                      <td colSpan={5} style={{ padding: '0 6px 14px' }}>
                        <EmailFrame html={e.html} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      )}

      {/* ─── Live template preview ────────────────────── */}
      {previews.length > 0 && (
        <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 12, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Preview a template for this applicant
          </div>
          <select
            value={previewType}
            onChange={(ev) => setPreviewType(ev.target.value)}
            style={{
              padding: '8px 10px',
              border: `1px solid ${C.border}`,
              borderRadius: 4,
              fontSize: 13,
              fontFamily: 'inherit',
              background: '#fff',
              color: C.charcoal,
              maxWidth: 360,
              width: '100%',
            }}
          >
            <option value="">Select a template…</option>
            {previews.map((p) => (
              <option key={p.type} value={p.type}>{p.label}</option>
            ))}
          </select>
          {activePreview && (
            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: 12, color: C.muted, margin: '0 0 8px' }}>
                Live preview — this is what the template would look like for this applicant, not a record of a sent email.
                {' '}<strong style={{ color: C.charcoal }}>Subject:</strong> {activePreview.subject}
              </p>
              <EmailFrame html={activePreview.html} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
