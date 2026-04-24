const { chromium } = require('playwright');
const path = require('path');

const OUT = path.resolve(__dirname);
const BASE = 'http://localhost:3000';

const VIEWPORTS = [
  { name: 'mobile',  width: 375,  height: 812 },
  { name: 'tablet',  width: 768,  height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const ROUTES = [
  { name: 'azul',      url: '/azul' },
  { name: 'confirmed', url: '/confirmed' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });

  const findings = {};

  for (const vp of VIEWPORTS) {
    for (const route of ROUTES) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });
      const page = await ctx.newPage();

      const errors = [];
      page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
      });
      page.on('requestfailed', r => {
        errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText || ''}`);
      });

      try {
        await page.goto(BASE + route.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(()=>{});
        await page.waitForTimeout(800);

        // full page screenshot
        const fullPath = path.join(OUT, `${route.name}-${vp.name}-full.png`);
        await page.screenshot({ path: fullPath, fullPage: true });

        // viewport screenshot
        const vpPath = path.join(OUT, `${route.name}-${vp.name}-viewport.png`);
        await page.screenshot({ path: vpPath, fullPage: false });

        // Collect DOM info
        const info = await page.evaluate(() => {
          const info = {};
          // nav presence
          const navs = Array.from(document.querySelectorAll('nav, header'));
          info.navCount = navs.length;
          info.navs = navs.map(n => ({
            tag: n.tagName.toLowerCase(),
            classes: n.className?.toString?.() || '',
            text: (n.innerText || '').replace(/\s+/g,' ').trim().slice(0,200),
            rect: n.getBoundingClientRect().toJSON(),
            visible: !!(n.offsetWidth || n.offsetHeight || n.getClientRects().length),
          }));

          // footer presence
          const footers = Array.from(document.querySelectorAll('footer'));
          info.footerCount = footers.length;
          info.footers = footers.map(f => ({
            text: (f.innerText || '').replace(/\s+/g,' ').trim().slice(0,400),
            rect: f.getBoundingClientRect().toJSON(),
            visible: !!(f.offsetWidth || f.offsetHeight || f.getClientRects().length),
          }));

          // videos
          info.videos = Array.from(document.querySelectorAll('video')).map(v => ({
            src: v.currentSrc || v.src || '',
            poster: v.poster || '',
            autoplay: v.autoplay,
            loop: v.loop,
            muted: v.muted,
            playsInline: v.playsInline,
            paused: v.paused,
            readyState: v.readyState,
            videoWidth: v.videoWidth,
            videoHeight: v.videoHeight,
            rect: v.getBoundingClientRect().toJSON(),
            controls: v.controls,
          }));

          // buttons
          info.buttons = Array.from(document.querySelectorAll('button, a')).map(b => {
            const r = b.getBoundingClientRect();
            const style = window.getComputedStyle(b);
            return {
              tag: b.tagName.toLowerCase(),
              text: (b.innerText || '').replace(/\s+/g,' ').trim().slice(0,80),
              href: b.getAttribute('href') || '',
              visible: !!(b.offsetWidth || b.offsetHeight || b.getClientRects().length),
              rect: { x: r.x, y: r.y, w: r.width, h: r.height },
              color: style.color,
              borderColor: style.borderColor,
              borderWidth: style.borderWidth,
              textTransform: style.textTransform,
              background: style.backgroundColor,
            };
          });

          // headings
          info.headings = Array.from(document.querySelectorAll('h1,h2,h3,h4')).map(h => ({
            level: h.tagName,
            text: (h.innerText||'').replace(/\s+/g,' ').trim(),
            rect: h.getBoundingClientRect().toJSON(),
          }));

          // overall doc/body sizes
          info.doc = {
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            scrollHeight: document.documentElement.scrollHeight,
            clientHeight: document.documentElement.clientHeight,
          };

          // Look for any element that overflows horizontally
          const overflowing = [];
          document.querySelectorAll('*').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.right > document.documentElement.clientWidth + 1 && r.width > 2) {
              overflowing.push({
                tag: el.tagName.toLowerCase(),
                cls: (el.className?.toString?.() || '').slice(0,60),
                right: r.right,
                width: r.width,
                text: (el.innerText||'').slice(0,40),
              });
            }
          });
          info.overflowing = overflowing.slice(0, 20);

          // Entire body text to validate copy
          info.bodyText = (document.body.innerText || '').replace(/\s+/g,' ').trim();

          return info;
        });

        findings[`${route.name}-${vp.name}`] = { info, errors };
      } catch (err) {
        findings[`${route.name}-${vp.name}`] = { errors: [...errors, `NAV ERROR: ${err.message}`] };
      }

      await ctx.close();
    }
  }

  // Special: on desktop, for /azul, attempt to click the VSL play button and screenshot
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + '/azul', { waitUntil: 'networkidle', timeout: 30000 }).catch(()=>{});
    await page.waitForTimeout(1000);

    // Try to find a non-background video with a play button
    const vslInfo = await page.evaluate(() => {
      const vids = Array.from(document.querySelectorAll('video'));
      return vids.map((v, i) => {
        const r = v.getBoundingClientRect();
        return { i, autoplay: v.autoplay, controls: v.controls, poster: v.poster, rect: { y: r.y, h: r.height, w: r.width } };
      });
    });
    console.log('VIDEOS on /azul desktop:', JSON.stringify(vslInfo, null, 2));

    // scroll down to find any poster/play region - try scrolling to mid page
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.2));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT, 'azul-desktop-scroll1.png') });

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.4));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT, 'azul-desktop-scroll2.png') });

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.6));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT, 'azul-desktop-scroll3.png') });

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.8));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT, 'azul-desktop-scroll4.png') });

    await ctx.close();
  }

  await browser.close();

  // write findings
  require('fs').writeFileSync(path.join(OUT, 'findings.json'), JSON.stringify(findings, null, 2));
  console.log('DONE');
})().catch(err => { console.error(err); process.exit(1); });
