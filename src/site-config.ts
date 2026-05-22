/**
 * Site configuration — single source of truth for nav, social, editorial meta.
 *
 * Conventions:
 * - Internal route hrefs end in `/` to match Astro's directory build format
 *   and avoid GitHub Pages 301 redirects on every internal click.
 * - `email` is rendered as a plain `mailto:` in HTML; no JS obfuscation
 *   (scraper-volume not a problem; predictability matters more).
 */
export const siteConfig = {
  author: "Brennon Williams",
  title: "Brennon Williams — Software Architect",
  subtitle: "I wonder what the machines think.",
  description:
    "Personal site of Brennon Williams — AI/ML software architect. Notes on machine reasoning, local-first software, physical computing, and rapid prototyping.",
  image: {
    src: "/og-image.png",
    alt: "Brennon Williams — I wonder what the machines think.",
  },
  email: "brennon@brennonw.com",

  socialLinks: [
    {
      text: "GitHub",
      href: "https://github.com/BrennonTWilliams",
      icon: "i-simple-icons-github",
      header: "i-ri-github-line",
    },
    {
      text: "LinkedIn",
      href: "https://www.linkedin.com/in/brennon-williams-ai/",
      icon: "i-simple-icons-linkedin",
    },
  ],

  header: {
    navLinks: [
      { text: "Work", href: "/#work" },
      { text: "Writing", href: "/blog/" },
      { text: "Now", href: "/now/" },
      { text: "Projects", href: "/projects/" },
    ],
  },

  /**
   * Editorial chrome strings — every component (topbar, side rails, hero foot,
   * dispatch table) reads from here. Bump issue / volume in one place.
   */
  editorial: {
    volume: "Vol. 01",
    issue: "Nº 03",
    series: "Notes from the lab · Nº 03",
    filedUnder: "Code · Intelligence",
    location: "SF · NYC · Dallas",
    coords: "38.89° N · 77.03° W",
    liveStatus: "shipping little-loops v0.4",
    sideRails: {
      left: "Agent Harnesses · Eval-driven-development · Agentic Coding Loops · Enterprise AI · Physical computing",
      right: "BW — Vol. 01 · Issue Nº 03 · 2026 · MIT",
    },
  },

  /**
   * Now-page content. `lastUpdated` is a manual signal — bump when entries
   * change, not on every release.
   */
  now: {
    lastUpdated: "2026-05-16",
    entries: [
      {
        kind: "Building",
        title: "<em>little-loops</em> v0.4 — sprint planning + handoff",
        meta: "PyPI · 21 cmds · 8 agents",
      },
      {
        kind: "Reading",
        title:
          "Cognitive Behaviors that Enable <em>Self-Improving Reasoners</em>",
        meta: "Gandhi et al · Stanford · 2025",
      },
      {
        kind: "Listening",
        title: "<em>Long</em> ambient sets while soldering",
        meta: "Brian Eno · Jon Hopkins · Hania Rani",
      },
      {
        kind: "Off-screen",
        title: "Trails with the <em>dog</em> &amp; the Blue Ridge mountains",
        meta: "38.89° N · 77.03° W",
      },
    ],
  },

  favicon: "/favicon.svg",

  page: {
    get blogLinks() {
      return siteConfig.header.navLinks.filter((link) =>
        link.href.startsWith("/blog"),
      );
    },
  },
};

export default siteConfig;
