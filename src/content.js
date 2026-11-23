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
  openToWork: '#',
  afterHours: '#',
  caseStudy: '#',
  offTheClock: '#',
  clients: '#',
  clientsAll: '#',
  review: '#',
  blog: '#',
  post1: '#',
  post2: '#',
  post3: '#',
  buildYourOwn: '#',
  github: '#',
  linkedin: '#',
  x: '#',
  youtube: '#',
  email: '#',
  resume: '#',
  privacy: '#',
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

export const MIAMI = {
  title: 'Miami, USA.',
  bio: "I'm Jarvis, a full-stack developer who has spent eight years building products for startups, agencies and teams that need to ship fast without breaking things. I work across the whole stack, from the interface people see to the API and database behind it, and I care about code the next developer will thank me for.",
}

// Four wide cards. `side` is where the text sits, so each card's text lands where its art leaves room.
export const HIGHLIGHTS = [
  { eyebrow: 'Status', title: 'Open to Work', text: "Available for freelance and contract work from spring 2027, remote or on site in Miami.", cta: 'Hire Me', link: 'openToWork', side: 'left' },
  { eyebrow: 'Community', title: 'After Hours', text: "When the deploy's done, I'm out with Miami's dev crowd: meetups, talks and the occasional late-night hackathon.", cta: 'View All', link: 'afterHours', side: 'right' },
  { eyebrow: 'Case Study', title: 'The Heist: Shipped in Six Weeks', text: "How I rebuilt a booking platform's checkout and cut drop-offs by 31%.", cta: 'Read the Case Study', link: 'caseStudy', side: 'left' },
  { eyebrow: 'Personal', title: 'Off the Clock', text: 'Open-source contributor, weekend game jammer and the one who always brings the coffee to the meetup.', cta: 'More About Me', link: 'offTheClock', side: 'right' },
]

export const CLIENTS = {
  title: 'Clients',
  link: 'View All',
  cards: [
    { eyebrow: 'Sample Clients', title: 'Startups, Agencies and Product Teams', cta: 'See All Clients', link: 'clientsAll' },
    { eyebrow: 'Sample Review', title: '\u201cIncredibly fast, detail-oriented, and easy to work with.\u201d', cta: 'Read the Review', link: 'review' },
  ],
}

export const BLOG = {
  title: 'Blog',
  link: 'View all',
  posts: [
    { title: '700 AI Agents Escaped and Became Hackers', date: 'November 3, 2026', link: 'post1' },
    { title: 'Agentic Engineering in 2026', date: 'October 21, 2026', link: 'post2' },
    { title: 'Think System Design & Architecture', date: 'October 8, 2026', link: 'post3' },
  ],
}

export const FOOTER = {
  logoAlt: 'Grand Theft Developer',
  pill: { title: 'Build Your Own', text: "Want a portfolio like this? Here's how it was built, step by step." },
  socials: [
    { label: 'GitHub', link: 'github' },
    { label: 'LinkedIn', link: 'linkedin' },
    { label: 'X', link: 'x' },
    { label: 'YouTube', link: 'youtube' },
  ],
  links: [
    { label: 'Email', link: 'email' },
    { label: 'R\u00e9sum\u00e9', link: 'resume' },
    { label: 'Privacy', link: 'privacy' },
  ],
  badge: { title: 'Rated D for Developer', text: 'Clean Code, Mild Refactoring, Frequent Coffee.' },
  copyright: '\u00a9 2026 Grand Theft Developer.',
}
