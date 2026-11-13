import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://rakeemchapman.com',
  devToolbar: { enabled: false },
  adapter: vercel(),
  integrations: [mdx()],
});
