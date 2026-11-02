import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import gsap from "gsap";
import Hls from "hls.js";

const videoUrl =
  "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

const projects = [
  {
    title: "OnBoardAI",
    category: "AI PRODUCT",
    date: "Jun 2026",
    summary:
      "A policy-grounded onboarding assistant for employee questions, sensitive-topic HR handoffs, and safe ticket creation.",
    highlight: "87 / 90",
    highlightLabel: "evaluation cases passed · 96.7%",
    visual: "onboarding",
    highlights: [
      "BGE-M3 retrieval with cited answers, refusal checks, and sensitive-topic escalation.",
      "Role-checked, deduplicated Jira drafts with an editable human confirmation step.",
    ],
    stack: [
      "Python",
      "Streamlit",
      "LangChain",
      "LangGraph",
      "RAG",
      "Chroma",
      "Groq",
      "LangSmith",
      "MCP",
    ],
    githubUrl: "https://github.com/vaibhav1010-geek/OnboardAI",
    liveUrl: "",
  },
  {
    title: "InsuraAI",
    category: "FULL-STACK AI",
    date: "Oct 2025 — Jan 2026",
    summary:
      "A full-stack insurance policy extraction and renewal workflow that turns documents into structured, searchable details.",
    highlight: "OCR + GPT",
    highlightLabel: "document extraction and normalization",
    visual: "insurance",
    highlights: [
      "Normalizes key policy details from noisy documents for review and renewal management.",
      "JWT, OTP, and Google OAuth with MongoDB Atlas, Cloudinary uploads, and automated notifications.",
    ],
    stack: [
      "React",
      "Tailwind CSS",
      "Framer Motion",
      "Node.js",
      "Express",
      "MongoDB Atlas",
      "JWT / OAuth",
      "OCR",
      "GPT",
      "Cloudinary",
      "node-cron",
      "Nodemailer",
      "Vercel",
      "Render",
    ],
    githubUrl: "",
    liveUrl: "https://insura-ai-pi.vercel.app/",
  },
  {
    title: "Subscribe.",
    category: "BILLING BACKEND",
    date: "Sep 2025 — Oct 2025",
    summary:
      "A SaaS-ready subscription and billing backend built around reliable payments and idempotent APIs.",
    highlight: "Razorpay",
    highlightLabel: "verified payment processing",
    visual: "subscription",
    highlights: [
      "JWT authentication, schema-driven data models, and idempotent REST APIs.",
      "MongoDB-backed subscription and invoice lifecycles with verified, concurrency-safe payments.",
    ],
    stack: ["Node.js", "Express.js", "MongoDB", "Razorpay", "JWT"],
    githubUrl: "https://github.com/vaibhav1010-geek/Subscribe.",
    liveUrl: "",
  },
  {
    title: "CareerConnect",
    category: "FULL-STACK WEB APP",
    date: "Jul 2025 — Aug 2025",
    summary:
      "A full-stack job portal connecting recruiters and candidates with secure, role-based tools.",
    highlight: "One platform",
    highlightLabel: "for recruiters and candidates",
    visual: "career",
    highlights: [
      "Role-based dashboards for posting jobs, applying, and managing resumes.",
      "JWT-secured APIs and Nodemailer notifications for successful applications.",
    ],
    stack: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Tailwind CSS",
      "JWT",
      "Nodemailer",
    ],
    githubUrl: "https://github.com/vaibhav1010-geek/CareerConnect",
    liveUrl: "",
  },
];

const journal = [
  {
    title: "Claude Code Lite: An India Product Strategy Case Study",
    category: "Product Strategy",
    description:
      "An exploration of an affordable, predictable AI coding subscription for India, backed by market research, competitive analysis and product strategy.",
    read: "6 min read",
    date: "October 18, 2025",
    image: "/images/claude-app-icon.jpg",
    link : "https://app.notion.com/p/Claude-Code-Lite-India-Product-Case-Study-40a652c6076a810b8f42d58eed92cb63?source=copy_link"
  },
  
];

function usePageVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | undefined;
    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: false });
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
    } else {
      console.error("HLS playback is not supported by this browser.");
    }

    return () => {
      hls?.destroy();
      video.removeAttribute("src");
      video.load();
    };
  }, []);

  return videoRef;
}

