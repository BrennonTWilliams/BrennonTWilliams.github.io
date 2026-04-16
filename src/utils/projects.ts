import { getCollection } from 'astro:content'
import type { CollectionProjects } from '@/types'

const STATUS_RANK: Record<string, number> = {
  Active: 0,
  'In Progress': 1,
  Archive: 2,
}

function statusRank(status?: string) {
  if (!status)
    return 99
  return STATUS_RANK[status] ?? 50
}

export function sortProjects(a: CollectionProjects, b: CollectionProjects) {
  const ao = a.data.order ?? Infinity
  const bo = b.data.order ?? Infinity
  if (ao !== bo)
    return ao - bo
  const sa = statusRank(a.data.status)
  const sb = statusRank(b.data.status)
  if (sa !== sb)
    return sa - sb
  return a.data.title.localeCompare(b.data.title)
}

export async function getProjects() {
  return (await getCollection('projects')).sort(sortProjects)
}

export interface ProjectGroup {
  category: string
  projects: CollectionProjects[]
}

export function groupProjectsByCategory(projects: CollectionProjects[]): ProjectGroup[] {
  const groups = new Map<string, CollectionProjects[]>()
  for (const p of projects) {
    const cat = p.data.category
    if (!groups.has(cat))
      groups.set(cat, [])
    groups.get(cat)!.push(p)
  }
  return Array.from(groups.entries()).map(([category, projects]) => ({ category, projects }))
}

export function partitionFlagship(projects: CollectionProjects[]) {
  const flagship = projects.find(p => p.data.flagship) ?? null
  const rest = flagship ? projects.filter(p => p !== flagship) : projects
  return { flagship, rest }
}
