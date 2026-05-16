# Site Redesign — Editorial "Paper / Ink" Theme

## Context

The repo `claudedocs/design_handoff_redesign/` ships a complete editorial-newspaper design system (Paper for light, Ink for dark) including a high-fidelity HTML prototype (`index.html`), an addendum for the Ink theme, and screenshots. The current site uses a clean "LessWrong-inspired" look (muted green accent, white/`#0d1117` surfaces, Valkyrie B serif). We are replacing it wholesale.

Constraints chosen with the user:
- **Hybrid homepage content** — use prototype editorial copy verbatim for marquee/Now/stats/hero, but pull Work cards from real project data and Writing from real posts.
- **Full editorial treatment on every page** — side rails, sticky editorial nav, marquee, section-header treatment apply site-wide.
- **Match prototype nav** — Work / Writing / Now / Contact. Requires a `/now` route and a `#contact` anchor.
- **All chrome on the homepage** — side rails, topbar, wire marquee, paper grain overlay.

Two further decisions, made now from the handoff README's own guidance (so the plan is grounded, not over-flexible):
- **Map Ink tokens to `html.dark`** (INK-THEME-ADDENDUM §"Wiring", Option A). Keeps the existing `ThemeToggle.vue` working untouched.
- **Don't load Google Fonts** despite the prototype's `<link>` tag. The handoff README explicitly says: "Do NOT use Playfair Display (redundant — Valkyrie B superior), JetBrains Mono (redundant — DM Mono already loaded)." We use **Valkyrie B** (self-hosted, regular + italic + bold) for serif/display, **Valkyrie B Caps** for labels/caps, **DM Mono** (already in UnoCSS) for mono, and add **Inter Tight** for UI sans via `presetWebFonts`.

### Pre-flight audit (do before opening the branch)

The migration breaks a few schemas; do these reads first and paste the inventory into the PR description so reviewers can confirm nothing was missed.

