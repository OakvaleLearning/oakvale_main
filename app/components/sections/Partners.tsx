'use client';

const partners = [
  { icon: 'EU', name: 'EKO Unimed' },
  { icon: 'SL', name: 'Soteria Learning' },
  { icon: 'HA', name: 'Hawksworth Advisors' },
  { icon: 'CC', name: 'Carter Consulting' },
  { icon: 'HE', name: 'Healthy Entrepreneurs' },
  { icon: 'AH', name: 'AHA' },
  { icon: 'MH', name: 'Medbury Healthcare' },
  { icon: 'PH', name: 'Pro-Health International' },
  { icon: 'AN', name: 'Antly' },
];

export default function Partners() {
  return (
    <section className="partners">
      <div className="partners-header">
        <div className="section-label">Our Partners</div>
        <h2>Organisations we are proud to work with</h2>
      </div>
      <div className="reel-track-wrap">
        <div className="reel-track">
          {[...partners, ...partners].map((p, i) => (
            <div className="partner-pill" key={i}>
              <div className="p-icon">{p.icon}</div>
              <span>{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
