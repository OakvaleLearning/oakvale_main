'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Briefcase, Globe, Laptop, ChevronDown, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Programme', id: 'overview' },
  { label: 'Tracks', id: 'tracks' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'FAQ', id: 'faq' },
  { label: 'Apply', id: 'cta' },
];

const TRACKS = [
  {
    Icon: Briefcase,
    title: 'Track A: Clinical Enterprise',
    tagline: 'For health professionals who want to understand the business of healthcare. Design, run, and lead a sustainable clinical service — from regulations and financing to quality management and operational design.',
    weeks: [
      {
        n: 1,
        title: 'Who You Are as a Clinician-Entrepreneur',
        body: 'Build your professional identity as someone who combines clinical skill with enterprise thinking. You will map the clinical services landscape in Nigeria, understand how private facilities are regulated and funded, and start to see your future practice as an enterprise that must be well managed and financially sound.',
        outcome: 'You can describe what a clinician-entrepreneur is, explain the professional and ethical standards that apply, and identify your own starting point as a leader.',
      },
      {
        n: 2,
        title: 'How Clinical Services Work as Systems',
        body: 'Learn how a clinical service is designed, managed, and measured. You will study service design, supply chain management, cost structures, and performance frameworks, and connect these to real examples of clinical operations in Nigeria.',
        outcome: 'You can explain how a clinical service is designed, managed, and measured, and connect this to real conditions in Nigeria.',
      },
      {
        n: 3,
        title: 'Global Standards and How to Apply Them',
        body: 'Study international best practices in clinical service design, including quality frameworks used by leading health systems worldwide. You will learn how to adapt these standards for resource-constrained environments and build quality improvement protocols that are practical and sustainable in a Nigerian context.',
        outcome: 'You can describe international best practices in clinical service design and explain how to adapt them for resource-constrained environments.',
      },
      {
        n: 4,
        title: 'Applied Scenario and Health Innovation Challenge',
        body: 'Apply everything from the previous three weeks to a structured real-world scenario: running a fertility clinic in Lagos. You will diagnose operational and financial challenges, propose practical solutions, and complete your Health Innovation Challenge capstone project for the live pitch on 5 September.',
        outcome: 'You have applied all four weeks of learning to a real-world scenario and completed a Service Design Roadmap ready for the Health Innovation Challenge Showcase.',
      },
    ],
  },
  {
    Icon: Globe,
    title: 'Track B: Health Systems Leadership',
    tagline: 'For health professionals who want to influence the systems that determine health outcomes for entire communities. Think beyond the individual patient to the policies and structures that shape care at scale.',
    weeks: [
      {
        n: 1,
        title: 'Who You Are as a Clinician-Systems Leader',
        body: 'Build your professional identity as a clinician who leads within health systems, not just practises within them. You will map the structure, funding, and key performance gaps of the Nigerian public health system, and start to identify where your leadership can make a difference.',
        outcome: 'You can describe the identity of a clinician-systems leader, explain how the Nigerian public health system is structured and financed, and map the key performance gaps.',
      },
      {
        n: 2,
        title: 'How Health Systems Work as Managed Entities',
        body: 'Learn how health systems are governed, financed, and managed. Using the WHO health system building block framework, you will study how governance, workforce management, and health financing interact in practice, and connect these to specific challenges in Nigerian public health delivery.',
        outcome: 'You can apply the WHO building block framework to diagnose a Nigerian health system problem and explain the governance, financing, and workforce dimensions that drive it.',
      },
      {
        n: 3,
        title: 'Global Standards and How to Apply Them Here',
        body: 'Study international frameworks for health systems strengthening, including lessons from health reforms in Rwanda, Ghana, and Ethiopia. You will learn how to translate global evidence into context-specific policy recommendations and how to advocate for systems change from within the system.',
        outcome: 'You can describe international frameworks for health systems strengthening and explain how to adapt them to the specific conditions of Nigerian healthcare.',
      },
      {
        n: 4,
        title: 'Applied Scenario and Health Innovation Challenge',
        body: 'Apply everything from the previous three weeks to a real-world systems challenge: strengthening maternal health services in a Nigerian state. You will design a multi-component intervention, develop a stakeholder engagement strategy, and complete your Health Innovation Challenge capstone for the live pitch on 5 September.',
        outcome: 'You have completed a structured Systems Change Proposal demonstrating competence across all four weeks and delivered a live pitch at the Health Innovation Challenge Showcase.',
      },
    ],
  },
  {
    Icon: Laptop,
    title: 'Track C: Digital Health Innovation',
    tagline: 'For health professionals who are curious about technology and want to lead digital transformation in healthcare. You do not need to be a software engineer — you need to understand the problems and champion solutions that make care better.',
    weeks: [
      {
        n: 1,
        title: 'Who You Are as a Clinician-Innovator',
        body: 'Build your professional identity as a clinician who leads digital change. You will map the Nigerian digital health landscape, study your regulatory responsibilities under the NDPR and FMOH guidelines, and develop the user-centred mindset that separates effective digital health leaders from passive technology users.',
        outcome: 'You can describe what a clinician-innovator is, explain your ethical and regulatory responsibilities in digital health, and articulate the user-centred approach needed to lead transformation effectively.',
      },
      {
        n: 2,
        title: 'How Digital Health Systems Work',
        body: 'Learn the core components of a digital health system: electronic health records, telemedicine platforms, mHealth tools, and health data governance. You will connect these concepts to the practical constraints of Nigerian digital health delivery and study what makes digital health products succeed or fail in the Nigerian market.',
        outcome: 'You can explain the core components of a digital health system and connect these to the practical constraints and opportunities of the Nigerian market.',
      },
      {
        n: 3,
        title: 'Global Standards and How to Apply Them Here',
        body: 'Study international frameworks for digital health design, including FHIR interoperability standards, WHO digital health guidelines, and the emerging evidence on AI in clinical workflows. You will learn how to adapt these frameworks for low-bandwidth, low-resource, and shared-device contexts specific to Nigeria.',
        outcome: 'You can describe international best practices in digital health design and explain how to adapt global frameworks for Nigerian infrastructure and users.',
      },
      {
        n: 4,
        title: 'Applied Scenario and Health Innovation Challenge',
        body: 'Apply everything from the previous three weeks to a structured real-world scenario: building a telemedicine service in Nigeria. You will diagnose clinical, technical, and adoption failures in an existing digital health service, redesign it using the frameworks from earlier weeks, and complete your Health Innovation Challenge capstone for the live pitch on 5 September.',
        outcome: 'You have completed a structured Digital Health Solution Concept demonstrating competence across all four weeks and delivered a live pitch at the Health Innovation Challenge Showcase.',
      },
    ],
  },
];

