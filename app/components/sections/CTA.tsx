'use client';

type Page = 'home' | 'about' | 'services' | 'corporates' | 'academic' | 'donors' | 'government' | 'contact';

interface CTAProps {
  onNavigate: (page: Page) => void;
}

export default function CTA({ onNavigate }: CTAProps) {
  return (
    <div className="cta">
      <div className="cta-inner">
        <h2>Ready to build something that lasts?</h2>
        <p>We work with a small number of institutional partners at any one time. If your project aligns with our expertise, we would like to hear from you.</p>
        <div className="cta-actions">
          <button className="btn-primary-dark" onClick={() => onNavigate('contact')}>Start a conversation</button>
          <button className="btn-outline-dark" onClick={() => onNavigate('services')}>Explore our services</button>
        </div>
      </div>
    </div>
  );
}
