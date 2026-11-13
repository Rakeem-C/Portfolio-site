export const SITE = {
  name: 'Rakeem Chapman',
  url: 'https://rakeemchapman.com',
  title: 'Rakeem Chapman · Bend the median',
  description:
    'Rakeem Chapman works on AI productivity and how its gains can benefit everyday people.',
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
  thesis: { label: 'Bend the Median', blurb: 'How AI productivity gains can spread to more people and businesses.' },
  'root-cause': { label: 'Root Cause', blurb: 'One problem per essay, examined from every angle.' },
  frontier: { label: 'From the Frontier', blurb: 'What evaluating models shows about where they work and where they fail.' },
  field: { label: 'From the Field', blurb: 'What happens when AI is put to work inside an operating business.' },
} as const;

export type SeriesKey = keyof typeof SERIES;
