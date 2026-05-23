<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import siteConfig from '@/site-config'
import { useHashScroll } from '@/composables/useHashScroll'

interface NavLink { text: string; href: string }

const props = defineProps<{
  isOpen: boolean
  navLinks: NavLink[]
  currentPath: string
}>()
const emit = defineEmits<{ (e: 'close'): void }>()

const { onHashClick } = useHashScroll()
const drawerRef = ref<HTMLElement | null>(null)
const firstFocus = ref<HTMLElement | null>(null)
const savedFocus = ref<HTMLElement | null>(null)
const savedOverflow = ref<string>('')

function isCurrent(href: string): boolean {
  if (href.startsWith('/#'))
    return props.currentPath === '/'
  if (href === '/blog/')
    return props.currentPath.startsWith('/blog') || props.currentPath.startsWith('/posts')
  if (href === '/reading/')
    return props.currentPath.startsWith('/reading')
  if (href === '/projects/')
    return props.currentPath.startsWith('/projects')
  return props.currentPath === href
}

function close() { emit('close') }

function handleClickInside(event: MouseEvent) {
  const a = (event.target as HTMLElement | null)?.closest('a')
  if (!a) return
  const href = a.getAttribute('href') ?? ''
  if (href.startsWith('/#') || href.startsWith('#'))
    onHashClick(event)
  close()
}

function onKeydown(e: KeyboardEvent) {
  if (!props.isOpen) return
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
    return
  }
  if (e.key !== 'Tab') return
  const root = drawerRef.value
  if (!root) return
  const focusable = root.querySelectorAll<HTMLElement>(
    'a, button, [tabindex]:not([tabindex="-1"])',
  )
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  }
  else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

watch(() => props.isOpen, async (open) => {
  if (open) {
    savedFocus.value = (document.activeElement as HTMLElement | null) ?? null
    savedOverflow.value = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeydown)
    const shell = document.querySelector('.shell') as HTMLElement | null
    if (shell) shell.setAttribute('inert', '')
    await nextTick()
    firstFocus.value?.focus()
  }
  else {
    document.body.style.overflow = savedOverflow.value
    document.removeEventListener('keydown', onKeydown)
    const shell = document.querySelector('.shell') as HTMLElement | null
    if (shell) shell.removeAttribute('inert')
    savedFocus.value?.focus()
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = savedOverflow.value
  const shell = document.querySelector('.shell') as HTMLElement | null
  if (shell) shell.removeAttribute('inert')
})
</script>

<template>
  <div
    class="nav-drawer-backdrop"
    :class="{ open: isOpen }"
    aria-hidden="true"
    @click="close"
  ></div>

  <aside
    id="nav-drawer"
    ref="drawerRef"
    class="nav-drawer"
    :class="{ open: isOpen }"
    role="dialog"
    aria-modal="true"
    aria-label="Site navigation"
    @click="handleClickInside"
  >
    <button
      ref="firstFocus"
      type="button"
      class="drawer-close"
      aria-label="Close navigation menu"
      @click.stop="close"
    >×</button>

    <ul class="drawer-links">
      <li v-for="link in navLinks" :key="link.text">
        <a
          :href="link.href"
          :aria-current="isCurrent(link.href) ? 'page' : undefined"
          :class="{ 'is-active': isCurrent(link.href) }"
        >
          {{ link.text }}
        </a>
      </li>
    </ul>

    <ul class="drawer-social">
      <li v-for="link in siteConfig.socialLinks" :key="link.text">
        <a :href="link.href" target="_blank" rel="noreferrer noopener">
          {{ link.text }} →
        </a>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.nav-drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(21, 20, 15, 0.45);
  z-index: var(--z-drawer-backdrop);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--dur-base) var(--ease-standard);
}
.nav-drawer-backdrop.open {
  opacity: 1;
  pointer-events: auto;
}

.nav-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: min(80vw, 380px);
  background: var(--paper);
  border-right: 1px solid var(--line);
  z-index: var(--z-drawer);
  padding: calc(28px + var(--safe-top)) 28px calc(28px + var(--safe-bottom));
  display: flex;
  flex-direction: column;
  gap: 28px;
  transform: translateX(-100%);
}
@media (prefers-reduced-motion: no-preference) {
  .nav-drawer {
    transition: transform var(--dur-slow) var(--ease-emphasized);
  }
}
.nav-drawer.open { transform: translateX(0); }

.drawer-close {
  align-self: flex-end;
  background: transparent;
  border: 1px solid var(--line);
  color: var(--ink);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition: color var(--dur-base) var(--ease-standard),
              border-color var(--dur-base) var(--ease-standard);
}
@media (hover: hover) and (pointer: fine) {
  .drawer-close:hover { color: var(--coral); border-color: var(--coral); }
}

.drawer-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.drawer-links a {
  font-family: var(--serif);
  font-size: 22px;
  color: var(--ink);
  text-decoration: none;
  transition: color var(--dur-base) var(--ease-standard);
}
@media (hover: hover) and (pointer: fine) {
  .drawer-links a:hover { color: var(--coral); }
}
.drawer-links a.is-active { color: var(--coral); }

.drawer-social {
  list-style: none;
  margin-top: auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid var(--line);
  padding-top: 20px;
}
.drawer-social a {
  font-family: var(--sans);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--ink-faint);
  text-decoration: none;
}
@media (hover: hover) and (pointer: fine) {
  .drawer-social a:hover { color: var(--coral); }
}
</style>
