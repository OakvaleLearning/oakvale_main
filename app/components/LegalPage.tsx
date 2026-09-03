import type { ReactNode } from "react";

interface LegalPageProps {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}

export default function LegalPage({ eyebrow, title, intro, children }: LegalPageProps) {
  return (
    <div className="legal-page">
      <div className="legal-hero">
        <div className="legal-hero-inner">
          <div className="section-label" style={{ color: "var(--mint)" }}>
            {eyebrow}
          </div>
          <h1 className="legal-title">{title}</h1>
          {intro ? <p className="legal-intro">{intro}</p> : null}
        </div>
      </div>

      <section className="legal-body">
        <div className="legal-content">{children}</div>
      </section>

      <style>{`
        .legal-page { margin-top: 2.5rem; }
        .legal-hero {
          background: var(--forest);
          color: #fff;
          padding: 5rem 8% 4rem;
        }
        .legal-hero-inner { max-width: 820px; margin: 0 auto; }
        .legal-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(2.4rem, 5vw, 3.6rem);
          line-height: 1.1;
          letter-spacing: -0.01em;
          margin-top: 0.75rem;
        }
        .legal-intro {
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.82);
          margin-top: 1.25rem;
          max-width: 680px;
        }
        .legal-body { background: var(--cream); padding: 4rem 8% 6rem; }
        .legal-content {
          max-width: 820px;
          margin: 0 auto;
          font-family: 'DM Sans', sans-serif;
          color: var(--slate);
          font-size: 0.975rem;
          line-height: 1.75;
        }
        .legal-content h2 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: 1.7rem;
          color: var(--forest);
          margin: 2.75rem 0 1rem;
          line-height: 1.2;
        }
        .legal-content h3 {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 1.05rem;
          color: var(--forest);
          margin: 1.75rem 0 0.5rem;
        }
        .legal-content p { margin: 0 0 1rem; }
        .legal-content ul { margin: 0 0 1.25rem; padding-left: 1.25rem; }
        .legal-content li { margin-bottom: 0.5rem; }
        .legal-content strong { color: var(--forest); font-weight: 600; }
        .legal-content a { color: var(--sage); text-decoration: underline; }
        .legal-content a:hover { color: var(--forest); }
        .legal-updated {
          font-size: 0.85rem;
          color: var(--slate);
          opacity: 0.75;
          margin-top: 3rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border, rgba(0,0,0,0.1));
        }
      `}</style>
    </div>
  );
}
