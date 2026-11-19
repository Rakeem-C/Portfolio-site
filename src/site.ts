export const SITE = {
  name: 'Rakeem Chapman',
  url: 'https://rakeemchapman.com',
  title: 'Rakeem Chapman · Bend the median',
  description:
    'Rakeem Chapman evaluates frontier AI models and builds AI systems for operating businesses — working to bend the median of what people and teams get from AI.',
  tagline: 'Bend the median.',
};

export const NAV = [
  { href: '/about', label: 'About' },
  { href: '/#idea', label: 'The idea' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/blog', label: 'Blog' },
  { href: 'https://open-meet-rakeem.vercel.app/', label: 'Open Meet' },
];

export const SERIES = {
  thesis: { label: 'Bend the Median', blurb: 'How AI productivity gains spread from power users to everyday teams and businesses.' },
  'root-cause': { label: 'Root Cause', blurb: 'One problem per essay, tested from every angle before proposing a fix.' },
  frontier: { label: 'From the Frontier', blurb: 'What evaluating frontier models and agents reveals about where they hold up and where they break.' },
  field: { label: 'From the Field', blurb: 'What happens when AI meets real phone lines, leads, schedules and back-office operations.' },
} as const;

export type SeriesKey = keyof typeof SERIES;
