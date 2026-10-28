"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

const LINKS = [
  { href: "#top", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#stack", label: "Tech Stack" },
  { href: "#achievements", label: "Info & Achievements" },
  { href: "#certificates", label: "Certificates" },
];

// Which tab each section belongs to (the cover and About are "Home"; the project ring
// and the at-a-glance grid are both "Projects").
const SECTION_TAB: Record<string, string> = {
  top: "#top",
  about: "#top",
  work: "#projects",
  projects: "#projects",
  stack: "#stack",
  achievements: "#achievements",
  certificates: "#certificates",
  contact: "#contact",
};

export default function Nav() {
  // Stay transparent over the avatar (cover and projects), then switch to a solid bar.
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState("#top");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stageEnd = document.getElementById("work") ?? document.getElementById("top");
    const sections = Object.keys(SECTION_TAB)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    // Section positions are measured once (and on resize), so scrolling only compares
    // numbers instead of asking the browser for layout on every scroll event.
    let tops: { id: string; top: number }[] = [];
    let stageEndBottom = 0;
    const measure = () => {
      tops = sections.map((s) => ({ id: s.id, top: s.getBoundingClientRect().top + window.scrollY }));
      stageEndBottom = stageEnd ? stageEnd.getBoundingClientRect().bottom + window.scrollY : 0;
    };
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setSolid(!stageEnd || stageEndBottom - y <= 80);
      // The current section is the last one whose top has passed 40% of the screen.
      const line = y + window.innerHeight * 0.4;
      let current = tops[0]?.id ?? "top";
      for (const t of tops) if (t.top <= line) current = t.id;
      if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) current = "contact";
      setActive(SECTION_TAB[current]);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    // The page transition covers the screen, jumps, then fires this: close the menu then.
    const onCovered = () => setMenuOpen(false);
    measure();
    update();
    // Fonts and images can shift section positions just after load: measure again.
    const late = window.setTimeout(onResize, 1500);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);
    window.addEventListener("bubble:covered", onCovered);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(late);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      window.removeEventListener("bubble:covered", onCovered);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.documentElement.classList.add("menu-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className={`nav${solid ? " is-solid" : ""}`}>
      <a href="#top" className="logo" aria-label={`${site.name}, back to top`} data-label="Home">
        <span className="logo-word">{site.logo.before}</span>
        <span className="logo-insert" aria-hidden="true">
          <span className="logo-script">{site.logo.insert}</span>
          <svg className="logo-caret" viewBox="0 0 20 14">
            <path d="M2 12.5 C5 9 7.5 5 10 1.8 C12.3 5.2 14.8 8.8 18 12" />
          </svg>
        </span>
        <span className="logo-word">{site.logo.after}</span>
      </a>
      <nav className="nav-links" aria-label="Main">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`nav-link${active === link.href ? " is-active" : ""}`}
            aria-current={active === link.href ? "true" : undefined}
          >
            {link.label}
          </a>
        ))}
        <a href="#contact" className={`button nav-cta${active === "#contact" ? " is-active" : ""}`}>
          Contact
        </a>
        <button
          type="button"
          className={`nav-menu-btn${menuOpen ? " is-open" : ""}`}
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </nav>

      {/* Narrow screens: all tabs in a full-screen menu that bubbles open from the button. */}
      <div id="nav-menu" className={`nav-menu${menuOpen ? " is-open" : ""}`} aria-hidden={!menuOpen}>
        <ul>
          {[...LINKS, { href: "#contact", label: "Contact" }].map((link, i) => (
            <li key={link.href} style={{ "--i": i } as React.CSSProperties}>
              <a
                href={link.href}
                className={active === link.href ? "is-active" : undefined}
                tabIndex={menuOpen ? 0 : -1}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
