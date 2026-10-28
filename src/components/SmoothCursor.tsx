"use client";

import { useEffect, useRef } from "react";

// A custom cursor that follows the mouse on a spring and tilts toward the direction of
// travel (after Magic UI's Smooth Cursor). Tuned a little more responsive than its
// defaults (stiffness 400, damping 45, mass 1).
const SPRING = { stiffness: 560, damping: 42, mass: 0.85 };
const REST = 0.01; // px: below this, the spring is considered settled

export default function SmoothCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only for a real mouse or trackpad, and not for visitors who prefer less motion.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || still.matches) return;

    const el = ref.current!;
    const root = document.documentElement;
    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    const vel = { x: 0, y: 0 };
    let angle = 0;
    let shownAngle = 0;
    let moving = false;
    let movingTimer = 0;
    let hovering = false;
    let raf = 0;
    let last = 0;

    root.classList.add("has-smooth-cursor");

    const step = (now: number) => {
      const dt = Math.min(1 / 30, last ? (now - last) / 1000 : 1 / 60);
      last = now;
      // Spring physics, in a few small substeps for stability.
      const n = 4;
      for (let i = 0; i < n; i++) {
        const h = dt / n;
        for (const k of ["x", "y"] as const) {
          const a = (SPRING.stiffness * (target[k] - pos[k]) - SPRING.damping * vel[k]) / SPRING.mass;
          vel[k] += a * h;
          pos[k] += vel[k] * h;
        }
      }
      // Turn toward the direction of travel, taking the short way round.
      const speed = Math.hypot(vel.x, vel.y);
      if (speed > 60) angle = (Math.atan2(vel.y, vel.x) * 180) / Math.PI + 90;
      const diff = ((angle - shownAngle + 540) % 360) - 180;
      shownAngle += diff * Math.min(1, dt * 14);

      const scale = (hovering ? 1.3 : 1) * (moving ? 0.94 : 1);
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(${shownAngle}deg) scale(${scale})`;

      const settled =
        Math.abs(target.x - pos.x) < REST && Math.abs(target.y - pos.y) < REST && speed < REST && Math.abs(diff) < 0.1;
      raf = settled ? 0 : requestAnimationFrame(step);
    };
    const wake = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(step);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (target.x < -50) {
        // First move: start exactly at the pointer instead of flying in from the corner.
        pos.x = e.clientX;
        pos.y = e.clientY;
      }
      target.x = e.clientX;
      target.y = e.clientY;
      el.classList.add("is-visible");
      moving = true;
      window.clearTimeout(movingTimer);
      movingTimer = window.setTimeout(() => {
        moving = false;
        wake();
      }, 150);
      wake();
    };
    const onOver = (e: PointerEvent) => {
      const interactive = !!(e.target as Element | null)?.closest?.("a, button, [role='button'], input, select, textarea, label");
      if (interactive !== hovering) {
        hovering = interactive;
        el.classList.toggle("is-hovering", interactive);
        wake();
      }
    };
    const onLeave = () => el.classList.remove("is-visible");
    const onDown = () => el.classList.add("is-pressed");
    const onUp = () => el.classList.remove("is-pressed");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(movingTimer);
      root.classList.remove("has-smooth-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="smooth-cursor" aria-hidden="true">
      <svg viewBox="0 0 32 36" width="26" height="29">
        <path d="M16 2.5 L28.5 31 Q29.2 33 27.3 32.2 L16 26.8 L4.7 32.2 Q2.8 33 3.5 31 Z" />
      </svg>
    </div>
  );
}