const STEPS = [
  {
    label: 'Apply',
    body: 'Fill in the online application form. Share your institution, faculty, year of study, and preferred track. Write 150 words on why you want to join. Applications are reviewed on a rolling basis. We are looking for genuine curiosity and commitment, not the highest grades.',
  },
  {
    label: 'Get accepted',
    body: 'Accepted students receive an invitation to join the online programme platform. You will complete a short onboarding module and introduce yourself to your track community before the programme begins.',
  },
  {
    label: 'Attend the Opening Ceremony',
    body: 'On Saturday 8 August 2026, all students gather at Julius Berger Hall, UNILAG Yaba Campus. You will hear from senior health system leaders, meet your cohort in person, and attend a practitioner session for your track. You also have the chance to hear from industry experts on possible career pathways.',
  },
  {
    label: 'Complete the four weeks online',
    body: 'Starting on Monday 10 August. Each week, an interactive module unlocks on the platform. You study it in your own time. In Week 2, we will host a guest practitioner on a live session. At the end of the week, you post a reflection and respond to a peer. In Week 3, your team will receive the Innovation Challenge brief.',
  },
  {
    label: 'Compete in the Innovata-thon Showcase',
    body: 'On 5 September, your team pitches your solution live to the judges via Zoom. All students attend. Winners are announced at the closing ceremony. You receive your UK CPD certificate the same day.',
  },
];

