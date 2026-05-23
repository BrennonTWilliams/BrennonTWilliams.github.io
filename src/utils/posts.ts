/**
 * Date convention: blog post dates are *calendar dates* in UTC, not points in
 * time. Every consumer of post.data.date / post.data.dateRaw must pass
 * `timeZone: 'UTC'` to any `toLocaleString` / formatter and use the `getUTC*`
 * accessors. Without this, a post dated `2025-01-01` would render as
 * `DEC 2024` when CI runs in America/Los_Angeles. See src/content/config.ts.
 */
import { getCollection } from 'astro:content'
import type { CollectionPosts, PostKey } from '@/types'

export function sortPostsByDate(itemA: CollectionPosts, itemB: CollectionPosts) {
  return itemB.data.dateRaw.getTime() - itemA.data.dateRaw.getTime()
}

export async function getPosts(path?: string, collection: PostKey = 'blog') {
  return (await getCollection(collection, (post) => {
    return (import.meta.env.PROD ? post.data.draft !== true : true) && (path ? post.slug.includes(path) : true)
  })).sort(sortPostsByDate)
}
