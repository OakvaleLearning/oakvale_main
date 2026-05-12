'use client';

import { useEffect, useRef } from 'react';

export default function Mission() {
  const missionCycleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = missionCycleRef.current;
    if (!el) return;
    const words = ['lives', 'communities', 'systems', 'futures'];
    let wordIdx = 0, charIdx = 0, deleting = false;
    const speed = { type: 100, delete: 60, pause: 2500, pauseShort: 300 };
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
    <div className="mission-strip">
      <div className="mission-inner">
        <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>Our Purpose</div>
        <p className="mission-quote">&ldquo;Changing <span className='text-gold' ref={missionCycleRef}>lives</span> through learning and self-discovery.&rdquo;</p>
        <p className="mission-statement">
          Our mission is to provide evidence-based learning that builds skills, raises standards and creates career pathways across Africa. We developed our methodology in health and social care: one of the most demanding, highest-stakes sectors in the world. The rigour, contextual sensitivity and commitment to real-world outcomes that sector demands is the standard we bring to every partnership, in every sector.
        </p>
      </div>
    </div>
  );
}
