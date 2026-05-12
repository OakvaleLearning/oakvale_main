"use client";

import Link from "next/link";
import Footer from "./Footer";

type Page =
  | "home"
  | "about"
  | "services"
  | "corporates"
  | "academic"
  | "donors"
  | "government"
  | "contact";

interface CorporatesPageProps {
  onNavigate: (page: Page) => void;
}

export default function CorporatesPage({ onNavigate }: CorporatesPageProps) {
  return (
    <div className="py-[2rem]">
      <div
        className="client-hero relative w-full sm:min-h-[40vh] md:min-h-[50vh] flex items-center"
        style={{
          backgroundImage: "url(/corporates.png)",

          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom center",
          backgroundSize: "cover",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-70 z-5" />

        <div className="relative z-10 m-w-[60%] mx-auto py-10">
          <div className="section-label" style={{ color: "var(--mint)" }}>
            For Corporates
          </div>
           <h1 className="text-white text-4xl md:text-5xl lg:text-6xl leading-tight">
            Building capability from <em>the inside out.</em>
          </h1>
          <p>
            Fast-growing organisations across Africa face a common challenge:
            the workforce needed to deliver on strategic ambition often does not
            yet exist. <br />
            We help you build it from frontline skills to senior leadership.
          </p>
        </div>
      </div>

      <nav className="client-subnav">
        <a className="active">Corporates</a>
        <a onClick={() => onNavigate("academic")}>Academic Institutions</a>
        <a onClick={() => onNavigate("donors")}>Donor Agencies</a>
        <a onClick={() => onNavigate("government")}>Government</a>
      </nav>

      <div className="client-intro">
        <div className="client-intro-grid">
          <div>
            <h2>
              The capability gap is <br />
              <em>your competitive risk.</em>
            </h2>
            <p>
              Across Africa&apos;s fastest-growing sectors, the organisations
              that will outperform are those that invest in building internal
              capability now.{" "}
            </p>
            <p>
              Not through one-off training days, but through structured,
              sustained programmes that change how people work.
            </p>
            <p>
              We partner with corporates at every stage of growth - from the
              high-growth startup building its first management layer to the
              established business redesigning its leadership pipeline for the
              next decade.
            </p>
          </div>
          <div>
            <div className="challenges-box">
              <h3>Challenges we hear most</h3>
              <ul>
                {[
                  "We promote technically strong people into management and they struggle with the transition",
                  "Our training spend does not seem to change anything",
                  "We need to develop African leaders from within, not always hire from outside",
                  "Our onboarding is not working. People are not performing quickly enough",
                  "We want to build a real learning culture, not just a training calendar",
                ].map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="client-services">
        <h2>
          What we do for <em>corporates</em>
        </h2>
        <br/>
        <div className="client-svc-grid">
          {[
            {
              title: "Management & Leadership Development",
              body: "Structured programmes that develop first-line managers, middle managers and senior leaders. Built around your organisation's context and leadership model, not imported frameworks.",
            },
            {
              title: "Workforce Capability Programmes",
              body: "Scalable skills programmes for your frontline and professional workforce. Built on competency frameworks that are co-designed with your organisation and aligned to your performance standards.",
            },
            {
              title: "Onboarding & Induction Design",
              body: "We redesign onboarding programmes that go beyond HR induction to build role readiness, professional identity and cultural alignment from day one.",
            },
            {
              title: "Learning Culture & L&D Strategy",
              body: "For organisations that want to build a genuine learning culture, we support the design of L&D strategies, competency frameworks and internal capability to sustain learning beyond any single programme.",
            },
            {
              title: "Coaching & Mentoring Programmes",
              body: "Individual and group coaching to support leadership transition, high-performer development and organisational change. Delivered by experienced practitioners with deep African context.",
            },
            {
              title: "Technology-Enabled Learning",
              body: "Digital learning platforms and content that extend your reach across dispersed teams and geographies. Built for low-bandwidth environments and mobile-first delivery.",
            },
          ].map((s, i) => (
            <div className="client-svc-card" key={i}>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>

        <div className="outcomes-strip">
          <div>
            <h3>What good looks like</h3>
            <ul>
              {[
                "Leaders who can manage complexity, ambiguity and rapid growth",
                "Frontline teams who are competent, confident and professionally grounded",
                "A learning culture that sustains improvement after every programme ends",
                "L&D investment that connects to measurable business performance",
              ].map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>How we are different</h3>
            <ul>
              {[
                "We co-design with you — no off-the-shelf programmes",
                "African context is built in, not added on",
                "We build your internal capability alongside delivery",
                "We measure what changes, not just who attended",
              ].map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="cta">
        <div className="cta-inner">
          <h2>Ready to invest in your people?</h2>
          <p>
            Tell us about your organisation and the capability challenge you are
            working on. We will come back to you with an honest assessment of
            how we can help.
          </p>
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
