<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  idx: string
  category?: string
  name: string
  blurb: string
  status: 'active' | 'archive'
  href: string
  external?: boolean
  image?: string
  year?: number
}

const props = defineProps<Props>()

const target = computed(() => props.external ? '_blank' : '_self')
const rel = computed(() => props.external ? 'noreferrer noopener' : undefined)
const initial = computed(() =>
  props.name.replace(/<[^>]*>/g, '').charAt(0).toUpperCase()
)
const displayYear = computed(() => props.year ?? new Date().getFullYear())
</script>

<template>
  <a
    :href="href"
    :target="target"
    :rel="rel"
    class="project-card"
    :class="{ 'is-archive': status === 'archive' }"
    data-reveal
    role="listitem"
  >
    <div class="card-visual">
      <span v-if="category" class="card-cat">{{ category }}</span>
      <div class="card-image-wrap">
        <img v-if="image" :src="image" :alt="name" class="card-img" />
        <div v-else class="card-placeholder">
          <span class="placeholder-letter" aria-hidden="true">{{ initial }}</span>
        </div>
      </div>
      <div class="card-tag-row">
        <span class="card-num">№ {{ idx }}</span>
        <span class="card-year">{{ displayYear }}</span>
      </div>
    </div>

    <div class="card-body">
      <span class="card-name" v-html="name" />
      <p class="card-blurb">{{ blurb }}</p>
      <span class="card-arrow" aria-hidden="true">→</span>
    </div>
  </a>
</template>

<style scoped>
.project-card {
  flex: 0 0 216px;
  aspect-ratio: 5 / 7;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--line-soft);
  border-radius: 10px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  scroll-snap-align: start;
  background: var(--paper);
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04);
  transition: background var(--dur-base) var(--ease-standard),
              opacity var(--dur-base) var(--ease-standard),
              box-shadow var(--dur-base) var(--ease-standard),
              transform var(--dur-base) var(--ease-standard);
}

.project-card.is-archive {
  opacity: 0.70;
}

@media (hover: hover) and (pointer: fine) {
  .project-card:hover {
    background: var(--paper-warm);
    box-shadow: 0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06);
    transform: translateY(-2px);
  }
  .project-card:hover .card-arrow {
    transform: translateX(4px);
  }
  .project-card.is-archive:hover {
    opacity: 1;
  }
}

/* ---- Visual zone ---- */
.card-visual {
  position: relative;
  flex: 0 0 58%;
  border-bottom: 1px solid var(--line-soft);
  overflow: hidden;
  background: var(--bone);
}

.card-cat {
  position: absolute;
  top: 11px;
  left: 12px;
  font-family: var(--caps);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-soft);
  z-index: 1;
  line-height: 1;
}

.card-image-wrap {
  width: 100%;
  height: 100%;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 10px;
}

.card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-letter {
  font-family: var(--serif);
  font-style: italic;
  font-size: 96px;
  font-weight: 500;
  color: var(--line);
  line-height: 1;
  user-select: none;
}

.card-tag-row {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 12px;
  border-top: 1px solid var(--line-soft);
  background: color-mix(in srgb, var(--bone) 80%, var(--paper) 20%);
  backdrop-filter: blur(2px);
}

.card-num {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.05em;
}

.card-year {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.05em;
}

/* ---- Body zone ---- */
.card-body {
  padding: 12px 12px 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.card-name {
  font-family: var(--serif);
  font-size: 18px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--ink);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 8px;
  text-wrap: pretty;
}

.card-name :deep(em) {
  font-style: italic;
  color: var(--coral);
}

.card-blurb {
  font-family: var(--body);
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.5;
  margin: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-wrap: pretty;
}

.card-arrow {
  font-family: var(--mono);
  font-size: 15px;
  color: var(--coral);
  margin-top: 6px;
  display: block;
  transition: transform var(--dur-base) var(--ease-standard);
}

@media (max-width: 640px) {
  .project-card {
    flex: 0 0 160px;
  }
  .placeholder-letter {
    font-size: 64px;
  }
}
</style>
