import { useWindowScroll, useThrottleFn } from '@vueuse/core'
import { onMounted, ref, unref } from 'vue'

export function useHeaderScroll() {
  const { y: scroll } = useWindowScroll()
  const oldScroll = ref(unref(scroll))

  onMounted(() => {
    const headerEl = document.querySelector('#header') as HTMLElement
    if (!headerEl)
      return

    // Initial check for blur effect
    if (document.documentElement.scrollTop > 100)
      headerEl.classList.add('header-bg-blur')

    // Scroll event listener for hide/show and blur (throttled for performance)
    const handleScroll = useThrottleFn(() => {
      // Always show header if near the top
      if (scroll.value < 150) {
        headerEl.classList.remove('header-hide')
        // Add/remove blur based on scroll position > 20 (matches template logic)
        if (scroll.value > 20)
          headerEl.classList.add('header-bg-blur')
        else
          headerEl.classList.remove('header-bg-blur')
        return
      }

      // Hide header on scroll down
      if (scroll.value - oldScroll.value > 150) {
        headerEl.classList.add('header-hide')
        oldScroll.value = scroll.value
      }

      // Show header on scroll up
      if (oldScroll.value - scroll.value > 150) {
        headerEl.classList.remove('header-hide')
        oldScroll.value = scroll.value
      }

      // Add/remove blur based on scroll position > 20 (matches template logic)
      if (scroll.value > 20)
        headerEl.classList.add('header-bg-blur')
      else
        headerEl.classList.remove('header-bg-blur')
    }, 16) // 16ms ≈ 60fps for smooth performance

    window.addEventListener('scroll', handleScroll)
  })

  // Return the scroll ref if needed elsewhere, though not strictly required by the current Header.vue
  // return { scroll }
}