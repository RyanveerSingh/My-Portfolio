"use client";

import { useEffect, useRef } from "react";

// Golden embers drifting up across the whole page, gently pushed aside by the mouse.
const DENSITY = 1 / 18000; // embers per px² of window
const MAX_EMBERS = 100;
const REPEL_RADIUS = 120; // px
const REPEL_STRENGTH = 2500; // px/s² at the pointer, fading linearly to 0 at the radius
const SPRITE = 32; // px, pre-rendered glow

type Ember = {
  x: number;
  y: number;
  vx: number; // push from the mouse, decays back to 0
  vy: number;
  rise: number; // px/s upward
  sway: number; // px/s side-to-side amplitude
  swayRate: number;
  size: number; // drawn glow diameter, px
  alpha: number;
  twinkle: number;
  phase: number;
};

export default function Embers() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Off on phones and other touch devices: a full-screen canvas redrawn every frame
    // competes with the video and the scroll animations there.
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // One soft golden glow, drawn once and stamped for every ember.
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = SPRITE;
    const s = sprite.getContext("2d")!;
    const g = s.createRadialGradient(SPRITE / 2, SPRITE / 2, 0, SPRITE / 2, SPRITE / 2, SPRITE / 2);
    g.addColorStop(0, "rgba(255, 240, 190, 1)");
    g.addColorStop(0.2, "rgba(255, 196, 96, 0.9)");
    g.addColorStop(0.55, "rgba(255, 140, 40, 0.28)");
    g.addColorStop(1, "rgba(255, 120, 30, 0)");
    s.fillStyle = g;
    s.fillRect(0, 0, SPRITE, SPRITE);

    let w = 0;
    let h = 0;
    let embers: Ember[] = [];
    const pointer = { x: -1e4, y: -1e4 };
    let raf = 0;
    let last = 0;

    const spawn = (anywhere: boolean): Ember => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 12,
      vx: 0,
      vy: 0,
      rise: 8 + Math.random() * 18,
      sway: 4 + Math.random() * 10,
      swayRate: 0.3 + Math.random() * 0.7,
      size: 6 + Math.random() * 9,
      alpha: 0.45 + Math.random() * 0.5,
      twinkle: 1 + Math.random() * 2.5,
      phase: Math.random() * Math.PI * 2,
    });

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      // Phones: a lighter canvas (1x pixels, fewer embers) so it doesn't compete with the
      // video and scroll animations.
      const phone = w < 720;
      const dpr = phone ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(phone ? 22 : MAX_EMBERS, Math.round(w * h * DENSITY));
      while (embers.length < count) embers.push(spawn(true));
      embers.length = count;
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const e of embers) {
        ctx.globalAlpha = e.alpha * (0.55 + 0.45 * Math.sin(t * e.twinkle + e.phase));
        ctx.drawImage(sprite, e.x - e.size / 2, e.y - e.size / 2, e.size, e.size);
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      const t = now / 1000;
      const dt = Math.min(0.05, last ? t - last : 0);
      last = t;
      const r2 = REPEL_RADIUS * REPEL_RADIUS;
      const damping = Math.pow(0.9, dt * 60);
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        const dx = e.x - pointer.x;
        const dy = e.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / REPEL_RADIUS) * REPEL_STRENGTH * dt;
          e.vx += (dx / d) * f;
          e.vy += (dy / d) * f;
        }
        e.vx *= damping;
        e.vy *= damping;
        e.x += (e.vx + Math.sin(t * e.swayRate + e.phase) * e.sway) * dt;
        e.y += (e.vy - e.rise) * dt;
        if (e.y < -12) embers[i] = spawn(false);
        else if (e.x < -12) e.x = w + 12;
        else if (e.x > w + 12) e.x = -12;
      }
      draw(t);
      raf = requestAnimationFrame(frame);
    };

    const onMove = (ev: PointerEvent) => {
      if (ev.pointerType !== "mouse") return;
      pointer.x = ev.clientX;
      pointer.y = ev.clientY;
    };
    const onLeave = () => {
      pointer.x = pointer.y = -1e4;
    };

    resize();
    if (still) {
      draw(0);
    } else {
      raf = requestAnimationFrame(frame);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
    }
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="embers" aria-hidden="true" />;
}
