"use client";

import Footer from "./Footer";
import {
  Building,
  GraduationCap,
  Globe,
  Building2,
  ArrowRight,
} from "lucide-react";

type Page =
  | "home"
  | "about"
  | "services"
  | "corporates"
  | "academic"
  | "donors"
  | "government"
  | "contact";

interface ServicesPageProps {
  onNavigate: (page: Page) => void;
}

const services = [
  {
    num: "01",
    title: "Capacity Building & Workforce Development",
    body1:
      "We design and deliver structured, scalable programmes that build skills, professional values and market readiness across all workforce levels and sectors. Our capacity building work connects learning to earning: employability skills and enterprise development pathways are built in from the start, not added as an afterthought.",
    body2:
      "Whether you are training frontline health workers, developing youth employment pipelines or building the professional workforce of a fast-growing sector, we design programmes that work at scale and sustain their impact.",
    outcomes: [
      "Measurable improvement in workforce competency and professional standards",
      "Pathways from skills training into employment and enterprise",
      "Programmes designed for national scale from day one",
      "Evidence base for impact reporting and continued investment",
    ],
    visual: {
      title: "Capacity Building at Scale",
      body: "Scalable workforce development from frontline to management, built for the bandwidth and operational realities of African organisations and communities.",
      ideal: [
        "Government ministries and public agencies",
        "NGOs and development partners with large beneficiary workforces",
        "Corporates running apprenticeship or graduate programmes",
        "Donor-funded youth or female empowerment programmes",
      ],
    },
  },
  {
    num: "02",
    title: "Organisational & Leadership Development",
    body1:
      "Strong organisations are built from the inside out. We co-create programmes that develop leaders at every level, strengthen professional identity and build the institutional capability that allows organisations to grow sustainably.",
    body2:
      "Our organisational development work spans executive leadership programmes, management capability development, professional standards frameworks and academic curriculum co-design — always contextualised to the specific organisation, sector and cultural environment.",
    outcomes: [
      "Leadership pipelines that build from within",
      "Professional frameworks that raise standards across the organisation",
      "Curriculum and qualifications that are globally benchmarked and locally relevant",
      "Measurable improvement in organisational effectiveness",
    ],
    visual: {
      title: "Leadership for Africa",
      body: "Development programmes that build authentic, contextually grounded leadership capability. Not imported models, but approaches built for African organisations.",
      ideal: [
        "Corporate leadership and management programmes",
        "University faculty and curriculum development",
        "Public sector leadership programmes",
        "Professional bodies and standards organisations",
      ],
    },
  },
  {
    num: "03",
    title: "Technology-Enabled Learning",
    body1:
      "Large workforces cannot be trained in a room. Technology-enabled learning extends reach, ensures consistency and enables the kind of data-driven improvement that donor agencies and institutional investors increasingly require.",
    body2:
      "We design and deploy digital learning solutions built for the bandwidth, device and operational realities of organisations and communities across Africa: mobile-first, low-bandwidth capable, analytics-enabled.",
    outcomes: [
      "Learning that reaches dispersed workforces at national scale",
      "Consistent, quality-assured content delivery across geographies",
      "Real-time analytics for monitoring and evaluation",
      "Infrastructure that your organisation owns and can build on",
    ],
    visual: {
      title: "Built for African Infrastructure",
      body: "Digital learning systems designed for low-bandwidth, mobile-first contexts. Consistent delivery, real-time analytics, national scale.",
      ideal: [
        "Organisations with dispersed or field-based workforces",
        "Government agencies running national training programmes",
        "Donor-funded programmes requiring M&E integration",
        "Organisations wanting to build internal learning infrastructure",
      ],
    },
  },
];

export default function ServicesPage({ onNavigate }: ServicesPageProps) {
  return (
    <div className="mt-[2.5rem]">
      <div className="services-hero relative w-full" style={{
      backgroundImage: 'url(/services.png)',

      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'bottom center',
      backgroundSize: 'cover',
    }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 z-5" />
      
        <div className="services-hero-inner relative z-10">
          <div className="section-label" style={{ color: "var(--mint)" }}>
            What We Do
          </div>
         <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Three disciplines.{" "}
            <em style={{ color: "var(--mint)", fontStyle: "italic" }}>
              One integrated approach.
            </em>
          </h1>
          <p>
            We work across three interconnected disciplines: workforce capacity
            building, organisational and leadership development, and
            technology-enabled learning. Separately, each is powerful. Together,
            they create the conditions for systemic, sustainable change.
          </p>
        </div>
      </div>

      {services.map((s, i) => (
        <div className="service-detail" key={i}>
          <div>
            <div className="service-detail-number">{s.num}</div>
            <h2>{s.title}</h2>
            <p>{s.body1}</p>
            <p>{s.body2}</p>
            <ul className="outcomes-list">
              {s.outcomes.map((o, j) => (
                <li key={j}>{o}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="service-detail-visual">
              <h3>{s.visual.title}</h3>
              <p>{s.visual.body}</p>
              <div className="ideal-for">
                <h4>Ideal For</h4>
                <ul>
                  {s.visual.ideal.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="services-routing">
        <div>
          <div className="routing-label">Find your match</div>
          <h2 className="routing-title">
            Who are you working <em>with?</em>
          </h2>
        </div>
        <p className="routing-intro">
          Our services are consistent in quality and rigour, but the way we
          design and structure them is built around who you are and what you are
          trying to achieve.
        </p>
        <div className="routing-grid">
          {[
            {
              icon: Building,
              title: "Corporates",
              body: "Workforce capability and leadership development for growing organisations.",
              page: "corporates" as Page,
            },
            {
              icon: GraduationCap,
              title: "Academic Institutions",
              body: "Curriculum co-development and academic programme design.",
              page: "academic" as Page,
            },
            {
              icon: Globe,
              title: "Donor Agencies",
              body: "Workforce development for grant-funded and development programmes.",
              page: "donors" as Page,
            },
            {
              icon: Building2,
              title: "Government",
              body: "National skills development and workforce infrastructure at scale.",
              page: "government" as Page,
            },
          ].map((r, i) => {
            const IconComponent = r.icon;
            return (
              <div
                className="routing-card"
                key={i}
                onClick={() => onNavigate(r.page)}
              >
                <IconComponent
                  className="routing-icon"
                  size={40}
                  strokeWidth={1.5}
                />
                <h3>{r.title}</h3>
                <p>{r.body}</p>
                <div className="routing-arrow">
                  Learn more{" "}
                  <ArrowRight size={16} style={{ display: "inline" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="cta">
        <div className="cta-inner">
          <h2>Ready to design something that works?</h2>
          <p>
            Every programme we design starts with a conversation. Tell us about
            your organisation and what you are trying to achieve.
          </p>
          <div className="cta-actions">
            <button
              className="btn-primary-dark"
              onClick={() => onNavigate("contact")}
            >
              Start a conversation
            </button>
            <button
              className="btn-outline-dark"
              onClick={() => onNavigate("about")}
            >
              About us
            </button>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