function VideoBackground({ flipped = false }: { flipped?: boolean }) {
  const videoRef = usePageVideo();
  return (
    <div
      className={`video-background ${flipped ? "video-background-flipped" : ""}`}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    </div>
  );
}

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    let frame = 0;
    let startTime = 0;
    let completeTimer = 0;
    const tick = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / 2700, 1);
      setCount(Math.floor(progress * 100));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else completeTimer = window.setTimeout(onComplete, 400);
    };
    frame = requestAnimationFrame(tick);
    const wordTimer = window.setInterval(
      () => setWordIndex((index) => (index + 1) % 3),
      900,
    );
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(completeTimer);
      window.clearInterval(wordTimer);
    };
  }, [onComplete]);

  const words = ["Discover", "Build", "Evolve"];
  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.p
        className="loading-label"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
      >
        Portfolio
      </motion.p>
      <div className="loading-word-wrap">
        <AnimatePresence mode="wait">
          <motion.p
            key={words[wordIndex]}
            className="loading-word"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            {words[wordIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
      <p className="loading-counter">{String(count).padStart(3, "0")}</p>
      <div className="loading-progress">
        <div
          className="loading-progress-value accent-gradient"
          style={{ transform: `scaleX(${count / 100})` }}
        />
      </div>
    </motion.div>
  );
}

