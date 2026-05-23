import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  theme: {
    fontFamily: {
      serif: ['Valkyrie B', 'Times New Roman', 'serif'],
      sans:  ['Inter Tight', 'Inter', 'system-ui', 'sans-serif'],
      body:  ['Valkyrie B', 'Times New Roman', 'serif'],
      caps:  ['Valkyrie B Caps', 'Inter Tight', 'sans-serif'],
      mono:  ['DM Mono', 'SF Mono', 'Menlo', 'monospace'],
    },
    colors: {
      paper:      'var(--paper)',
      'paper-warm': 'var(--paper-warm)',
      'paper-dark': 'var(--paper-dark)',
      bone:       'var(--bone)',
      ink:        'var(--ink)',
      'ink-soft': 'var(--ink-soft)',
      'ink-mute': 'var(--ink-mute)',
      'ink-faint': 'var(--ink-faint)',
      coral:      'var(--coral)',
      'coral-soft': 'var(--coral-soft)',
      mustard:    'var(--mustard)',
      olive:      'var(--olive)',
      line:       'var(--line)',
      'line-soft': 'var(--line-soft)',
      'line-faint': 'var(--line-faint)',
    },
    // 8px grid spacing system for consistent rhythm
    spacing: {
      '0.5': '0.125rem',
      '1':   '0.25rem',
      '1.5': '0.375rem',
      '2':   '0.5rem',
      '2.5': '0.625rem',
      '3':   '0.75rem',
      '4':   '1rem',
      '5':   '1.25rem',
      '6':   '1.5rem',
      '8':   '2rem',
      '10':  '2.5rem',
      '12':  '3rem',
      '14':  '3.5rem',
      '16':  '4rem',
    },
  },
  shortcuts: [
    // Surfaces / text — paint from CSS vars so theme toggling is free
    {
      'bg-paper': 'bg-[var(--paper)]',
      'bg-bone':  'bg-[var(--bone)]',
      'text-ink':       'text-[var(--ink)]',
      'text-ink-soft':  'text-[var(--ink-soft)]',
      'text-ink-mute':  'text-[var(--ink-mute)]',
      'text-ink-faint': 'text-[var(--ink-faint)]',
      'text-coral':     'text-[var(--coral)]',
      'border-line':       'border-[var(--line)]',
      'border-line-soft':  'border-[var(--line-soft)]',
      'border-line-faint': 'border-[var(--line-faint)]',
    },
    // UI primitives
    {
      'nav-link':   'text-[var(--ink)] hover:text-[var(--coral)] transition-colors duration-200 cursor-pointer',
      'prose-link': 'text-[var(--ink)] no-underline border-b border-[var(--coral)] hover:text-[var(--coral)] transition-colors duration-200',
      'btn-primary': 'inline-flex items-center gap-3 px-5 py-3.5 rounded-full bg-[var(--ink)] text-[var(--paper)] border border-[var(--ink)] font-sans font-600 text-3 tracking-[0.08em] uppercase hover:bg-[var(--coral)] hover:border-[var(--coral)] transition-all duration-200',
      'btn-ghost':   'inline-flex items-center gap-3 px-5 py-3.5 rounded-full bg-transparent text-[var(--ink)] border border-[var(--ink)] font-sans font-600 text-3 tracking-[0.08em] uppercase hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-all duration-200',
      'pill': 'inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--ink)] font-sans font-600 text-3 tracking-[0.08em] uppercase',
      'eyebrow': 'font-sans font-600 text-[10.5px] tracking-[0.32em] uppercase text-[var(--ink-faint)]',
      'coord':   'font-mono text-[10.5px] tracking-[0.06em] uppercase text-[var(--ink-faint)]',
      'roman':   'font-serif italic font-500',
    },
    // Page-width tiers for <main>
    {
      'main-prose': 'max-w-[48rem]',
      'main-wide':  'max-w-[64rem]',
      'main-wider': 'max-w-[75rem]',
      'main-full':  'max-w-none',
    },
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      prefix: 'i-',
      extraProperties: { display: 'inline-block' },
    }),
    presetTypography(),
    presetWebFonts({
      // 'none' provider just normalizes the family stack; no font fetching.
      // Valkyrie B / Valkyrie B Caps / Inter Tight are self-hosted via @font-face.
      // DM Mono kept on Google for now; swap to self-hosted if full GF independence is desired.
      provider: 'google',
      fonts: {
        mono: 'DM Mono:400,600',
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: [
    'i-carbon-campsite',
    'i-simple-icons-github',
    'i-simple-icons-linkedin',
    'i-ri-github-line',
    'i-ri-arrow-up-line',
    'i-ri-moon-line',
    'i-ri-sun-line',
    'i-ri-rss-line',
    'i-ri-menu-2-fill',
  ],
})
