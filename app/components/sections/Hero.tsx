"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type Page =
  | "home"
  | "about"
  | "services"
  | "corporates"
  | "academic"
  | "donors"
  | "government"
  | "contact";

interface HeroProps {
  onNavigate: (page: Page) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const cycleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = cycleRef.current;
    if (!el) return;
    const words = ["deserves", "needs", "is ready for"];
    let wordIdx = 0,
      charIdx = 0,
      deleting = false;
    const speed = { type: 90, delete: 55, pause: 2200, pauseShort: 400 };
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      const current = words[wordIdx];
      if (!deleting) {
        el!.textContent = current.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          deleting = true;
          timer = setTimeout(tick, speed.pause);
          return;
        }
        timer = setTimeout(tick, speed.type);
      } else {
        el!.textContent = current.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          wordIdx = (wordIdx + 1) % words.length;
          timer = setTimeout(tick, speed.pauseShort);
          return;
        }
        timer = setTimeout(tick, speed.delete);
      }
    }
    tick();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="relative w-full hero-bg pt-16 md:pt-20"
      style={{
        backgroundImage: "url(/hero-image2.png)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />

      {/* Grid overlay pattern */}
      <div className="absolute inset-0 hero-grid-overlay z-20" />

      <section className="hero relative z-30">
        <div className="hero-inner">
          <div
            className="hero-content relative z-20"
            style={{ position: "relative", zIndex: 20 }}
          >
            <div className="hero-eyebrow">
              Workforce Solutions | Leadership & Organisational Development
            </div>
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl leading-tight">
              Building <br />
              the health systems <br />
              Africa <br />
              <em>
                <span ref={cycleRef}></span>
              </em>
              <br />
            </h1>
            <p className="hero-sub">
              We design and deliver evidence-based learning programmes that
              build capability, raise professional standards and create genuine
              career pathways across Africa.
            </p>
            {/* <div className="hero-actions flex w-full md:w-auto">
              <Link target="_blank" href="https://learn.oakvaleltd.com" className="w-fit">
                <button className="btn-primary w-full md:w-auto">
                  Train Your Care Workforce
                </button>
              </Link>
              <Link target="_blank" href="https://jobs.oakvaleltd.com" className="w-fit">
                <button className="btn-ghost w-full md:w-auto">Hire Certified Care Staff</button>
              </Link>
            </div> */}
          </div>
        </div>
        <div className="hero-scroll animate">
          <div className="scroll-line" />
          Scroll
        </div>
      </section>
    </div>
  );
}
