'use client';

import { useActionState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { loginAction } from '../actions';

const C = {
  forest: '#0A3D2B',
  gold: '#C8881A',
  cream: '#F7F3EC',
  charcoal: '#1C1C1C',
  muted: '#5A5A5A',
  border: 'rgba(10,61,43,0.12)',
};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, {});

  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <div style={{ minHeight: '100vh', background: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 6, padding: '2.25rem 2rem', boxShadow: '0 2px 12px rgba(10,61,43,0.06)', border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>
          Oakvale · Admin
        </div>
        <h1 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 26, fontWeight: 500, color: C.forest, margin: '0 0 0.25rem' }}>
          Sign in
        </h1>
        <p style={{ fontSize: 13, color: C.muted, margin: '0 0 1.5rem' }}>
          Access the Summer Intensive applications dashboard.
        </p>

        <form action={formAction}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: C.charcoal, marginBottom: 5 }}>Email</label>
          <input name="email" type="email" required autoComplete="email"
            style={{ width: '100%', padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 14, marginBottom: 14, boxSizing: 'border-box', fontFamily: 'inherit' }} />

          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: C.charcoal, marginBottom: 5 }}>Password</label>
          <input name="password" type="password" required autoComplete="current-password"
            style={{ width: '100%', padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 14, marginBottom: 16, boxSizing: 'border-box', fontFamily: 'inherit' }} />

          <button type="submit" disabled={pending}
            style={{ width: '100%', background: C.forest, color: '#fff', border: 'none', borderRadius: 4, padding: '11px 16px', fontSize: 14, fontWeight: 500, cursor: pending ? 'not-allowed' : 'pointer', opacity: pending ? 0.7 : 1, fontFamily: 'inherit' }}>
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
