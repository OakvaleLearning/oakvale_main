import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateNotes } from '../../actions';
import StatusControls from './StatusControls';

const C = {
  forest: '#0A3D2B',
  gold: '#C8881A',
  cream: '#F7F3EC',
  charcoal: '#1C1C1C',
  muted: '#5A5A5A',
  border: 'rgba(10,61,43,0.12)',
};

export const dynamic = 'force-dynamic';

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, padding: '10px 0' }}>
      <div style={{ width: '40%', fontSize: 12, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ width: '60%', fontSize: 14, color: C.charcoal, whiteSpace: 'pre-wrap' }}>{value || '—'}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 6, padding: '18px 22px', marginBottom: 18 }}>
      <h2 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 18, fontWeight: 500, color: C.forest, margin: '0 0 10px' }}>{title}</h2>
      {children}
    </div>
  );
}

export default async function ApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  const { id } = await params;
  const a = await prisma.application.findUnique({
    where: { id },
    include: { payments: { orderBy: { createdAt: 'desc' } } },
  });
  if (!a) notFound();

  const aidFiles = (a.aidFiles as { url: string; name: string; size: number }[] | null) ?? [];

  const setNotes = async (formData: FormData) => {
    'use server';
    await updateNotes(id, String(formData.get('notes') ?? ''));
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
      <Link href="/admin/applications" style={{ fontSize: 13, color: C.gold, textDecoration: 'none' }}>← All applications</Link>
      <h1 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 30, fontWeight: 500, color: C.forest, margin: '8px 0 4px' }}>
        {a.firstName} {a.lastName}
      </h1>
      <p style={{ fontSize: 13, color: C.muted, margin: '0 0 24px' }}>
        Submitted {a.createdAt.toLocaleString('en-GB', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} · ID {a.id}
      </p>

      <Section title="Manage">
        <StatusControls id={id} initialPayment={a.paymentStatus} initialStatus={a.status} />
      </Section>

      <Section title="Personal">
        <Field label="Full name" value={`${a.firstName} ${a.lastName}`} />
        <Field label="Email" value={<a href={`mailto:${a.email}`} style={{ color: C.forest }}>{a.email}</a>} />
        <Field label="Phone (WhatsApp)" value={a.phone} />
        <Field label="State of residence" value={a.state} />
      </Section>

      <Section title="Academic">
        <Field label="Institution" value={a.institution} />
        <Field label="Discipline" value={a.discipline} />
        <Field label="Year of study" value={a.yearOfStudy} />
        <Field label="Student ID" value={a.studentId} />
      </Section>

      <Section title="Track">
        <Field label="First preference" value={`Track ${a.trackFirst}`} />
        <Field label="Second preference" value={a.trackSecond ? `Track ${a.trackSecond}` : 'None'} />
      </Section>

      <Section title="Motivation">
        <Field label="Why this track" value={a.mot1} />
        <Field label="What will you do differently" value={a.mot2} />
      </Section>

      <Section title="Financial Aid">
        <Field label="Applying for aid" value={a.needsAid ? 'Yes' : 'No'} />
        {a.needsAid && <Field label="Level of support" value={a.aidLevel ?? '—'} />}
        {a.needsAid && <Field label="Aid statement" value={a.aidStatement ?? '—'} />}
        {a.needsAid && (
          <Field
            label="Supporting documents"
            value={
              aidFiles.length === 0 ? (
                '—'
              ) : (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {aidFiles.map((f, i) => (
                    <li key={i}>
                      <a href={f.url} target="_blank" rel="noreferrer" style={{ color: C.forest }}>{f.name}</a>
                      <span style={{ color: C.muted, fontSize: 12, marginLeft: 6 }}>({Math.round(f.size / 1024)} KB)</span>
                    </li>
                  ))}
                </ul>
              )
            }
          />
        )}
      </Section>

      <Section title="Consents">
        <Field label="Information is truthful" value={a.consentTruth ? 'Yes' : 'No'} />
        <Field label="May be contacted" value={a.consentContact ? 'Yes' : 'No'} />
        <Field label="Accepts terms" value={a.consentTerms ? 'Yes' : 'No'} />
      </Section>

      <Section title="Payments">
        {a.payments.length === 0 ? (
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>No payment attempts on record.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: C.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <th style={{ padding: '8px 6px', borderBottom: `1px solid ${C.border}` }}>Reference</th>
                <th style={{ padding: '8px 6px', borderBottom: `1px solid ${C.border}` }}>Amount</th>
                <th style={{ padding: '8px 6px', borderBottom: `1px solid ${C.border}` }}>Status</th>
                <th style={{ padding: '8px 6px', borderBottom: `1px solid ${C.border}` }}>Channel</th>
                <th style={{ padding: '8px 6px', borderBottom: `1px solid ${C.border}` }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {a.payments.map((p) => (
                <tr key={p.id}>
                  <td style={{ padding: '10px 6px', borderBottom: `1px solid ${C.border}`, fontFamily: 'monospace', fontSize: 12 }}>
                    <a
                      href={`https://dashboard.paystack.com/#/transactions/${encodeURIComponent(p.reference)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: C.forest, textDecoration: 'none' }}
                    >
                      {p.reference}
                    </a>
                  </td>
                  <td style={{ padding: '10px 6px', borderBottom: `1px solid ${C.border}` }}>
                    ₦{(p.amount / 100).toLocaleString('en-NG')}
                  </td>
                  <td style={{ padding: '10px 6px', borderBottom: `1px solid ${C.border}` }}>{p.status}</td>
                  <td style={{ padding: '10px 6px', borderBottom: `1px solid ${C.border}`, color: C.muted }}>{p.paystackChannel ?? '—'}</td>
                  <td style={{ padding: '10px 6px', borderBottom: `1px solid ${C.border}`, color: C.muted }}>
                    {(p.paidAt ?? p.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      <Section title="Internal notes">
        <form action={setNotes}>
          <textarea name="notes" defaultValue={a.notes ?? ''} rows={4}
            style={{ width: '100%', padding: 10, border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' }} />
          <button type="submit" style={{ marginTop: 8, background: C.forest, color: '#fff', border: 'none', borderRadius: 4, padding: '7px 14px', fontSize: 13, cursor: 'pointer' }}>Save notes</button>
        </form>
      </Section>
    </div>
  );
}