function Navbar() {
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const links = [
    ["Home", "#home"],
    ["Work", "#work"],
    ["Resume", "https://drive.google.com/file/d/1s-SDbSeSjIVKsli5R0mAqSEsqk8g4gzU/view?usp=drive_link"],
  ];

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  const handleNav = (label: string, href: string) => {
    if (label === "Resume") {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    setActive(label);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className={`nav-pill ${scrolled ? "nav-pill-scrolled" : ""}`}>
        <a
          className="logo-mark"
          href="#home"
          aria-label="Michael Smith, home"
          onClick={() => setActive("Home")}
        >
          <span>VG</span>
        </a>
        <span className="nav-divider mobile-hide" />
        <div className="nav-links">
          {links.map(([label, href]) => (
            <button
              className={`nav-link ${active === label ? "nav-link-active" : ""}`}
              key={label}
              onClick={() => handleNav(label, href)}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="nav-divider" />
        <a className="say-hi" href="https://mail.google.com/mail/?view=cm&fs=1&to=guptavaibhav2005%40gmail.com">
          <span className="say-hi-border accent-gradient" />
          <span className="say-hi-content">
            Say hi <span aria-hidden="true">↗</span>
          </span>
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const roles = ["AI Enthusiast", "Product Thinker", "Problem Solver", "Full Stack Developer"];

  useEffect(() => {
    const timer = window.setInterval(
      () => setRoleIndex((index) => (index + 1) % roles.length),
      2000,
    );
    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          ".name-reveal",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, delay: 0.1 },
        )
        .fromTo(
          ".blur-in",
          { opacity: 0, filter: "blur(10px)", y: 20 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 1,
            stagger: 0.1,
          },
          0.3,
        );
    }, heroRef);
    return () => {
      window.clearInterval(timer);
      context.revert();
    };
  }, []);

  return (
    <section className="hero" id="home" ref={heroRef}>
      <VideoBackground />
      <div className="hero-overlay" />
      <div className="hero-bottom-fade" />
      <Navbar />
      <div className="hero-content">
        <h1 className="hero-title name-reveal">Vaibhav Gupta</h1>
        <p className="hero-role blur-in">
          {" "}
          <AnimatePresence mode="wait">
            <motion.span
              className="role-word"
              key={roleIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              {roles[roleIndex]}
            </motion.span>
          </AnimatePresence>{" "}
          Based in India.
        </p>
        <p className="hero-description blur-in">
          Understanding user needs, identifying product opportunities and shaping intelligent solutions through technology.
        </p>
        <div className="hero-actions blur-in">
          <a className="button button-primary" href="#work">
            See Works
          </a>
          <a className="button button-outline" href="#contact">
            Reach out...
          </a>
        </div>
      </div>
      <a className="scroll-indicator" href="#work">
        <span>Scroll</span>
        <span className="scroll-line">
          <span />
        </span>
      </a>
    </section>
  );
}

function SectionHeading({
  label,
  title,
  italic,
  description,
  action,
}: {
  label: string;
  title: string;
  italic: string;
  description: string;
  action?: { text: string; href: string };
}) {
  return (
    <motion.div
      className="section-heading"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="section-heading-main">
        <p className="section-eyebrow">
          <span />
          {label}
        </p>
        <h2>
          {title} <em>{italic}</em>
        </h2>
        <p className="section-description">{description}</p>
      </div>
      {action && (
        <a className="text-link desktop-action" href={action.href}>
          {action.text} <span aria-hidden="true">↗</span>
        </a>
      )}
    </motion.div>
  );
}

function Experience() {
  return (
    <section className="section experience-section" id="experience">
      <div className="container">
        <SectionHeading
          label="Experience"
          title="Where I've"
          italic="worked"
          description="Learning, building, and contributing alongside teams shipping real-world software."
        />
        <motion.article
          className="experience-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75 }}
        >
          <div className="experience-card-index" aria-hidden="true">
            01
          </div>
          <div className="experience-card-content">
            <div className="experience-card-meta">
              <span className="experience-card-company">Suprazo Technologies</span>
              <time className="experience-card-date" dateTime="2026-04">
                Apr 2026 — Jun 2026
              </time>
            </div>
            <h3>Software Developer Intern</h3>
            <p className="experience-card-description">
              Contributed across the full software development lifecycle by
              developing frontend and backend features, building REST APIs, and
              working with databases alongside the development team to deliver
              real-world software solutions.
            </p>
            <div className="experience-card-tags" aria-label="Experience highlights">
              <span>Frontend &amp; backend</span>
              <span>REST APIs</span>
              <span>Database development</span>
              <span>Software lifecycle</span>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}

function SelectedWork() {
  return (
    <section className="section work-section" id="work">
      <div className="container">
        <SectionHeading
          label="Selected Work"
          title="Featured"
          italic="projects"
          description="A selection of AI and full-stack products, from grounded onboarding to insurance document intelligence."
          action={{ text: "Discuss a project", href: "#contact" }}
        />
        <div className="project-grid">
          {projects.map((project, index) => (
            <motion.article
              className="project-card"
              key={project.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.75, delay: index * 0.08 }}
            >
              <div className={`project-visual project-visual--${project.visual}`} aria-hidden="true">
                <div className="project-preview-window">
                  {project.visual === "onboarding" ? (
                    <>
                      <div className="project-preview-toolbar">
                        <span className="project-preview-mark">O</span>
                        <span>People assistant</span>
                        <span className="project-preview-status">● Ready</span>
                      </div>
                      <div className="project-chat">
                        <div className="project-chat-question">
                          Where can I find onboarding guidance?
                        </div>
                        <div className="project-chat-answer">
                          <span className="project-answer-mark">✳</span>
                          <span>
                            Here&apos;s the right policy and next step.
                            <span className="project-citation">Source · Employee handbook</span>
                          </span>
                        </div>
                      </div>
                    </>
                  ) : project.visual === "insurance" ? (
                    <>
                      <div className="project-preview-toolbar">
                        <span className="project-preview-mark">I</span>
                        <span>Policy overview</span>
                        <span className="project-preview-status">● Processed</span>
                      </div>
                      <div className="project-document">
                        <div className="project-document-file">
                          <span className="project-file-icon">PDF</span>
                          <span>Policy document <small>Extraction complete</small></span>
                          <span className="project-file-check">✓</span>
                        </div>
                        <div className="project-document-fields">
                          <span>Coverage type<i /></span>
                          <span>Policy dates<i /></span>
                          <span>Premium details<i /></span>
                        </div>
                      </div>
                    </>
                  ) : project.visual === "subscription" ? (
                    <>
                      <div className="project-preview-toolbar">
                        <span className="project-preview-mark">S</span>
                        <span>Subscription overview</span>
                        <span className="project-preview-status">● Active</span>
                      </div>
                      <div className="project-billing">
                        <div className="project-plan">
                          <span>PRO PLAN <small>Monthly subscription</small></span>
                          <strong>$29 <small>/ month</small></strong>
                        </div>
                        <div className="project-invoice">
                          <span><i /> INV-2025-009 <small>Payment verified</small></span>
                          <strong>Paid <b>↗</b></strong>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="project-preview-toolbar">
                        <span className="project-preview-mark">C</span>
                        <span>Find your next role</span>
                        <span className="project-preview-status">● 248 jobs</span>
                      </div>
                      <div className="project-jobs">
                        <div className="project-job-search">
                          <span>⌕</span> Product designer <i /> Remote
                        </div>
                        <div className="project-job-row">
                          <span className="project-job-company">V</span>
                          <span>Visual Designer <small>Vercel · Remote</small></span>
                          <span className="project-job-tag">Full-time</span>
                        </div>
                        <div className="project-job-row">
                          <span className="project-job-company project-job-company--blue">N</span>
                          <span>Product Designer <small>Notion · New York</small></span>
                          <span className="project-job-tag">Hybrid</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="project-visual-caption">
                  <span>{project.highlight}</span>
                  <span>{project.highlightLabel}</span>
                </div>
              </div>
              <div className="project-card-content">
                <div className="project-card-meta">
                  <span className="project-card-category">{project.category}</span>
                  <span className="project-card-date">{project.date}</span>
                </div>
                <h3>{project.title}</h3>
                <p className="project-card-summary">{project.summary}</p>
                <ul className="project-highlights">
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <div className="project-card-footer">
                  <div className="project-tech-list" aria-label="Technologies used">
                    {project.stack.map((technology) => (
                      <span className="project-tech" key={technology}>
                        {technology}
                      </span>
                    ))}
                  </div>
                  <div className="project-links" aria-label={`${project.title} project links`}>
                    {project.githubUrl ? (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer">
                        GitHub <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                    {project.liveUrl ? (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer">
                        Live site <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                    {!project.githubUrl && !project.liveUrl ? (
                      <span className="project-links-pending">Project links coming soon</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Journal() {
  return (
    <section className="section journal-section" id="journal">
      <div className="container">
        <SectionHeading
          label="Product"
          title="Case"
          italic="Studies"
          description="Product case studies."
          action={{ text: "View all", href: "#journal" }}
        />
        <div className="journal-list">
          {journal.map((entry, index) => (
            <motion.a
              className="journal-item"
              href={entry.link}
              key={entry.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: index * 0.07 }}
            >
              <img src={entry.image} alt="" loading="lazy" />
              <div className="journal-copy">
                <span className="journal-category">{entry.category}</span>
                <h3>{entry.title}</h3>
                <p className="journal-description">{entry.description}</p>
              </div>
              <div className="journal-meta">
                <span>{entry.read}</span>
                <span>{entry.date}</span>
              </div>
              <span className="journal-arrow" aria-hidden="true">↗</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function BeyondTheCode() {
  return (
    <section className="beyond-code-section" id="resume">
      <div className="container">
        <motion.div
          className="beyond-code-card"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75 }}
        >
          <p className="beyond-code-eyebrow">AI • PRODUCT • ENGINEERING</p>
          <h2 className="beyond-code-title">
            Bridging the gap between AI capabilities and real-world {" "}
            <em>products.</em>
          </h2>
          <p className="beyond-code-description">
            Interested in the intersection of AI, engineering and product management — and in understanding what makes technology genuinely valuable.
          </p>
          <ul className="beyond-code-interests" aria-label="Areas of interest">
            <li>AI Products</li>
            <li>Product Strategy</li>
            <li>Developer Tools</li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

function Contact() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marqueeRef.current) return;
    const tween = gsap.to(marqueeRef.current, {
      xPercent: -50,
      duration: 40,
      ease: "none",
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  }, []);

  const phrase = "IDEAS INTO PRODUCT INTO VALUE • ";
  return (
    <footer className="contact-section" id="contact">
      <VideoBackground flipped />
      <div className="contact-overlay" />
      <div className="contact-inner">
        <p className="section-eyebrow"><span />GOOD IDEAS START WITH A CONVERSATION.</p>
        <div className="marquee-window">
          <div className="marquee-track" ref={marqueeRef}>
            {Array.from({ length: 10 }, (_, index) => (
              <span key={index}>{phrase}</span>
            ))}
          </div>
        </div>
        <a
          className="contact-email accent-border"
          href="https://mail.google.com/mail/?view=cm&fs=1&to=guptavaibhav2005%40gmail.com"
        >
          Let's Connect <span aria-hidden="true">↗</span>
        </a>
        <div className="footer-bottom">
          <a className="footer-brand" href="#home">Vaibhav Gupta</a>
          <div className="social-links">
            {[
              ["X", "https://x.com/vaibhavguptqae?s=11"],
              ["LinkedIn", "https://www.linkedin.com/in/vaibhav-gupta-2555a5240/"],
              ["GitHub", "https://github.com/vaibhav1010-geek"],
            ].map(([label, href]) => (
              <a href={href} key={label} target="_blank" rel="noreferrer">{label}</a>
            ))}
          </div>
          <p className="availability"><span />Available for projects</p>
        </div>
      </div>
    </footer>
  );
}

function PortfolioPage() {
  const [isLoading, setIsLoading] = useState(true);
  const completeLoading = useCallback(() => setIsLoading(false), []);
  return (
    <>
      <AnimatePresence>{isLoading && <LoadingScreen onComplete={completeLoading} />}</AnimatePresence>
      <main>
        <Hero />
        <Experience />
        <SelectedWork />
        <Journal />
        <BeyondTheCode />
        <Contact />
      </main>
    </>
  );
}

function PageTransition() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Routes location={location}>
          <Route path="*" element={<PortfolioPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return <PageTransition />;
}
