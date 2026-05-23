<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  year: number
  month: string         // 'MAY' from dateRaw.toLocaleString('en', { month: 'short', timeZone: 'UTC' })
  name: string          // 2-line clamp
  desc?: string         // 3-line clamp
  tags?: string[]       // first 3 rendered
  href: string
}
const props = defineProps<Props>()

const visibleTags = computed(() => (props.tags ?? []).slice(0, 3))
</script>

<template>
  <a :href="href" class="write-item" data-reveal>
    <span class="y">{{ year }}<br>{{ month }}</span>
    <div class="write-body">
      <div class="name">{{ name }}</div>
      <div v-if="desc" class="desc">{{ desc }}</div>
      <div v-if="visibleTags.length" class="tags">
        <span v-for="t in visibleTags" :key="t" class="tag">{{ t }}</span>
      </div>
    </div>
  </a>
</template>

<style scoped>
.write-item {
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: 22px;
  padding: 26px 24px;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: var(--bone);
  text-decoration: none;
  color: var(--ink);
  transition: background var(--dur-base) var(--ease-standard);
}
.write-item:nth-child(2n) { border-right: none; }
@media (hover: hover) and (pointer: fine) {
  .write-item:hover { background: var(--paper-dark); }
}

.write-item .y {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--coral);
  letter-spacing: 0.05em;
  padding-top: 6px;
}
.write-body { min-width: 0; }
.write-item .name {
  font-family: var(--serif);
  font-size: 22px;
  font-weight: 500;
  line-height: 1.18;
  letter-spacing: -0.005em;
  color: var(--ink);
  margin-bottom: 8px;
  text-wrap: balance;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.write-item .desc {
  font-family: var(--body);
  font-size: 14px;
  line-height: 1.5;
  color: var(--ink-soft);
  margin-bottom: 12px;
  text-wrap: pretty;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.write-item .tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
}
.write-item .tag {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--ink-mute);
  border: 1px solid var(--line);
  padding: 3px 8px;
  border-radius: 999px;
  letter-spacing: 0.04em;
}

@media (max-width: 820px) {
  .write-item { border-right: none; }
}
</style>
