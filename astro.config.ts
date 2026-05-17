import { execSync } from 'node:child_process'
import { readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'astro/config'
import type { AstroIntegration } from 'astro'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import UnoCSS from 'unocss/astro'
import vue from '@astrojs/vue'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

function shortGitHash(): string {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  }
  catch {
    return 'dev'
  }
}

/**
 * Warn when src/site-config.ts has been edited more than 14 days after
 * `siteConfig.now.lastUpdated`. Signal: nav/issue/volume got bumped but the
 * Now block was forgotten. Fires once at config:setup so it's visible in dev
 * server boot and at build start.
 */
function nowFreshnessCheck(): AstroIntegration {
  return {
    name: 'now-freshness-check',
    hooks: {
      'astro:config:setup': ({ config, logger }) => {
        try {
          const configPath = fileURLToPath(new URL('./src/site-config.ts', config.root))
          const source = readFileSync(configPath, 'utf-8')
          const match = source.match(/lastUpdated:\s*['"](\d{4}-\d{2}-\d{2})['"]/)
          if (!match) return

          const lastUpdated = new Date(`${match[1]}T00:00:00Z`)
          const mtime = statSync(configPath).mtime
          const diffDays = (mtime.getTime() - lastUpdated.getTime()) / 86_400_000

          if (diffDays > 14) {
            logger.warn(
              `siteConfig.now.lastUpdated is ${Math.floor(diffDays)} days behind src/site-config.ts mtime — `
              + `bump the date and refresh the Now entries.`,
            )
          }
        }
        catch {
          // Best-effort: never block a build because the freshness check failed.
        }
      },
    },
  }
}

export default defineConfig({
  site: 'https://brennontwilliams.github.io',
  server: {
    port: 1977,
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  integrations: [
    mdx(),
    sitemap({
      filter: page => !page.endsWith('/404/') && !page.endsWith('/404'),
    }),
    UnoCSS({
      injectReset: true,
    }),
    vue(),
    nowFreshnessCheck(),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light-default',
        dark: 'github-dark-default',
      },
      wrap: true,
    },
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: {
            className: ['heading-anchor'],
            ariaLabel: 'Permalink to this heading',
          },
          content: { type: 'text', value: '¶' },
        },
      ],
    ],
  },
  vite: {
    define: {
      __BUILD_HASH__: JSON.stringify(shortGitHash()),
    },
  },
})
