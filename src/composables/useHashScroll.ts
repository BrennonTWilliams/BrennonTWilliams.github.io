/**
 * Shared anchor-intercept logic.
 *
 * Used by EdNav, EdFooter, and NavDrawer. Handles two cases:
 *   1. Same-page hash link from /:       prevent default, smooth-scroll, replace state.
 *   2. Cross-page hash link from /blog:  let Astro nav, then scroll on page-load.
 *
 * Honors prefers-reduced-motion (snaps instead of animating).
 */
export function useHashScroll() {
  function isHashHref(href: string): boolean {
    return href.startsWith('/#') || href.startsWith('#')
  }

  function targetId(href: string): string | null {
    const idx = href.indexOf('#')
    if (idx < 0) return null
    const id = href.slice(idx + 1)
    return id || null
  }

  function reduced(): boolean {
    return typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  function scrollToId(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({
      behavior: reduced() ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  function onHashClick(event: MouseEvent) {
    const anchor = (event.currentTarget as HTMLAnchorElement | null)
      ?? (event.target as HTMLElement | null)?.closest('a')
    if (!anchor) return
    const href = anchor.getAttribute('href') ?? ''
    if (!isHashHref(href)) return

    const id = targetId(href)
    if (!id) return

    const currentlyHome = window.location.pathname === '/' || window.location.pathname === ''
    if (href.startsWith('/#') && currentlyHome) {
      event.preventDefault()
      scrollToId(id)
      history.replaceState(null, '', href)
      return
    }
    if (href.startsWith('#')) {
      event.preventDefault()
      scrollToId(id)
      history.replaceState(null, '', `${window.location.pathname}#${id}`)
      return
    }
    // Cross-page hash (e.g. /#work from /blog): let Astro navigate,
    // then scroll once the destination page is loaded.
    const handler = () => {
      const hash = window.location.hash.slice(1)
      if (hash) scrollToId(hash)
    }
    document.addEventListener('astro:page-load', handler, { once: true })
    // Fallback for environments without view transitions.
    window.setTimeout(() => {
      if (window.location.hash) scrollToId(window.location.hash.slice(1))
    }, 600)
  }

  function onMount() {
    // Re-fire hash scroll after a hard load when the URL already has a hash.
    if (typeof window === 'undefined') return
    if (window.location.hash) {
      const id = window.location.hash.slice(1)
      // Wait for layout to settle.
      requestAnimationFrame(() => scrollToId(id))
    }
  }

  return { onHashClick, onMount }
}
