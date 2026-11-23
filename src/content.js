// Every word on the page lives here, one object per section. CONTENT.md is the source of truth.

// Every link on the page. All samples: replace the '#'s.
export const LINKS = {
  home: '#',
  hire: '#',
  watch: '#',
  featured: '#',
  projectAiBook: '#',
  projectBasketball: '#',
  projectLanguageApp: '#',
  codeRescue: '#',
  fullStack: '#',
}

export const SITE = {
  title: 'Grand Theft Developer',
  disclaimer: 'Fan-made GTA VI-style portfolio. Not affiliated with Rockstar Games.',
}

export const NAVBAR = {
  monogram: 'GTD',
  homeLabel: 'Grand Theft Developer, back to top',
  menuLabel: 'Open menu',
  cta: 'Hire Me',
}

export const HERO = {
  logoAlt: 'Grand Theft Developer',
  tagline: ['Full-stack developer', 'Booking spring 2027'],
  cta: 'Hire Me',
  tags: ['React', 'Node.js', 'PostgreSQL'],
  scrollLabel: 'Scroll for more content.',
}

export const LOADER = {
  label: 'Loading',
}

export const WATCH = {
  eyebrow: 'Watch',
  title: 'Meet the Developer',
  playLabel: 'Play: Meet the Developer',
  featured: { eyebrow: 'Watch', title: 'Ride Along', cta: 'Play' },
  // Order of the art, left to right. Titles over 23 characters take a smaller headline size (see Card.jsx).
  projects: [
    { eyebrow: 'AI', title: 'AI Book Assistant', link: 'projectAiBook' },
    { eyebrow: '3D Web', title: '3D Basketball Website', link: 'projectBasketball' },
    { eyebrow: 'Mobile', title: 'React Native Language App', link: 'projectLanguageApp' },
  ],
}

export const SERVICES = {
  cards: [
    {
      title: 'Code Rescue',
      text: 'For existing teams: slow pages, flaky deploys or a codebase nobody wants to touch. I find the problems, fix them and leave it documented.',
      cta: "See What's Included",
      link: 'codeRescue',
    },
    {
      eyebrow: 'For new products',
      title: ['Full-Stack', 'Builds'],
      text: 'Product, API and database, designed and shipped end to end, from the first sketch to production. Typically six to ten weeks.',
      cta: 'Start a Project',
      link: 'fullStack',
    },
  ],
}
