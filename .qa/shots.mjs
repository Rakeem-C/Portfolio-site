// Local QA: screenshots every page at desktop + mobile, flags horizontal overflow and console errors,
// and exercises the diffusion figure. Run against `npm run dev -- --port 4400 --host 127.0.0.1`.
import { chromium } from 'file:///C:/Users/justa/Documents/aurelia/node_modules/playwright/index.mjs';
const base = 'http://127.0.0.1:4400';
const pages = ['/', '/portfolio', '/blog', '/blog/ai-gains-follow-a-power-law', '/blog/every-angle', '/about', '/nope'];
const browser = await chromium.launch();
const errors = [];
for (const [w, h, tag] of [[1440, 900, 'desk'], [390, 844, 'mob']]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  page.on('console', (m) => m.type() === 'error' && !m.text().includes('404') && errors.push(`${tag} ${page.url()} ${m.text()}`));
  page.on('pageerror', (e) => errors.push(`${tag} ${page.url()} ${e.message}`));
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const name = p === '/' ? 'home' : p.slice(1).replace(/\//g, '_');
    await page.screenshot({ path: `.qa/${tag}-${name}.png`, fullPage: true });
    const overflow = await page.evaluate(() => {
      const max = document.documentElement.clientWidth;
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.width && r.right > max + 1) return `${el.tagName}.${String(el.className).split(' ')[0]} right=${Math.round(r.right)}`;
      }
      return null;
    });
    if (overflow) console.log(`${tag} ${name}: OVERFLOW ${overflow}`);
  }
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const read = () => page.evaluate(() => ['median', 'top', 'reach'].map((k) => document.querySelector(`[data-${k}]`)?.textContent).join(' | '));
  console.log(`${tag} today:    `, await read());
  await page.click('[data-diffuse]');
  await page.waitForTimeout(4500);
  console.log(`${tag} diffused: `, await read(), 'slider=', await page.inputValue('[data-transfer]'));
  await page.locator('[data-canvas]').scrollIntoViewIfNeeded();
  const c = await page.locator('[data-canvas]').boundingBox();
  for (const [fx, fy] of [[0.6, 0.3], [0.8, 0.7], [0.45, 0.8]]) await page.mouse.click(c.x + c.width * fx, c.y + c.height * fy);
  await page.waitForTimeout(3000);
  console.log(`${tag} +3 translators:`, await read());
  await page.locator('[data-diffusion]').screenshot({ path: `.qa/${tag}-fig-diffused.png` });
  await page.click('[data-reset]');
  await page.waitForTimeout(4500);
  console.log(`${tag} reset:    `, await read(), 'slider=', await page.inputValue('[data-transfer]'));
}
await browser.close();
console.log('errors:', JSON.stringify(errors));
