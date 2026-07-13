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

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function EnquiriesPage() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  const enquiries = await prisma.interestEnquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const th: React.CSSProperties = {
    padding: '8px 6px',
    borderBottom: `1px solid ${C.border}`,
    textAlign: 'left',
  };
  const td: React.CSSProperties = { padding: '10px 6px', borderBottom: `1px solid ${C.border}`, verticalAlign: 'top' };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 30, fontWeight: 500, color: C.forest, margin: '0 0 4px' }}>
        Interest enquiries
      </h1>
      <p style={{ fontSize: 13, color: C.muted, margin: '0 0 24px' }}>
        People who registered interest in future editions of the Summer Intensive. {enquiries.length} total.
      </p>

      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 6, padding: '18px 20px' }}>
        {enquiries.length === 0 ? (
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>No enquiries yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ color: C.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <th style={th}>Name</th>
                <th style={th}>Interest</th>
                <th style={th}>State</th>
                <th style={th}>Details</th>
                <th style={th}>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e) => {
                const details = [
                  e.discipline && `Field: ${e.discipline}`,
                  e.individualInstitution && `Institution: ${e.individualInstitution}`,
                  e.yearOfStudy && `Year: ${e.yearOfStudy}`,
                  e.institutionName && `School: ${e.institutionName}`,
                  e.institutionRole && `Role: ${e.institutionRole}`,
                  e.cityOrArea && `Area: ${e.cityOrArea}`,
                  e.connectedSchool && `Connect: ${e.connectedSchool}`,
                  e.heardVia && `Heard via: ${e.heardVia}`,
                ].filter(Boolean);
                return (
                  <tr key={e.id}>
                    <td style={td}>
                      <div style={{ color: C.forest, fontWeight: 500 }}>{e.name}</div>
                      <div style={{ fontSize: 12, color: C.muted }}>{e.email}</div>
                      {e.phone && <div style={{ fontSize: 12, color: C.muted }}>{e.phone}</div>}
                    </td>
                    <td style={td}>{e.interest}</td>
                    <td style={td}>{e.state}</td>
                    <td style={{ ...td, color: C.muted, maxWidth: 320 }}>
                      {details.length > 0 && <div>{details.join(' · ')}</div>}
                      {e.message && <div style={{ marginTop: 4, color: C.charcoal }}>&ldquo;{e.message}&rdquo;</div>}
                    </td>
                    <td style={{ ...td, color: C.muted, whiteSpace: 'nowrap' }}>{fmtDate(e.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
