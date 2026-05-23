# CLAUDE.md

Guidance for Claude Code when working in this repo.

## Project Overview

Personal site/portfolio for Brennon Williams. **Editorial "Paper / Ink" design** — newspaper-inspired (serif display + sans UI + mono detail), light/dark theme via `html.dark`.

**Stack:**
- **Astro 4** (SSG) — static output to `dist/`
- **Vue 3** islands for interactive components
- **UnoCSS** utility-first CSS, reading from CSS custom properties
- **MDX** for blog content
- **TypeScript** throughout

## Development Commands

```bash
npm run dev          # dev server on port 1977
npm run build        # SSG to dist/
npm run preview      # serve dist/
npm run lint         # eslint (errors)
npm run lint:fix     # auto-fix
npm run release      # bumpp version
```

A `__BUILD_HASH__` global is injected at build time (git short SHA) via Vite `define:` in `astro.config.ts`. Surfaced in `EdFooter.vue` and the hero plate annotation.

## Architecture

### Layout & chrome

- **`EditorialLayout.astro`** is the canonical layout. All pages should use it (except where `BaseLayout.astro` already shims through to it).
  - Props: `title`, `description`, `image`, `socialImage`, `pageType` (`website` | `article`), `mainWidth` (`prose` | `wide` | `wider` | `full`), `bodyClass`, `lang`, `noindex`, `structuredData`, `noMainWrapper`.
  - Mounts `<ViewTransitions />`, side rails, topbar, persisted `EdNav`, `<main id="main">` wrapper (skippable via `noMainWrapper={true}` when a page wants full-bleed sections), `EdFooter`, `ScrollToTop`.
  - Computes `workCount` / `writingCount` once per render and feeds them as props to `EdNav` (safe for persisted islands — content size is stable across client-side navs).
- **`BaseHead.astro`** owns SEO meta, font preloads (Valkyrie B + Inter Tight), favicons, OG/Twitter meta, JSON-LD `Person` site-wide + per-page `structuredData` slot, and the no-flash theme script (`vueuse-color-scheme` storage key + `html.dark` toggle + `.js` class flag + `astro:after-swap` re-fire).
- **`tokens.css`** is the canonical theme. Import order in `BaseHead`: `tokens.css → global.css → prose.css`. Never hardcode durations, easings, z-indexes, hero-scale type clamps in component CSS — always reference a token.

### Components

**Astro components** (server-rendered, no hydration):
- `EdTopbar.astro` — issue/filed-under/locale strip, pulsing live-status link
- `EdSideRails.astro` — fixed left/right rails, hidden < 980px
- `EdSectionHeader.astro` — § numeral + serif H2 + eyebrow/coord. Title accepts raw `<em>` for coral italic.
- `ArticleNav.astro` — prev/next strip at the foot of detail pages. Always emits two cells (an empty placeholder if needed) for grid stability.
- `PovBlock.astro` — bone background, 2px coral left rule, italic serif body

