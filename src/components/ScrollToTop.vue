<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y: scroll } = useWindowScroll()

function toTop() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({
    top: 0,
    behavior: reduced ? 'auto' : 'smooth',
  })
}
</script>

<template>
  <button
    aria-label="Scroll to top"
    class="scroll-to-top"
    :class="scroll > 300 ? 'visible' : ''"
    @click="toTop()"
  >
    <i i-ri-arrow-up-line aria-hidden="true" />
  </button>
</template>

<style scoped>
.scroll-to-top {
  position: fixed;
  right: 24px;
  bottom: calc(24px + var(--safe-bottom));
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--ink);
  color: var(--paper);
  border: 1px solid var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  z-index: var(--z-scroll-top);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--dur-base) var(--ease-standard),
              background var(--dur-base) var(--ease-standard),
              border-color var(--dur-base) var(--ease-standard);
  cursor: pointer;
}
.scroll-to-top.visible {
  opacity: 0.92;
  pointer-events: auto;
}
@media (hover: hover) and (pointer: fine) {
  .scroll-to-top:hover {
    opacity: 1;
    background: var(--coral);
    border-color: var(--coral);
  }
}
@media (min-width: 980px) {
  .scroll-to-top { right: 64px; }
}
@media print {
  .scroll-to-top { display: none !important; }
}
</style>
