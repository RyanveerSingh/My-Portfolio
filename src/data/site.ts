// All of the portfolio's text lives here — edit this file to update the site.
// Anything marked TODO is a placeholder to replace with your real details.

export const site = {
  name: "Ryanveer Singh",
  // Logo: "Ryan ^ Singh" with "veer" handwritten above the caret.
  logo: { before: "Ryan", insert: "veer", after: "Singh" },
  role: "Full Stack Developer & AI Engineer",
  description:
    "Ryanveer Singh is a full stack developer and AI engineer building fast, reliable web products and AI-powered software.",
  email: "hello@example.com", // TODO: your email address
  socials: [
    { label: "GitHub", href: "https://github.com/" }, // TODO: your GitHub profile
    { label: "LinkedIn", href: "https://www.linkedin.com/" }, // TODO: your LinkedIn profile
  ],

  hero: {
    eyebrow: "Portfolio — 2026",
  },

  about: {
    heading: "I turn ideas into software people actually use.",
    paragraphs: [
      "I'm Ryanveer, a full stack developer and AI engineer. I like owning a product from the first sketch to production: designing the API, building the interface and wiring in the intelligence that makes it feel effortless.",
      "Lately I've been focused on bringing large language models into real products, from retrieval systems and AI agents to tools that save people hours every week.",
    ],
  },

  services: [
    {
      title: "Full stack web apps",
      text: "Fast, accessible React and Next.js frontends backed by clean APIs and solid databases.",
    },
    {
      title: "AI & LLM engineering",
      text: "Chat assistants, RAG search, agents and automations built on modern AI models.",
    },
    {
      title: "Idea to launch",
      text: "Product thinking, architecture, deployment and iteration. I ship, then improve.",
    },
  ],

  // TODO: adjust to the tools you actually use.
  stack: [
    { group: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"] },
    { group: "Backend", items: ["Node.js", "Python", "FastAPI", "PostgreSQL", "REST & GraphQL"] },
    { group: "AI / ML", items: ["LLM APIs", "RAG", "AI agents", "Vector databases", "PyTorch"] },
    { group: "Cloud & tools", items: ["Docker", "AWS", "Vercel", "Git", "CI/CD"] },
  ],

  // TODO: placeholders — replace with your real numbers and achievements.
  stats: [
    { value: "8+", label: "Projects shipped" },
    { value: "3+", label: "Years building" },
    { value: "4", label: "AI products" },
  ],
  achievements: [
    {
      year: "2026",
      title: "Hackathon win (example)",
      text: "Replace with the event, your placing and what you built in one line.",
    },
    {
      year: "2025",
      title: "Open-source contribution (example)",
      text: "Replace with the project you contributed to and the impact of your change.",
    },
    {
      year: "2025",
      title: "Product milestone (example)",
      text: "Replace with a launch, a user count, a revenue figure or another result you're proud of.",
    },
    {
      year: "2024",
      title: "Recognition (example)",
      text: "Replace with an award, a scholarship, a talk you gave or an article you wrote.",
    },
  ],

  // TODO: placeholders — replace with your real certificates and their links.
  certificates: [
    { title: "Cloud certificate (example)", issuer: "Issuer name", year: "2026", href: "#" },
    { title: "AI / ML certificate (example)", issuer: "Issuer name", year: "2025", href: "#" },
    { title: "Web development certificate (example)", issuer: "Issuer name", year: "2025", href: "#" },
    { title: "Data certificate (example)", issuer: "Issuer name", year: "2024", href: "#" },
  ],

  // Projects, in display order. `mark` is the big monogram on the card's cover, `hue`
  // (0–360) its colour. An empty `href` means there is no public link (confidential).
  projects: [
    {
      title: "CatalogForge",
      mark: "CF",
      type: "AI product",
      year: "2026",
      description:
        "Turns a messy supplier spreadsheet and a folder of photos into a clean, reviewed product catalog in three languages, with a live storefront. AI writes the copy; code checks every claim.",
      tags: ["Next.js", "TypeScript", "PostgreSQL", "Claude API"],
      href: "https://github.com/RyanveerSingh/Assignment-Catalog-Forge",
      image: "/projects/catalogforge.webp",
      hue: 35,
    },
    {
      title: "Numerology Platform",
      mark: "NP",
      type: "Full stack",
      year: "2026",
      description:
        "A premium platform for numerologist Shetal Cchopra: number calculators, consultation booking, a shop with checkout and invoices, customer accounts and an admin dashboard.",
      tags: ["Next.js", "TypeScript", "Supabase", "Resend"],
      href: "https://github.com/RyanveerSingh/Numerology-Website",
      image: "/projects/numerology.webp",
      hue: 280,
    },
    {
      title: "Dealership Service API",
      mark: "DS",
      type: "Backend",
      year: "2026",
      description:
        "A service-lane backend for a car dealership: bookings, repair orders, parts and billing. Solves two different concurrency problems, with a schema that refuses invalid data.",
      tags: ["Java", "Spring Boot", "MySQL", "React"],
      href: "https://github.com/RyanveerSingh/dealership-service-api",
      image: "/projects/dealership.webp",
      hue: 210,
    },
    {
      title: "Provenance Lab",
      mark: "PL",
      type: "AI / ML · Team",
      year: "2026",
      description:
        "Detects whether an essay, Python file, image or voice recording was made by a person or by AI: checks provenance signals and watermarks first, then trained deep-learning detectors.",
      tags: ["Python", "BERT", "ViT", "wav2vec 2.0"],
      href: "https://github.com/RyanveerSingh/provenance-lab",
      image: "/projects/provenance.webp",
      hue: 165,
    },
    {
      title: "Rakshak AI",
      mark: "RA",
      type: "AI · Hackathon",
      year: "2025",
      description:
        "An AI-powered surveillance dashboard for Chandigarh Police: live camera feeds, threat detection, incident reports and an AI assistant. Built by Team Cypher for the Cytherthon.ai hackathon.",
      tags: ["Next.js", "TypeScript", "Gemini API", "Framer Motion"],
      href: "https://github.com/RyanveerSingh/Rakshak-AI",
      image: "/projects/rakshak.webp",
      hue: 0,
    },
    {
      title: "EntreConnect",
      mark: "EC",
      type: "AI · PEC Hackathon",
      year: "2025",
      description:
        "A platform for first-time founders: AI mentorship, AI-generated learning roadmaps, curated courses from Coursera, Udemy and YouTube, and connections to mentors and investors.",
      tags: ["Next.js", "Gemini API", "LangGraph", "Prisma"],
      href: "https://github.com/RyanveerSingh/pec-hackathon",
      image: "/projects/pec.webp",
      hue: 50,
    },
    {
      // TODO: the repo only holds starter code; add a line on the problem you tackled.
      title: "Smart India Hackathon 2025",
      mark: "SIH",
      type: "Hackathon",
      year: "2025",
      description: "My team's entry for Smart India Hackathon 2025, the national hackathon run by the Government of India.",
      tags: ["Next.js", "TypeScript", "Tailwind CSS"],
      href: "https://github.com/RyanveerSingh/sih-2025",
      image: "", // TODO: the repo only has Next.js's starter page, nothing to screenshot yet
      hue: 125,
    },
    {
      title: "DRDO Compliance Report",
      mark: "DR",
      type: "Defence · Confidential",
      year: "",
      description:
        "Compliance reporting work for DRDO, India's Defence Research and Development Organisation. The code and details are confidential, so there is no public repository.",
      tags: ["Confidential"],
      href: "",
      image: "", // confidential: no screenshot
      hue: 225,
    },
  ],

  contact: {
    heading: "Have an idea? Let's build it.",
    text: "I'm open to freelance projects, full-time roles and interesting collaborations. The fastest way to reach me is email.",
  },
};
