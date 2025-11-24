# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website/portfolio built with **Astro 4**, using **Vue 3** components and **UnoCSS** for styling. The site features a blog with markdown content, a projects page, and responsive design with dark mode support.

**Key Technologies:**
- Astro 4 (SSG framework)
- Vue 3 (component library)
- UnoCSS (utility-first CSS)
- MDX (enhanced markdown)
- TypeScript

## Development Commands

```bash
# Development server (runs on port 1977)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Linting
npm run lint         # Check for errors
npm run lint:fix     # Auto-fix linting errors

# Version bumping (for releases)
npm run release
```

## Architecture

### Content Management System

**Content Collections** (`src/content/config.ts`):
- **blog**: Blog posts with frontmatter (title, date, description, duration, tag, draft status)
- **pages**: Static pages like "Markdown Style" and "Posts Props"

**Blog Organization**:
Blog posts are organized in `/src/content/blog/` with subdirectory support.

Currently implemented:
- `writing/` - Blog posts and articles

Configured blog categories (src/site-config.ts):
- Writing (`/blog`)
- Notes (`/blog/notes`)
- Talks (`/blog/talks`)

Note: Category routes exist even if directories are empty.

**Content Schema**:
- `date`: Auto-transformed to formatted string (e.g., "Jan 15, 2025")
- `draft`: Posts with `draft: true` are hidden in production
- `redirect`: Optional redirect URL
- `tag`: Category/topic tag
- `duration`: Reading time estimate

### Routing System

**Dynamic Routes**:
- `/posts/[...slug].astro`: Blog post detail pages (uses `getPosts()` for SSG)
- `/blog/[...path].astro`: Blog listing pages with path-based filtering
- `/[...slug].astro`: Generic page routing for content collection pages

**Static Routes**:
- `/`: Homepage (`src/pages/index.astro`)
- `/projects`: Projects listing (`src/pages/projects/index.astro`)
- `/robots.txt.ts`: Auto-generated robots.txt
- `/rss.xml.ts`: Auto-generated RSS feed

### Styling Architecture

**UnoCSS Configuration** (`uno.config.ts`):
- **Custom Shortcuts**: Semantic class names for common patterns
  - `bg-main`: Background color (light/dark mode aware)
  - `text-main`: Text color (light/dark mode aware)
  - `text-link`: Link text color (dark mode aware)
  - `text-title`: Title styling (text-link text-4xl font-800)
  - `border-main`: Border color theming (truegray-300/truegray-600)
  - `nav-link`: Navigation link styling with hover effects
  - `prose-link`: Prose content link styling
  - `container-link`: Container link with background hover effects
  - `hr-line`: Horizontal rule styling

- **Font Configuration**:
  - Sans-serif: "Valkyrie A" (custom font)
  - Monospace: "DM Mono"

- **Theme System**: Light/dark mode handled via CSS custom properties and UnoCSS dark: variants

**Global Styles** (`src/styles/`):
- `global.css`: Base styles and CSS variables
- `prose.css`: Typography styles for markdown content
- `dot.css`: Dotted background pattern (`.bg-dot` class)

### Component Architecture

**Astro Components**:
- `BaseHead.astro`: SEO meta tags, fonts, analytics
- `BaseLayout.astro`: Main layout with header, footer, scroll-to-top
- `PovBlock.astro`: Point-of-view/quote block component

**Vue Components** (all use `client:idle` hydration):
- `Header.vue`: Site navigation with mobile drawer
- `NavDrawer.vue`: Mobile navigation drawer
- `Footer.vue`: Site footer with links
- `ListPosts.vue`: Blog post listing component
- `ListProjects.vue`: Project cards listing
- `ThemeToggle.vue`: Dark/light mode toggle
- `ScrollToTop.vue`: Scroll-to-top button

**Composables**:
- `useHeaderScroll.ts`: Header scroll behavior (hide/show on scroll direction)

### Data Management

**Site Configuration** (`src/site-config.ts`):
- Author info, site metadata
- Social links (GitHub, LinkedIn)
- Navigation structure (header, footer)
- Blog category links

