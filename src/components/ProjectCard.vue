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
</script>

<template>
  <div
    class="card-wrapper"
    :class="{ 'is-archive': status === 'archive' }"
    data-reveal
    role="listitem"
  >
    <a
      :href="href"
      :target="target"
      :rel="rel"
      class="project-card"
    >
      <!-- Playing card corner indices -->
      <div class="card-corner top-left">
        <span class="corner-sym">№</span>
        <span class="corner-num">{{ idx }}</span>
      </div>
      <div class="card-corner bottom-right" aria-hidden="true">
        <span class="corner-sym">№</span>
        <span class="corner-num">{{ idx }}</span>
      </div>

      <!-- Full-bleed art -->
      <div class="card-image-wrap">
        <img v-if="image" :src="image" :alt="name" class="card-img" />
        <div v-else class="card-placeholder">
          <span class="placeholder-letter" aria-hidden="true">{{ initial }}</span>
        </div>
      </div>
    </a>

    <div class="card-caption">
      <span class="card-name" v-html="name" />
      <p class="card-blurb">{{ blurb }}</p>
    </div>
  </div>
</template>

<style scoped>
.card-wrapper {
  flex: 0 0 260px;
  display: flex;
  flex-direction: column;
  scroll-snap-align: start;
}

.card-wrapper.is-archive .project-card {
  opacity: 0.70;
}

@media (hover: hover) and (pointer: fine) {
  .card-wrapper:hover .project-card {
    transform: translateY(-5px) scale(1.025);
    box-shadow:
      inset 0 0 0 8px var(--paper),
      inset 0 0 0 9px var(--line-soft),
      0 6px 16px rgba(0,0,0,0.14),
      0 16px 40px rgba(0,0,0,0.10),
      0 1px 3px rgba(0,0,0,0.12);
  }
  .card-wrapper.is-archive:hover .project-card {
    opacity: 1;
  }
}

/* ── Card shell ──────────────────────────────── */
.project-card {
  width: 100%;
  aspect-ratio: 5 / 4;
  position: relative;
  display: block;
  border: 1px solid var(--line-soft);
  border-radius: 10px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  background: var(--bone);
  /* inner frame: 8px paper border + 1px hairline at inner edge + card drop shadow */
  box-shadow:
    inset 0 0 0 8px var(--paper),
    inset 0 0 0 9px var(--line-soft),
    0 2px 6px rgba(0,0,0,0.08),
    0 8px 24px rgba(0,0,0,0.06),
    0 1px 2px rgba(0,0,0,0.10);
  transition: opacity var(--dur-base) var(--ease-standard),
              box-shadow var(--dur-base) var(--ease-standard),
              transform var(--dur-base) var(--ease-standard);
}

/* Paper grain overlay */
.project-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='1'/></svg>");
  opacity: 0.05;
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 4;
}

/* ── Corner indices ───────────────────────────── */
.card-corner {
  position: absolute;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
  gap: 1px;
  pointer-events: none;
  user-select: none;
}

.card-corner.top-left {
  top: 5px;
  left: 7px;
}

.card-corner.bottom-right {
  bottom: 5px;
  right: 7px;
  transform: rotate(180deg);
}

.corner-sym {
  font-family: var(--mono);
  font-size: 7px;
  color: var(--ink-mute);
  letter-spacing: 0.05em;
  line-height: 1;
}

.corner-num {
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--ink-soft);
  line-height: 1;
  letter-spacing: -0.02em;
}

/* ── Art ──────────────────────────────────────── */
.card-image-wrap {
  position: absolute;
  inset: 0;
  background: var(--bone);
  z-index: 0;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  font-size: 80px;
  font-weight: 500;
  color: var(--line);
  line-height: 1;
  user-select: none;
}

/* ── Caption (below card) ─────────────────────── */
.card-caption {
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-name {
  font-family: var(--serif);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--ink);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-wrap: pretty;
}

@media (max-width: 640px) {
  .card-wrapper {
    flex: 0 0 200px;
  }
  .placeholder-letter {
    font-size: 56px;
  }
}
</style>
