import Link from 'next/link';
import { auth } from '@/lib/auth';
import { logoutAction } from './actions';

const C = {
  forest: '#0A3D2B',
  gold: '#C8881A',
  cream: '#F7F3EC',
  charcoal: '#1C1C1C',
  muted: '#5A5A5A',
  border: 'rgba(10,61,43,0.12)',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div style={{ minHeight: '100vh', background: C.cream, fontFamily: 'DM Sans, sans-serif', color: C.charcoal }}>
      {session?.user ? (
        <header style={{ background: C.forest, color: '#fff', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 20 }}>
              Oakvale Admin
            </Link>
            <nav style={{ display: 'flex', gap: 18, fontSize: 13 }}>
              <Link href="/admin" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>Overview</Link>
              <Link href="/admin/applications" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>Applications</Link>
            </nav>
          </div>
          <form action={logoutAction}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginRight: 12 }}>{session.user.email}</span>
            <button type="submit" style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 4, padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
              Sign out
            </button>
          </form>
        </header>
      ) : null}
      <main>{children}</main>
    </div>
  );
}
