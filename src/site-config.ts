export const siteConfig = {
  author: 'Brennon Williams',
  title: 'Brennon Williams AI/ML Software Architect',
  subtitle: 'Explorations in code and language.',
  description: 'Personal website for Brennon Williams, AI/ML software architect.',
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
    get blogLinks() {
      return siteConfig.header.navLinks.filter(link => link.href.startsWith('/blog'))
    },
  },
}

export default siteConfig
