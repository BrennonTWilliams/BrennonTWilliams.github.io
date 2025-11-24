# Brennon Williams' Personal Website

Personal portfolio and blog for Brennon Williams, AI/ML Software Architect.

**Live Site**: [https://brennontwilliams.github.io](https://brennontwilliams.github.io)

## Overview

This is a modern, performant personal website built with Astro 4, featuring a blog system, project showcase, and responsive design with dark mode support. The site uses Vue 3 components for interactivity and UnoCSS for styling.

### Key Features

- 📝 **Blog System**: MDX-powered blog with category organization and RSS feed
- 🎨 **Modern Design**: Clean, responsive UI with dark/light mode support
- ⚡ **High Performance**: Static site generation with selective component hydration
- 🎯 **SEO Optimized**: Auto-generated sitemap, meta tags, and structured data
- 📱 **Responsive**: Mobile-first design with optimized navigation

## Technology Stack

- **Framework**: [Astro 4](https://astro.build) - Static site generator
- **Components**: [Vue 3](https://vuejs.org) - Interactive UI components
- **Styling**: [UnoCSS](https://unocss.dev) - Utility-first CSS engine
- **Content**: [MDX](https://mdxjs.com) - Enhanced markdown with components
- **Language**: TypeScript - Type-safe development
- **Deployment**: GitHub Pages with custom domain

## Getting Started

### Prerequisites

- Node.js >= 18.17.1 (or >= 20.3.0, or >= 21.0.0)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/BrennonTWilliams/BrennonTWilliams.github.io.git
cd BrennonTWilliams.github.io

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The development server will start on **port 1977** and be accessible at `http://localhost:1977`

### Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The built site will be in the `dist/` directory.

## Development Workflow

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 1977 |
| `npm run build` | Build site for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check for linting errors |
| `npm run lint:fix` | Auto-fix linting errors |
| `npm run release` | Bump version and create release |

### Code Quality

The project uses ESLint for code quality with automated linting on pre-commit:

- **Linting**: ESLint configured for TypeScript, Astro, and Vue
- **Auto-formatting**: Pre-commit hooks run `lint:fix` automatically
- **Type checking**: Strict TypeScript configuration

### Content Management

#### Adding Blog Posts

1. Create a new `.md` or `.mdx` file in `src/content/blog/writing/` (or appropriate category)
2. Add frontmatter:

```yaml
---
title: "Your Post Title"
date: "2025-01-15"
description: "Brief description for SEO and previews"
duration: "5 min read"
tag: "Technology"
draft: false
---
```

3. Write your content using markdown or MDX
4. Posts are automatically sorted by date (newest first)
5. Draft posts (`draft: true`) are hidden in production builds

#### Managing Projects

Edit `src/data/projects.ts` to add or modify project listings. Projects are organized into groups with the following structure:

```typescript
{
  title: "Project Group Name",
  projects: [
    {
      text: "Project Name",
      description: "Project description",
      icon: "i-carbon-icon-name",
      href: "/project-url"
    }
  ]
}
```

## Project Structure

```
BrennonTWilliams.github.io/
├── src/
│   ├── components/        # Astro and Vue components
│   │   ├── *.astro       # Astro components
│   │   └── *.vue         # Vue components
│   ├── content/          # Content collections
│   │   ├── blog/         # Blog posts
│   │   │   └── writing/  # Blog category
│   │   └── pages/        # Static pages
│   ├── data/             # Data files
│   │   └── projects.ts   # Projects data
│   ├── layouts/          # Page layouts
│   ├── pages/            # Route pages
│   ├── styles/           # Global styles
│   ├── utils/            # Utility functions
│   └── site-config.ts    # Site configuration
├── public/               # Static assets
└── dist/                 # Production build output
```

### Key Directories

- **`src/components/`**: Reusable Astro and Vue components
- **`src/content/`**: Markdown/MDX content organized by collection
- **`src/pages/`**: File-based routing (`.astro` files become routes)
- **`src/styles/`**: Global CSS, prose styles, theme variables
- **`src/utils/`**: Helper functions for posts, links, dates

## Deployment

### Build Process

1. Run `npm run build` to generate static site
2. Output is created in `dist/` directory
3. All assets are optimized and minified

### GitHub Pages Configuration

- **Repository**: BrennonTWilliams/BrennonTWilliams.github.io
- **Branch**: Deployed from `main` branch
- **Custom Domain**: Configured via `CNAME` file
- **Build**: Automated via GitHub Actions (if configured)

### Custom Domain Setup

The site uses a custom domain configured in the repository settings and `CNAME` file. To change the domain:

1. Update `CNAME` file in repository root
2. Configure DNS records with your domain provider
3. Update `site` URL in `astro.config.ts`

## Contributing

This is a personal website, but suggestions and bug reports are welcome:

1. Open an issue to discuss proposed changes
2. Fork the repository
3. Create a feature branch
4. Make your changes following the code style
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Contact

**Brennon Williams**
- GitHub: [@BrennonTWilliams](https://github.com/BrennonTWilliams)
- Email: brennon@brennonw.com
- Website: [https://brennontwilliams.github.io](https://brennontwilliams.github.io)

---

Built with ❤️ using [Astro](https://astro.build)
