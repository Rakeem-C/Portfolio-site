# rakeemchapman.com

Personal brand site for Rakeem Chapman. Brand line: **"Bend the median."** Shows how he thinks (data, first principles, root causes) and what matters to him (spreading AI's gains beyond the few closest to the frontier). Home for future essays.

## Content rules
- Do not name specific companies, clients, contracts, products or initiatives Rakeem works on. Describe the type of work only.
- Use "bend the median" terminology (not "move the median" or "working on everyone else").
- Voice: matter-of-fact and analytical, like Rakeem's own writing. State the claim, define terms, explain the mechanism, back it with numbers, weigh both sides. Entrepreneurial and upside-focused, not nonprofit or "help the poor vs. the 1%". No slogans, filler or superficial flourishes. If there's no real material for a section, leave it out.
- Core framing: the top 1% of AI users get ~50× more done while the median gets ~1.5×, on the same models. The gap is usage, not access. Bending the median = moving the middle of that distribution.
- Ideas front and center. No biography: no hometown, current location, education, or athletics. (He was not self-taught; he trained at a web development academy. Don't claim otherwise.)
- Photos live in `public/images/` (hero, portrait, mural). The hero is the podium photo (`E:\ran\Pro photo.webp`), chosen by Rakeem. Don't use the colorful-shirt street photo (removed at his request).
- Do not link to LinkedIn, GitHub, or X anywhere on the site. Contact happens through the contact form at /#contact (POST /api/contact). The destination address lives only in the host env (CONTACT_TO) and must never appear in source, HTML, JS, or console. Bot protection: honeypot + per-IP rate limit always on; Turnstile activates when PUBLIC_TURNSTILE_SITE_KEY + TURNSTILE_SECRET_KEY are both set in the host env (fails closed without a valid token).
- Any statistic must cite a primary source on the page (e.g. SBA Office of Advocacy).
- Essays live in `src/content/writing/*.mdx`. `draft: true` shows in dev only and is excluded from production builds.
- Series keys are defined in `src/site.ts` (`SERIES`) and must match the enum in `src/content.config.ts`.

## Commands
- `npm run dev` (local), `npm run build` (static output in `dist/`), `npm run preview`
- `rolldown` is pinned to 1.2.16 via `overrides` because Windows Application Control blocks the 1.3.0 native binary on this machine.
- QA: run `npx astro dev --port 4400 --host 127.0.0.1`, then `node .qa/shots.mjs` (uses Playwright from `C:\Users\justa\Documents\aurelia\node_modules`). It screenshots every page at desktop and mobile, flags horizontal overflow and console errors, and exercises the diffusion model on the homepage.

## Design system
- Paper + graph-grid background, ink-black type, one cobalt accent (`--accent`). Fonts: Newsreader (serif), Inter Tight (sans), JetBrains Mono (labels).
- Personal-brand layout: name + photo hero, offset accent shadows on photos, dark story band, cobalt contact band. Interactive figures must state when a model is illustrative.
