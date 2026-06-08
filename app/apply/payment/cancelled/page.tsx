import Link from 'next/link';

const C = {
  forest: '#0A3D2B',
  gold: '#C8881A',
  cream: '#F7F3EC',
  muted: '#5A5A5A',
};

export default function PaymentCancelledPage() {
  return (
    <div style={{ minHeight: '100vh', background: C.cream, paddingTop: 80, fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, marginBottom: 10 }}>
          Oakvale · Summer Intensive 2026
        </div>
        <h1 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 34, fontWeight: 500, color: C.forest, margin: '0 0 12px' }}>
          Payment cancelled
        </h1>
        <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, margin: '0 0 24px' }}>
          You closed the checkout before completing payment. Your application is saved — we have emailed you a pay link you can use whenever you are ready.
        </p>
        <Link href="/" style={{ color: C.gold, textDecoration: 'none', fontSize: 13 }}>← Return to oakvaleltd.com</Link>
      </div>
    </div>
  );
}
