<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import siteConfig from '@/site-config'
import { useHashScroll } from '@/composables/useHashScroll'
import { useHeaderScroll } from '@/composables/useHeaderScroll'
import ThemeToggle from './ThemeToggle.vue'
import NavDrawer from './NavDrawer.vue'

interface Props {
  workCount?: number
  writingCount?: number
}
const props = defineProps<Props>()

const navLinks = siteConfig.header.navLinks
const { onHashClick } = useHashScroll()

// Reactive path — never a prop, because this island persists across view
// transitions and would freeze a prop value (see §EditorialLayout note).
const currentPath = ref<string>(
  typeof window !== 'undefined'
    ? (document.documentElement.dataset.astroCurrentPath ?? window.location.pathname)
    : '/',
)
function refreshPath() {
  currentPath.value = window.location.pathname
}
onMounted(() => {
  refreshPath()
  document.addEventListener('astro:after-swap', refreshPath)
  document.addEventListener('astro:page-load', refreshPath)
})
onBeforeUnmount(() => {
  document.removeEventListener('astro:after-swap', refreshPath)
  document.removeEventListener('astro:page-load', refreshPath)
})

function isCurrent(href: string): boolean {
  if (href.startsWith('/#')) {
    // Anchor on home — current only when on /.
    return currentPath.value === '/' && href !== '/#contact'
  }
  if (href === '/blog/') {
    return currentPath.value.startsWith('/blog') || currentPath.value.startsWith('/posts')
  }
  if (href === '/now/') {
    return currentPath.value.startsWith('/now')
  }
  return currentPath.value === href
}

function countFor(text: string): number | undefined {
  if (text === 'Work') return props.workCount
  if (text === 'Writing') return props.writingCount
  return undefined
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

// Mobile drawer
const isDrawerOpen = ref(false)
function toggleDrawer() {
  isDrawerOpen.value = !isDrawerOpen.value
}
function closeDrawer() {
  isDrawerOpen.value = false
}

useHeaderScroll()

const githubLink = computed(() =>
  siteConfig.socialLinks.find(l => l.text === 'GitHub')?.href ?? '#',
)
</script>

<template>
  <header class="nav ed-nav">
    <div class="container nav-inner">
      <a href="/" class="brand" aria-label="Brennon Williams — home">
        <span class="brand-mark" style="view-transition-name: brand-mark">B</span>
        <span class="brand-name">Brennon Williams</span>
        <span class="brand-meta">
          <b>Studio of One</b>
          <span>Software · Reasoning · Hardware</span>
        </span>
      </a>

      <nav class="nav-center">
        <ul class="nav-links">
          <li v-for="link in navLinks" :key="link.text">
            <a
              :href="link.href"
              :aria-current="isCurrent(link.href) ? 'page' : undefined"
              :class="{ 'is-active': isCurrent(link.href) }"
              @click="link.href.startsWith('/#') ? onHashClick($event) : undefined"
            >
              {{ link.text }}
              <span v-if="countFor(link.text) !== undefined" class="num">{{ pad2(countFor(link.text)!) }}</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="nav-side">
        <a class="nav-cta ghost" :href="githubLink" target="_blank" rel="noreferrer noopener">GitHub</a>
        <a class="nav-cta" :href="`mailto:${siteConfig.email}`">Get in touch</a>
        <span class="status-dot" title="Available for select collaboration" aria-hidden="true"></span>
        <ThemeToggle />
        <button
          type="button"
          class="nav-drawer-trigger"
          :aria-expanded="isDrawerOpen"
          aria-controls="nav-drawer"
          :aria-label="isDrawerOpen ? 'Close navigation menu' : 'Open navigation menu'"
          @click="toggleDrawer"
        >
          <svg viewBox="0 0 22 14" width="22" height="14" aria-hidden="true">
            <line x1="0" y1="3" x2="22" y2="3" stroke="currentColor" stroke-width="1.5" />
            <line x1="0" y1="11" x2="22" y2="11" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </button>
      </div>
    </div>
  </header>

  <NavDrawer
    :is-open="isDrawerOpen"
    :nav-links="navLinks"
    :current-path="currentPath"
    @close="closeDrawer"
  />
</template>

<style scoped>
.nav {
  border-bottom: 1px solid var(--line);
  padding: 22px 0;
  background: var(--paper);
  position: sticky;
  top: 0;
  z-index: var(--z-nav);
  transition: transform var(--dur-base) var(--ease-standard);
}
.nav.nav--hidden {
  transform: translateY(-100%);
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: inherit;
}
.brand-mark {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--ink);
  border-radius: 50%;
  background: var(--ink);
  font-family: var(--serif);
  font-style: italic;
  font-weight: 500;
  font-size: 22px;
  line-height: 1;
  padding-bottom: 2px;
  color: var(--paper);
  transition: background var(--dur-base) var(--ease-standard);
}
@media (hover: hover) and (pointer: fine) {
  .brand:hover .brand-mark { background: var(--coral); border-color: var(--coral); }
}
.brand-name {
  font-family: var(--serif);
  font-size: 19px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--ink);
}
.brand-meta {
  display: inline-flex;
  flex-direction: column;
  gap: 1px;
  margin-left: 4px;
  font-family: var(--sans);
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
  border-left: 1px solid var(--line);
  padding-left: 12px;
}
.brand-meta b { color: var(--ink); font-weight: 600; }

.nav-links {
  list-style: none;
  display: inline-flex;
  gap: 30px;
  margin: 0;
  padding: 0;
  font-family: var(--sans);
  font-size: 13.5px;
  font-weight: 500;
}
.nav-links a {
  color: var(--ink);
  text-decoration: none;
  position: relative;
  padding: 4px 0;
  transition: color var(--dur-base) var(--ease-standard);
}
.nav-links a .num {
  display: inline-block;
  margin-left: 6px;
  font-family: var(--mono);
  font-size: 10.5px;
  color: var(--ink-faint);
  font-weight: 500;
  vertical-align: super;
  line-height: 1;
}
@media (hover: hover) and (pointer: fine) {
  .nav-links a:hover { color: var(--coral); }
}
.nav-links a.is-active {
  color: var(--coral);
  border-bottom: 1px solid var(--coral);
}

.nav-side {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.nav-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border: 1px solid var(--ink);
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: var(--ink);
  color: var(--paper);
  text-decoration: none;
  border-radius: 999px;
  transition: background var(--dur-base) var(--ease-standard),
              color var(--dur-base) var(--ease-standard),
              border-color var(--dur-base) var(--ease-standard);
}
.nav-cta.ghost {
  background: transparent;
  color: var(--ink);
}
@media (hover: hover) and (pointer: fine) {
  .nav-cta:hover {
    background: var(--coral);
    border-color: var(--coral);
    color: var(--bone);
  }
}
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--olive);
  display: inline-block;
  box-shadow: 0 0 0 3px rgba(110, 116, 72, 0.18);
}

.nav-drawer-trigger {
  display: none;
  background: transparent;
  border: 0;
  padding: 12px;
  color: var(--ink);
  cursor: pointer;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  transition: color var(--dur-base) var(--ease-standard);
}
@media (hover: hover) and (pointer: fine) {
  .nav-drawer-trigger:hover { color: var(--coral); }
}

@media (max-width: 980px) {
  .nav-links { display: none; }
  .brand-meta { display: none; }
  .nav-cta.ghost { display: none; }
  .nav-drawer-trigger { display: inline-flex; }
}
</style>
