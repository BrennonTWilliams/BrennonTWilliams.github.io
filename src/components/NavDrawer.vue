<script lang="ts" setup>
import { computed } from 'vue'
import { getLinkTarget } from '@/utils/link'

// Define NavLink type locally based on site-config.ts structure
interface NavLink {
  text: string
  href: string
}

const props = defineProps<{
  navLinks: NavLink[]
  isOpen: boolean
  toggleNavDrawer: () => void
}>()

// Use computed properties to reactively apply styles based on the isOpen prop
const drawerTransform = computed(() => props.isOpen ? 'translateX(0%)' : 'translateX(-100%)')
const maskDisplay = computed(() => props.isOpen ? 'block' : 'none')
</script>

<template>
  <!-- Navigation Drawer -->
  <nav
    class="nav-drawer sm:hidden"
    :style="{ transform: drawerTransform }"
    aria-label="Mobile Navigation"
  >
    <!-- Links within the drawer -->
    <a
      v-for="link in navLinks"
      :key="link.text"
      :aria-label="`${link.text}`"
      :target="getLinkTarget(link.href)"
      nav-link
      :href="link.href"
      @click="toggleNavDrawer" <!-- Close drawer on link click -->
    >
      {{ link.text }}
    </a>
  </nav>

  <!-- Overlay Mask -->
  <div
    class="nav-drawer-mask"
    :style="{ display: maskDisplay }"
    @click="toggleNavDrawer" <!-- Close drawer on mask click -->
    aria-hidden="true"
  ></div> <!-- Corrected closing tag -->
</template>

<style scoped>
.nav-drawer {
  /* Base styles moved from Header.vue */
  /* Transform is now controlled dynamically via :style binding */
  --at-apply: box-border fixed h-screen z-999 left-0 top-0 min-w-32vw max-w-50vw
    bg-main p-6 text-lg flex flex-col gap-5 transition-transform duration-300 ease-in-out;
}

.nav-drawer-mask {
  /* Base styles moved from Header.vue */
  /* Display is now controlled dynamically via :style binding */
  --at-apply: transition-opacity duration-300 ease-in-out; /* Use opacity transition */
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998; /* Ensure it's below the drawer but above content */
}

/* Assuming nav-link styles are globally available or handled by UnoCSS */
/* If not, they would need to be included here or made global */
</style>