1. **`date` callers.** `rg -n "\\.data\\.date|post\\.data\\.date|frontmatter\\.date" src/ astro.config.mjs` — expected hit set: `src/utils/posts.ts`, `src/components/ListPosts.vue`, `src/pages/posts/[...slug].astro`, `src/pages/rss.xml.ts`. Any additional hits must be updated when the schema changes (Wave 1).
2. **Projects content audit.** `ls src/content/projects/` and read each `.md`/`.mdx` frontmatter; record which entries are missing `stack`, `status`, or `category`. Backfill in the same commit as the schema extension. Cards must render gracefully when an optional field is absent (omit the row, don't render an empty cell).
3. **`siteConfig.email`.** Confirm it exists in `src/site-config.ts`. If not, add it (used by Contact pill, footer, mailto button). If it lives under a different key today (e.g. `author.email`), the plan's references to `siteConfig.email` must be updated to match.
4. **Headshot asset path.** The codebase moved to Astro image optimization in a recent commit. The canonical path is `src/assets/images/profile/brennon-headshot-bw-stylized.png` consumed via `import` + the Astro `<Image />` component — **not** `/public/images/...`. The hero portrait plate must use `<Image />` so it picks up format conversion and responsive `srcset`. Do not copy the file into `public/`.
5. **Asset acquisition: Inter Tight WOFF2.** Self-hosted Inter Tight (weights 500, 600, 700; regular + italic = 6 files) is a prerequisite for Wave 1, not a code task. **Acquire and commit these files before the branch opens**, otherwise the `@font-face` declarations in `global.css` will 404 and the entire UI sans stack falls back to system fonts. Source: download the Inter Tight static fonts from the official `rsms/inter` GitHub releases (or Google Fonts → unzip → run the `.ttf` files through `woff2_compress` from the `woff2` package). Place at `public/fonts/WOFF2/Inter Tight/InterTight-Medium.woff2`, `…-MediumItalic.woff2`, `…-SemiBold.woff2`, `…-SemiBoldItalic.woff2`, `…-Bold.woff2`, `…-BoldItalic.woff2`. Confirm file presence (`ls public/fonts/WOFF2/Inter\ Tight/`) before merging Wave 1.
6. **Color-contrast pre-check on coral.** `#ed6f5c` (coral) on `#efe7d2` (paper) measures ~3.0:1, which **fails WCAG AA for body text (4.5:1)** and only passes AA for large text (3:1). Decide *now*, not at verification time: coral is acceptable for accents, hover, italic emphasis, large headings (h1/h2), pill borders, and the `coral-soft` selection background — but **not** for sustained body copy. Document the rule in `tokens.css` comments: `--coral` is an accent, never a body-text color. If a body-text coral is ever needed, derive a `--coral-deep` token (e.g. `#c8523f`) and verify it passes AA against both `--paper` and `--bone` before adding it. Run the check with a tool (e.g. `npx wcag-contrast`) before Wave 1 lands, not during §Verification.

---

## Approach

Three waves of work. **Waves 1 and 2 land together in a single merge** (a tokens-only commit leaves the existing `Header.vue`/`Footer.vue` rendering against the new palette and looking visibly broken; do the work on a branch and merge once chrome is in place). Wave 3 can ship as a follow-up merge — the site stays functional with the new chrome and the legacy page bodies in between.

1. **Tokens & foundation** — replace UnoCSS theme, install token CSS variables (`--paper`, `--ink`, `--coral`, etc.), rewrite `global.css` and `prose.css` against the new palette, drop `dot.css` from the site (paper-grain overlay replaces it).
2. **Chrome & navigation** — new `EdTopbar`, `EdNav`, `EdWire`, `EdSideRails`, `EdFooter` Vue components plus a new `EditorialLayout.astro` that wraps every page. Existing `Header.vue` / `Footer.vue` are deleted as part of the same merge.
3. **Pages** — rebuild `index.astro` against the prototype. Apply section-header + grain treatment to blog index, post detail, projects index, project detail. Add `/now/index.astro` page and a `#contact` anchor section on the homepage.

The plan is deliberately concrete: every value below (`#efe7d2`, `clamp(48px, 7.6vw, 112px)`, `60s linear infinite`, etc.) is copied from the prototype CSS at `claudedocs/design_handoff_redesign/index.html` so the implementer can lift it directly.

---

## Wave 1 — Tokens & foundation

### `uno.config.ts` (rewrite)

Replace the current theme + shortcuts entirely. Keep `presetUno`, `presetAttributify`, `presetIcons`, `presetTypography`, `presetWebFonts`, both transformers, and the `safelist`.

- `theme.fontFamily`:
  - `serif: ['Valkyrie B', 'Times New Roman', 'serif']`
  - `sans: ['Inter Tight', 'Inter', 'system-ui', 'sans-serif']`
  - `body: ['Valkyrie B', 'Times New Roman', 'serif']` (so prose stays serif)
  - `caps: ['Valkyrie B Caps', 'Inter Tight', 'sans-serif']`
  - `mono: ['DM Mono', 'SF Mono', 'Menlo', 'monospace']`
- `theme.colors`: add a `paper`, `ink`, `bone`, `coral`, `olive`, `mustard` palette mirroring the CSS vars, but the canonical source of truth is `tokens.css` (below). UnoCSS gets short aliases only for utility classes.
- `presetWebFonts`: **do not** add Inter Tight here — `presetWebFonts` defaults to the Google Fonts CDN, which violates the "no Google Fonts" rule. Self-host Inter Tight instead (the WOFF2 files are acquired in §Pre-flight audit step 5 and committed at `public/fonts/WOFF2/Inter Tight/`); declare `@font-face` blocks in `global.css` alongside Valkyrie B. Keep the existing `mono: 'DM Mono:400,600'` entry in `presetWebFonts` for now (DM Mono is already wired this way); if we want full Google-Fonts independence later, swap that to a self-hosted face too. If `presetWebFonts` is used at all, set `provider: 'none'` so it just normalizes the family stack without fetching.
- Replace every `bg-main`/`text-main`/`text-accent`/`prose-link` shortcut. New shortcuts (all paint from CSS vars so theme toggle works for free):
  - `bg-paper`: `bg-[var(--paper)]`
  - `bg-bone`: `bg-[var(--bone)]`
  - `text-ink`: `text-[var(--ink)]`
  - `text-ink-soft`: `text-[var(--ink-soft)]`
  - `text-ink-mute`: `text-[var(--ink-mute)]`
  - `text-ink-faint`: `text-[var(--ink-faint)]`
  - `text-coral`: `text-[var(--coral)]`
  - `border-line`: `border-[var(--line)]`
  - `border-line-soft`: `border-[var(--line-soft)]`
  - `nav-link`: `text-ink hover:text-coral transition-colors duration-180`
  - `prose-link`: `text-ink no-underline border-b border-coral hover:text-coral transition-colors duration-180`
  - `btn-primary`: `inline-flex items-center gap-3 px-5.5 py-3.5 rounded-full bg-[var(--ink)] text-[var(--paper)] border border-[var(--ink)] font-sans font-600 text-3.25 tracking-[0.08em] uppercase hover:bg-coral hover:border-coral transition-all duration-200`
  - `btn-ghost`: same as `btn-primary` but `bg-transparent text-ink`
  - `pill`: `inline-flex items-center gap-2 px-4 py-2.25 rounded-full border border-[var(--ink)] font-sans font-600 text-3 tracking-[0.08em] uppercase`
  - `eyebrow`: `font-sans font-600 text-[10.5px] tracking-[0.32em] uppercase text-[var(--ink-faint)]`
  - `coord`: `font-mono text-[10.5px] tracking-[0.06em] uppercase text-[var(--ink-faint)]`
  - `roman`: `font-serif italic font-500`
- Drop these shortcuts entirely (no replacement): `bg-main`, `bg-surface`, `text-main`, `text-secondary`, `text-tertiary`, `text-muted`, `text-link`, `border-main`, `border-subtle`, `text-accent*`, `bg-accent*`, `border-accent`, `text-title`, `container-link`, `shadow-soft`, `shadow-elevated`, `glass`, `glass-subtle`, `hr-line`.
- Keep: `main-prose`, `main-wide`, `main-wider`, `main-full` (used by `BaseLayout`).

### New: `src/styles/tokens.css`

Holds all CSS custom properties — the canonical theme. Imported first in `BaseHead.astro`.

- `:root { … }` block with every Paper-mode token from `claudedocs/design_handoff_redesign/index.html:14-38` (paper/paper-warm/paper-dark/bone, ink/ink-soft/ink-mute/ink-faint, coral/coral-soft, mustard, olive, line/line-soft/line-faint, shadow, font-family vars).
  - Override the prototype's `--serif` and `--body` to `"Valkyrie B"` and `--sans` to `"Inter Tight"`, `--mono` stays `"DM Mono"`. We're not loading Playfair Display or JetBrains Mono.
- `html.dark { … }` block (NOT `body[data-theme="ink"]`) with every Ink override from `INK-THEME-ADDENDUM.md:18-33`. `--coral` stays `#ed6f5c`.

### `src/styles/global.css` (rewrite)

- Drop all `@font-face` declarations for Valkyrie A (unused).
- Keep `@font-face` for Valkyrie B (regular/italic/bold/bold-italic) and Valkyrie B Caps (regular/bold) — already in `public/fonts/WOFF2/`.
- Add `@font-face` declarations for **Inter Tight** (500, 600, 700; regular + italic) pointing at `/fonts/WOFF2/Inter Tight/*.woff2`. `font-display: swap`. These files need to be added to the repo before this rewrite lands.
- Remove the old `--color-accent` / `--color-divider` / dot-pattern variables.
- Body: `font-family: var(--body); background: var(--paper); color: var(--ink); font-size: 16px; line-height: 1.55;` (per prototype line 41-49).
- **Add `html { scroll-padding-top: 96px; }`** (height of `EdTopbar` + `EdNav` stacked). Without it, `/#work` and other anchor links land with the section heading hidden behind the sticky nav. If the nav height changes responsively, set it via a CSS var (`--nav-offset`) and override in media queries.
- **Add `::selection` rules** so text selection matches the palette: `::selection { background: var(--coral-soft); color: var(--ink); }` and the equivalent for `html.dark` (use a softer coral-on-ink tone, e.g. `rgba(237, 111, 92, 0.28)`).
- **Add a `:focus-visible` ring**: `:focus-visible { outline: 2px solid var(--coral); outline-offset: 2px; border-radius: 2px; }`. The default browser ring on coral/bone is ugly and fails on dark mode.
- Add the **paper grain overlay** on `body::before` exactly as in prototype line 53-64 (radial gradients + SVG noise filter + `mix-blend-mode: multiply; opacity: 0.9`). Add the `html.dark body::before` variant from `INK-THEME-ADDENDUM.md:45-53` (the two-gradient ink version with `mix-blend-mode: normal; opacity: 1`).
- **Mobile mitigation for the grain overlay.** SVG noise + `mix-blend-mode` on a full-viewport pseudo-element is a known mobile paint hot-path. Add `@media (max-width: 640px) { body::before { background-image: none; background: var(--paper-warm); opacity: 0.6; mix-blend-mode: normal; } }` (and the equivalent for `html.dark body::before`) so phones get a flat warm wash instead of the noise filter. Keep a `body[data-grain="off"] ::before { display: none }` escape hatch for debugging.
- Add the `[data-reveal]` rules from prototype line 487-488 (the scroll reveal animation).
- Add `@keyframes pulse` (prototype 103) and `@keyframes marquee` (prototype 301).
- `color-scheme` rules already exist; keep them.
- View transition CSS already exists; keep it.

### `src/styles/prose.css` (rewrite against new palette)

The serif body face stays Valkyrie B; the structure changes:

- `.prose` base: `font-family: var(--body); font-size: 17px; line-height: 1.6; color: var(--ink); letter-spacing: -0.003em`.
- Headings switch to `var(--serif)` with `font-weight: 500`, color `var(--ink)`; `em` inside headings becomes `color: var(--coral); font-style: italic`. Replace the uppercase Valkyrie B Caps treatment for h2/h3 — the new design uses serif italics for emphasis, not all-caps headings inside prose.
- Links: drop the underlined accent treatment. Use `color: var(--ink); border-bottom: 1px solid var(--coral); padding-bottom: 1px; hover { color: var(--coral) }`. This matches the editorial pattern in `.about-prose a` (prototype 313-314).
- Blockquote: switch the 4px accent border to `border-left: 2px solid var(--coral); background: var(--bone); padding: 1.25em 1.5em; font-style: italic; color: var(--ink-soft)`.
- Inline code: `font-family: var(--mono); background: var(--bone); padding: 0.125em 0.375em; border-radius: 3px; font-size: 0.875em`.
- Pre/code blocks: `background: var(--bone); border: 1px solid var(--line); padding: 1.25em 1.5em; font-size: 0.8125em; font-family: var(--mono)`. Drop the `shadow-soft` shadow.
- Tables: borders use `var(--line)`; thead font is `var(--caps)` size 11px tracking 0.18em uppercase.
- Lists: keep the custom bullets but recolor with `var(--coral)`.

### `src/styles/dot.css` — delete

The paper-grain overlay replaces the dotted background entirely. Remove the import from `BaseHead.astro` and remove `class="bg-dot"` from `BaseLayout.astro`.

### `src/components/BaseHead.astro`

- Import `tokens.css` first, then `global.css`, then `prose.css`. Drop `dot.css`.
- Update font preloads to add Inter Tight 500 + 600 (self-hosted; see `global.css`). Keep Valkyrie B regular + bold preloads.
- Update theme-color meta to `#efe7d2` light / `#15140f` dark (use a media-query meta pair).
- **Refresh brand assets alongside the meta-color flip.** The palette change makes the existing favicon, `apple-touch-icon`, and `manifest.json` `theme_color`/`background_color` look wrong. Tasks: (a) regenerate the favicon set against the Paper palette (italic-B mark, coral-on-bone or ink-on-paper); (b) update `manifest.json` `theme_color: "#efe7d2"`, `background_color: "#efe7d2"`; (c) update `apple-touch-icon.png` to match. Flag the OG/social card image as a Wave 3 follow-up — generate a new card matching the Paper hero (italic coral headline on bone, brand mark top-left).
- **Update the inline no-flash theme script.** Today's script almost certainly sets `data-theme` on `<body>` or `<html>`. With Ink wired to `html.dark` (per the decision above), the script must read `localStorage` / `prefers-color-scheme` and set `document.documentElement.classList.toggle('dark', isDark)` *before* first paint. Without this change the page paints in Paper, then snaps to Ink after `ThemeToggle` hydrates. Verify by checking that `useDark()` from `@vueuse/core` uses the same storage key (`vueuse-color-scheme` by default) — align the inline script to whatever `ThemeToggle.vue` reads.
- **Add the site-wide reveal observer here.** Inline `<script>` from prototype 1040-1058, wrapped so it runs on both first load *and* Astro view transitions: register on `astro:page-load` (fires on initial load and after every client-side navigation). DOMContentLoaded alone will only fire on hard loads and reveal animations will silently break after the first nav.

---

### Content schema migration (do in Wave 1, not Wave 3)

The Writing card on the homepage needs raw `year` and `month` values, which the current `date` Zod transform (string-only output) can't supply. Rather than reshape `date` into an object (which would force every existing caller to update its accessor and risk subtle bugs in RSS/posts utilities), **add a sibling `dateRaw: Date` derived value alongside the existing `date: string` format**. Lower-friction migration:

```ts
// src/content/config.ts
date: z.coerce.date().transform(d => formatDate(d)),   // existing
dateRaw: z.coerce.date(),                              // new
```

Then `WriteItem.vue` reads `post.data.dateRaw.getFullYear()` and `.toLocaleString('en', { month: 'short' }).toUpperCase()`, while all existing callers of `post.data.date` continue to work untouched. `rss.xml.ts` should switch to `dateRaw` for the proper RFC-822 `<pubDate>` (today it ingests the formatted string, which is technically invalid RSS — fix in the same commit).

For the `projects` schema extension (`stack`, `status`, `category`), keep all three optional with defaults (`status: z.enum(['active','archive']).default('active')`). Backfill existing entries per the §Pre-flight audit inventory.

---

## Wave 2 — Chrome & navigation

### Shared editorial primitives (introduce before pages)

Three small components are reused across the homepage and every inner page. Spec them once so the page sections can stay terse.

- **`src/components/EdSectionHeader.astro`** — the "§ I" treatment. Props: `numeral` (roman, e.g. `'I'`), `title` (string, may contain `<em>` for coral italic emphasis), `eyebrow?` (caps label, e.g. `'Selected work'`), `id?` (for anchor target). Renders the same markup used in prototype 695-700, 740-745, etc. Used in 6+ places (homepage About / Work / Writing / Now / Contact, blog index, projects index, post & project headers). Astro component — no hydration needed.
  - **Heading semantics.** The `§ I` numeral is decorative — wrap it in `<span class="numeral" aria-hidden="true">`. The eyebrow caps label, if present, sits *outside* the heading element (also as a decorative span). Only the `title` text lives inside `<h2>`. This prevents screen readers from announcing "Section I Selected work — Selected work" (numeral + eyebrow + title triple-read). Result for the Work section: SRs hear "heading level 2, Selected work — Field notes from the bench"; sighted users see `§ II · SELECTED WORK · Selected work — Field notes from the bench`. The post/project detail variants that use `<h1>` instead of `<h2>` accept a `level?: 1 | 2` prop (default `2`).
- **`src/components/WorkCard.vue`** — single work-card row. Props: `idx` (string, e.g. `'01'`), `category`, `name` (may contain italic emphasis HTML), `stack?`, `blurb`, `status` (`'active' | 'archive'`), `href`. Renders prototype 753-895 row markup. Reused by homepage Selected Work *and* `/projects` index — single component, no duplication. Cards must render gracefully when `stack` or `category` is missing (omit the row rather than render an empty cell).
- **`src/components/WriteItem.vue`** — single writing-card row. Props: `year`, `month`, `name`, `desc`, `tags` (string[]), `href`. Reused by homepage Writing section *and* `/blog` index. Replaces the old year-divider hero treatment in `ListPosts.vue` (which gets rewritten to map over `WriteItem`).

These three components are the source of truth — `index.astro`, `blog/[...path].astro`, `projects/index.astro`, etc. all consume them rather than re-implementing the markup.

### New: `src/layouts/EditorialLayout.astro`

A new sibling to `BaseLayout.astro`. Wraps the page in the full editorial chrome. Becomes the layout for every page.

Structure (copy from prototype `index.html:546-602`, then 1037 closing):
```
<body class="editorial">
  <a href="#main" class="skip-link">Skip to content</a>
  <EdSideRails />            <!-- fixed, hidden < 980px -->
  <div class="shell">        <!-- z-index: 2, sits above ::before grain -->
    <EdTopbar />
    <EdNav workCount={workCount} writingCount={writingCount} />
    <slot />
    <EdFooter />
  </div>
</body>
```

Props:
- `title`, `description`, `image` — passed to `BaseHead` (same shape as today).
- `mainWidth: 'prose' | 'wide' | 'wider' | 'full'` — width modifier applied to a `<main id="main" class="container">` *inside* the slot for inner pages. The homepage will not use `<main>` and provides its own full-bleed sections — but it must still expose an `id="main"` anchor on its first focusable region (the hero) so the skip-link works.
- `bodyClass?: string` — escape hatch for the homepage to add e.g. `editorial homepage`.

**Skip-to-content link.** First focusable element in the document. Visually hidden by default (`position: absolute; left: -9999px; top: 0;` plus `clip` fallback), but on `:focus-visible` it pops into the top-left as a coral pill on paper background, above the topbar (`z-index: 100`). Without this, keyboard users tab through the entire topbar + nav + side rail metadata before reaching content on every navigation. Add the CSS to `global.css` alongside the `:focus-visible` rule.

**Nav badge counts (computed, not from siteConfig).** A static `siteConfig` module cannot call `getCollection()` at import time, so badge numbers must be resolved at the layout level. `EditorialLayout.astro` computes them once per page render:
```astro
---
import { getCollection } from 'astro:content';
import { getPosts } from '~/utils/posts';
const workCount = (await getCollection('projects')).filter(p => !p.data.draft).length;
const writingCount = (await getPosts()).length;
---
```
and passes them as props to `<EdNav workCount={workCount} writingCount={writingCount} />`. Drop the `badge` field from `siteConfig.header.navLinks` entirely — it's authoritative-looking but inert. `EdNav` merges the counts in at render time by link `text`.

**ViewTransitions are required, not optional.** The reveal observer (in `BaseHead`) and the anchor-scroll intercept (in `EdNav` / `EdFooter`) both subscribe to `astro:page-load`. That event **only fires when `<ViewTransitions />` is mounted in the head**. Without it, both behaviors silently break on internal navigation. Add `import { ViewTransitions } from 'astro:transitions';` and render `<ViewTransitions />` inside `<BaseHead>` (or directly in `EditorialLayout`'s `<head>` slot). Verify: (a) the inline no-flash theme script still runs on transitions — wrap its body in a function and call it on both initial load *and* `document.addEventListener('astro:after-swap', fn)`, since the script tag is replaced during transitions; (b) `useDark()` from `@vueuse/core` survives — its listener is on `window`/`document`, not on the swapped DOM, so it persists across transitions but the `html.dark` class set by the inline script must be re-applied via `astro:after-swap`. If wiring view transitions cleanly turns out to be too invasive in this branch, fall back to: disable view transitions entirely, fire reveal observer / hash-scroll on `DOMContentLoaded` + `popstate`, and accept that internal navigations are hard loads. The fall-back must be an explicit decision, not a default.

Old `src/layouts/BaseLayout.astro` is repurposed: it now just renders `EditorialLayout` and forwards props. Pages don't need to change their imports yet.

### New: `src/components/EdSideRails.vue`

Two fixed strips, left and right, with rotated uppercase metadata. Hidden under 980px.
- Right rail text: `BW — Vol. 01 · Issue Nº 03 · 2026 · MIT` (prototype line 550).
- Left rail text: `Reasoning · Local-first · Physical computing · Prototyping` (prototype line 553).
- All CSS comes from prototype lines 70-86.
- Static markup; no client directive needed (`client:load` not required — rendered server-side).

### New: `src/components/EdTopbar.vue`

Thin strip above the nav. Reads from `siteConfig` for the live-status string + locale.
- Left: `BW / 2026 · Vol. 01 / Issue Nº 03` (these become `siteConfig.editorial.issue`, hardcoded for now).
- Middle (hidden < 980px): `Filed under Code · Intelligence` + `Berlin, VA · Made on Earth`.
- Right: pulse dot + live status link to `#now` + EN locale.
- CSS from prototype 89-105. Pulse keyframe is in `global.css`.

### New: `src/components/EdNav.vue`

Sticky header. Replaces the existing `Header.vue` + `NavDrawer.vue` + the standalone `ThemeToggle` usage in `BaseLayout`.

- Left: brand mark (38px circle with italic serif "B") + brand name ("Brennon Williams") + brand-meta column (`Studio of One` + `Software · Reasoning · Hardware`). The whole brand cluster is a single `<a href="/">` — give it `aria-label="Brennon Williams — home"` because the italic-B glyph alone isn't a usable screen-reader label.
- Center: `<ul class="nav-links">` with Work / Writing / Now / Contact. The mono superscript counts (rendered next to Work and Writing) come from props (`workCount`, `writingCount`) passed by `EditorialLayout` — see "Nav badge counts" above. `EdNav` does not read `siteConfig` for these numbers; it merges them in by matching the link `text` field. If a count prop is `undefined`, render no badge (don't emit a stale literal).
- Right: ghost pill button "GitHub", primary pill button "Get in touch" (mailto), olive status dot, plus `<ThemeToggle />` (existing Vue component — re-skin per "Critical files" but keep the `useDark()` logic; verify its storage key matches the `BaseHead` no-flash script).
- CSS from prototype 108-147.
- **Anchor links from non-home pages.** Nav targets `/#work`, `/#about`, `/#contact` work via the browser's native hash scroll on `/` but require a full nav from `/blog`, `/projects`, etc. The intercept lives in a shared composable `src/composables/useHashScroll.ts` (see below) and is consumed by both `EdNav.vue` and `EdFooter.vue` — duplicating the logic in each component is fragile because the two will drift. The composable returns a single `onClick(event)` handler that components attach to any `<a>` whose `href` starts with `/#`.
- Mobile (< 980px): collapse `.nav-links` and `.brand-meta`. Reveal a mobile drawer trigger button (see `NavDrawer.vue` rebuild below for full spec) that opens the redesigned `NavDrawer.vue`. The topbar stays visible on mobile (the prototype's middle column hides < 980px but the left/right strips remain).
- **`useHeaderScroll`** composable still applies for hide-on-scroll. **Update the composable's class targets**: today it toggles classes against the `header.glass` element rendered inside `Header.vue`. Change it to query `.nav` (the new sticky element inside `EdNav.vue`) and toggle a `.nav--hidden` modifier; update the CSS in `EdNav.vue` to translate the nav up by its own height when `.nav--hidden` is present. Without this change hide-on-scroll silently breaks.

Hydration: `client:idle` (matches today's `Header`).

### New: `src/components/EdWire.vue`

The "From the workshop" marquee. Lives between the hero and the first section on the homepage **only** — do not put it in the global layout.

- Left label box: pulsing coral dot + `From the workshop` / `Active threads · 06 in flight`.
- Track: nine items from prototype 673-689, duplicated for seamless loop. Use the prototype's exact handles/coords/roles for now (the user picked "Hybrid" — marquee uses prototype copy).
- CSS from prototype 292-306.
- **Reduced motion is required, not optional.** Wrap the marquee animation in `@media (prefers-reduced-motion: no-preference) { … }` so the `animation: marquee 60s linear infinite` only applies when motion is allowed. Under reduced motion the track sits static at its starting position; consider showing the first ~5 items inline and visually truncating the rest with the existing edge mask.

### New: `src/composables/useHashScroll.ts`

Shared anchor-intercept logic. Returns `{ onHashClick(event) }`. Behavior:
- If the link's `href` starts with `/#` *and* `window.location.pathname === '/'`: `event.preventDefault()`, locate the target by id, call `scrollIntoView({ behavior: 'smooth', block: 'start' })`, and update `history.replaceState(null, '', href)` so the URL reflects the hash without a re-scroll fight.
- If the link's `href` starts with `/#` and the user is *not* on `/`: let Astro navigate, then register a one-shot `document.addEventListener('astro:page-load', handler, { once: true })` that pulls the hash off the destination URL, queries the element, and `scrollIntoView`s it. If `<ViewTransitions />` is disabled (per the fall-back path in `EditorialLayout`), this listener never fires — fall back to inspecting `location.hash` on mount of the destination page (a `useHashScroll().onMount()` helper attached to a layout-level lifecycle).
- Respect `prefers-reduced-motion: reduce` by switching `behavior: 'smooth'` → `'auto'`.
- Both `EdNav.vue` and `EdFooter.vue` import and use this composable. Do not inline the logic in either component.

### Rebuild: `src/components/NavDrawer.vue`

Re-skin + add the mobile trigger. Keep the existing slide-in / overlay behaviour.

**Drawer trigger button** (lives inside `EdNav.vue`, only visible < 980px; the trigger is spec'd here so all drawer-related UI is in one place):
- Markup: `<button type="button" class="nav-drawer-trigger" :aria-expanded="isOpen" aria-controls="nav-drawer" aria-label="Open navigation menu">…</button>`. When the drawer is open, update `aria-label` to "Close navigation menu" and `aria-expanded="true"`.
- Icon: two stacked 1.5px horizontal rules (a minimalist "≡" — not three; the editorial palette reads cleaner with two). 22px wide, 14px tall, `currentColor`. Render as inline SVG so it inherits `color: var(--ink)` and flips to coral on hover/focus. No icon library dependency — the existing UnoCSS `presetIcons` is overkill for one mark.
- Placement: rightmost element in the nav row at `< 980px`, after `ThemeToggle` hides (or alongside it — keep theme toggle visible on mobile, drawer trigger to its right). Sits at the same vertical baseline as the brand cluster.
- States: default `color: var(--ink); background: transparent; border: none; padding: 8px;`; hover/focus `color: var(--coral)`; open `color: var(--coral)`.
- Focus ring: inherits the global `:focus-visible` ring.
- Tap target: minimum 44×44px hit area (pad as needed). Do not rely on the 22×14 visual size — that fails WCAG 2.5.5.

**Drawer panel** (the existing slide-in):
- Drawer: `background: var(--paper); border-right: 1px solid var(--line)`.
- Items: serif 22px, hover color `var(--coral)`.
- Add the same Work/Writing/Now/Contact links plus social links underneath. No more `nav-link` opacity treatment.
- The drawer's own internal anchor links (`/#work` etc.) also use `useHashScroll` — same intercept, same behavior, and the drawer should close after a same-page hash scroll fires.

### Rebuild: `src/components/EdFooter.vue` (replaces `Footer.vue`)

The 4-column editorial footer from prototype 993-1035. Updates needed vs. prototype:
- Index column links to actual routes: About (`/#about`), Selected Work (`/#work`), Writing (`/blog`), Now (`/now`), Contact (`/#contact`). **Footer anchor links use the same `useHashScroll` composable as `EdNav`** — without it, clicking "Work" or "Contact" from `/blog` lands at the anchor with no smooth scroll on hard nav and silently misbehaves under view transitions. Do not duplicate the intercept logic; import the composable.
- Elsewhere column reads from `siteConfig.socialLinks` plus two extra hardcoded entries (little-loops.ai, deep-codebase.com).
- Colophon column: update font names to **Valkyrie B / Inter Tight / DM Mono** to match what we actually load (not Playfair/Inter/JetBrains).
- Bottom strip: `© 2026 Brennon Williams · MIT · Made on Earth` and `Vol. 01 · Issue Nº 03 · Last build {hash}`. **Wire the build hash via Vite `define`** in `astro.config.mjs`:
  ```js
  import { execSync } from 'node:child_process';
  // ...
  vite: {
    define: {
      __BUILD_HASH__: JSON.stringify(
        execSync('git rev-parse --short HEAD').toString().trim()
      ),
    },
  },
  ```
  Add a matching `declare const __BUILD_HASH__: string;` to `src/env.d.ts` so TS doesn't complain. Footer renders `{__BUILD_HASH__}`. Don't punt this to "hardcode for now" — it always rots.
- CSS from prototype 465-483.

### `src/composables/useHeaderScroll.ts`

Update the element selector and toggled class names: query `.nav` (rendered by `EdNav.vue`) instead of `header.glass`, and toggle a `.nav--hidden` modifier instead of the old class. The scroll-direction logic itself is unchanged. Without this update hide-on-scroll silently no-ops because the target element no longer exists.

---

## Wave 3 — Pages

### Site config: `src/site-config.ts`

- `header.navLinks` becomes the four prototype links. **No `badge` field** — badge counts are computed in `EditorialLayout` and passed to `EdNav` as props (see §EditorialLayout "Nav badge counts"). A static module can't call `getCollection()` at import time, and hardcoded badges drift the moment content is published.
  ```ts
  navLinks: [
    { text: 'Work',    href: '/#work'    },
    { text: 'Writing', href: '/blog'     },
    { text: 'Now',     href: '/now'      },
    { text: 'Contact', href: '/#contact' },
  ]
  ```
- Add `editorial: { volume: 'Vol. 01', issue: 'Nº 03', filedUnder: 'Code · Intelligence', location: 'Berlin, VA · Made on Earth', liveStatus: 'shipping little-loops v0.4' }`.
- Add `now` array (used by homepage §IV and `/now` page). Shape:
  ```ts
  now: Array<{
    kind: string;     // caps eyebrow, e.g. 'Building'
    title: string;    // serif H4, may contain <em>
    detail: string;   // body sentence
    meta?: string;    // mono coord line, e.g. 'v0.4 · this week'
  }>
  ```
  Seed with the four entries from prototype 940-972 verbatim (user picked Hybrid → prototype copy).
- Add or confirm `email: string` (used by Contact pill, footer, mailto buttons). If email already lives under `author.email`, either move it to top-level or update the plan's references to read `siteConfig.author.email` everywhere consistently.
- `header.logo` no longer needed (brand mark is rendered inline). Keep the favicon reference but rename to `siteConfig.favicon`.
- Update `subtitle` to "I wonder what the machines think." to match the prototype hero (or leave existing if user prefers — flagged for review).

### Homepage: `src/pages/index.astro` (full rewrite)

Pulls together everything. Mirrors prototype 604-990 section by section:

1. **Hero** (`#top`) — exact prototype layout 605-662. Label "Notes from the workshop · Nº 03"; H1 "I wonder what the **machines** think." (italic coral); lead paragraph from prototype 610; two buttons; stats ring (3 cells); foot row with the keyboard hint + `38.89° N · 77.03° W`; right side: portrait plate using Astro `<Image />` (`import headshot from '~/assets/images/profile/brennon-headshot-bw-stylized.png'`) with corner brackets + four annotation tags + 4-cell index strip. Use `<Image src={headshot} alt="Portrait of Brennon Williams" widths={[480, 720, 1080]} sizes="(max-width: 820px) 90vw, 480px" />` — do **not** copy the file into `public/`; the asset must flow through Astro's image optimizer.
   - **Stats ring values are computed, not hardcoded.** Cell 1 = `${getCollection('projects').filter(p => !p.data.draft).length} projects` (matches the Work nav badge — single source of truth, no drift). Cell 2 = `15+ years` (hardcoded; manually bumped). Cell 3 = `1 good dog` (hardcoded). The prototype's `13` was illustrative — show the real count.
   - **Keyboard hint** in the hero foot row is **decorative only** for v1 (no real shortcut wired). The prototype's "Press / to search" copy is misleading — it visually promises a feature that doesn't exist, and `aria-hidden` only hides it from SRs, not from sighted users who'll try the shortcut and find nothing. Replace the copy with something non-actionable that still anchors the foot row visually: e.g. `Filed 2026 · Issue Nº 03` or `Field notes · ongoing` styled in `var(--caps)` 10.5px with `var(--ink-faint)`. If a command palette is wired later (Wave-N follow-up), restore the original copy at that point. Keep `aria-hidden="true"` on the element regardless — it's decorative meta, not navigation.
   - **Mobile degradation (≥ portrait phones, < 820px).** Single column with the portrait plate above the text block. Corner brackets stay (they read as decoration, not data). The four annotation tags hide entirely (they overflow and crowd at this width). The 4-cell index strip collapses to a 2-col grid below the plate. Stats ring stays 3-col until < 480px, then stacks. The foot row's coord text wraps to its own line.
2. **Wire marquee** — `<EdWire />`.
3. **About** (`#about`) — Section header §I + 2-col grid: serif prose paragraphs + dispatch table aside. Prototype 694-737.
4. **Selected Work** (`#work`) — `<EdSectionHeader numeral="II" ... />` + grid of `<WorkCard />` instances. **Pull cards from the `projects` content collection**, sorted by status (active first), then by an explicit `order` or date. Iteration: `const projects = (await getCollection('projects')).filter(p => !p.data.draft); const featured = projects.slice(0, 8);`.
   - **Empty / sparse-state guards.** If `projects.length === 0`, render a single italic serif line ("No projects published yet — back soon.") inside the grid container instead of an empty grid. If `0 < projects.length < 8`, render however many exist and *omit* the "N more in the archive" caption (`featured.length === projects.length` → no caption). Caption only appears when `projects.length > 8` and reads `${projects.length - 8} more in the archive` (computed, never hardcoded).
   - The schema migration that adds `stack`/`status`/`category` is already specified in §"Content schema migration" (Wave 1) — no further work here.
5. **Writing** (`#writing`) — `<EdSectionHeader numeral="III" ... />` + 2-col grid of `<WriteItem />` pulled from `getPosts().slice(0, 2)`. `WriteItem` consumes the `dateRaw` field added in Wave 1 to derive year + month locally. Prototype 898-936.
   - **Empty / sparse-state guards.** If `getPosts().length === 0`, hide the entire Writing section (don't render the section header at all — an empty §III reads as broken). If `length === 1`, render a single card spanning both columns rather than a card + an empty cell.
6. **Now** (`#now`) — Section header §IV + 4-col strip. Hardcoded from prototype 938-973 (user picked Hybrid → prototype copy for Now). Each cell pulls from a new `siteConfig.now` object so it can be updated without touching the template.
7. **Contact CTA** (`#contact`) — H2 from prototype 980; email pill linking to `siteConfig.email`; sub-note. Prototype 975-990.

Side rails, topbar, nav, footer all come from `EditorialLayout`. The marquee, hero, and all sections sit in the layout slot.

Add the **reveal observer** script at the bottom of `index.astro` as inline `<script>` from prototype 1040-1058. (Or move it into `BaseHead.astro` so it applies site-wide; recommended.)

### New: `src/pages/now/index.astro`

A page that mirrors the homepage's Now section but expanded. For v1, a single `<EditorialLayout>` page with the same 4-col now-strip from `siteConfig.now`, a longer prose intro, and a "Last updated" coord line. `mainWidth="wide"`.

### Blog index: `src/pages/blog/[...path].astro`

- Wrap in `EditorialLayout` (`mainWidth="wide"`).
- Use `<EdSectionHeader numeral="I" title="Writing — Notes from the workshop" />`.
- `ListPosts.vue` rebuild — drop the year-divider hero text and map over `<WriteItem />` (the same component used on the homepage). Mono `y` cell handled inside `WriteItem`.

### Post detail: `src/pages/posts/[...slug].astro`

- Wrap in `EditorialLayout` (`mainWidth="prose"`).
- Article header: roman §, serif H1 title, italic serif description, mono meta row (`coord` styling).
- TOC sidebar (already exists): re-skin only — caps eyebrow heading, mono text 12px, hover border-left 2px coral. No structural change.
- Body content renders through `.prose` which we already retokenized in Wave 1.

### Projects index: `src/pages/projects/index.astro`

- Wrap in `EditorialLayout` (`mainWidth="wider"`).
- `<EdSectionHeader numeral="II" title="Selected work — Field notes from the bench" />`, then a `work-grid` of `<WorkCard />` covering *all* non-draft projects, sorted by status (active first), then chronologically. Same component as the homepage — single source of truth, no duplicate markup.

### Project detail: `src/pages/projects/[...slug].astro`

- Wrap in `EditorialLayout` (`mainWidth="prose"`).
- Header: roman §, eyebrow with category, serif H1 with optional italic emphasis, stack mono row, status pill, primary link button.
- Body content through `.prose`.

### `src/pages/[...slug].astro` (generic pages)

Wrap in `EditorialLayout` with `mainWidth="prose"`. Add a serif H1 + roman § wrapper around the content. Minimal change.

### Other pages

- `src/pages/404.mdx` — re-skin properly. Inside the full editorial chrome (side rails, topbar, nav) a blank "404" reads as broken. Give it: roman `§ 404` eyebrow, serif H1 ("This page didn't make the cut."), an italic serif sub-line, mono coord row, and two pill buttons ("Back to the workshop" → `/`, "Read the writing" → `/blog`). Wrap in `EditorialLayout` with `mainWidth="prose"`. No marquee.
- `src/pages/_index.astro.backup` — delete (orphan backup file).
- `src/pages/robots.txt.ts` — no design changes.
- `src/pages/rss.xml.ts` — switch from `post.data.date` (formatted string) to `post.data.dateRaw` (Date). The current feed emits the human-formatted string in `<pubDate>`, which is invalid per RSS 2.0; the new `dateRaw` is a proper `Date` and serializes correctly.

---

## Cleanup / file deletions

- `src/styles/dot.css` — delete.
- `src/components/Header.vue` — delete (replaced by `EdNav.vue`).
- `src/components/Footer.vue` — delete (replaced by `EdFooter.vue`).
- `src/pages/_index.astro.backup` — delete.
- `public/fonts/WOFF2/Valkyrie A/`, `Valkyrie A Caps/`, `+ OT family/`, `+ Tab variants/` — delete (unused) **only after confirming no remaining @font-face references**.

---

## Critical files

Touched directly:

| File | Action |
|---|---|
| `uno.config.ts` | Rewrite theme + shortcuts |
| `src/styles/tokens.css` | **NEW** — all CSS variables |
| `src/styles/global.css` | Rewrite — fonts, grain overlay, keyframes |
| `src/styles/prose.css` | Rewrite — typography against new palette |
| `src/styles/dot.css` | **DELETE** |
| `src/components/BaseHead.astro` | Update imports, font preloads, theme-color |
| `src/layouts/BaseLayout.astro` | Delegate to `EditorialLayout` |
| `src/layouts/EditorialLayout.astro` | **NEW** |
| `src/components/EdSideRails.vue` | **NEW** |
| `src/components/EdTopbar.vue` | **NEW** |
| `src/components/EdNav.vue` | **NEW** (replaces `Header.vue`) |
| `src/components/EdWire.vue` | **NEW** |
| `src/components/EdFooter.vue` | **NEW** (replaces `Footer.vue`) |
| `src/components/EdSectionHeader.astro` | **NEW** — `§` numeral + serif H2 primitive, reused site-wide |
| `src/components/WorkCard.vue` | **NEW** — single work-card row; reused by homepage + `/projects` |
| `src/components/WriteItem.vue` | **NEW** — single writing-card row; reused by homepage + `/blog` |
| `src/components/NavDrawer.vue` | Re-skin only |
| `src/components/ThemeToggle.vue` | Re-skin (icon + color), keep `useDark()` logic |
| `src/components/ScrollToTop.vue` | Re-skin — pill button in `--ink`. **Position: bottom-right, with `right: 64px` ≥ 980px** to clear the right side rail (which sits at `right: 0` / `width: ~40px`). Below 980px, side rails are hidden and ScrollToTop can return to `right: 24px`. Use a CSS media query, not JS. |
| `src/components/ListPosts.vue` | Rebuild as `write-item` cards |
| `src/components/ListProjects.vue` | Rebuild as `work-card` rows; reuse on homepage + projects index |
| `src/pages/index.astro` | Full rewrite per prototype |
| `src/pages/now/index.astro` | **NEW** |
| `src/pages/blog/[...path].astro` | Re-skin against editorial chrome |
| `src/pages/posts/[...slug].astro` | Re-skin header + TOC |
| `src/pages/projects/index.astro` | Rebuild with `work-card` grid |
| `src/pages/projects/[...slug].astro` | Re-skin header |
| `src/pages/[...slug].astro` | Wrap in editorial layout |
| `src/site-config.ts` | New nav links, `editorial` + `now` objects; confirm/add `email` |
| `src/content/config.ts` | Add `stack`, `status`, `category` to project schema; add `dateRaw: Date` sibling to blog schema |
| `astro.config.mjs` | Add Vite `define` for `__BUILD_HASH__` |
| `src/env.d.ts` | Declare `__BUILD_HASH__` global |
| `public/favicon*.png`, `public/apple-touch-icon.png`, `public/manifest.json` | Regenerate against Paper palette; update `theme_color` / `background_color` to `#efe7d2` |
| `src/composables/useHashScroll.ts` | **NEW** — shared anchor intercept used by `EdNav` + `EdFooter` + `NavDrawer` |
| `public/fonts/WOFF2/Inter Tight/*.woff2` | **NEW** — 6 self-hosted WOFF2 files (pre-Wave-1 asset task; see Pre-flight §5) |

Reused as-is:
- `src/composables/useHeaderScroll.ts`
- `src/utils/posts.ts` (`getPosts()`)
- `src/utils/link.ts`
- All Valkyrie B / Valkyrie B Caps WOFF2 files in `public/fonts/WOFF2/Valkyrie B*/`
- `@vueuse/core` `useDark()` for theme toggling

Reference (do not edit): `claudedocs/design_handoff_redesign/index.html`, `README.md`, `INK-THEME-ADDENDUM.md`, `assets/brennon-headshot.png`.

---

## Verification

Run after each wave; the site should be functional throughout.

1. **Dev server** — `npm run dev` (port 1977). Open `http://localhost:1977/`.
2. **Visual parity with prototype**:
   - Hero matches the Paper screenshot (`screenshots/screenshot-light.png`). Coral italics, portrait plate corners, stats rings, hero foot meta.
   - Marquee scrolls seamlessly (no jump every 60s) and is masked at both edges.
   - Side rails appear ≥ 980px, hidden < 980px.
   - Paper grain visible but subtle; test with `body[data-grain="off"]` query toggle in devtools to confirm overlay is what's adding the texture.
3. **Theme toggle** — click `ThemeToggle`; `html.dark` is added; tokens flip to Ink; grain overlay switches to the 2-gradient + `mix-blend-mode: normal` version; coral stays visible; portrait plate's `mix-blend-mode` is acceptable in dark (consider `screen` per addendum §"Elements That Need Explicit Overrides" if it looks muddy).
4. **Responsive**:
   - < 980px: nav links collapse, brand-meta hides, hero → 1-col, work cards → 1-col.
   - < 820px: container padding drops to 22px, footer → 2-col, now → 2-col.
   - < 480px: footer → 1-col, now → 1-col.
5. **Routes** — verify every page renders without error: `/`, `/blog`, `/blog/writing`, a post detail, `/projects`, a project detail, `/now`, `/404` (force).
6. **Type & lint** — `npm run build` (no errors); `npm run lint` (no errors).
7. **Reduced motion** — set `prefers-reduced-motion: reduce` in devtools; reveal animations should fire immediately on load (`data-revealed` set on all `[data-reveal]` elements via the script's reduce-motion branch). **Marquee must be static under reduced-motion** (the `animation: marquee 60s …` rule is wrapped in `@media (prefers-reduced-motion: no-preference)` per Wave 2) — confirm the track does not animate at all in this mode, and that the edge mask still hides the overflow cleanly.
8. **View transitions** — navigate `/` → `/blog` → back. Reveal animations re-fire on the destination page (confirms the `astro:page-load` wiring). Anchor links from `/blog` (e.g. clicking "Work" in nav) navigate home *and* scroll to `#work` after load.
9. **No-flash theme toggle** — hard-refresh `/` with system in dark mode and `localStorage` empty. The page should paint in Ink immediately — no Paper flash. Then toggle to light, refresh: should paint Paper. This confirms the inline `BaseHead` script and `useDark()` agree on storage key.
10. **Accessibility quick pass** — coral-on-paper / coral-on-bone contrast was pre-checked before Wave 1 (see Pre-flight §6); re-verify the rule held (no body-text coral landed). Topbar uppercase text uses semantic markup; side rails have `aria-hidden="true"`; brand-mark link in `EdNav` has `aria-label="Brennon Williams — home"`; hero meta foot row text has `aria-hidden="true"`; hero portrait `<Image />` has alt text; `:focus-visible` ring renders on tab through nav and CTAs.
   - **Skip-to-content link.** Hard-refresh `/` and press Tab once: the first focusable element should be a coral "Skip to content" pill in the top-left, above the topbar. Activating it (Enter) jumps focus to `#main` (or the hero on the homepage). Repeat on `/blog`, a post detail, and `/projects`.
   - **EdSectionHeader semantics.** Open VoiceOver / NVDA on the homepage and rotor to headings. Confirm: "heading level 2, Selected work — Field notes from the bench" (not "Section II Selected work Selected work — Field notes from the bench"). Numeral and eyebrow are not announced.
   - **Mobile drawer trigger.** At ≤ 980px, Tab to the drawer trigger button: it should announce as "Open navigation menu, button, collapsed" (or equivalent). Activate → drawer opens, label flips to "Close navigation menu", focus moves into the drawer.
11. **View transitions wired.** Confirm `<ViewTransitions />` is mounted in `EditorialLayout` (or fall-back path is documented and the reveal observer / hash scroll listen for `DOMContentLoaded` + `popstate`). Navigate `/` → `/blog` and check the DOM head for the transitions stylesheet. Open devtools console and verify `astro:page-load` fires on internal navigation (not just hard loads).
12. **Anchor offset & footer intercept** — click `Work` / `Writing` / `Contact` in the `EdNav` from `/blog`; then repeat the same clicks in the `EdFooter` Index column. Both should navigate `/` → smooth-scroll to the target section, with the heading sitting *below* the sticky `EdNav` (validates `scroll-padding-top` *and* that `EdFooter` consumes `useHashScroll`). If only the nav variant works, the footer is missing the composable.
13. **Selection color** — drag-select prose on a post detail page; selection background uses `--coral-soft` in light, `rgba(237,111,92,0.28)` in dark.
14. **Empty/sparse content states** — temporarily set all but 1 post to `draft: true` and reload `/`: Writing card spans both columns, no empty cell. Set all to draft: Writing section hides entirely (no orphan header). Same for projects: only 5 published → grid renders 5 cards, no "N more" caption. Also verify nav badge counts update accordingly (computed counts, not hardcoded).
15. **Sitemap & RSS** — `npm run build`, then check `dist/sitemap-0.xml` includes `/now`. Check `dist/rss.xml` `<pubDate>` values are proper RFC-822 strings (not human-formatted), confirming the `dateRaw` switch landed.
16. **Build hash** — footer colophon renders a 7-char git short hash, not literal `{hash}` or `undefined`.
17. **Brand assets** — Paper favicon visible in browser tab in light mode; on iOS "Add to Home Screen", the apple-touch-icon shows the new mark; `manifest.json` `theme_color` matches Paper.
18. **Inter Tight loaded.** Open devtools → Network → filter by Font. Confirm `InterTight-Medium.woff2`, `InterTight-SemiBold.woff2`, etc. are served from `/fonts/WOFF2/Inter Tight/` with `200`, not `404`. A 404 here means the pre-Wave-1 asset task (Pre-flight §5) was skipped — UI sans falls back to system fonts and the editorial look breaks subtly across nav, pills, and footer.
19. **MCP screenshot diff** (optional) — open the prototype `index.html` in a browser and the new homepage side-by-side at 1440 width; spot-check the section header §, work card grid (col widths `80px 1.1fr 1.4fr auto`), and footer 4-col widths (`1.4fr 1fr 1fr 1fr`).
20. **Preview deploy before merge.** Waves 1+2 land as ~15 files in a single PR with no soft-rollback. Build the branch via the same CI path as production (`npm run build && npx serve dist`) and step through every route in §11.5 before merging to `main`. Don't trust a green `npm run build` alone — the editorial chrome is mostly runtime, not build-time.

End state: the site looks like the prototype's Paper screenshot in light mode and the Ink screenshot in dark mode, with real content driving the Work and Writing sections.
