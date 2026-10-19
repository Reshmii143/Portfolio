// All personal content lives here — edit this file to make the site yours.

export const site = {
  firstName: 'Reshmi',
  fullName: 'Reshmi',
  role: 'Frontend developer',
  city: 'Kolkata',
  tag: 'Fresher · open to work',
  email: 'reshmi0905kumari@gmail.com',
  // Put the PDF at public/resume.pdf — the button downloads it under this file name.
  resumeUrl: '/resume.pdf',
  resumeFile: 'Reshmi-Resume.pdf',
  github: 'https://github.com/Reshmii143',
  linkedin: 'https://www.linkedin.com/in/reshmi-kumari-183514442',
  portrait: 'https://picsum.photos/seed/reshmi-portrait/200/200',
}

export const about = {
  copy: [
    'I’m a fresher frontend developer who loves the moment a design file turns into something you can actually click. I care about clean, semantic HTML, CSS that doesn’t fight you, and JavaScript that stays out of the user’s way.',
    'I don’t have years of experience yet — what I do have is a habit of building. Every project on this site started as “how does that work?” and ended with me shipping it, breaking it, and making it better.',
  ],
  current:
    'Right now I’m looking for my first role — an internship or junior frontend position where I can learn from a great team and ship real things.',
  coffee:
    'When I’m not coding, you’ll find me recreating websites I love from scratch just to see how they’re built. Usually with coffee.',
  principles: [
    {
      title: 'Accessible by default',
      body: 'Keyboard navigation, real buttons, good contrast and alt text aren’t extras. If someone can’t use it, it isn’t finished.',
      sticky: 'semantic HTML first!',
      tone: 'cyan',
    },
    {
      title: 'Learning by building',
      body: 'Tutorials get me started, projects make it stick. I learn a new tool by building something small and real with it.',
      sticky: 'ship it, then polish.',
      tone: 'yellow',
    },
  ],
} as const

export type Project = {
  title: string
  stack: string[]
  year: string
  summary: string
  bg: string
  image: string
  live: string
  code: string
}

export const projects: Project[] = [
  {
    title: 'This portfolio',
    stack: ['Next.js', 'React.js', 'CSS'],
    year: '2026',
    summary:
      'An interactive portfolio with a scroll-driven project showcase, draggable Figma-style frames and eyes that follow your cursor — responsive from small phones to large desktops.',
    bg: '#a4e5f8',
    image: '/assets/img/projects/portfolio.png',
    live: 'https://reshmi-portfolio-six.vercel.app',
    code: 'https://github.com/Reshmii143/Portfolio',
  },
  {
    title: 'Solar System',
    stack: ['HTML5', 'CSS3', 'CSS animations'],
    year: '2026',
    summary:
      'An animated solar system built with only HTML and CSS — all eight planets orbit the Sun at their own speed, with zero JavaScript.',
    bg: '#f5dda1',
    image: '/assets/img/projects/solar-system.png',
    // Add the GitHub Pages URL here once Pages is switched on for the repo.
    live: '',
    code: 'https://github.com/Reshmii143/Solar-System-CsS',
  },
  {
    // The to-do app from Petro Komar's open-source "JS Mini Projects" collection — keep the credit in the summary.
    title: 'To-do List',
    stack: ['JavaScript (ES6+)', 'localStorage', 'CSS3'],
    year: '2026',
    summary:
      'A to-do app in vanilla JavaScript: add, edit inline, tick off and clear tasks — all saved in localStorage so nothing is lost on refresh. Based on Petro Komar’s open-source collection.',
    bg: '#a1dfc5',
    image: '/assets/img/projects/todo-list.png',
    live: '',
    code: 'https://github.com/Reshmii143/JS-Project/tree/main/03-todo-list',
  },
]

export type SkillGroup = { title: string; tone: 'cyan' | 'yellow' | 'mint' | 'pink'; note: string; skills: string[] }

export const skillGroups: SkillGroup[] = [
  { title: 'Languages', tone: 'cyan', note: 'the foundations', skills: ['HTML5', 'CSS3', 'JavaScript (ES6+)'] },
  { title: 'Frameworks & libraries', tone: 'yellow', note: 'daily drivers', skills: ['React.js', 'Next.js', 'Tailwind CSS'] },
  {
    title: 'Tools & practices',
    tone: 'mint',
    note: 'how I ship',
    skills: ['Git & GitHub', 'VS Code', 'Figma', 'npm', 'Vercel', 'Chrome DevTools', 'Responsive UI Design'],
  },
  { title: 'Currently learning', tone: 'pink', note: 'work in progress', skills: ['Testing with Vitest', 'Web Performance', 'Accessibility (WCAG)'] },
]

// Example entries — replace with Reshmi's real certificates and credential links.
export type Certification = { title: string; issuer: string; year: string; url: string; tone: 'cyan' | 'yellow' | 'mint' | 'pink' }

export const certifications: Certification[] = [
  { title: 'Responsive Web Design', issuer: 'freeCodeCamp', year: '2025', url: '#', tone: 'cyan' },
  { title: 'JavaScript Algorithms and Data Structures', issuer: 'freeCodeCamp', year: '2025', url: '#', tone: 'yellow' },
  { title: 'Meta Front-End Developer', issuer: 'Coursera', year: '2025', url: '#', tone: 'mint' },
  { title: 'React — The Complete Guide', issuer: 'Udemy', year: '2024', url: '#', tone: 'pink' },
]