**Projects Data** (`src/data/projects.ts`):
- Project listings organized by category groups
- Structure: Array of project groups, each containing projects array
- Each project has: text, description, icon, href
- Used by: `src/pages/projects/index.astro`

**Utilities** (`src/utils/`):
- `posts.ts`: Content collection queries
  - `getPosts(path?, collection?)`: Get posts with optional path filtering, sorted by date
  - `sortPostsByDate()`: Date-based sorting function
  - Draft posts excluded in production builds
- `link.ts`: Link utilities
  - `getLinkTarget(link)`: Returns '_blank' for external links, '_self' for internal
  - `isExternalLink(link)`: Boolean check for http/https URLs

## Development Guidelines

### Adding Blog Posts

1. Create markdown/MDX file in `src/content/blog/[category]/`
2. Include frontmatter with required and optional fields:

**Content Schema**:

**Required Fields**:
- `title`: Post title (string)
- `date`: Publication date (string or Date, auto-formatted to "Jan 15, 2025")

**Optional Fields**:
- `description`: Brief description (string)
- `duration`: Reading time estimate (string, e.g., "5 min read")
- `tag`: Category/topic tag (string)
- `draft`: Hide from production when true (boolean, default: false)
- `redirect`: Redirect URL (string)
- `lang`: Language code (string, default: 'en-US')
- `video`: Video content flag (boolean, default: false)
- `image`: Image object with `src` and `alt` properties

**Example Frontmatter**:
```yaml
---
title: "Post Title"
date: "2025-01-15"
description: "Brief description"
duration: "5 min read"
tag: "Category"
draft: false
lang: "en-US"
video: false
image:
  src: "/images/post-image.jpg"
  alt: "Post image description"
---
```

3. Posts are automatically sorted by date (newest first)
4. Path-based filtering available via blog category routes

### Styling Patterns

- Use UnoCSS shortcuts (`bg-main`, `text-link`, etc.) for consistency
- Dark mode: Use `dark:` variant (e.g., `dark:bg-hex-0d1117`)
- Responsive: Use breakpoint prefixes (`sm:`, `md:`, `lg:`)
- Typography: `.prose` class for markdown content styling

### Vue Component Integration

**Astro-Level Component Hydration**:
- Interactive components use `client:idle` directive for optimal performance
  - `Header` (src/layouts/BaseLayout.astro:19) - includes nested NavDrawer and ThemeToggle
  - `ScrollToTop` (src/layouts/BaseLayout.astro:25)
- Static components are rendered server-side without client directives
  - `Footer` (src/layouts/BaseLayout.astro:26)
  - `ListPosts` (src/pages/blog/[...path].astro:47)
  - `ListProjects` (src/pages/projects/index.astro:20)

**Component Architecture**:
- `NavDrawer` and `ThemeToggle` are Vue subcomponents nested within `Header.vue`, not standalone Astro imports
- Follow composables pattern for shared logic (see `useHeaderScroll.ts`)
- Use TypeScript for type safety

### Code Quality

**Linting**:
- ESLint configured for TypeScript, Astro, and Vue
- Pre-commit hooks run `lint:fix` automatically via simple-git-hooks
- Files linted: `.ts`, `.astro`, `.vue` (CSS files excluded)

**TypeScript**:
- Strict type checking enabled
- Use types from `src/types.ts` (e.g., `CollectionPosts`, `PostKey`)

## Build & Deployment

- **Build Output**: Static site generated to `dist/`
- **Site URL**: https://brennontwilliams.github.io
- **Custom Domain**: Configured via `CNAME` file
- **SEO**: Sitemap auto-generated via `@astrojs/sitemap`
- **RSS**: Feed auto-generated at `/rss.xml`

## Important Patterns

1. **Content Queries**: Always use `getPosts()` utility, not direct `getCollection()`
2. **Routing**: Use Astro's file-based routing; dynamic routes use `getStaticPaths()`
3. **Hydration**: Vue components should use `client:idle` unless interactivity is critical
4. **Styling**: Prefer UnoCSS utilities and shortcuts over custom CSS
5. **Type Safety**: Import types from `src/types.ts` for content collections
