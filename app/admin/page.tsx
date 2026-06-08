import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const C = {
  forest: '#0A3D2B',
  gold: '#C8881A',
  cream: '#F7F3EC',
  charcoal: '#1C1C1C',
  muted: '#5A5A5A',
  border: 'rgba(10,61,43,0.12)',
};

export const dynamic = 'force-dynamic';

function Stat({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 6, padding: '18px 20px', minWidth: 160, flex: '1 1 160px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: tone || C.muted, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontFamily: 'var(--font-cormorant), Georgia, serif', color: C.forest }}>{value}</div>
    </div>
  );
}

export default async function AdminOverview() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  const [total, pending, paid, waived, rejected, accepted, submitted, recent] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { paymentStatus: 'Pending' } }),
    prisma.application.count({ where: { paymentStatus: 'Paid' } }),
    prisma.application.count({ where: { paymentStatus: 'Waived' } }),
    prisma.application.count({ where: { paymentStatus: 'Rejected' } }),
    prisma.application.count({ where: { status: 'Accepted' } }),
    prisma.application.count({ where: { status: 'Submitted' } }),
    prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, firstName: true, lastName: true, email: true, institution: true, paymentStatus: true, createdAt: true },
    }),
  ]);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 30, fontWeight: 500, color: C.forest, margin: '0 0 4px' }}>Overview</h1>
      <p style={{ fontSize: 13, color: C.muted, margin: '0 0 24px' }}>Summer Intensive 2026 — applications snapshot.</p>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 32 }}>
        <Stat label="Total" value={total} />
        <Stat label="Payment · Pending" value={pending} tone="#a06010" />
        <Stat label="Payment · Paid" value={paid} tone="#145C3F" />
        <Stat label="Payment · Waived" value={waived} />
        <Stat label="Payment · Rejected" value={rejected} tone="#9a1d1d" />
        <Stat label="Status · Submitted" value={submitted} />
        <Stat label="Status · Accepted" value={accepted} tone="#145C3F" />
      </div>

      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 6, padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 20, fontWeight: 500, color: C.forest, margin: 0 }}>Recent applications</h2>
          <Link href="/admin/applications" style={{ fontSize: 13, color: C.gold, textDecoration: 'none' }}>View all →</Link>
        </div>
        {recent.length === 0 ? (
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>No applications yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: C.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <th style={{ padding: '8px 6px', borderBottom: `1px solid ${C.border}` }}>Name</th>
                <th style={{ padding: '8px 6px', borderBottom: `1px solid ${C.border}` }}>Institution</th>
                <th style={{ padding: '8px 6px', borderBottom: `1px solid ${C.border}` }}>Payment</th>
                <th style={{ padding: '8px 6px', borderBottom: `1px solid ${C.border}` }}>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((a) => (
                <tr key={a.id}>
                  <td style={{ padding: '10px 6px', borderBottom: `1px solid ${C.border}` }}>
                    <Link href={`/admin/applications/${a.id}`} style={{ color: C.forest, textDecoration: 'none', fontWeight: 500 }}>
                      {a.firstName} {a.lastName}
                    </Link>
                    <div style={{ fontSize: 12, color: C.muted }}>{a.email}</div>
                  </td>
                  <td style={{ padding: '10px 6px', borderBottom: `1px solid ${C.border}` }}>{a.institution}</td>
                  <td style={{ padding: '10px 6px', borderBottom: `1px solid ${C.border}` }}>{a.paymentStatus}</td>
                  <td style={{ padding: '10px 6px', borderBottom: `1px solid ${C.border}`, color: C.muted }}>
                    {a.createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