const DETAILS: [string, string][] = [
  ['Open to', 'Penultimate and final-year students in Medicine, Pharmacy, Dentistry, Nursing, Lab Sciences, and Physiotherapy at CMUL, LASUCOM, and EkoUnimed.'],
  ['Applications open', '9 June 2026'],
  ['Applications close', '2 July 2026'],
  ['Opening Ceremony', 'Saturday 8 August 2026. Julius Berger Hall, UNILAG Yaba. Hybrid.'],
  ['Online modules', '10 August to 4 September 2026'],
  ['Innovata-thon Showcase', 'Saturday 5 September 2026. Online via Zoom.'],
  ['Application fee', '₦10,000. Fifteen scholarship places available: five per institution.'],
  ['Certificate', 'UK CPD-accredited certificate, formally recognised.'],
];

const FAQS = [
  {
    q: 'Do I have to attend the Opening Ceremony in person?',
    a: "Attendance isn't mandatory, but attending the Opening Ceremony on 8 August is strongly encouraged. The rest of the programme is fully online.",
  },
  {
    q: 'I study Pharmacy, not Medicine. Can I apply?',
    a: 'Yes. The programme is open to all health sciences disciplines: Medicine, Pharmacy, Dentistry, Nursing, Laboratory Sciences, and Physiotherapy.',
  },
  {
    q: 'What if I cannot pay the application fee?',
    a: 'Fifteen scholarship places are available — five per track. Mention in your motivation statement that you are applying for a scholarship and why. Scholarships are awarded on merit and financial need.',
  },
  {
    q: 'How much time does it take each week?',
    a: 'Plan for around five to seven hours per week, i.e. one hour daily. This includes the self-study module, the live session, and the weekly reflection activity.',
  },
  {
    q: 'What is the Oakvale Health Innovation Challenge?',
    a: 'It is a team competition built into the programme. In Week 3, your team receives a real healthcare challenge. You develop a solution and pitch it live to judges on 5 September. There is a total prize pool of ₦4,000,000.',
  },
];

// ─── colour constants ────────────────────────────────────────────────────────
const C = {
  forest: '#0A3D2B',
  forestMid: '#145C3F',
  forestDark: '#071f16',
  gold: '#C8881A',
  goldLight: '#E8A832',
  cream: '#F7F3EC',
  creamWarm: '#EDE7DB',
  charcoal: '#1C1C1C',
  dark: '#3A3A3A',
  muted: '#5A5A5A',
};

