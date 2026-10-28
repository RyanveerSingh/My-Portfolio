"use client";

import { useEffect, useRef } from "react";

// Clicking any in-page link (nav tabs, buttons, the logo) bursts a crimson-and-gold
// bubble out from the click, jumps to the section while the screen is covered, then
// shrinks the bubble away, so the visitor never sees the page scroll past.
const GROW_MS = 420;
const SHRINK_MS = 460;
const HOLD_MS = 60;

export default function PageTransition() {
  const rimRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const rim = rimRef.current!;
    const fill = fillRef.current!;
    const label = labelRef.current!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let busy = false;

    const jumpTo = (target: HTMLElement) => {
      const top = target.id === "top" ? 0 : target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "instant" });
      history.replaceState(null, "", target.id === "top" ? " " : `#${target.id}`);
    };

    const circle = (r: number, x: number, y: number) => `circle(${r}px at ${x}px ${y}px)`;
    const frames = (n: number) =>
      new Promise<void>((done) => {
        const tick = () => (--n <= 0 ? done() : requestAnimationFrame(tick));
        requestAnimationFrame(tick);
      });

    const go = async (target: HTMLElement, x: number, y: number, text: string) => {
      busy = true;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const r = Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + 20;
      document.body.classList.add("is-transitioning");
      label.textContent = text;
      fill.style.setProperty("--x", `${x}px`);
      fill.style.setProperty("--y", `${y}px`);

      const ease = "cubic-bezier(0.65, 0, 0.35, 1)";
      const grow = { duration: GROW_MS, easing: ease, fill: "forwards" as const };
      // A gold rim leads, the crimson bubble follows just behind it.
      rim.animate([{ clipPath: circle(0, x, y) }, { clipPath: circle(r, x, y) }], grow);
      await fill.animate([{ clipPath: circle(0, x, y) }, { clipPath: circle(r, x, y) }], { ...grow, delay: 70 })
        .finished;
      label.animate([{ opacity: 0, transform: "scale(0.9)" }, { opacity: 1, transform: "none" }], {
        duration: 180,
        fill: "forwards",
      });

      jumpTo(target);
      window.dispatchEvent(new Event("bubble:covered"));
      await frames(2); // let the page settle at its new position before revealing it
      await new Promise((done) => setTimeout(done, HOLD_MS));

      // Shrink away into the middle of the screen, crimson first, then the gold rim.
      const cx = w / 2;
      const cy = h / 2;
      const shrink = { duration: SHRINK_MS, easing: ease, fill: "forwards" as const };
      label.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: "forwards" });
      fill.animate([{ clipPath: circle(r, cx, cy) }, { clipPath: circle(0, cx, cy) }], shrink);
      await rim.animate([{ clipPath: circle(r, cx, cy) }, { clipPath: circle(0, cx, cy) }], { ...shrink, delay: 70 })
        .finished;

      document.body.classList.remove("is-transitioning");
      busy = false;
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
      const id = link?.getAttribute("href")?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!link || !target) return;
      e.preventDefault();
      if (busy) return;
      if (still.matches) {
        jumpTo(target);
        window.dispatchEvent(new Event("bubble:covered"));
        return;
      }
      // Keyboard "clicks" have no position: burst from the middle of the link instead.
      const box = link.getBoundingClientRect();
      const x = e.clientX || box.left + box.width / 2;
      const y = e.clientY || box.top + box.height / 2;
      const text = link.dataset.label ?? link.textContent?.replace(/[↗↓↑]/g, "").trim() ?? "";
      void go(target, x, y, text);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="bubble" aria-hidden="true">
      <div ref={rimRef} className="bubble-rim" />
      <div ref={fillRef} className="bubble-fill">
        <span ref={labelRef} className="bubble-label" />
      </div>
    </div>
  );
}
