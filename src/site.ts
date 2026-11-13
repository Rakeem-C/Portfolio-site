export const SITE = {
  name: 'Rakeem Chapman',
  url: 'https://rakeemchapman.com',
  title: 'Rakeem Chapman · Bend the median',
  description:
    'Rakeem Chapman on bending the median of AI: why the heaviest users get 50× more out of the same models than the typical user, and how to close the gap.',
  tagline: 'Bend the median.',
};

export const NAV = [
  { href: '/about', label: 'About' },
  { href: '/#idea', label: 'The idea' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/blog', label: 'Blog' },
  { href: 'https://meet.automationation.com/', label: 'Open Meet' },
];

export const SERIES = {
  thesis: { label: 'Bend the Median', blurb: 'Why AI’s productivity gains concentrate at the top, and what moves the middle.' },
  'root-cause': { label: 'Root Cause', blurb: 'One problem per essay, examined from every angle.' },
  frontier: { label: 'From the Frontier', blurb: 'What evaluating models shows about where they work and where they fail.' },
  field: { label: 'From the Field', blurb: 'What happens when AI is put to work inside an operating business.' },
} as const;

export type SeriesKey = keyof typeof SERIES;