export default function SummerIntensivePage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [trackOpen, setTrackOpen] = useState<number | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 118;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMobileNavOpen(false);
  };

  return (
    <>
      {/* Injected keyframe animations */}
      <style>{`
        @keyframes si-fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .si-fadeup {
          animation: si-fadeUp 0.85s ease forwards;
          opacity: 0;
        }
        .si-faq-body {
          overflow: hidden;
          transition: max-height 0.35s ease, opacity 0.3s ease;
        }
        .si-track-card {
          transition: box-shadow 0.22s ease, border-color 0.22s ease;
        }
        .si-track-card:hover {
          box-shadow: 0 8px 28px rgba(10,61,43,0.10);
        }
        .si-track-body {
          overflow: hidden;
          transition: max-height 0.45s ease, opacity 0.35s ease;
        }
        @media (max-width: 640px) {
          .si-track-header { padding: 18px 18px !important; gap: 14px !important; }
          .si-week-row { grid-template-columns: 1fr !important; gap: 8px !important; }
        }
        .si-btn:hover { background-color: ${C.goldLight} !important; }
        .si-nav-link:hover { opacity: 0.75; }
      `}</style>

      {/* ── Section sub-nav (fixed below root nav) ───────────────────────── */}
      <nav
        aria-label="Section navigation"
        style={{
          position: 'fixed',
          top: 70,
          left: 0,
          right: 0,
          zIndex: 90,
          height: 48,
          backgroundColor: C.forest,
          borderBottom: `1px solid rgba(200,136,26,0.25)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: '0.95rem',
          fontWeight: 600,
          color: C.cream,
          letterSpacing: '0.03em',
          whiteSpace: 'nowrap',
        }}>
          Summer Intensive 2026
        </span>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }} className="si-desktop-nav">
          {NAV_LINKS.map(link =>
            link.label === 'Apply' ? (
              <a
                key={link.id}
                href="/apply"
                className="si-nav-link"
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: C.gold,
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
              >
                {link.label}
              </a>
            ) : (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="si-nav-link"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 400,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: C.cream,
                  transition: 'opacity 0.2s',
                  padding: 0,
                }}
              >
                {link.label}
              </button>
            )
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileNavOpen(o => !o)}
          aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileNavOpen}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: C.cream,
            display: 'none',
            padding: 4,
          }}
          className="si-hamburger"
        >
          {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile nav dropdown */}
      {mobileNavOpen && (
        <div
          style={{
            position: 'fixed',
            top: 118,
            left: 0,
            right: 0,
            zIndex: 89,
            backgroundColor: C.forest,
            borderBottom: `1px solid rgba(200,136,26,0.25)`,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          }}
        >
          {NAV_LINKS.map(link =>
            link.label === 'Apply' ? (
              <a
                key={link.id}
                href="/apply"
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '14px 24px',
                  fontSize: '0.9rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: C.gold,
                  borderBottom: `1px solid rgba(247,243,236,0.07)`,
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </a>
            ) : (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '14px 24px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: C.cream,
                  borderBottom: `1px solid rgba(247,243,236,0.07)`,
                }}
              >
                {link.label}
              </button>
            )
          )}
        </div>
      )}

      {/* Responsive style for hamburger vs desktop nav */}
      <style>{`
        @media (max-width: 767px) {
          .si-desktop-nav { display: none !important; }
          .si-hamburger { display: block !important; }
        }
      `}</style>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main style={{ paddingTop: 118 }}>

        {/* ── SECTION 1: Hero ────────────────────────────────────────────── */}
        <section
          id="hero"
          style={{
            minHeight: '90vh',
            backgroundColor: C.forest,
            display: 'flex',
            alignItems: 'flex-end',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            maxWidth: 'none',
            padding: 0,
            margin: 0,
          }}
        >
          {/* Background image */}
          <Image
            src="/summer/summer-intensive-hero1.png"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'bottom' }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-[#071f16]/70 pointer-events-none" />
          {/* Gradient wash */}
          <div className="opacity-40" style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, rgba(10,61,43,0.55) 0%, rgba(20,92,63,0.35) 60%, rgba(10,61,43,0.45) 100%)`,
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 960, margin: '0 auto', padding: '24px 24px 64px' }}>
            <p
              className="si-fadeup"
              style={{ animationDelay: '0.1s', color: C.gold, textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.78rem', fontWeight: 600, marginBottom: '1.5rem' }}
            >
              Oakvale Learning · Healthcare Leadership and Innovation · Summer Intensive 2026
            </p>

            <h1
              className="si-fadeup"
              style={{
                animationDelay: '0.25s',
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(1.9rem, 4.6vw, 3.8rem)',
                fontWeight: 600,
                color: C.cream,
                lineHeight: 1.15,
                marginBottom: '1.5rem',
                maxWidth: 820,
              }}
            >
              Lead the future of healthcare.
              <br/>
              <em style={{ color: C.gold }}>Shape Systems. Drive Innovation. Create Impact.</em> 
            </h1>

            <a
              href="/apply"
              className="si-fadeup si-btn"
              style={{
                animationDelay: '0.7s',
                display: 'inline-block',
                backgroundColor: C.gold,
                color: '#fff',
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.05rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '15px 42px',
                borderRadius: 2,
                textDecoration: 'none',
                transition: 'background-color 0.2s ease',
              }}
            >
              Apply now
            </a>
          </div>
        </section>

        {/* ── SECTION 2: Programme Overview ──────────────────────────────── */}
        <section id="overview" style={{ backgroundColor: C.cream, padding: '88px 24px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <p style={{ color: C.gold, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.6rem' }}>
              The Programme
            </p>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: C.forest, lineHeight: 1.2, marginBottom: '2rem' }}>
              What is this programme about?
            </h2>

            <p style={{ fontSize: '1.05rem', color: C.charcoal, lineHeight: 1.82, marginBottom: '1.5rem' }}>
              Your degree teaches you how to diagnose, treat, and care for patients. But healthcare today is more than clinical work. Someone has to run the clinic. Someone has to design the policy. Someone has to build the technology. Nigerian health professionals are stepping into those roles, and most of them had no training for it.
            </p>
            <p style={{ fontSize: '1.05rem', color: C.charcoal, lineHeight: 1.82, marginBottom: '1.25rem' }}>
              This programme gives you that training. In four weeks, you will study one specialist track:
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: '1.5rem' }}>
              {['Clinical Enterprise', 'Health Systems Leadership', 'Digital Innovation'].map(t => (
                <span key={t} style={{
                  border: `1.5px solid ${C.gold}`,
                  color: C.forest,
                  padding: '6px 18px',
                  borderRadius: 20,
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                }}>
                  {t}
                </span>
              ))}
            </div>

            <p style={{ fontSize: '1.05rem', color: C.charcoal, lineHeight: 1.82, marginBottom: '1.5rem' }}>
              You will learn from Nigerian practitioners doing this work right now. You will work in a team to tackle a real healthcare challenge. And you will earn a formally recognised UK CPD certificate.
            </p>
            <p style={{ fontSize: '1.05rem', color: C.charcoal, lineHeight: 1.82 }}>
              You will not just listen to lectures. You will think through real problems, discuss them with your peers, and leave with a clearer picture of who you want to be as a health professional.
            </p>
          </div>
        </section>

        {/* ── SECTION 3: Tracks ──────────────────────────────────────────── */}
        <section id="tracks" style={{ backgroundColor: C.creamWarm, padding: '88px 24px' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <p style={{ color: C.gold, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.6rem', textAlign: 'center' }}>
              Your Specialisation
            </p>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: C.forest, lineHeight: 1.2, marginBottom: '0.75rem', textAlign: 'center' }}>
              Choose Your Track
            </h2>
            <p style={{ fontSize: '1rem', color: C.muted, maxWidth: 620, margin: '0 auto 3.5rem', textAlign: 'center', lineHeight: 1.72 }}>
              You choose one track when you apply. You stay in that track for the full four weeks. Your track shapes the modules you study, the live sessions you attend, and the team you compete with in the Innovata-thon.
            </p>

            <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {TRACKS.map(({ Icon, title, tagline, weeks }, i) => {
                const open = trackOpen === i;
                return (
                  <div
                    key={i}
                    className="si-track-card"
                    style={{
                      backgroundColor: C.cream,
                      border: `1px solid rgba(10,61,43,0.10)`,
                      borderLeft: `4px solid ${C.gold}`,
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      aria-expanded={open}
                      onClick={() => setTrackOpen(prev => prev === i ? null : i)}
                      className="si-track-header"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20,
                        width: '100%',
                        textAlign: 'left',
                        padding: '22px 26px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      <div style={{
                        width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                        backgroundColor: `rgba(200,136,26,0.12)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={22} color={C.gold} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem', fontWeight: 600, color: C.forest, lineHeight: 1.3, margin: 0, marginBottom: open ? 0 : 6 }}>
                          {title}
                        </h3>
                        {!open && (
                          <p style={{ fontSize: '0.95rem', color: C.muted, lineHeight: 1.6, margin: 0 }}>
                            {tagline}
                          </p>
                        )}
                      </div>
                      <ChevronDown
                        size={22}
                        color={C.gold}
                        style={{ flexShrink: 0, transition: 'transform 0.3s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                    </button>

                    <div
                      className="si-track-body"
                      style={{ maxHeight: open ? 2400 : 0, opacity: open ? 1 : 0 }}
                    >
                      <div style={{ padding: '4px 26px 28px' }}>
                        <p style={{ fontSize: '0.97rem', color: C.dark, lineHeight: 1.78, marginBottom: 24 }}>
                          {tagline}
                        </p>

                        {weeks.map((wk, wi) => (
                          <div
                            key={wk.n}
                            className="si-week-row"
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '88px 1fr',
                              gap: 20,
                              paddingBottom: 20,
                              marginBottom: 20,
                              borderBottom: wi < weeks.length - 1 ? `1px solid rgba(10,61,43,0.08)` : 'none',
                            }}
                          >
                            <div>
                              <span style={{
                                display: 'inline-block',
                                fontFamily: 'DM Sans, sans-serif',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: C.gold,
                                backgroundColor: 'rgba(200,136,26,0.10)',
                                padding: '5px 10px',
                                borderRadius: 3,
                              }}>
                                Week {wk.n}
                              </span>
                            </div>
                            <div>
                              <h4 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', fontWeight: 600, color: C.forest, lineHeight: 1.3, margin: '0 0 8px' }}>
                                {wk.title}
                              </h4>
                              <p style={{ fontSize: '0.95rem', color: C.dark, lineHeight: 1.75, margin: '0 0 12px' }}>
                                {wk.body}
                              </p>
                              <div style={{
                                backgroundColor: 'rgba(200,136,26,0.08)',
                                borderLeft: `3px solid ${C.gold}`,
                                padding: '12px 14px',
                                borderRadius: 2,
                              }}>
                                <span style={{
                                  fontFamily: 'DM Sans, sans-serif',
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  color: C.forest,
                                  letterSpacing: '0.02em',
                                }}>
                                  By the end of this week:
                                </span>{' '}
                                <span style={{ fontSize: '0.93rem', color: C.dark, lineHeight: 1.7 }}>
                                  {wk.outcome}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SECTION 4: Innovata-thon ───────────────────────────────────── */}
        <section
          id="innovathon"
          style={{ backgroundColor: C.forestMid, padding: '88px 24px', position: 'relative', overflow: 'hidden' }}
        >
           <Image
            src="/summer/summer-intensive-hero00.png"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-[#071f16]/60 pointer-events-none" />

          {/* Diagonal stripe pattern */}
          {/* <div style={{
            position: 'absolute', inset: 0, opacity: 0.05,
            backgroundImage: `repeating-linear-gradient(45deg, ${C.gold} 0, ${C.gold} 1px, transparent 0, transparent 50%)`,
            backgroundSize: '20px 20px',
            pointerEvents: 'none',
          }} /> */}

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
            <p style={{ color: C.goldLight, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.6rem' }}>
              The Capstone Competition
            </p>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', fontWeight: 600, color: C.cream, lineHeight: 1.2, marginBottom: '2rem' }}>
              The Oakvale Health Innovation Challenge
            </h2>

            <p style={{ fontSize: '1.05rem', color: 'rgba(247,243,236,0.88)', lineHeight: 1.82, marginBottom: '1.25rem' }}>
              The Innovation Challenge is the capstone competition at the heart of the programme. In Week 3, your team will receive a real, unsolved challenge facing the Nigerian health system.
            </p>
            <p style={{ fontSize: '1.05rem', color: 'rgba(247,243,236,0.88)', lineHeight: 1.82, marginBottom: '1.25rem' }}>
              As a group, you will work on this challenge and shape a real-world solution. You have one week to develop your solution.
            </p>
            <p style={{ fontSize: '1.05rem', color: 'rgba(247,243,236,0.88)', lineHeight: 1.82, marginBottom: '1.25rem' }}>
              On Saturday 5 September 2026, every team will pitch their solution to an independent panel of industry judges.
            </p>
            <p style={{ fontSize: '1.05rem', color: 'rgba(247,243,236,0.88)', lineHeight: 1.82, marginBottom: '2.5rem' }}>
              Winners are announced the same day. The prize pool is{' '}
              <span style={{ color: C.goldLight, fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-cormorant)', letterSpacing: '0.02em' }}>
                ₦4,000,000
              </span>
              , distributed across the overall winner, three track winners, and one individual student award.
            </p>

            <hr style={{ border: 'none', borderTop: `1px solid rgba(232,168,50,0.4)`, marginBottom: '1.75rem' }} />

            <p style={{ fontSize: '1.15rem', fontStyle: 'italic', color: C.goldLight, fontWeight: 600, lineHeight: 1.6 }}>
              This is not a simulation. The problems are real. The judges are real. The prizes are real.
            </p>
          </div>
        </section>

        {/* ── SECTION 5: How It Works ────────────────────────────────────── */}
        <section id="how-it-works" style={{ backgroundColor: C.cream, padding: '88px 24px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <p style={{ color: C.gold, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.6rem' }}>
              The Journey
            </p>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: C.forest, lineHeight: 1.2, marginBottom: '3.5rem' }}>
              How it works
            </h2>

            <div style={{ position: 'relative' }}>
              {/* Vertical connector line */}
              <div style={{
                position: 'absolute',
                left: 21,
                top: 22,
                bottom: 22,
                width: 2,
                background: `linear-gradient(to bottom, ${C.gold}, rgba(200,136,26,0.08))`,
              }} />

              {STEPS.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 28, marginBottom: i < STEPS.length - 1 ? 44 : 0, position: 'relative' }}>
                  {/* Step number circle */}
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    backgroundColor: C.forest,
                    border: `2px solid ${C.gold}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-cormorant)', fontWeight: 700, fontSize: '1.05rem',
                    color: C.gold,
                    zIndex: 1,
                  }}>
                    {i + 1}
                  </div>

                  <div style={{ paddingTop: 8 }}>
                    <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem', fontWeight: 600, color: C.forest, marginBottom: 8 }}>
                      Step {i + 1}: {step.label}
                    </h3>
                    <p style={{ fontSize: '0.97rem', color: C.dark, lineHeight: 1.78 }}>
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 6: Key Details ─────────────────────────────────────── */}
        <section id="details" style={{ backgroundColor: C.creamWarm, padding: '88px 24px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ color: C.gold, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.6rem' }}>
              Essentials
            </p>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: C.forest, lineHeight: 1.2, marginBottom: '2rem' }}>
              The Details
            </h2>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {DETAILS.map(([label, value], i) => (
                  <tr
                    key={i}
                    style={{ backgroundColor: i % 2 === 0 ? 'rgba(247,243,236,0.65)' : 'transparent' }}
                  >
                    <td style={{
                      padding: '15px 16px',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      color: C.forest,
                      width: '36%',
                      borderBottom: `1px solid rgba(10,61,43,0.1)`,
                      verticalAlign: 'top',
                      lineHeight: 1.6,
                    }}>
                      {label}
                    </td>
                    <td style={{
                      padding: '15px 16px',
                      fontSize: '0.95rem',
                      color: C.dark,
                      borderBottom: `1px solid rgba(10,61,43,0.1)`,
                      lineHeight: 1.68,
                    }}>
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── SECTION 7: FAQ ─────────────────────────────────────────────── */}
        <section id="faq" style={{ backgroundColor: C.cream, padding: '88px 24px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <p style={{ color: C.gold, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.6rem' }}>
              Questions
            </p>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: C.forest, lineHeight: 1.2, marginBottom: '2rem' }}>
              Frequently Asked Questions (FAQs)
            </h2>

            <div>
              {FAQS.map((faq, i) => (
                <div key={i} style={{ borderBottom: `1px solid rgba(10,61,43,0.12)` }}>
                  <button
                    aria-expanded={faqOpen === i}
                    onClick={() => setFaqOpen(prev => prev === i ? null : i)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      textAlign: 'left',
                      padding: '20px 0',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      color: C.forest,
                      paddingRight: 16,
                      lineHeight: 1.4,
                    }}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={20}
                      color={C.gold}
                      style={{ flexShrink: 0, transition: 'transform 0.3s ease', transform: faqOpen === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>

                  <div
                    className="si-faq-body"
                    style={{ maxHeight: faqOpen === i ? 400 : 0, opacity: faqOpen === i ? 1 : 0 }}
                  >
                    <p style={{ fontSize: '0.97rem', color: C.dark, lineHeight: 1.78, paddingBottom: 20 }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 8: Final CTA ───────────────────────────────────────── */}
        <section
          id="cta"
          style={{ backgroundColor: C.forest, padding: '96px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
        >
           <Image
            src="/summer/summer-intensive-footer.png"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-[#071f16]/80 pointer-events-none" />

       

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 600,
              color: C.cream,
              lineHeight: 1.25,
              marginBottom: '1.5rem',
            }}>
              Applications close 2 July 2026. <br /> Sixty places per institution across three tracks.
            </h2>

            <p style={{ fontSize: '1.05rem', color: 'rgba(247,243,236,0.78)', lineHeight: 1.78, maxWidth: 580, margin: '0 auto 2.5rem' }}>
              Three tracks. One cohort. A chance to compete for ₦4,000,000 in prizes and walk away with a UK CPD certificate. Apply now and be part of the first cohort.
            </p>

            <a
              href="/apply"
              className="si-btn"
              style={{
                display: 'inline-block',
                backgroundColor: C.gold,
                color: '#fff',
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.05rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '15px 42px',
                borderRadius: 2,
                textDecoration: 'none',
                transition: 'background-color 0.2s ease',
              }}
            >
              Apply now
            </a>

            <p style={{ fontSize: '0.84rem', color: 'rgba(247,243,236,0.45)', marginTop: '1.75rem', lineHeight: 1.7 }}>
              Questions? Contact the Oakvale team:{' '}
              <a href="mailto:hello@oakvaleltd.com" style={{ color: 'rgba(247,243,236,0.65)', textDecoration: 'underline' }}>
                hello@oakvaleltd.com
              </a>
              {' '}|{' '}
              <a href="https://www.oakvaleltd.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(247,243,236,0.65)', textDecoration: 'underline' }}>
                www.oakvaleltd.com
              </a>
            </p>
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer style={{ backgroundColor: C.forestDark, padding: '28px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.82rem', color: 'rgba(247,243,236,0.4)', letterSpacing: '0.04em', lineHeight: 1.7 }}>
            <a href="mailto:hello@oakvaleltd.com" style={{ color: 'rgba(247,243,236,0.6)', textDecoration: 'none' }}>
              hello@oakvaleltd.com
            </a>
            {/* {' '}·{' '}
            <a href="https://www.oakvaleltd.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(247,243,236,0.6)', textDecoration: 'none' }}>
              www.oakvaleltd.com
            </a> */}
            
          </p>
        </footer>
      </main>
    </>
  );
}
