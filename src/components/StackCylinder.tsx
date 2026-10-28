"use client";

import { useEffect, useRef } from "react";
import { site } from "@/data/site";

const groups = site.stack;
const N = groups.length;
const STEP = 360 / N;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * The tech stack as cards on a 3D cylinder. The section is pinned while you scroll,
 * and scrolling turns the cylinder one category at a time; the card facing you is
 * bright, the ones turning away dim. Pure CSS 3D transforms, driven by scroll.
 */
export default function StackCylinder() {
  const sectionRef = useRef<HTMLElement>(null);
  const drumRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current!;
    const drum = drumRef.current!;
    const cards = cardRefs.current;
    let raf = 0;
    let shown = -1;

    const render = () => {
      raf = 0;
      const h = window.innerHeight;
      // 0 → 1 over the pinned part of the section.
      const p = clamp01(-section.getBoundingClientRect().top / (section.offsetHeight - h));
      const turn = p * (N - 1); // which card faces front (fractional while turning)
      if (Math.abs(turn - shown) < 0.0005) return;
      shown = turn;
      drum.style.transform = `translateZ(calc(var(--radius) * -1)) rotateY(${-turn * STEP}deg)`;
      cards.forEach((el, i) => {
        if (!el) return;
        const off = Math.abs(i - turn); // 0 = facing front
        el.style.opacity = String(Math.max(0.25, 1 - off * 0.32));
        el.style.setProperty("--lit", clamp01(1 - off).toFixed(3));
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section
      id="stack"
      ref={sectionRef}
      className="stack-pin section--raised"
      style={{ "--n": N } as React.CSSProperties}
      aria-labelledby="stack-title"
    >
      <div className="stack-stage">
        <div className="stack-head">
          <p className="section-label">Tech Stack</p>
          <h2 id="stack-title" className="section-title">
            The tools I build with.
          </h2>
        </div>
        <div className="stack-scene">
          <div ref={drumRef} className="stack-drum">
            {groups.map((group, i) => (
              <article
                key={group.group}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="stack-card"
                style={{ transform: `rotateY(${i * STEP}deg) translateZ(var(--radius))` }}
              >
                <p className="stack-card-index">
                  {String(i + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
                </p>
                <h3>{group.group}</h3>
                <ul className="stack-items">
                  {group.items.map((item) => (
                    <li key={item.name} className="stack-item">
                      {"icon" in item && item.icon ? (
                        <span
                          className="stack-logo"
                          style={{ "--logo": `url(/stack/${item.icon}.svg)` } as React.CSSProperties}
                          aria-hidden="true"
                        />
                      ) : null}
                      {item.name}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
        <p className="stack-hint" aria-hidden="true">
          Scroll to turn
        </p>
      </div>
    </section>
  );
}