**Vue islands** (use `client:idle` for persistent, `client:visible` for below-the-fold):
- `EdNav.vue` — persisted nav island. Mobile drawer trigger + ThemeToggle nested. Reads `currentPath` from a reactive `ref` synced on `astro:after-swap` (not from a prop — props freeze on persisted islands).
- `NavDrawer.vue` — backdrop + slide aside, scroll lock, focus trap, Esc-to-close, `inert` on `.shell`
- `EdFooter.vue` — 4-column editorial footer, hash-scroll for Index column, renders `__BUILD_HASH__`
- `EdWire.vue` — marquee of project handles, auto-hides if `activeCount === 0`, hover/focus pauses
- `WorkCard.vue` — single work-card row; archive treatment, content clamps
- `WriteItem.vue` — year/month tile + name/desc/tags
- `ThemeToggle.vue` — uses `useDark({ storageKey: 'vueuse-color-scheme' })` (pinned with BaseHead's inline script)
- `ScrollToTop.vue` — ink pill, clears right rail at ≥ 980px

**Composables:**
- `useHashScroll.ts` — shared anchor intercept, smooth-scrolls same-page, defers to `astro:page-load` on cross-page nav. Used by `EdNav`, `EdFooter`, `NavDrawer`. Don't inline this logic elsewhere.
- `useHeaderScroll.ts` — header hide/show on scroll direction. Targets `.nav` / `.nav--hidden`.

### Styling

**UnoCSS** (`uno.config.ts`) — theme reads CSS vars; shortcuts:
- Surfaces: `bg-paper`, `bg-bone`, `text-ink`, `text-ink-soft`, `text-ink-mute`, `text-ink-faint`, `text-coral`, `border-line`, `border-line-soft`, `border-line-faint`
- UI: `nav-link`, `prose-link`, `btn-primary`, `btn-ghost`, `pill`, `eyebrow`, `coord`, `roman`
- Page width tiers (used by `EditorialLayout` `mainWidth` prop): `main-prose`, `main-wide`, `main-wider`, `main-full`

Legacy shortcuts removed: `bg-main`, `text-main`, `text-link`, `text-title`, `border-main`, `hr-line`, `container-link`, `glass`, accent-green palette, dotted background helpers.

**Fonts:**
- Serif/body: **Valkyrie B** (House Industries — commercial, license file NOT committed, audit before public release)
- Sans UI: **Inter Tight** (self-hosted, latin + latin-italic variable WOFF2, ~93KB)
- Caps: **Valkyrie B Caps**
- Mono: **DM Mono** (Google Fonts via `presetWebFonts`)

**Global styles** (`src/styles/`):
- `tokens.css` — palettes (Paper light + Ink dark via `html.dark`), motion vars, z-index scale, type/spacing, safe-area insets
- `global.css` — `@font-face`, paper grain overlay, `.js`-gated reveal animations, scroll-padding-top, smooth scroll under reduced-motion gate, skip-link, `:focus-visible`, marquee keyframe, view-transition stacking, print stylesheet
- `prose.css` — coral italic emphasis in headings, coral underlined links, bone code/quote panels, heading anchor styles for `rehype-autolink-headings`, optional `.lede` drop cap, `hyphens: auto`

### Routing

**Static routes:**
- `/` — homepage, full-bleed sections (uses `noMainWrapper={true}` and puts `id="main"` on the hero)
- `/projects/` — projects index (editorial list, Archive divider on status transition)
- `/reading/` — Reading page, an editorial list of favorite books + whitepapers, fed from the `books` / `whitepapers` collections
- `/404.astro` — `noindex={true}`, two pill CTAs
- `/robots.txt.ts`, `/rss.xml.ts` — generated

**Dynamic:**
- `/posts/[...slug].astro` — blog post detail. Header: roman § + serif H1 + italic description + mono meta. `<ArticleNav>` at foot. Emits `BlogPosting` structuredData. No TOC sidebar (intentionally dropped).
- `/projects/[...slug].astro` — project detail. Header: status pill + stack row + `btn-primary` link. `<ArticleNav>` prev/next driven by `sortProjects()` order.
- `/blog/[...path].astro` — blog listing by category path
- `/[...slug].astro` — generic content-collection pages

Markdown plugins wired in `astro.config.ts`: `rehype-slug` + `rehype-autolink-headings` (pilcrow `¶` anchor). Sitemap `filter` excludes `/404`.

### Content collections (`src/content/config.ts`)

- **`blog`** — required: `title`, `date`, `dateRaw`. Optional: `description`, `duration`, `image`, `tag`, `draft`, `lang`, `redirect`, `video`, `recording`.
  - **UTC convention:** `date` is human-formatted with `timeZone: 'UTC'`; `dateRaw` is a `Date` object for programmatic access (RSS `<pubDate>`, year/month derivation). Always pass `timeZone: 'UTC'` to any `toLocaleString` / `getFullYear` call on `dateRaw`.
- **`projects`** — required: `title`, `summary`, `status` (`active` | `archive`, default `active`). Optional: `category`, `stack: string[]`, `repo`, `website`, `icon`, `svg`, `order`, `flagship`, `link: { href, label }`, `draft`.
  - `link.href` is the primary outbound link on the detail page (rendered as `btn-primary`).
- **`pages`** — required: `title`. Optional: `description`, `image`.
- **`books`** / **`whitepapers`** — `type: 'data'` collections. Each is a single YAML file (`src/content/books/books.yaml`, `src/content/whitepapers/whitepapers.yaml`) holding a top-level array; the schema is `z.array(...)` and pages flatten entries with `.flatMap(e => e.data)`.
  - `books` item: `title`, `author` (req); `note`, `featured` (opt).
  - `whitepapers` item: `title`, `year`, `category`, `note` (req); `author`, `featured` (opt).
  - `featured: true` surfaces an item in the homepage Reading strip (Section IV).

### Data utilities (`src/utils/`)

- `posts.ts`
  - `getPosts(path?, collection?)` — sorted by `dateRaw.getTime()` (newest first), drafts excluded in production
  - `sortPostsByDate()` — comparator
- `projects.ts`
  - `sortProjects(projects[])` — comparator-wrapped sort: status active first → `order` asc → slug fallback
  - `getProjects()` — convenience: non-draft, sorted
  - `groupProjectsByCategory()`, `partitionFlagship()` — for legacy grouping (unused by current pages)
- `link.ts` — `getLinkTarget(link)`, `isExternalLink(link)`

### Site config (`src/site-config.ts`)

Single source of truth for nav, social, and editorial chrome strings.

- `editorial` — `volume`, `issue`, `series`, `filedUnder`, `location`, `coords`, `sideRails.{left,right}`. Components read from here; bump volume/issue in one place.
- `reading` — `lastUpdated` (manual signal, bump when the books/whitepapers lists change). The list content lives in the `books` / `whitepapers` collections. `astro.config.ts`'s `readingFreshnessCheck` warns if this date drifts > 14 days behind the config file mtime.
- Internal route `href`s end in `/` (matches Astro's directory build, avoids GH Pages 301)

## Development Guidelines

### Adding a blog post

1. Create `src/content/blog/[category]/post-slug.md` (or `.mdx`)
2. Frontmatter:

```yaml
---
title: "Post Title"
date: "2026-05-16"
dateRaw: "2026-05-16"
description: "Brief description"
duration: "5 min read"
tag: "Category"
lang: "en-US"
draft: false
image:                       # optional per-post OG (1200×630, ≤ 200KB)
  src: "/og/post-slug.png"
  alt: "Image description"
---
```

`dateRaw` is required and must match `date`. Both are needed because `date` is pre-formatted for display while `dateRaw` powers RSS and programmatic year/month derivation.

### Adding a project

1. Create `src/content/projects/slug.md`
2. Frontmatter:

```yaml
---
title: "project-name"
category: "AI & Dev Tooling"
status: active        # 'active' | 'archive'
order: 1              # canonical sort key
summary: "Short summary, ~160 chars."
stack: ["Python", "Claude Code", "PyPI"]
repo: "https://github.com/..."
website: "https://..."
link:                 # optional primary outbound on detail page
  href: "https://..."
  label: "Visit site"
flagship: false
draft: false
---
```

The card title may contain raw `<em>` for coral italic; `WorkCard.vue` `v-html`s it.

### Adding a book or whitepaper

Append a block to the relevant YAML file — no new file needed.

- **Book** → `src/content/books/books.yaml`:

  ```yaml
  - title: "Book Title"
    author: "Author Name"
    note: "Optional — one line on why it stays on the shelf."
    featured: true   # optional — surfaces in the homepage Reading strip
  ```

- **Whitepaper** → `src/content/whitepapers/whitepapers.yaml`:

  ```yaml
  - title: "Paper Title"
    author: "Author et al."   # optional — omit if none
    year: 2026
    category: "Reasoning & Cognition"
    note: "Required — one line on why it matters."
    featured: true            # optional
  ```

Bump `siteConfig.reading.lastUpdated` when the lists change. Plain text only —
titles are not `v-html`'d, so no raw `<em>`.

### Styling patterns

- Reach for UnoCSS shortcuts (`bg-paper`, `text-ink`, etc.) over custom CSS — they read from tokens automatically and theme-switch for free.
- Page-specific CSS in a `<style>` block at the bottom of the `.astro` file. Use distinct class names; Astro scopes by default.
- Dark mode wires to `html.dark` — don't fight it with `:global(.dark) {}` overrides; use the CSS vars (they flip automatically).
- Animations: gate behind `@media (prefers-reduced-motion: no-preference)`.
- Hover effects: gate behind `@media (hover: hover) and (pointer: fine)` so touch devices don't get stuck hover states.

### Hydration

- `client:idle` — persistent islands (EdNav, ScrollToTop) where interactivity matters at any moment
- `client:visible` — below-the-fold lists (EdWire, WorkCard, WriteItem) — defer cost until in viewport
- No directive — static islands (EdFooter renders server-side and re-uses Vue templates for the hash-scroll method binding only)
- Persisted islands MUST read changing state from reactive `ref`s synced on `astro:after-swap`, not from props.

### Code quality

- ESLint: TypeScript + Astro + Vue. Pre-commit runs `lint:fix` via simple-git-hooks. `.d.ts` files are ignored at the global ignore level (the typed `declare global` block can't be parsed by the JS-only fallback config).
- TypeScript strict. Types in `src/types.ts` (`CollectionPosts`, `CollectionProjects`, `CollectionPages`, `PostKey`).

## Build & Deployment

- Static site to `dist/`, deployed via GitHub Pages
- Site URL: <https://brennontwilliams.github.io>
- Custom domain via `CNAME`
- No CSP assumed (GH Pages doesn't add one). If one is later added, the inline scripts in `BaseHead.astro` need nonces / hashes / externalization.

## Important patterns

1. **Always use `getPosts()` and `getProjects()` / `sortProjects()`** — never raw `getCollection()` in page bodies. The utilities pin sort order, draft filtering, and UTC date handling.
2. **Use Astro's `<Image />` for asset-pipeline images** (everything under `src/assets/`). Static files (favicons, OG image, fonts) live in `public/` and reference via root-relative URL.
3. **Prefer `EditorialLayout` directly over `BaseLayout`** in new pages. BaseLayout exists only to keep existing callers (e.g. content-collection pages that author against `layout:` frontmatter, if any) working.
4. **Section structure on the homepage** uses `noMainWrapper={true}` so each `<section>` can paint full-bleed with its own `border-top: 1px solid var(--line)`. The hero wraps in `<main id="main">` to keep the skip-link target.
5. **Hero plate annotations** read `__BUILD_HASH__` and `siteConfig.editorial.*` — never hardcode the SHA or issue number in a component.
