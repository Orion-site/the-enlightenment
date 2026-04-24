const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const vp of [
    { name: 'mobile',  width: 375,  height: 812 },
    { name: 'desktop', width: 1440, height: 900 },
  ]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3000/azul', { waitUntil: 'networkidle' }).catch(()=>{});
    await page.waitForTimeout(800);

    // Incrementally scroll to trigger every IntersectionObserver
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    const step = Math.floor(vp.height * 0.6);
    for (let y = 0; y < total; y += step) {
      await page.evaluate(pos => window.scrollTo(0, pos), y);
      await page.waitForTimeout(180);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    // capture specific anchor points
    const targets = [
      { y: 0, name: 'hero' },
      { y: vp.height * 0.9, name: 'vsl' },
      { y: vp.height * 2, name: 'twocolumn' },
      { y: vp.height * 3, name: 'details' },
      { y: vp.height * 4, name: 'icp' },
      { y: vp.height * 5.2, name: 'agenda' },
      { y: vp.height * 6.5, name: 'includes-price' },
      { y: vp.height * 7.8, name: 'pillars' },
      { y: total - vp.height, name: 'final-cta' },
    ];
    for (const t of targets) {
      await page.evaluate(pos => window.scrollTo(0, pos), t.y);
      await page.waitForTimeout(350);
      await page.screenshot({ path: path.join(__dirname, `azul-${vp.name}-${t.name}.png`), fullPage: false });
    }

    await ctx.close();
  }
  await browser.close();
  console.log('done');
})();
