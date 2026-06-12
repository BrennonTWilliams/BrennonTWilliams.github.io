<script setup lang="ts">
import { computed } from 'vue'

interface ExternalLink { label: string; href: string }

interface Props {
  idx: string
  category?: string
  name: string
  blurb: string
  status: 'active' | 'archive'
  href: string
  image?: string
  year?: number
  links?: ExternalLink[]
}

const props = defineProps<Props>()

const plainName = computed(() => props.name.replace(/<[^>]*>/g, ''))

const initial = computed(() => plainName.value.charAt(0).toUpperCase())
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
        <img v-if="image" :src="image" :alt="plainName" class="card-img" loading="lazy" decoding="async" />
        <div v-else class="card-placeholder">
          <span class="placeholder-letter" aria-hidden="true">{{ initial }}</span>
        </div>
      </div>
    </a>

    <div class="card-caption">
      <div class="card-name-row">
        <span v-if="status === 'active'" class="status-dot" aria-label="Active" />
        <span class="card-name" v-html="name" />
      </div>
      <p class="card-blurb">{{ blurb }}</p>
    </div>
    <div v-if="links?.length" class="card-chips">
      <a
        v-for="link in links"
        :key="link.href"
        :href="link.href"
        target="_blank"
        rel="noreferrer noopener"
        class="chip"
        @click.stop
      >{{ link.label }}</a>
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
}

/* ── Card shell ──────────────────────────────── */
.project-card {
  /* local stacking order: art < corners < grain overlay */
  --z-card-art: 0;
  --z-card-corner: 3;
  --z-card-grain: 4;
  width: 100%;
  aspect-ratio: 5 / 7;
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
  z-index: var(--z-card-grain);
}

/* ── Corner indices ───────────────────────────── */
.card-corner {
  position: absolute;
  z-index: var(--z-card-corner);
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
  z-index: var(--z-card-art);
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

.card-name-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.status-dot {
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--coral);
  margin-top: 5px;
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

/* ── External link chips ──────────────────────── */
.card-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 8px;
}

.chip {
  font-family: var(--caps);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-mute);
  border: 1px solid var(--line-soft);
  border-radius: 2px;
  padding: 3px 8px;
  text-decoration: none;
  transition: color var(--dur-base), border-color var(--dur-base);
}

@media (hover: hover) and (pointer: fine) {
  .chip:hover {
    color: var(--ink);
    border-color: var(--line);
  }
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
