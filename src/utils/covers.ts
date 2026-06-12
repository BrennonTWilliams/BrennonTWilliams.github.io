import type { ImageMetadata } from 'astro'
import { getImage } from 'astro:assets'

// Cover art for project cards/plates. Files live in src/assets/covers/ and are
// referenced by bare filename in project frontmatter (`cover: little-loops.jpg`).
const coverModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/covers/*.{jpg,jpeg,png,webp}',
  { eager: true },
)

const coversByName = new Map<string, ImageMetadata>(
  Object.entries(coverModules).map(([path, mod]) => [path.split('/').pop()!, mod.default]),
)

export interface CoverSrc {
  src: string
  width: number
  height: number
}

// 960w covers the largest rendered size (flagship plate ~480px CSS) at 2x DPR.
export async function getCoverSrc(filename?: string): Promise<CoverSrc | undefined> {
  if (!filename)
    return undefined
  const meta = coversByName.get(filename)
  if (!meta) {
    if (import.meta.env.DEV)
      console.warn(`[covers] No cover found in src/assets/covers/ for "${filename}"`)
    return undefined
  }
  const optimized = await getImage({ src: meta, format: 'webp', width: 960, quality: 80 })
  return {
    src: optimized.src,
    width: Number(optimized.attributes.width ?? 960),
    height: Number(optimized.attributes.height ?? Math.round(960 * (meta.height / meta.width))),
  }
}

// Convenience for pages that need covers for a whole project list at once.
export async function getCoverSrcMap(
  projects: Array<{ slug: string, data: { cover?: string } }>,
): Promise<Map<string, CoverSrc>> {
  const out = new Map<string, CoverSrc>()
  await Promise.all(projects.map(async (p) => {
    const cover = await getCoverSrc(p.data.cover)
    if (cover)
      out.set(p.slug, cover)
  }))
  return out
}
