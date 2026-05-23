<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'

// Explicit storage key — matches the inline no-flash script in BaseHead.astro.
// `vueuse-color-scheme` is the @vueuse/core default; declaring it here pins
// the contract so a future major-version default change can't silently break
// no-flash.
const isDark = useDark({
  storageKey: 'vueuse-color-scheme',
  valueDark: 'dark',
  valueLight: 'light',
})
const toggleDark = useToggle(isDark)

function toggleTheme(event: MouseEvent) {
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  )
  // @ts-expect-error: View Transition API not in lib.dom.d.ts yet
  if (!document.startViewTransition) {
    toggleDark()
    return
  }
  // @ts-expect-error: View Transition API not in lib.dom.d.ts yet
  const transition = document.startViewTransition(async () => {
    toggleDark()
  })
  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    document.documentElement.animate(
      { clipPath: isDark.value ? [...clipPath].reverse() : clipPath },
      {
        duration: 400,
        easing: 'ease-in',
        pseudoElement: isDark.value
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    )
  })
}
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :aria-label="isDark ? 'Switch to Paper theme' : 'Switch to Ink theme'"
    @click="toggleTheme"
  >
    <i :class="isDark ? 'i-ri-moon-line' : 'i-ri-sun-line'" aria-hidden="true" />
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid transparent;
  color: var(--ink);
  border-radius: 50%;
  font-size: 1.05rem;
  cursor: pointer;
  transition: color var(--dur-base) var(--ease-standard),
              border-color var(--dur-base) var(--ease-standard);
}
@media (hover: hover) and (pointer: fine) {
  .theme-toggle:hover {
    color: var(--coral);
    border-color: var(--line);
  }
}
</style>
