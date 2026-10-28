import Embers from "@/components/Embers";
import MagicStage from "@/components/MagicStage";
import Nav from "@/components/Nav";
import PageTransition from "@/components/PageTransition";
import ProjectOrbit from "@/components/ProjectOrbit";
import Reveal from "@/components/Reveal";
import ScrollFade from "@/components/ScrollFade";
import SmoothCursor from "@/components/SmoothCursor";
import StackCylinder from "@/components/StackCylinder";
import { site } from "@/data/site";

// A project card in the at-a-glance grid: opens the GitHub repo in a new tab, or is a
// plain card marked confidential when there's no public link.
function GlanceCard({ project }: { project: (typeof site.projects)[number] }) {
  const body = (
    <>
      <div className="glance-cover" style={{ "--hue": project.hue } as React.CSSProperties} aria-hidden="true">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.image} alt="" className="cover-shot" loading="lazy" />
        ) : (
          <span>{project.mark}</span>
        )}
      </div>
      <p className="glance-meta">{[project.type, project.year].filter(Boolean).join(" · ")}</p>
      <h3 className="glance-title">
        {project.title}
        <span className="glance-arrow" aria-hidden="true">
          {project.href ? "↗" : "🔒"}
        </span>
      </h3>
      <p className="glance-text">{project.description}</p>
      <ul className="pills pills--small">
        {project.tags.map((tag) => (
          <li key={tag} className="pill">
            {tag}
          </li>
        ))}
      </ul>
    </>
  );
  return project.href ? (
    <a href={project.href} className="glance-card" target="_blank" rel="noreferrer">
      {body}
    </a>
  ) : (
    <div className="glance-card glance-card--locked">{body}</div>
  );
}

// A certificate card: links to the credential when there is one.
function CertCard({ cert }: { cert: (typeof site.certificates)[number] }) {
  const body = (
    <>
      <span className="cert-seal" aria-hidden="true">
        ✦
      </span>
      <h3>{cert.title}</h3>
      <p>
        {cert.issuer} · {cert.year}
      </p>
      {cert.href && (
        <span className="cert-link">
          View credential <span aria-hidden="true">↗</span>
        </span>
      )}
    </>
  );
  return cert.href ? (
    <a href={cert.href} className="cert" target="_blank" rel="noreferrer">
      {body}
    </a>
  ) : (
    <div className="cert">{body}</div>
  );
}


export default function Home() {
  const [first, ...rest] = site.name.split(" ");

  return (
    <>
      <MagicStage />
      <Embers />
      <Nav />
      <SmoothCursor />
      <ScrollFade />
      <PageTransition />
      <main>
        <section id="top" className="hero" aria-label="Introduction">
          <div className="hero-content">
            <p className="hero-eyebrow">{site.hero.eyebrow}</p>
            <h1 className="hero-name">
              {first}
              <br />
              {rest.join(" ")}
            </h1>
            <p className="hero-role">{site.role}</p>
            <div className="hero-actions">
              <a href="#work" className="button">
                View my work
              </a>
              <a href="#contact" className="button button--ghost">
                Get in touch
              </a>
            </div>
          </div>
          <div className="scroll-hint" aria-hidden="true">
            <span>Scroll</span>
            <span className="scroll-hint-line" />
          </div>
        </section>

        {/* About, split around the avatar: heading on its left, story on its right. */}
        <section id="about" className="about-split" aria-labelledby="about-title">
          <Reveal className="about-side about-side--left reveal--from-left">
            <p className="section-label">About</p>
            <h2 id="about-title" className="about-split-title">
              {site.about.heading}
            </h2>
          </Reveal>
          <div className="about-gap" aria-hidden="true" />
          <Reveal delay={150} className="about-side about-side--right reveal--from-right">
            {site.about.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </Reveal>
        </section>

        {/* Pinned while scrolling turns the ring of projects around the avatar. */}
        <section
          id="work"
          className="work"
          aria-labelledby="work-title"
          style={{ "--n": site.projects.length } as React.CSSProperties}
        >
          <div className="work-sticky">
            <div className="work-intro">
              <p className="section-label">Selected work</p>
              <h2 id="work-title" className="work-title">
                Things I&apos;ve built.
              </h2>
              <p className="work-hint">Keep scrolling to turn the ring.</p>
              <a href="#projects" className="work-skip">
                In a hurry? See them all at a glance <span aria-hidden="true">↓</span>
              </a>
            </div>
            <ProjectOrbit />
          </div>
        </section>

        {/* Every project at once, for visitors who want the quick version. */}
        <section id="projects" className="section section--solid">
          <div className="container">
            <Reveal>
              <p className="section-label">Projects</p>
              <h2 className="section-title">Everything, at a glance.</h2>
            </Reveal>
            <div className="glance">
              {site.projects.map((project, i) => (
                <Reveal key={project.title} delay={(i % 4) * 70}>
                  <GlanceCard project={project} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <StackCylinder />

        <section id="achievements" className="section section--solid">
          <div className="container">
            <Reveal>
              <p className="section-label">Info &amp; Achievements</p>
              <h2 className="section-title">What I do, and what I&apos;ve done.</h2>
            </Reveal>

            <div className="stats">
              {site.stats.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 90} className="stat">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </Reveal>
              ))}
            </div>

            <div className="services">
              {site.services.map((service, i) => (
                <Reveal key={service.title} delay={i * 100} className="card service">
                  <span className="service-index">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </Reveal>
              ))}
            </div>

            <ol className="timeline">
              {site.achievements.map((item, i) => (
                <li key={item.title}>
                  <Reveal delay={i * 80} className="timeline-item">
                    <span className="timeline-year">{item.year}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p className="timeline-sub">{item.subtitle}</p>
                      <p>{item.text}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="certificates" className="section section--raised">
          <div className="container">
            <Reveal>
              <p className="section-label">Certificates</p>
              <h2 className="section-title">Learning, on the record.</h2>
            </Reveal>
            <div className="certs">
              {site.certificates.map((cert, i) => (
                <Reveal key={cert.title} delay={i * 80}>
                  <CertCard cert={cert} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section contact">
          <div className="container">
            <Reveal>
              <p className="section-label section-label--center">Contact</p>
              <h2 className="contact-title">{site.contact.heading}</h2>
              <p className="contact-text">{site.contact.text}</p>
              <div className="contact-actions">
                <a href={`mailto:${site.email}`} className="button">
                  {site.email}
                </a>
                {site.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="button button--ghost"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}
