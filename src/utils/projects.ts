/**
 * Canonical project ordering used by the homepage Selected Work and /projects.
 *
 * Sort rule: status active first → `order` ascending → slug fallback.
 * Soft style guide for authors: `title` ≤ 60 chars, `summary` ≤ 160 chars.
 * WorkCard.vue clamps both as a safety net.
 */
import { getCollection } from 'astro:content'
import type { CollectionProjects } from '@/types'

function statusRank(p: CollectionProjects): number {
  return p.data.status === 'active' ? 0 : 1
}

function compare(a: CollectionProjects, b: CollectionProjects): number {
  const rankDiff = statusRank(a) - statusRank(b)
  if (rankDiff !== 0) return rankDiff
  const ao = a.data.order ?? 999
  const bo = b.data.order ?? 999
  if (ao !== bo) return ao - bo
  return a.slug.localeCompare(b.slug)
}

/** Array-in / array-out comparator wrapper (preferred call shape). */
export function sortProjects(projects: CollectionProjects[]): CollectionProjects[] {
  return [...projects].sort(compare)
}

/** Convenience: get all non-draft projects in canonical order. */
export async function getProjects(): Promise<CollectionProjects[]> {
  return sortProjects(
    (await getCollection('projects')).filter(p => !p.data.draft),
  )
}

export function partitionFlagship(projects: CollectionProjects[]) {
  const flagship = projects.find(p => p.data.flagship) ?? null
  const rest = flagship ? projects.filter(p => p !== flagship) : projects
  return { flagship, rest }
}
