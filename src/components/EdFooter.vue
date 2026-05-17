<script setup lang="ts">
import siteConfig from '@/site-config'
import { useHashScroll } from '@/composables/useHashScroll'

const { onHashClick } = useHashScroll()
const { volume, issue } = siteConfig.editorial
const buildHash = typeof __BUILD_HASH__ !== 'undefined' ? __BUILD_HASH__ : 'dev'
const year = new Date().getUTCFullYear()
</script>

<template>
  <footer class="ed-footer">
    <div class="container">
      <div class="foot-grid">
        <div class="foot-brand">
          <span class="stamp">
            {{ siteConfig.author }}
            <br>
            <span class="stamp-sub">Software · Reasoning · Hardware</span>
          </span>
          <span class="sub">
            A personal site, set in Valkyrie B &amp; Inter Tight. Hand-laid in 2026
            from a small studio under the Blue Ridge.
          </span>
        </div>

        <div class="foot-col">
          <h4>Index</h4>
          <ul>
            <li><a href="/#about" @click="onHashClick($event)">About</a></li>
            <li><a href="/#work" @click="onHashClick($event)">Selected Work</a></li>
            <li><a href="/blog/">Writing</a></li>
            <li><a href="/now/">Now</a></li>
            <li><a href="/#contact" @click="onHashClick($event)">Contact</a></li>
          </ul>
        </div>

        <div class="foot-col">
          <h4>Elsewhere</h4>
          <ul>
            <li v-for="link in siteConfig.socialLinks" :key="link.text">
              <a :href="link.href" target="_blank" rel="noreferrer noopener">{{ link.text }} →</a>
            </li>
            <li><a href="https://little-loops.ai" target="_blank" rel="noreferrer noopener">little-loops.ai →</a></li>
            <li><a href="https://deep-codebase.com" target="_blank" rel="noreferrer noopener">deep-codebase.com →</a></li>
          </ul>
        </div>

        <div class="foot-col">
          <h4>Colophon</h4>
          <ul>
            <li>Display in Valkyrie B</li>
            <li>UI in Inter Tight</li>
            <li>Code in DM Mono</li>
            <li>Paper: #efe7d2</li>
            <li>Ink: #15140f</li>
          </ul>
        </div>
      </div>

      <div class="foot-bottom">
        <span>© {{ year }} {{ siteConfig.author }} · MIT · Made on Earth</span>
        <span>{{ volume }} · Issue {{ issue }} · Last build {{ buildHash }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.ed-footer {
  padding: 56px 0 max(40px, var(--safe-bottom));
  border-top: 1px solid var(--ink);
  background: var(--paper);
}
.foot-grid {
  display: grid;
  grid-template-columns: 1.4fr repeat(3, 1fr);
  gap: 32px;
  align-items: start;
}
.foot-brand {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.stamp {
  font-family: var(--serif);
  font-style: italic;
  font-size: 22px;
  color: var(--ink);
}
.stamp-sub {
  color: var(--ink-faint);
  font-style: normal;
  font-family: var(--sans);
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}
.foot-brand .sub {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-mute);
  letter-spacing: 0.04em;
  max-width: 320px;
}

.foot-col h4 {
  font-family: var(--sans);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin: 0 0 12px;
}
.foot-col ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
}
.foot-col a {
  font-family: var(--body);
  font-size: 14px;
  color: var(--ink);
  text-decoration: none;
  transition: color var(--dur-base) var(--ease-standard);
}
@media (hover: hover) and (pointer: fine) {
  .foot-col a:hover { color: var(--coral); }
}

.foot-bottom {
  margin-top: 56px;
  padding-top: 22px;
  border-top: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-mute);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

@media (max-width: 820px) {
  .foot-grid { grid-template-columns: 1fr 1fr; }
  .foot-bottom { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 480px) {
  .foot-grid { grid-template-columns: 1fr; }
}
</style>
