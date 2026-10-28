"use client";

import { useEffect, useRef } from "react";

// idle: calm, blinking loop (on two players that take turns, so the loop never seeks
// back to its start on screen). cast-front: facing the camera, he conjures two rings
// once, then lowers his hands again.
type Clip = "idle" | "cast-front";
const PLAYERS = ["idle#a", "idle#b", "cast-front"];
const FPS = 24;
// Moment in the spell when the fire blasts out: the project cards burst out with it.
const BURST_AT = 1.6;
const FADE_MS = 400;
// Scrolling faster than this (screen heights per second, averaged over SPEED_WINDOW_MS)
// skips the spell: the cards appear at once.
const FAST_SCROLL = 2.8;
const SPEED_WINDOW_MS = 400;

type FrameMeta = { mediaTime: number };
type Player = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: (now: number, meta: FrameMeta) => void) => number;
};

// Tells the project ring to burst out, or to collapse back (it also checks the flag in
// case it mounts later).
const setBurst = (out: boolean) => {
  (window as Window & { __orbitBurst?: boolean }).__orbitBurst = out;
  window.dispatchEvent(new Event(out ? "orbit:burst" : "orbit:reset"));
};
const burst = () => setBurst(true);

/**
 * The avatar video behind the cover, About and the projects. It stands centred and
 * blinks; when the projects come into view it casts its spell once, facing forward,
 * and the project cards burst out around it.
 */
export default function MagicStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const playerRefs = useRef<Record<string, Player>>({});

  useEffect(() => {
    const stage = stageRef.current!;
    const players = playerRefs.current;
    const work = document.getElementById("work");

    let clip: Clip = "idle";
    let player = players["idle#a"];
    let cast = false; // the spell has played for this visit to the projects
    let z = 1;
    let raf = 0;
    let onScreen = true;
    // React (in development) mounts effects twice; callbacks from a torn-down run must do nothing.
    let disposed = false;

    let samples: { t: number; y: number }[] = [];
    const speed = () => {
      const first = samples[0];
      const last = samples[samples.length - 1];
      if (!last || performance.now() - last.t > 200) return 0;
      return (Math.abs(last.y - first.y) / window.innerHeight) * (1000 / SPEED_WINDOW_MS);
    };

    const start = (p: HTMLVideoElement) => {
      if (onScreen) p.play().catch(() => {});
    };

    const playerFor = (name: Clip) => {
      if (name !== "idle") return players[name];
      const a = players["idle#a"];
      return player === a ? players["idle#b"] : a;
    };

    const play = (name: Clip) => {
      const prev = player;
      const next = playerFor(name);
      const fade = !(clip === "idle" && name === "idle"); // the idle twins hand over with a hard cut
      clip = name;
      player = next;
      next.style.transition = fade ? "" : "none";
      next.style.zIndex = String(++z);
      next.classList.add("is-on");
      start(next);

      // Retire the previous clip once the new one is really showing a frame.
      let retired = false;
      const retire = () => {
        if (retired || disposed || prev === player) return;
        retired = true;
        prev.classList.remove("is-on");
        prev.pause();
        prev.currentTime = 0;
      };
      const afterShown = () => window.setTimeout(retire, fade ? FADE_MS + 40 : 0);
      if (next.requestVideoFrameCallback) next.requestVideoFrameCallback(afterShown);
      else next.addEventListener("playing", afterShown, { once: true });
      window.setTimeout(retire, FADE_MS + 600);
      watch(name, next);
    };

    // Follow the clip on screen: fire the burst at the spell's peak, and start the next
    // clip right as this one shows its last frame.
    const watch = (name: Clip, p: Player) => {
      let done = false;
      let burst_ = false;
      const finish = () => {
        if (disposed || done || p !== player) return;
        done = true;
        if (name === "cast-front" && !burst_) burst();
        play("idle");
      };
      const check = (t: number) => {
        if (name === "cast-front" && !burst_ && t >= BURST_AT) {
          burst_ = true;
          burst();
        }
      };
      p.addEventListener("ended", finish, { once: true });
      if (!p.requestVideoFrameCallback) {
        const onTime = () => {
          if (disposed || done || p !== player) return p.removeEventListener("timeupdate", onTime);
          check(p.currentTime);
        };
        p.addEventListener("timeupdate", onTime);
        return;
      }
      const cb = (_now: number, meta: FrameMeta) => {
        if (disposed || done || p !== player) return;
        check(meta.mediaTime);
        if (p.duration && meta.mediaTime >= p.duration - 1.5 / FPS) {
          window.setTimeout(finish, 1000 / FPS - 12);
          return;
        }
        p.requestVideoFrameCallback!(cb);
      };
      p.requestVideoFrameCallback(cb);
    };

    const update = () => {
      raf = 0;
      const workTop = work ? work.getBoundingClientRect().top : Infinity;
      if (work && !cast && workTop <= window.innerHeight * 0.25) {
        cast = true;
        if (speed() > FAST_SCROLL || document.hidden) burst();
        else play("cast-front");
      } else if (cast && workTop > window.innerHeight * 0.6) {
        // Back up above the projects: collapse the cards so the spell plays again next time.
        cast = false;
        setBurst(false);
      }
      // Pause once the projects have scrolled away (the rest of the page covers the stage).
      const visible = !work || work.getBoundingClientRect().bottom > 0;
      if (visible !== onScreen) {
        onScreen = visible;
        stage.style.display = visible ? "" : "none";
        if (visible) start(player);
        else player.pause();
      }
    };
    const onScroll = () => {
      document.documentElement.classList.toggle("has-scrolled", window.scrollY > 8); // hides "Scroll"
      const now = performance.now();
      samples.push({ t: now, y: window.scrollY });
      while (samples.length > 2 && samples[1].t < now - SPEED_WINDOW_MS) samples.shift();
      if (!raf) raf = requestAnimationFrame(update);
    };
    // While the tab is hidden, stop everything; on return, resume only the clip on screen.
    const onVisibility = () => {
      if (document.hidden) {
        Object.values(players).forEach((p) => p.pause());
        return;
      }
      samples = [];
      start(player);
    };

    Object.entries(players).forEach(([key, p]) => {
      p.muted = true; // autoplay needs muted, which React doesn't always set as an attribute
      p.src = `/video/magic/1080/${key.split("#")[0]}.mp4`;
    });
    player.classList.add("is-on");
    start(player);
    watch("idle", player);
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      Object.values(players).forEach((p) => {
        p.pause();
        p.classList.remove("is-on");
        p.style.zIndex = "";
        p.currentTime = 0;
      });
    };
  }, []);

  return (
    <div ref={stageRef} className="magic">
      <div className="magic-frame">
        {PLAYERS.map((key) => (
          <video
            key={key}
            ref={(el) => {
              if (el) playerRefs.current[key] = el;
            }}
            className="magic-clip"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="magic-shade" aria-hidden="true" />
    </div>
  );
}
