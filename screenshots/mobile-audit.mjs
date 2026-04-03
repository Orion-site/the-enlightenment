import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const ROUTES = ['/', '/welcome', '/saloon', '/network', '/brotherhood', '/booked'];
const DIR = '/Users/tomaz/Coding Projects/TE Madrid/screenshots';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  });

  for (const route of ROUTES) {
    const name = route === '/' ? 'home' : route.slice(1);
    const page = await context.newPage();

    console.log(`\n=== Navigating to ${route} ===`);
    await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000); // let images/videos/animations settle

    // Full page screenshot
    await page.screenshot({ path: `${DIR}/${name}-mobile-full.png`, fullPage: true });
    console.log(`  Saved ${name}-mobile-full.png`);

    // Viewport-only screenshot (above the fold)
    await page.screenshot({ path: `${DIR}/${name}-mobile-viewport.png`, fullPage: false });
    console.log(`  Saved ${name}-mobile-viewport.png`);

    // Get page height info
    const dims = await page.evaluate(() => ({
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
      bodyHeight: document.body.scrollHeight,
    }));
    console.log(`  Page dimensions: scrollH=${dims.scrollHeight}, clientH=${dims.clientHeight}`);

    // Scroll down in chunks and screenshot each fold
    const folds = Math.ceil(dims.scrollHeight / 844);
    for (let i = 1; i < Math.min(folds, 8); i++) {
      await page.evaluate((y) => window.scrollTo(0, y), i * 800);
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${DIR}/${name}-mobile-fold${i}.png`, fullPage: false });
      console.log(`  Saved ${name}-mobile-fold${i}.png`);
    }

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    await page.close();
  }

  await browser.close();
  console.log('\nDone!');
})();
