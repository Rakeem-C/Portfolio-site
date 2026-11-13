import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://rakeemchapman.com',
  devToolbar: { enabled: false },
  markdown: { syntaxHighlight: false },
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "object-src 'none'",
        "base-uri 'none'",
        "form-action 'self' https://rakeemchapman-site.vercel.app",
        "connect-src 'self' https://rakeemchapman-site.vercel.app https://challenges.cloudflare.com",
        'frame-src https://challenges.cloudflare.com',
        "img-src 'self' data:",
        "font-src 'self' data:",
      ],
      scriptDirective: { resources: ["'self'", 'https://challenges.cloudflare.com'] },
    },
  },
  adapter: vercel(),
  integrations: [mdx()],
});
