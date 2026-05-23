<script setup lang="ts">
const pillars = [
  { top: 'DYNAMISM', bottom: 'DOGMA' },
  { top: 'PLAY', bottom: 'PROCEDURE' },
  { top: 'PROTOTYPE', bottom: 'POLISH' },
  { top: 'LOCAL', bottom: 'CLOUD' },
  { top: 'DEPTH', bottom: 'BREADTH' },
]

const track = [...pillars, ...pillars]
</script>

<template>
  <section class="pov-marquee" aria-label="Design philosophy">
    <div class="pov-inner">
      <div class="pov-left">
        <span class="pov-mark" aria-hidden="true"></span>
        <span class="pov-title">
          <b>Point of View</b>
          <span>Principles I build by</span>
        </span>
      </div>
      <div class="pov-rows">
        <div class="marquee-track" aria-hidden="true">
          <span v-for="(item, i) in track" :key="i" class="pov-item">
            <span class="pov-top">{{ item.top }}</span>
            <span class="pov-sep">/</span>
            <span class="pov-bottom">{{ item.bottom }}</span>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pov-marquee {
  position: relative;
  z-index: var(--z-shell);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: var(--paper-dark);
  padding: 14px 0;
  overflow: hidden;
  isolation: isolate;
}
.pov-inner {
  display: flex;
  align-items: center;
  gap: 32px;
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 64px;
}
@media (max-width: 820px) {
  .pov-inner { padding: 0 22px; }
}
.pov-left {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 22px;
  border-right: 1px solid var(--line);
}
.pov-mark {
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
.pov-mark::after {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--paper);
}
.pov-title {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-family: var(--sans);
  font-size: 10.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
}
.pov-title b { color: var(--ink); font-weight: 600; }

.pov-rows {
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
    .pov-marquee:hover .marquee-track,
    .pov-marquee:focus-within .marquee-track {
      animation-play-state: paused;
    }
  }
}
.pov-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Valkyrie B Caps', 'Inter Tight', sans-serif;
  font-size: 13px;
  letter-spacing: 0.18em;
  color: var(--ink);
}
.pov-top {
  color: var(--ink);
}
.pov-sep {
  color: var(--coral);
  font-weight: 700;
}
.pov-bottom {
  color: var(--ink-soft);
}
</style>
