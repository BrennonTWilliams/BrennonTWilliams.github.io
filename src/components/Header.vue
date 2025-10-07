<script lang="ts" setup>
import { computed, ref } from 'vue' // Removed unref, added ref
import ThemeToggle from './ThemeToggle.vue'
import NavDrawer from './NavDrawer.vue' // Import the new component
import siteConfig from '@/site-config'
import { getLinkTarget } from '@/utils/link'
import { useHeaderScroll } from '../composables/useHeaderScroll'

const navLinks = siteConfig.header.navLinks || []

// State for controlling the navigation drawer
const isNavDrawerOpen = ref(false)

// Function to toggle the navigation drawer state
function toggleNavDrawer() {
  isNavDrawerOpen.value = !isNavDrawerOpen.value
}

const socialLinks = computed(() => {
  return siteConfig.socialLinks.filter((link: Record<string, any>) => {
    if (link.header && typeof link.header === 'boolean') {
      return link
    }
    else if (link.header && typeof link.header === 'string') {
      link.icon = link.header.includes('i-') ? link.header : link.icon
      return link
    }
    else {
      return false
    }
  })
})

// Activate header scroll behavior
useHeaderScroll()


</script>

<template>
  <header
    id="header"
    class="!fixed bg-transparent z-899 w-screen h-20 px-6 flex justify-between items-center relative"
  >
    <div class="flex items-center h-full">
      <a href="/" mr-6 aria-label="Header Logo Image">
        <img width="60" height="38" :src="siteConfig.header.logo.src" :alt="siteConfig.header.logo.alt">
      </a>
      <nav class="sm:flex hidden flex-wrap gap-x-6 position-initial flex-row">
        <a
          v-for="link in navLinks" :key="link.text" :aria-label="`${link.text}`" :target="getLinkTarget(link.href)"
          nav-link :href="link.href"
        >
          {{ link.text }}
        </a>
      </nav>
      <div sm:hidden h-full flex items-center @click="toggleNavDrawer()">
        <menu i-ri-menu-2-fill />
      </div>
    </div>
    <div class="flex gap-x-6">
      <a
        v-for="link in socialLinks" :key="link.text" :aria-label="`${link.text}`" :class="link.icon" nav-link
        :target="getLinkTarget(link.href)" :href="link.href" rel="noopener noreferrer"
      />

      <a nav-link target="_blank" href="/rss.xml" i-ri-rss-line aria-label="RSS" rel="noopener noreferrer" />
      <ThemeToggle />
    </div>
  </header>
  <NavDrawer
    :nav-links="navLinks"
    :is-open="isNavDrawerOpen"
    :toggle-nav-drawer="toggleNavDrawer"
  />
</template>

<style scoped>
.header-hide {
  transform: translateY(-100%);
  transition: transform 0.4s ease;
}

.header-bg-blur {
  --at-apply: backdrop-blur-sm;
}

</style>
