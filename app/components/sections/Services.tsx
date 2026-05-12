'use client';

type Page = 'home' | 'about' | 'services' | 'corporates' | 'academic' | 'donors' | 'government' | 'contact';

interface ServicesProps {
  onNavigate: (page: Page) => void;
}

export default function Services({ onNavigate }: ServicesProps) {
  return (
    <div className="services">
      <div className="services-header">
        <div>
          <div className="section-label">What we do</div>
          <h2 className="section-title">Learning solutions built for<br /><em>lasting impact</em></h2>
        </div>
        <p className="section-body">
          From frontline workforce development to organisational leadership and technology-enabled learning, we design programmes that create systemic change, not just short-term skills transfer.
        </p>
      </div>
      <div className="services-grid">
        <div className="service-card" onClick={() => onNavigate('services')}>
          <div className="service-number">01</div>
          <h3 className="service-title">Capacity Building</h3>
          <p className="service-body">Structured, scalable programmes that build skills, professional values and market readiness across all workforce levels and sectors.</p>
          <div className="service-tags">
            <span className="tag">All Sectors</span><span className="tag">All Cadres</span>
            <span className="tag">Learn &amp; Earn</span><span className="tag">Youth &amp; Female</span>
          </div>
        </div>
        <div className="service-card" onClick={() => onNavigate('services')}>
          <div className="service-number">02</div>
          <h3 className="service-title">Organisational &amp; Leadership Development</h3>
          <p className="service-body">Co-creating programmes that strengthen the capability of organisations from the inside out, through leadership development and institutional capacity building.</p>
          <div className="service-tags">
            <span className="tag">Leadership</span><span className="tag">CPD</span>
            <span className="tag">Curriculum</span><span className="tag">Co-Design</span>
          </div>
        </div>
        <div className="service-card" onClick={() => onNavigate('services')}>
          <div className="service-number">03</div>
          <h3 className="service-title">Technology-Enabled Learning</h3>
          <p className="service-body">Digital learning infrastructure and content that extends reach, improves consistency and enables data-driven improvement. Built for African realities.</p>
          <div className="service-tags">
            <span className="tag">E-Learning</span><span className="tag">LMS</span>
            <span className="tag">Digital Content</span><span className="tag">Low-Bandwidth</span>
          </div>
        </div>
      </div>
    </div>
  );
}
