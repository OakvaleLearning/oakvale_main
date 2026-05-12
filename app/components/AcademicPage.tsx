'use client';

import Link from 'next/link';
import Footer from './Footer';

type Page = 'home' | 'about' | 'services' | 'corporates' | 'academic' | 'donors' | 'government' | 'contact';

interface AcademicPageProps {
  onNavigate: (page: Page) => void;
}

export default function AcademicPage({ onNavigate }: AcademicPageProps) {
  return (
    <div>
      <div className="client-hero sm:min-h-[40vh] md:min-h-[50vh] flex items-center relative w-full" style={{
      backgroundImage: 'url(/academic.png)',

      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'bottom center',
      backgroundSize: 'cover',
    }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 z-5" />
      
        <div className="relative z-10 m-w-[60%] mx-auto py-10">
          <div className="section-label" style={{ color: 'var(--mint)' }}>For Academic Institutions</div>
          <h1>Curriculum that is <br/><em>globally benchmarked and locally relevant.</em></h1>
          <p>African universities and colleges face a dual mandate: meet international academic standards while equipping graduates <br/>for the realities of African labour markets. We help you do both.</p>
        </div>
      </div>

      <nav className="client-subnav">
        <a onClick={() => onNavigate('corporates')}>Corporates</a>
        <a className="active">Academic Institutions</a>
        <a onClick={() => onNavigate('donors')}>Donor Agencies</a>
        <a onClick={() => onNavigate('government')}>Government</a>
      </nav>

      <div className="client-intro">
        <div className="client-intro-grid">
          <div>
            <h2>The gap between <em>degree and employability</em> is a design problem.</h2>
            <p>Across Africa, graduates are emerging from universities with strong academic credentials but limited readiness for the professional world. </p>
            <p> This is not a talent problem. It is a curriculum design problem. We work with faculties and institutions to close it.</p>
            <p>Our academic partnerships range from curriculum review and redesign through to the co-development of new qualifications, executive education programmes and continuous professional development frameworks.</p>
          </div>
          <div>
            <div className="challenges-box">
              <h3>What institutions tell us</h3>
              <ul>
                {[
                  'Our graduates are academically strong but professionally underprepared',
                  'Employers tell us our curriculum is out of date with market needs',
                  'We want to develop an executive education offer but do not know where to start',
                  'Our faculty lacks the industry connection to make curriculum relevant',
                  'We are under pressure to demonstrate graduate employment outcomes',
                ].map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="client-services">
        <h2>What we do for <em>academic institutions</em></h2>
        <br/>
        <div className="client-svc-grid">
          {[
            { title: 'Curriculum Review & Redesign', body: 'We review existing programmes against international benchmarks and African labour market needs, then work with your faculty to redesign modules, assessments and learning outcomes.' },
            { title: 'New Programme Development', body: 'From scoping to accreditation support, we support the development of new undergraduate, postgraduate and professional programmes, particularly in management, leadership and professional disciplines.' },
            { title: 'Executive Education Design', body: 'We help universities develop executive education and short-course offerings that generate revenue, build institutional reputation and meet the development needs of African organisations.' },
            { title: 'Employability & Professional Skills Integration', body: 'We integrate employability, professional skills and enterprise development into academic programmes, building graduate readiness alongside academic rigour.' },
            { title: 'Faculty Development', body: 'We work directly with faculty members on curriculum development skills, industry engagement and pedagogy, building internal capability alongside programme improvement.' },
            { title: 'Industry Partnership Facilitation', body: 'We broker and structure partnerships between academic institutions and employers, ensuring that curriculum development is grounded in real labour market intelligence.' },
          ].map((s, i) => (
            <div className="client-svc-card" key={i}>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>

        <div className="outcomes-strip">
          <div>
            <h3>What success looks like</h3>
            <ul>
              {[
                'Programmes that are internationally benchmarked and employer-valued',
                'Graduates who are professionally ready, not just academically credentialled',
                'An executive education offer that generates sustainable revenue',
                'Faculty that can continue improving curriculum independently',
              ].map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>
          <div>
            <h3>Our approach</h3>
            <ul>
              {[
                'Co-design with faculty',
                'Labour market grounding — curriculum shaped by real employer needs',
                'International benchmarking with African contextualisation',
                'Full support from design through to accreditation',
              ].map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="cta">
        <div className="cta-inner">
          <h2>Developing your academic programmes?</h2>
          <p>Whether you are reviewing an existing programme or developing something new, we would welcome the conversation.</p>
           <div className="cta-actions">
            
            <Link
              href="https://learn.oakvaleltd.com"  
            >
              <button
                className="btn-primary-dark"
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
