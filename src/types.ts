import type { CollectionEntry } from 'astro:content'

export type PostKey = 'blog'

export type CollectionPosts = CollectionEntry<PostKey>

export type Pages = 'pages'

export type CollectionPages = CollectionEntry<Pages>

export type ProjectData = Array<{
  title: string
  projects: Array<{
    text: string
    description?: string
    icon?: string
    href: string
  }>
}>

export interface NavLink {
  text: string
  href: string
}

export interface SocialLink {
  text: string
  href: string
  icon: string
  header?: string | boolean
}

export interface PostData {
  title: string
  description?: string
  duration?: string
  image?: {
    src: string
    alt: string
  }
  date: string
  draft?: boolean
  lang?: string
  tag?: string
  redirect?: string
  video?: boolean
  recording?: boolean
}
