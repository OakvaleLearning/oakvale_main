'use client';

import { Building, GraduationCap, Globe, Building2 } from 'lucide-react';

type Page = 'home' | 'about' | 'services' | 'corporates' | 'academic' | 'donors' | 'government' | 'contact';

interface AudiencesProps {
  onNavigate: (page: Page) => void;
}

export default function Audiences({ onNavigate }: AudiencesProps) {
  return (
    <section className="audiences relative bg-forest w-full z-0" style={{
      // backgroundImage: 'url(/female_health_professional.png)',

      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'top',
      backgroundSize: 'cover',
    }}>
      {/* Dark overlay */}
      {/* <div className="absolute inset-0 bg-black/65 z-10" /> */}
      
      <div className="audiences-header relative z-30">
        <div>
          <div className="section-label">Find your fit</div>
          <h2 className="section-title">The same commitment to quality.<br /><em>Designed for your context.</em></h2>
        </div>
        <p className="section-body">The capability challenges facing a fast-growing corporate are different from those facing a government ministry, a development foundation or a university faculty.</p>
      </div>
      <div className="audiences-grid relative z-30">
        <div className="audience-card" onClick={() => onNavigate('corporates')}>
          <div className="audience-icon"><Building size={24} strokeWidth={1.5} /></div>
          <h3 className="audience-title">For Corporates</h3>
          <p className="audience-body">Workforce capability, leadership development and professional standards for growing organisations.</p>
          <div className="audience-need">Stronger people. Stronger organisations. Sustainable growth.</div>
        </div>
        <div className="audience-card" onClick={() => onNavigate('academic')}>
          <div className="audience-icon"><GraduationCap size={24} strokeWidth={1.5} /></div>
          <h3 className="audience-title">For Academic Institutions</h3>
          <p className="audience-body">Curriculum co-development and academic programme design for universities and colleges.</p>
          <div className="audience-need">Globally benchmarked. Grounded in African realities. Built to evolve.</div>
        </div>
        <div className="audience-card" onClick={() => onNavigate('donors')}>
          <div className="audience-icon"><Globe size={24} strokeWidth={1.5} /></div>
          <h3 className="audience-title">For Donor Agencies &amp; Implementing Partners</h3>
          <p className="audience-body">Workforce and capacity development for grant-funded programmes and development projects.</p>
          <div className="audience-need">Workforce development that delivers results and proves them.</div>
        </div>
        <div className="audience-card" onClick={() => onNavigate('government')}>
          <div className="audience-icon"><Building2 size={24} strokeWidth={1.5} /></div>
          <h3 className="audience-title">For Government Agencies &amp; Departments</h3>
          <p className="audience-body">National skills development and workforce infrastructure, from strategy through to delivery at scale.</p>
          <div className="audience-need">National capability. Built to scale. Designed to endure.</div>
        </div>
      </div>
    </section>
  );
}
