export const siteConfig = {
  author: 'Brennon Williams',
  title: 'Brennon Williams Software Engineer',
  subtitle: 'Explorations in code and language.',
  description: 'Personal website for Brennon Williams, software engineer.',
  image: {
    src: '/hero.jpg',
    alt: 'Website Main Image',
  },
  email: 'brennon@brennonw.com',
  socialLinks: [
    {
      text: 'GitHub',
      href: 'https://github.com/BrennonTWilliams',
      icon: 'i-simple-icons-github',
      header: 'i-ri-github-line',
    },
    {
      text: 'Linkedin',
      href: 'https://www.linkedin.com/in/brennon-williams-ai/',
      icon: 'i-simple-icons-linkedin',
    },
  ],
  header: {
    logo: {
      src: '/favicon.svg',
      alt: 'Logo Image',
    },
    navLinks: [
      {
        text: 'Writing',
        href: '/blog',
      },
      {
        text: 'Notes',
        href: '/blog/notes',
      },
      {
        text: 'Talks',
        href: '/blog/talks',
      },
      {
        text: 'Projects',
        href: '/projects',
      },
    ],
  },
  page: {
    blogLinks: [
      {
        text: 'Writing',
        href: '/blog',
      },
      {
        text: 'Notes',
        href: '/blog/notes',
      },
      {
        text: 'Talks',
        href: '/blog/talks',
      },
    ],
  },
  footer: {
    navLinks: [
      {
        text: 'Posts Props',
        href: '/posts-props',
      },
      {
        text: 'Markdown Style',
        href: '/md-style',
      },
      {
        text: 'View on Astro',
        href: 'https://astro.build/themes/details/vitesse-theme-for-astro/',
      },
      {
        text: 'GitHub Repository',
        href: 'https://github.com/kevinwong865/astro-theme-vitesse',
      },
    ],
  },
}

export default siteConfig
