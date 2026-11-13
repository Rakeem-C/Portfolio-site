// Screenshots individual homepage sections after scrolling them into view (so lazy images load).
import { chromium } from 'file:///C:/Users/justa/Documents/aurelia/node_modules/playwright/index.mjs';
const browser = await chromium.launch();
for (const [w, h, tag] of [[1440, 900, 'desk'], [390, 844, 'mob']]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto('http://127.0.0.1:4400/', { waitUntil: 'networkidle' });
  for (const [sel, name] of [['.hero', 'hero'], ['.gap', 'gap'], ['.story', 'story'], ['.contact', 'contact']]) {
    const el = page.locator(sel).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await el.screenshot({ path: `.qa/${tag}-sec-${name}.png` });
  }
  const broken = await page.evaluate(() => [...document.images].filter((i) => !i.complete || !i.naturalWidth).map((i) => i.src));
  console.log(tag, 'unloaded images:', JSON.stringify(broken));
}
await browser.close();
