"use client";

import { useEffect } from "react";

// Content fades out as it scrolls up toward the nav bar, so nothing slides underneath it.
const TARGETS = [
  "main h1",
  "main h2",
  "main p",
  "main .hero-actions",
  "main .scroll-hint",
  "main .card",
  // Project cards are tall: fade their pieces one by one so the rest stays crisp.
  "main .glance-cover",
  "main .glance-meta",
  "main .glance-title",
  "main .glance-card .pills",
  "main .cert",
  "main .stat",
  "main .timeline-item",
  "main .work-skip",
  "main .contact-actions",
].join(", ");
const FADE_PX = 70; // fading starts when a block's top is this far below the nav bar
const MAX_FADE_PX = 120; // ...or up to this far for tall blocks

export default function ScrollFade() {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(".nav");
    let els: HTMLElement[] = [];
    let raf = 0;

    const collect = () => {
      const all = Array.from(document.querySelectorAll<HTMLElement>(TARGETS));
      // Fade each block once: skip anything inside another faded block, and the pinned
      // project ring and stack cylinder (they manage their own fading).
      els = all.filter(
        (el) =>
          !el.closest(".work-sticky, .stack-stage") && !all.some((other) => other !== el && other.contains(el)),
      );
    };

    const update = () => {
      raf = 0;
      const line = nav ? nav.getBoundingClientRect().bottom : 0;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        // 0 while the block is well below the bar; 1 (fully gone) once its top reaches
        // the bar. Taller blocks start fading a little earlier, but never more than
        // MAX_FADE_PX before it, so anything comfortably on screen stays crisp.
        const distance = Math.min(MAX_FADE_PX, Math.max(FADE_PX, r.height * 0.6));
        const p = (line + distance - r.top) / distance;
        if (p <= 0 || r.bottom < 0) {
          if (el.dataset.fading) {
            el.style.opacity = "";
            el.style.transition = "";
            delete el.dataset.fading;
          }
          continue;
        }
        el.dataset.fading = "1";
        el.style.transition = "none"; // follow the scroll exactly (overrides reveal transitions)
        el.style.opacity = String(Math.max(0, 1 - p));
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      collect();
      schedule();
    };

    collect();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}
