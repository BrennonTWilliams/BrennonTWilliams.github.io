/**
 * Hide-on-scroll-down / show-on-scroll-up for the sticky EdNav.
 *
 * Targets `.nav` (rendered by EdNav.vue) and toggles `.nav--hidden`. The CSS in
 * EdNav.vue translates the element up by its full height when this class is on.
 */
import { useThrottleFn, useWindowScroll } from '@vueuse/core'
import { onMounted, onUnmounted, ref, unref } from 'vue'

export function useHeaderScroll() {
  const { y: scroll } = useWindowScroll()
  const oldScroll = ref(unref(scroll))

  onMounted(() => {
    const navEl = document.querySelector('.nav') as HTMLElement | null
    if (!navEl) return

    const handleScroll = useThrottleFn(() => {
      if (scroll.value < 150) {
        navEl.classList.remove('nav--hidden')
        return
      }
      if (scroll.value - oldScroll.value > 150) {
        navEl.classList.add('nav--hidden')
        oldScroll.value = scroll.value
      }
      if (oldScroll.value - scroll.value > 150) {
        navEl.classList.remove('nav--hidden')
        oldScroll.value = scroll.value
      }
    }, 16)

    window.addEventListener('scroll', handleScroll)
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })
  })
}
