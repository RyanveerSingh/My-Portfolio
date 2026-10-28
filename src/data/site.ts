// All of the portfolio's text lives here — edit this file to update the site.
// Anything marked TODO is a placeholder to replace with your real details.

export const site = {
  name: "Ryanveer Singh",
  // Logo: "Ryan ^ Singh" with "veer" handwritten above the caret.
  logo: { before: "Ryan", insert: "veer", after: "Singh" },
  role: "Full Stack Developer & AI Engineer",
  description:
    "Ryanveer Singh is a full stack developer and AI engineer building fast, reliable web products and AI-powered software.",
  email: "ryanchd35@gmail.com",
  socials: [
    { label: "GitHub", href: "https://github.com/RyanveerSingh" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ryanveer-singh-554b98336" },
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

  // Tech stack, one card per group on the rotating cylinder. `icon` is a logo file in
  // public/stack/ (from Simple Icons); leave it out for a text-only pill.
  stack: [
    {
      group: "Languages",
      items: [
        { name: "TypeScript", icon: "typescript" },
        { name: "JavaScript", icon: "javascript" },
        { name: "Python", icon: "python" },
        { name: "Java", icon: "openjdk" },
        { name: "C++", icon: "cplusplus" },
        { name: "C", icon: "c" },
        { name: "SQL" },
      ],
    },
    {
      group: "Frontend",
      items: [
        { name: "React", icon: "react" },
        { name: "Next.js", icon: "nextdotjs" },
        { name: "Tailwind CSS", icon: "tailwindcss" },
        { name: "Redux / Zustand", icon: "redux" },
        { name: "Framer Motion", icon: "framer" },
        { name: "HTML & CSS", icon: "html5" },
      ],
    },
    {
      group: "Backend",
      items: [
        { name: "Node.js", icon: "nodedotjs" },
        { name: "Express", icon: "express" },
        { name: "Spring Boot", icon: "springboot" },
        { name: "FastAPI", icon: "fastapi" },
        { name: "JWT auth", icon: "jsonwebtokens" },
        { name: "REST APIs" },
      ],
    },
    {
      group: "Databases",
      items: [
        { name: "PostgreSQL", icon: "postgresql" },
        { name: "MySQL", icon: "mysql" },
        { name: "MongoDB", icon: "mongodb" },
        { name: "Supabase", icon: "supabase" },
        { name: "Prisma", icon: "prisma" },
        { name: "Hibernate / JPA", icon: "hibernate" },
      ],
    },
    {
      group: "AI / ML",
      items: [
        { name: "Claude API", icon: "anthropic" },
        { name: "Gemini API", icon: "googlegemini" },
        { name: "LangChain / LangGraph", icon: "langchain" },
        { name: "PyTorch", icon: "pytorch" },
        { name: "Hugging Face", icon: "huggingface" },
        { name: "RAG" },
      ],
    },
    {
      group: "DevOps & Testing",
      items: [
        { name: "Docker", icon: "docker" },
        { name: "AWS (EC2, S3)", icon: "amazonwebservices" },
        { name: "GitHub Actions", icon: "githubactions" },
        { name: "Vercel", icon: "vercel" },
        { name: "Git", icon: "git" },
        { name: "Jest", icon: "jest" },
        { name: "JUnit 5", icon: "junit5" },
        { name: "Playwright" },
      ],
    },
  ],

  stats: [
    { value: "8", label: "Projects built" },
    { value: "1st", label: "of 82 teams at CyberthonAI" },
    { value: "2×", label: "IPD Expo winner" },
  ],
  achievements: [
    {
      year: "2025",
      title: "CyberthonAI — National Hackathon Winner",
      subtitle: "1st Place out of 82 Teams",
      text: "Won CyberthonAI, a national-level hackathon organized by Infosys in collaboration with PEC-CRC and Chandigarh Police. Secured 1st place competing against 82 teams from across the country.",
    },
    {
      year: "2025",
      title: "Full Stack Intern — DRDO, Jodhpur",
      subtitle: "Defence Research & Development Organisation",
      text: "Completed a one-month remote internship as a Full Stack Developer at DRDO Jodhpur, working on internal tools and web applications for defence research operations.",
    },
    {
      year: "2024 – 2025",
      title: "IPD Expo Winner — 2024 & 2025",
      subtitle: "CCET, Sector 26, Chandigarh",
      text: "Won the IPD Expo consecutively in 2024 and 2025 at Chandigarh College of Engineering & Technology (CCET), Sector 26, Chandigarh.",
    },
    {
      year: "2023 – Present",
      title: "B.Tech — Computer Science & Engineering",
      subtitle: "4th Year • Undergraduate",
      text: "Building a strong foundation in C, C++, JavaScript, and Python. Continuously improving skills in Data Structures & Algorithms while diving into full-stack development with Next.js and the MERN stack.",
    },
  ],

  // Add an `href` to a certificate to make its card link to the credential.
  certificates: [
    { title: "Data Analytics Job Simulation", issuer: "Deloitte · Forage", year: "Nov 2025", href: "" },
    { title: "Software Engineering Job Simulation", issuer: "JPMorgan Chase & Co. · Forage", year: "Nov 2025", href: "" },
    { title: "CyberthonAI Hackathon", issuer: "National Level AI Hackathon", year: "2025", href: "" },
    { title: "DRDO Internship", issuer: "Defence Research & Development Organisation", year: "2025", href: "" },
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
