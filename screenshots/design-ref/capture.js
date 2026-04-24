const { chromium } = require('playwright');
const path = require('path');

const OUT = '/Users/tomaz/Coding Projects/TE Madrid/screenshots/design-ref';

const TARGETS = [
  { name: 'go-leadestate', url: 'https://go.leadestate.com' },
  { name: 'leadestate',    url: 'https://leadestate.com' },
  { name: 'azul',          url: 'http://localhost:3000/azul' },
];

const VIEWPORTS = [
  { label: 'desktop', width: 1440, height: 900 },
  { label: 'mobile',  width: 375,  height: 812 },
];

async function autoScrollAndCaptureSlices(page, outBase) {
  // Scroll through the page slowly to trigger any lazy loads / scroll reveals.
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = 400;
      const interval = setInterval(() => {
        window.scrollBy(0, step);
        y += step;
        if (y >= document.body.scrollHeight + 1000) {
          clearInterval(interval);
          resolve();
        }
      }, 180);
    });
  });
  await page.waitForTimeout(1200);
  // Scroll back to top for the full-page capture.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
}

async function captureSlicedViewport(page, outPrefix) {
  // Capture sequential viewport-height slices so we can read each in detail.
  const viewportH = await page.evaluate(() => window.innerHeight);
  const docH = await page.evaluate(() => Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight
  ));
  const slices = Math.min(Math.ceil(docH / viewportH), 10);
  for (let i = 0; i < slices; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * viewportH);
    await page.waitForTimeout(700);
    await page.screenshot({
      path: `${outPrefix}-slice-${String(i + 1).padStart(2, '0')}.png`,
      fullPage: false,
    });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const tgt of TARGETS) {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
        userAgent:
          vp.label === 'mobile'
            ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
            : undefined,
      });
      const page = await context.newPage();
      const prefix = path.join(OUT, `${tgt.name}-${vp.label}`);
      console.log(`\n→ ${tgt.url} @ ${vp.label} (${vp.width}×${vp.height})`);

      try {
        await page.goto(tgt.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        // Wait for network to settle if possible, but don't fail if it never does.
        await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
        // Generous settle for animations / PageTransition / fonts.
        await page.waitForTimeout(1500);

        await autoScrollAndCaptureSlices(page, prefix);

        // Full-page screenshot.
        await page.screenshot({
          path: `${prefix}-full.png`,
          fullPage: true,
        });
        console.log(`  ✓ full-page saved: ${prefix}-full.png`);

        // Viewport-height slices for readability.
        await captureSlicedViewport(page, prefix);
        console.log(`  ✓ slices saved for ${tgt.name}-${vp.label}`);
      } catch (err) {
        console.error(`  ✗ ${tgt.url} @ ${vp.label} failed:`, err.message);
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();
  console.log('\nDone.');
})();
