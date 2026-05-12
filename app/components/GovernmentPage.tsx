'use client';

import Footer from './Footer';

type Page = 'home' | 'about' | 'services' | 'corporates' | 'academic' | 'donors' | 'government' | 'contact';

interface GovernmentPageProps {
  onNavigate: (page: Page) => void;
}

export default function GovernmentPage({ onNavigate }: GovernmentPageProps) {
  return (
    <div>
      <div className="client-hero relative sm:min-h-[40vh] md:min-h-[50vh] flex items-center" style={{
      backgroundImage: 'url(/government.png)',

      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'bottom center',
      backgroundSize: 'cover',
    }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 z-5" />
      
        <div className="relative z-10 m-w-[60%] mx-auto py-10">
          <div className="section-label" style={{ color: 'var(--mint)' }}>For Government Agencies & Departments</div>
          <h1 className="font-[500]">National capability.  <em>Competence at scale.</em></h1>
          <p>Government workforces are the backbone of national development. We partner with ministries and public agencies to build the workforce capability that public service delivery depends on.</p>
        </div>
      </div>

      <nav className="client-subnav">
        <a onClick={() => onNavigate('corporates')}>Corporates</a>
        <a onClick={() => onNavigate('academic')}>Academic Institutions</a>
        <a onClick={() => onNavigate('donors')}>Donor Agencies</a>
        <a className="active">Government</a>
      </nav>

      <div className="client-intro">
        <div className="client-intro-grid">
          <div>
            <h2>Building the workforce that <br/><em>national development requires.</em></h2>
            <p>Public sector workforce development operates at a different scale and with different constraints from the private sector. Workforces are dispersed, infrastructure is variable, accountability is public and the stakes are high. We understand this environment and we design for it.</p>
            <p>We work with government ministries and agencies across Africa on everything from health workforce development to national skills programmes, civil service capability and technology-enabled national training delivery.</p>
          </div>
          <div>
            <div className="challenges-box">
              <h3>What we hear from government partners</h3>
              <ul>
                {[
                  'We need to train thousands of civil servants and the logistics are overwhelming',
                  'Training happens but nothing changes and the transfer problem is real',
                  'We want to build internal L&D capability, not rely on consultants forever',
                  'Our workforce is dispersed and face-to-face training is not enough',
                  'We need to demonstrate the impact of our training investment to treasury',
                ].map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="client-services">
        <h2>What we do for <em>government</em></h2>
        <br/>
        <div className="client-svc-grid">
          {[
            { title: 'Health Workforce Strengthening', body: 'Our foundational expertise. We design and deliver workforce development for health systems at every level — from community health workers and frontline clinicians through to health managers, administrators and health ministry officials.' },
            { title: 'Civil Service Capability Development', body: 'Structured learning programmes that build the professional capability of civil servants — from technical skills and professional standards to management capability and policy expertise.' },
            { title: 'Youth Employment and Skills Pipeline Programmes', body: 'For ministries focused on youth employment and economic empowerment, we design workforce development programmes that create genuine pathways into growth sectors.' },
            { title: 'Technology-Enabled National Delivery', body: 'Large-scale government training cannot rely on face-to-face delivery alone. We design and deploy digital learning systems scaled for national deployment: mobile-first, low-bandwidth capable, analytics-enabled.' },
            { title: 'National Skills Strategy & Design', body: 'For governments developing or reviewing national skills frameworks, we provide technical advisory support and programme design expertise across the full policy-to-delivery spectrum.' },
            { title: 'Institutional Capacity Transfer', body: 'Beyond programme delivery, we build the internal learning and development capacity of government agencies, equipping ministry staff to design, manage and improve workforce development programmes independently.' },
          ].map((s, i) => (
            <div className="client-svc-card" key={i}>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>

        <div className="outcomes-strip">
          <div>
            <h3>What we deliver</h3>
            <ul>
              {[
                'Workforce programmes that reach every part of the national workforce',
                'Measurable improvement in service delivery and professional standards',
                'Technology infrastructure that the government owns and operates',
                'Internal L&D capability that sustains improvement after we are gone',
              ].map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>
          <div>
            <h3>Built for government realities</h3>
            <ul>
              {[
                'Designed for dispersed, large-scale national workforces',
                'Low-bandwidth and mobile-first digital delivery',
                'Public accountability and transparency built in',
                'Capability transfer — government ownership is always the goal',
              ].map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="cta">
        <div className="cta-inner">
          <h2>Building national workforce capability?</h2>
          <p>We work with government ministries and public sector agencies at every stage, from strategy through to large-scale delivery. We would welcome the conversation.</p>
          <div className="cta-actions">
            <button className="btn-primary-dark" onClick={() => onNavigate('contact')}>Request a government briefing</button>
            <button className="btn-outline-dark" onClick={() => onNavigate('services')}>See all services</button>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
