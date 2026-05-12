'use client';

import Link from 'next/link';
import Footer from './Footer';

type Page = 'home' | 'about' | 'services' | 'corporates' | 'academic' | 'donors' | 'government' | 'contact';

interface DonorsPageProps {
  onNavigate: (page: Page) => void;
}

export default function DonorsPage({ onNavigate }: DonorsPageProps) {
  return (
    <div>
      <div className="client-hero sm:min-h-[40vh] md:min-h-[50vh] flex items-center relative w-full" style={{
      backgroundImage: 'url(/donors.png)',

      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'bottom center',
      backgroundSize: 'cover',
    }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 z-5" />
      
        <div className="relative z-10 m-w-[60%] mx-auto py-10">
          <div className="section-label" style={{ color: 'var(--mint)' }}>For Donor Agencies & Implementing Partners</div>
          <h1>Workforce development that <em>delivers results.</em></h1>
          <p>Grant-funded workforce programmes face a dual obligation: deliver real impact for beneficiaries, and demonstrate that impact convincingly to funders. We design programmes that do both.</p>
        </div>
      </div>

      <nav className="client-subnav">
        <a onClick={() => onNavigate('corporates')}>Corporates</a>
        <a onClick={() => onNavigate('academic')}>Academic Institutions</a>
        <a className="active">Donor Agencies</a>
        <a onClick={() => onNavigate('government')}>Government</a>
      </nav>

      <div className="client-intro">
        <div className="client-intro-grid">
          <div>
            <h2>Learning that justifies <br/><em>continued investment.</em></h2>
            <p>Development programmes are under increasing pressure to demonstrate impact, not just outputs. Completion rates and attendance numbers are no longer sufficient. </p>
            <p>Funders want to see real behaviour change, employment outcomes, and sustainable improvement after the programme ends.</p>
            <p>We design workforce development programmes that are built around measurable outcomes from day one. Our M&E frameworks are integrated into the learning design, not bolted on at the end.</p>
          </div>
          <div>
            <div className="challenges-box">
              <h3>What we hear from implementing partners</h3>
              <ul>
                {[
                  'We need to show impact, not just delivery',
                  'Our training is not changing behaviour the way we hoped',
                  'The beneficiaries we work with have complex starting points and generic training does not work',
                  'We need a learning partner who understands the realities of grant-funded delivery',
                  'We want to integrate M&E into the learning design, not treat it as an afterthought',
                ].map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="client-services">
        <h2>What we do for <em>donor-funded programmes</em></h2>
        <br/>
        <div className="client-svc-grid">
          {[
            { title: 'Workforce Development Programme Design', body: 'End-to-end design of workforce development programmes for grant-funded contexts, from training needs analysis through to delivery and evaluation. Built for the bandwidth, capacity and beneficiary realities of your operating context.' },
            { title: 'Youth Employment & Livelihoods Programmes', body: 'Programmes that create genuine pathways into employment and enterprise for young people. Combining technical and professional skills training with employability capability, financial literacy and enterprise development.' },
            { title: 'Women\'s Economic Empowerment', body: 'Specialist programme design for female economic empowerment initiatives, addressing the specific barriers that women face in accessing skills, employment and enterprise opportunities.' },
            { title: 'Health Workforce Development', body: 'Our foundational expertise. We design and deliver workforce development programmes for health systems at every level — from community health workers to clinical managers and health administrators.' },
            { title: 'M&E Framework Design', body: 'Integrated monitoring and evaluation frameworks that are built into the learning design from the start — measuring real behaviour change and outcome achievement, not just attendance.' },
            { title: 'Proposal Partnership & Joint Bidding', body: 'For NGOs, development foundations and implementing partners seeking to strengthen the learning and workforce development components of funding proposals. We bring technical credibility and delivery track record to your bid.' },
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
                'Programmes that demonstrate measurable behaviour change',
                'Employment and enterprise outcomes for beneficiaries',
                'M&E data that satisfies donor reporting requirements',
                'Sustainable impact that continues after grant funding ends',
              ].map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>
          <div>
            <h3>Why Oakvale for grant-funded work</h3>
            <ul>
              {[
                'Deep experience in grant-funded delivery environments',
                'M&E integrated into learning design from day one',
                'Contextual sensitivity to beneficiary realities',
                'Reporting frameworks built for donor accountability',
              ].map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="cta">
        <div className="cta-inner">
          <h2>Working on a workforce development programme?</h2>
          <p>Whether you are designing a new programme, reviewing an existing one, or looking for a delivery partner for a funding bid, we would welcome the conversation.</p>
           <div className="cta-actions">
            <Link href="https://jobs.oakvaleltd.com" >
            <button 
            className="btn-primary-dark"
              onClick={() => onNavigate("contact")}
              >
             Hire Certified Care Staff
            </button>
              </Link>
            <Link
              href="https://learn.oakvaleltd.com"  
            >
              <button
                className="btn-outline-dark"
                onClick={() => onNavigate("services")}
              >
                Train Your Care Workforce
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
