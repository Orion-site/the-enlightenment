// Re-capture leadestate.com with cookie banner dismissed for cleaner hero reads.
const { chromium } = require('playwright');
const path = require('path');

const OUT = '/Users/tomaz/Coding Projects/TE Madrid/screenshots/design-ref';

async function dismissCookies(page) {
  // Try common selectors/texts.
  const candidates = [
    'button:has-text("Reject all")',
    'button:has-text("Accept all")',
    'button:has-text("Accept")',
    '[aria-label*="close" i]',
  ];
  for (const sel of candidates) {
    const btn = await page.$(sel);
    if (btn) {
      try { await btn.click({ timeout: 2000 }); await page.waitForTimeout(600); return; } catch {}
    }
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const vp of [
    { label: 'desktop', width: 1440, height: 900 },
    { label: 'mobile',  width: 375,  height: 812 },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent:
        vp.label === 'mobile'
          ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
          : undefined,
    });
    const page = await ctx.newPage();
    await page.goto('https://leadestate.com', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // Dismiss cookie banner.
    await dismissCookies(page);
    await page.waitForTimeout(500);

    // Hero-only screenshot.
    await page.screenshot({ path: path.join(OUT, `leadestate-${vp.label}-hero-clean.png`), fullPage: false });

    // Scroll through once to trigger lazy reveals, then top.
    await page.evaluate(async () => {
      await new Promise((res) => {
        let y = 0;
        const h = window.innerHeight;
        const iv = setInterval(() => {
          window.scrollBy(0, h);
          y += h;
          if (y >= document.body.scrollHeight + 1000) { clearInterval(iv); res(); }
        }, 250);
      });
    });
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Clean viewport slices for key sections (scroll by viewport).
    const docH = await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
    const vh = vp.height;
    const slices = Math.min(Math.ceil(docH / vh), 10);
    for (let i = 0; i < slices; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), i * vh);
      await page.waitForTimeout(700);
      await page.screenshot({
        path: path.join(OUT, `leadestate-${vp.label}-clean-slice-${String(i + 1).padStart(2, '0')}.png`),
        fullPage: false,
      });
    }

    await ctx.close();
  }
  await browser.close();
})();
