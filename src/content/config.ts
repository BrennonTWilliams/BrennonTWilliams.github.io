import { defineCollection, z } from 'astro:content'

/**
 * Date handling — blog dates are calendar dates in UTC, not points in time.
 * Every consumer must read them as such (pass `timeZone: 'UTC'` to any
 * `toLocaleString` / `getFullYear` call). See src/utils/posts.ts.
 */
function formatDateUTC(val: string | number | Date): string {
  return new Date(val).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

const pages = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
      }).optional(),
  }),
})

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    duration: z.string().optional(),
    /**
     * Per-post social image override. Used by BaseHead.astro to emit
     * `<meta property="og:image">`. Size convention: 1200×630, ≤200KB.
     */
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
      }).optional(),
    /**
     * Human-formatted date string (e.g. "Jan 15, 2025"). Stable across
     * timezones because we pin `timeZone: 'UTC'`. Existing callers use this.
     */
    date: z
      .string()
      .or(z.date())
      .transform(formatDateUTC),
    /**
     * Raw Date object — for `getUTCFullYear()`, RSS `<pubDate>`, and any
     * caller needing programmatic date access. Added alongside `date` so
     * existing string consumers aren't disturbed.
     */
    dateRaw: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
    draft: z.boolean().default(false).optional(),
    lang: z.string().default('en-US').optional(),
    tag: z.string().optional(),
    redirect: z.string().optional(),
    video: z.boolean().default(false).optional(),
    recording: z.boolean().default(false).optional(),
  }),
})

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    category: z.string().optional(),
    /**
     * Lifecycle status. Drives sort order (active before archive) and the
     * card's visual treatment in WorkCard.vue.
     */
    status: z.enum(['active', 'archive']).default('active'),
    /** Tech list rendered as a mono caps row on detail + stack cell on card. */
    stack: z.array(z.string()).optional(),
    repo: z.string().optional(),
    website: z.string().optional(),
    summary: z.string(),
    icon: z.string().optional(),
    svg: z.string().optional(),
    /** Canonical sort key — entries without `order` sort to the end. */
    order: z.number().optional(),
    flagship: z.boolean().optional(),
    /** Primary outbound link rendered as btn-primary on detail header. */
    link: z
      .object({
        href: z.string().url(),
        label: z.string().optional(),
      }).optional(),
    cover: z.string().optional(),
    /** Hide from production listings. */
    draft: z.boolean().default(false).optional(),
  }),
})

export const collections = { pages, blog, projects }
