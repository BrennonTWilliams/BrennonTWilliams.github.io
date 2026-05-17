<script setup lang="ts">
interface Props {
  activeCount: number
}
const props = defineProps<Props>()

// Static editorial items, duplicated for seamless marquee loop.
const items = [
  { coord: 'act/01', handle: 'little-loops', role: 'v0.4 sprint' },
  { coord: 'act/02', handle: 'blender-agents', role: 'OODA loop' },
  { coord: 'act/03', handle: 'lmc-voice', role: 'tool router' },
  { coord: 'act/04', handle: 'deep-codebase', role: 'cli' },
  { coord: 'act/05', handle: 'mission-control', role: 'homelab' },
  { coord: 'act/06', handle: 'MC-Vault', role: 'obsidian' },
  { coord: 'arc/01', handle: 'swan', role: 'multi-agent' },
  { coord: 'arc/02', handle: 'Blubry', role: 'trrs' },
  { coord: 'arc/03', handle: 'UntieAI', role: 'utility AI' },
]
const track = [...items, ...items]
const pad = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <section v-if="props.activeCount > 0" class="ed-wire" aria-label="Currently shipping">
    <div class="container wire-inner">
      <div class="wire-left">
        <span class="wire-mark" aria-hidden="true"></span>
        <span class="wire-title">
          <b>From the workshop</b>
          <span>Active threads · {{ pad(props.activeCount) }} in flight</span>
        </span>
      </div>
      <div class="wire-rows">
        <div class="marquee-track" aria-hidden="true">
          <span v-for="(item, i) in track" :key="i" class="wire-item">
            <span class="wire-dot">·</span>
            <span class="wire-coord">{{ item.coord }}</span>
            <span class="wire-handle">{{ item.handle }}</span>
            <span class="wire-role">{{ item.role }}</span>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ed-wire {
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 14px 0;
  overflow: hidden;
}
.wire-inner {
  display: flex;
  align-items: center;
  gap: 32px;
}
.wire-left {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 22px;
  border-right: 1px solid var(--line);
}
.wire-mark {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--coral);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 3px rgba(237, 111, 92, 0.15);
  position: relative;
}
.wire-mark::after {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--bone);
}
.wire-title {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-family: var(--sans);
  font-size: 10.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
}
.wire-title b { color: var(--ink); font-weight: 600; }

.wire-rows {
  flex: 1;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent 0, #000 64px, #000 calc(100% - 64px), transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 64px, #000 calc(100% - 64px), transparent 100%);
}
.marquee-track {
  display: inline-flex;
  gap: 36px;
  white-space: nowrap;
}
@media (prefers-reduced-motion: no-preference) {
  .marquee-track {
    animation: marquee var(--dur-marquee) var(--ease-linear) infinite;
  }
  @media (hover: hover) and (pointer: fine) {
    .ed-wire:hover .marquee-track,
    .ed-wire:focus-within .marquee-track {
      animation-play-state: paused;
    }
  }
}
.wire-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--sans);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--ink-soft);
}
.wire-dot { color: var(--coral); font-weight: 700; }
.wire-handle { color: var(--ink); font-weight: 500; }
.wire-role {
  color: var(--ink-faint);
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.wire-coord {
  color: var(--ink-faint);
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: 0.06em;
}
</style>
