<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  idx: string           // zero-padded '01'..'NN'
  category?: string     // omitted if absent (no empty cell)
  name: string          // may contain raw <em>; 1-line clamp at render
  stack?: string[]      // first 4 rendered + `+N more`
  blurb: string         // 2-line clamp
  status: 'active' | 'archive'
  href: string
  external?: boolean
}
const props = defineProps<Props>()

const target = computed(() => props.external ? '_blank' : '_self')
const rel = computed(() => props.external ? 'noreferrer noopener' : undefined)

const stackVisible = computed(() => (props.stack ?? []).slice(0, 4))
const stackOverflow = computed(() => {
  const total = props.stack?.length ?? 0
  return total > 4 ? total - 4 : 0
})
</script>

<template>
  <a
    :href="href"
    :target="target"
    :rel="rel"
    class="work-card"
    :class="{ 'is-archive': status === 'archive' }"
    data-reveal
  >
    <span class="idx">
      № {{ idx }}
      <small v-if="status === 'archive'" class="idx-tag">arch</small>
    </span>

    <div class="work-meta">
      <span v-if="category" class="cat">{{ category }}</span>
      <span class="name" v-html="name" />
      <span v-if="stackVisible.length" class="stack">
        {{ stackVisible.join(' · ') }}<span v-if="stackOverflow > 0"> · +{{ stackOverflow }} more</span>
      </span>
    </div>

    <p class="work-blurb">{{ blurb }}</p>

    <div class="work-side">
      <span class="work-status" :class="status">
        {{ status === 'active' ? 'Active' : 'Archive' }}
      </span>
    </div>
  </a>
</template>

<style scoped>
.work-card {
  display: grid;
  grid-template-columns: 80px 1.1fr 1.4fr auto;
  align-items: start;
  gap: 28px;
  padding: 30px 0;
  border-bottom: 1px solid var(--line);
  position: relative;
  text-decoration: none;
  color: inherit;
  transition: background var(--dur-base) var(--ease-standard),
              padding var(--dur-base) var(--ease-standard),
              opacity var(--dur-base) var(--ease-standard);
}
@media (hover: hover) and (pointer: fine) {
  .work-card:hover {
    background: var(--paper-warm);
    padding-left: 18px;
    padding-right: 18px;
  }
}

.work-card.is-archive {
  opacity: 0.62;
  border-bottom-color: var(--line-soft);
}
@media (hover: hover) and (pointer: fine) {
  .work-card.is-archive:hover { opacity: 0.85; }
}
.work-card.is-archive .name :deep(em) { color: var(--ink-mute); }

.idx {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--ink-faint);
  letter-spacing: 0.05em;
  padding-top: 6px;
}
.idx-tag {
  display: block;
  font-family: var(--caps);
  font-size: 9px;
  letter-spacing: 0.2em;
  color: var(--ink-faint);
  text-transform: uppercase;
  margin-top: 4px;
}

.work-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 2px;
  min-width: 0;
}
.work-meta .cat {
  font-family: var(--sans);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--coral);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.work-meta .name {
  font-family: var(--serif);
  font-size: 30px;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--ink);
  line-height: 1.1;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.work-meta .name :deep(em) {
  font-style: italic;
  color: var(--coral);
}
.work-meta .stack {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-mute);
  letter-spacing: 0.04em;
  line-height: 1.7;
}

.work-blurb {
  font-family: var(--body);
  font-size: 15px;
  color: var(--ink-soft);
  line-height: 1.55;
  max-width: 540px;
  padding-top: 4px;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-wrap: pretty;
}

.work-side {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
  padding-top: 4px;
}
.work-status {
  font-family: var(--sans);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-mute);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.work-status::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ink-faint);
}
.work-status.active { color: var(--olive); }
.work-status.active::before {
  background: var(--olive);
  box-shadow: 0 0 0 3px rgba(110, 116, 72, 0.18);
}
.work-status.archive { color: var(--ink-faint); }

@media (max-width: 980px) {
  .work-card {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 24px 0;
  }
  .work-card:hover { padding-left: 0; padding-right: 0; }
  .work-meta .name { font-size: 24px; }
  .work-side {
    align-items: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
