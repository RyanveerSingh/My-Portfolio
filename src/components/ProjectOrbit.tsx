"use client";

import { useEffect, useRef } from "react";
import { site } from "@/data/site";

const projects = site.projects;
const N = projects.length;
// Angle between neighbouring cards on the ring: a quarter turn, so three show at once
// (at his left, in front, at his right); the rest are behind his head.
const STEP_DEG = 90;
const BURST_MS = 1100;
const UNBURST_MS = 450;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutBack = (t: number) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;

/**
 * The projects on a ring around the avatar at chest height: one on his left, one in
 * front, one on his right; the back of the ring rises behind his turban (cards there are
 * masked by his silhouette, so he covers them). They burst out of the spell; scrolling
 * turns the ring so each project comes out from behind his head on the right, passes in
 * front of him, moves to his left and goes back behind his head. Scrolling back above
 * the section collapses them, so the spell and burst play again on the way back down.
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
    const intro = section.querySelector<HTMLElement>(".work-intro");
    const cards = cardRefs.current;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // b: 0 = collapsed into his chest, 1 = fully out. Animated toward `target`.
    let b = 0;
    let target = 0;
    let from = 0;
    let animStart = 0;
    let raf = 0;
    const lastFocus: number[] = [];
    const lastH: number[] = [];

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
      // The video frame (see .magic-frame): 16:9 as wide as fits, on the bottom edge; on
      // portrait screens twice the screen's width, centred vertically.
      const portrait = w <= h;
      const fw = portrait ? 2 * w : Math.min(w, (h * 16) / 9);
      const fh = (fw * 9) / 16;
      const fx = (w - fw) / 2;
      const fy = portrait ? (h - fh) / 2 : h - fh;
      const cx = fx + fw / 2;
      const narrow = w < 720;
      const s = progress();
      const grow = b >= 1 ? 1 : b <= 0 ? 0 : target === 1 ? easeOutBack(b) : b;

      // The ring (as drawn): centred on his face, wide and tilted. Its back passes
      // behind the turban at forehead height, its sides are level with his mouth, its
      // front crosses his collar. On phones it's kept within the screen's width.
      const rcx = cx;
      const rcy = fy + fh * 0.485;
      const rx = narrow ? Math.min(fw * 0.33, w * 0.4) : fw * 0.33;
      const ry = fh * 0.235;

      // Pass 1: where each card sits on the ring. p = 0 is in front of him, +1 on his right
      // (coming in), -1 on his left (seen); beyond that they're behind his head.
      const layout = cards.map((el, i) => {
        const p = i - s;
        const a = Math.max(-180, Math.min(180, p * STEP_DEG));
        const rad = (a * Math.PI) / 180;
        const depth = (Math.cos(rad) + 1) / 2; // 1 front … 0 back
        const x = rcx + rx * Math.sin(rad);
        const y = rcy + ry * Math.cos(rad);
        // Front 0.88; sides about 0.65 (0.5 on phones, so all three fit across the screen).
        const scale = narrow ? 0.36 + 0.52 * depth ** 2 : 0.5 + 0.38 * depth ** 1.3;
        // Solid at the sides, gone behind his head (sooner on phones, where the back layer
        // isn't masked by his silhouette).
        const opacity = narrow ? 1 - clamp01((Math.abs(a) - 92) / 20) : 1 - clamp01((Math.abs(a) - 100) / 45);
        const z = Math.round(depth * 100);
        const focus = clamp01(1 - Math.abs(p) / 0.6);
        const behind = Math.abs(a) > 95; // round the back: he covers it
        const front = Math.abs(a) < 45; // passing in front of his face
        return { x, y, scale, opacity, z, focus, behind, front, w: el?.offsetWidth ?? 0, h: el?.offsetHeight ?? 0 };
      });
      const chinY = fy + fh * 0.57; // the front card never rises above his chin

      // Pass 2: fit each card on its own, staying as close to the ring as possible: below
      // "Things I've built" if it's under the heading (else below the nav bar), and above
      // the bottom of the screen. A card that can't fit both is shrunk until it does.
      const rootTop = root.getBoundingClientRect().top;
      const head = intro?.getBoundingClientRect();
      const headBottom = head ? head.bottom - rootTop + 16 : 0;
      const navBottom = 84;
      const bottom = h - 14;
      for (const c of layout) {
        const halfW = (c.w * c.scale) / 2;
        const underHead = !!head && c.x - halfW < head.right + 16 && c.x + halfW > head.left;
        const top = Math.max(underHead ? headBottom : navBottom, c.front ? chinY : 0);
        const room = bottom - top;
        if (c.h * c.scale > room) c.scale = Math.max(0.3, room / c.h);
        const half = (c.h * c.scale) / 2;
        c.y = Math.min(Math.max(c.y, top + half), bottom - half);
      }

      // Pass 3: apply, with the burst flying the cards out of the rings at his chest.
      cards.forEach((el, i) => {
        if (!el) return;
        let { x, y } = layout[i];
        const { scale, opacity, z, focus, behind } = layout[i];
        const halfW = (layout[i].w * scale) / 2;
        x = Math.min(Math.max(x, halfW + 12), w - halfW - 12); // stay inside the window
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
      // A card's details unfold as it reaches the front, changing its height. Rather than
      // measuring again now (which would force a second layout this frame), fit again
      // next frame whenever the unfolding changed or a card's size differs from last time.
      const changed = layout.some(
        (c, i) => Math.abs(c.focus - (lastFocus[i] ?? -1)) > 0.001 || Math.abs(c.h - (lastH[i] ?? -1)) > 1,
      );
      layout.forEach((c, i) => {
        lastFocus[i] = c.focus;
        lastH[i] = c.h;
      });
      if (b !== target || changed) raf = requestAnimationFrame(render);
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
