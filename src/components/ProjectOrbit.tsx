"use client";

import { useEffect, useRef } from "react";
import { site } from "@/data/site";

const projects = site.projects;
const N = projects.length;
// Angle between neighbouring cards on the ring: three are visible at a time (0°, 50°,
// 100°); the rest wait hidden at the back, behind him.
const SPACING = 50;
const BURST_MS = 1100;
const UNBURST_MS = 450;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutBack = (t: number) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;

/**
 * The projects on a tilted ring around the avatar's head: the front of the ring dips in
 * front of his chest, the back rises behind his turban (cards there are masked by his
 * silhouette, so he covers them). They burst out of the spell; scrolling turns the
 * ring so the next project comes round from behind him to the front, and once seen it
 * slides straight off to the right. Scrolling back above the section collapses them,
 * so the spell and burst play again on the way back down.
 */
export default function ProjectOrbit() {
  const rootRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current!;
    const front = frontRef.current!;
    const back = backRef.current!;
    const section = root.closest("section")!;
    const cards = cardRefs.current;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // b: 0 = collapsed into his chest, 1 = fully out. Animated toward `target`.
    let b = 0;
    let target = 0;
    let from = 0;
    let animStart = 0;
    let raf = 0;

    const progress = () => {
      // s = how many projects have come round (0 … N), from the scroll position.
      const h = window.innerHeight;
      const scrolled = -section.getBoundingClientRect().top;
      return Math.min(N, Math.max(0, (scrolled - 0.35 * h) / (0.6 * h)));
    };

    const render = () => {
      raf = 0;
      const now = performance.now();
      if (b !== target) {
        const dur = target > from ? BURST_MS : UNBURST_MS;
        const t = still ? 1 : clamp01((now - animStart) / dur);
        b = from + (target - from) * t;
        if (t >= 1) b = target;
      }
      const w = root.clientWidth;
      const h = root.clientHeight;
      // The video frame: 16:9, as wide as fits, standing on the bottom edge (see .magic-frame).
      const portrait = w <= h;
      const fw = portrait ? Math.max(w, (h * 16) / 9) : Math.min(w, (h * 16) / 9);
      const fh = (fw * 9) / 16;
      const fx = (w - fw) / 2;
      const fy = portrait ? (h - fh) / 2 : h - fh;
      const cx = fx + fw / 2;
      const cy = fy + fh * 0.42; // ring centre: between his eyes and chin
      const rx = fw * 0.36;
      const ry = fh * 0.22; // front dips to 64% of the frame, back rises to 20% (behind the turban)
      const s = progress();
      const grow = b >= 1 ? 1 : b <= 0 ? 0 : target === 1 ? easeOutBack(b) : b;

      cards.forEach((el, i) => {
        if (!el) return;
        let a = (i - s) * SPACING; // 0 = front; positive = still to come; negative = seen
        let x: number, y: number, scale: number, opacity: number, z: number, focus: number;
        let behind = false;
        if (a >= 0) {
          // Past the side of the ring cards fade out and wait behind him, so only three
          // (front, side, just behind the side) are visible at a time.
          const waiting = clamp01((a - 112) / 22);
          a = Math.min(a, 180);
          const rad = (a * Math.PI) / 180;
          const depth = (Math.cos(rad) + 1) / 2; // 1 front … 0 back
          const persp = 0.55 + 0.45 * depth; // the far side of the ring looks narrower
          x = cx - rx * Math.sin(rad) * persp;
          y = cy + ry * Math.cos(rad);
          scale = 0.4 + 0.6 * depth ** 1.2;
          opacity = (0.55 + 0.45 * depth) * (1 - waiting);
          z = Math.round(depth * 100);
          focus = clamp01(1 - a / (SPACING * 0.6));
          behind = a > 90;
        } else {
          // Seen: straight off to the right, fading out.
          const t = clamp01(-a / SPACING);
          x = cx + t * w * 0.62;
          y = cy + ry;
          scale = 1 - 0.15 * t;
          opacity = 1 - t;
          z = 101;
          focus = 1 - t;
        }
        // Burst: the cards fly out of the rings in front of his chest.
        const ox = cx;
        const oy = fy + fh * 0.6;
        x = ox + (x - ox) * grow;
        y = oy + (y - oy) * grow;
        const layer = behind ? back : front;
        if (el.parentElement !== layer) layer.appendChild(el);
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${Math.max(0, scale * grow)})`;
        el.style.opacity = String(opacity * Math.min(1, b * 1.6));
        el.style.zIndex = String(z);
        el.style.setProperty("--focus", focus.toFixed(3));
        el.style.pointerEvents = focus > 0.5 && b >= 1 ? "auto" : "none";
      });
      if (b !== target) raf = requestAnimationFrame(render);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    const animateTo = (value: number) => {
      if (target === value) return;
      from = b;
      target = value;
      animStart = performance.now();
      schedule();
    };
    const onBurst = () => animateTo(1);
    const onReset = () => animateTo(0);

    if ((window as Window & { __orbitBurst?: boolean }).__orbitBurst) onBurst();
    render();
    window.addEventListener("orbit:burst", onBurst);
    window.addEventListener("orbit:reset", onReset);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      // Put every card back in the layer React rendered it into.
      cards.forEach((el) => el && el.parentElement !== front && front.appendChild(el));
      window.removeEventListener("orbit:burst", onBurst);
      window.removeEventListener("orbit:reset", onReset);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div ref={rootRef} className="orbit">
      {/* Behind him: masked by his silhouette so his head and body cover these cards. */}
      <div ref={backRef} className="orbit-layer orbit-layer--back" />
      <div ref={frontRef} className="orbit-layer">
        {projects.map((project, i) => (
          <article
            key={project.title}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="orbit-card"
            style={{ "--hue": project.hue } as React.CSSProperties}
          >
            <div className="orbit-cover" aria-hidden="true">
              {project.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.image} alt="" className="cover-shot" />
              ) : (
                <span>{project.mark}</span>
              )}
            </div>
            <div className="orbit-body">
              <p className="orbit-meta">
                {String(i + 1).padStart(2, "0")} · {[project.type, project.year].filter(Boolean).join(" · ")}
              </p>
              <h3 className="orbit-title">{project.title}</h3>
              <div className="orbit-more">
                <p className="orbit-text">{project.description}</p>
                {project.href ? (
                  <a href={project.href} className="orbit-link" target="_blank" rel="noreferrer">
                    View on GitHub <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="orbit-link orbit-link--locked">Confidential · no public code</span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
