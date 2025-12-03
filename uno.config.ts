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
      sans: ['Valkyrie B', 'sans-serif'],
      mono: ['DM Mono', 'monospace'],
    },
    // 8px grid spacing system for consistent rhythm
    spacing: {
      '0.5': '0.125rem',  // 2px
      '1': '0.25rem',     // 4px
      '1.5': '0.375rem',  // 6px
      '2': '0.5rem',      // 8px
      '2.5': '0.625rem',  // 10px
      '3': '0.75rem',     // 12px
      '4': '1rem',        // 16px
      '5': '1.25rem',     // 20px
      '6': '1.5rem',      // 24px
      '8': '2rem',        // 32px
      '10': '2.5rem',     // 40px
      '12': '3rem',       // 48px
      '14': '3.5rem',     // 56px
      '16': '4rem',       // 64px
    },
  },
  shortcuts: [
    // Color system - refined for elegance (inspired by LessWrong)
    {
      'bg-main': 'bg-white dark:bg-hex-0d1117',
      'bg-surface': 'bg-hex-fafafa dark:bg-hex-161b22',
      'text-main': 'text-black/87 dark:text-white/87',
      'text-secondary': 'text-black/54 dark:text-white/54',
      'text-tertiary': 'text-black/38 dark:text-white/38',
      'text-muted': 'text-black/26 dark:text-white/26',
      'text-link': 'text-black/90 dark:text-white/90',
      'border-main': 'border-black/12 dark:border-white/12',
      'border-subtle': 'border-black/6 dark:border-white/6',
    },
    // Accent color system - muted green for sophistication
    {
      'text-accent': 'text-hex-5f9b65 dark:text-hex-7ab882',
      'text-accent-hover': 'text-hex-426c46 dark:text-hex-5f9b65',
      'bg-accent': 'bg-hex-5f9b65 dark:bg-hex-7ab882',
      'bg-accent-hover': 'bg-hex-426c46 dark:bg-hex-5f9b65',
      'border-accent': 'border-hex-5f9b65 dark:border-hex-7ab882',
    },
    // UI components - refined
    {
      'text-title': 'text-link text-4xl font-500',
      'nav-link': 'text-link opacity-70 hover:opacity-100 transition-opacity duration-200 cursor-pointer',
      'prose-link': 'text-accent cursor-pointer underline decoration-current/40 underline-offset-2 hover:text-accent-hover hover:decoration-current/70 transition-colors duration-200',
      'container-link': 'p-2 opacity-60 hover:opacity-100 cursor-pointer hover:bg-black/4 dark:hover:bg-white/4 transition-colors transition-opacity duration-200',
      'shadow-soft': 'shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.04)]',
      'shadow-elevated': 'shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.08)]',
    },
    // Glassmorphic effects
    {
      'glass': 'bg-white/80 dark:bg-hex-0d1117/80 backdrop-blur-md',
      'glass-subtle': 'bg-white/65 dark:bg-hex-0d1117/65 backdrop-blur-sm',
    },
    {
      'hr-line': 'w-14 mx-auto my-8 border-solid border-1px border-black/8 dark:border-white/8',
    },
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      prefix: 'i-',
      extraProperties: {
        display: 'inline-block',
      },
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        // Valkyrie B is loaded locally via @font-face in global.css
        // Only load web fonts that aren't available locally
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
  ],
})
