import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const DIR = '/Users/tomaz/Coding Projects/TE Madrid/screenshots';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  // Test 1: Nav drawer close button
  console.log('=== Test: Nav drawer close ===');
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  const hamburger = await page.$('[class*="hamburger"], [class*="burger"], nav button, header button');
  if (hamburger) {
    await hamburger.click();
    await page.waitForTimeout(800);

    // Close via X button
    const closeBtn = await page.$('button[aria-label*="Close"], [class*="drawerClose"], [class*="close"]');
    if (closeBtn) {
      await closeBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${DIR}/nav-closed-mobile.png`, fullPage: false });
      console.log('  Closed via close button');
    }
  }

  // Test 2: Hero section measurements
  console.log('\n=== Test: Hero section measurements ===');
  const routes = [
    { path: '/', name: 'home' },
    { path: '/saloon', name: 'saloon' },
    { path: '/network', name: 'network' },
    { path: '/brotherhood', name: 'brotherhood' },
    { path: '/booked', name: 'booked' },
    { path: '/welcome', name: 'welcome' },
  ];

  for (const route of routes) {
    await page.goto(`${BASE}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    const measurements = await page.evaluate(() => {
      const vh = window.innerHeight;
      const main = document.querySelector('main');
      const firstChild = main?.firstElementChild;
      const hero = document.querySelector('[class*="hero"], [class*="Hero"]') || firstChild;
      const footer = document.querySelector('footer');
      const nav = document.querySelector('nav') || document.querySelector('header');

      const getRect = (el) => el ? el.getBoundingClientRect() : null;

      return {
        viewport: { w: window.innerWidth, h: vh },
        pageHeight: document.documentElement.scrollHeight,
        hero: hero ? {
          tag: hero.tagName,
          className: hero.className.slice(0, 80),
          height: Math.round(getRect(hero).height),
          pctViewport: (getRect(hero).height / vh * 100).toFixed(0),
        } : null,
        nav: nav ? {
          height: Math.round(getRect(nav).height),
        } : null,
        footer: footer ? {
          height: Math.round(getRect(footer).height),
          pctViewport: (getRect(footer).height / vh * 100).toFixed(0),
        } : null,
      };
    });

    console.log(`  ${route.name}:`);
    console.log(`    Page: ${measurements.pageHeight}px total`);
    console.log(`    Nav: h=${measurements.nav?.height}px`);
    console.log(`    Hero: h=${measurements.hero?.height}px (${measurements.hero?.pctViewport}% vh) [${measurements.hero?.className?.slice(0, 60)}]`);
    console.log(`    Footer: h=${measurements.footer?.height}px (${measurements.footer?.pctViewport}% vh)`);
  }

  // Test 3: Font sizes check
  console.log('\n=== Test: Font sizes ===');
  for (const route of routes) {
    await page.goto(`${BASE}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);

    const fonts = await page.evaluate(() => {
      const results = [];
      const headings = document.querySelectorAll('h1, h2, h3');
      for (const h of headings) {
        const styles = window.getComputedStyle(h);
        results.push({
          tag: h.tagName,
          text: h.textContent?.trim().slice(0, 40),
          fontSize: styles.fontSize,
          lineHeight: styles.lineHeight,
        });
      }
      return results;
    });

    if (fonts.length > 0) {
      console.log(`  ${route.name}:`);
      for (const f of fonts) {
        console.log(`    ${f.tag}: "${f.text}" - size=${f.fontSize}, lh=${f.lineHeight}`);
      }
    }
  }

  // Test 4: Horizontal overflow
  console.log('\n=== Test: Horizontal overflow ===');
  for (const route of routes) {
    await page.goto(`${BASE}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);

    const overflow = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const vpWidth = window.innerWidth;

      // Find elements causing overflow
      const overflowEls = [];
      if (docWidth > vpWidth) {
        const all = document.querySelectorAll('*');
        for (const el of all) {
          const rect = el.getBoundingClientRect();
          if (rect.right > vpWidth + 5) {
            overflowEls.push({
              tag: el.tagName,
              class: el.className?.toString().slice(0, 50),
              right: Math.round(rect.right),
            });
          }
        }
      }
      return { docWidth, vpWidth, hasOverflow: docWidth > vpWidth, overflowEls: overflowEls.slice(0, 5) };
    });

    const status = overflow.hasOverflow ? `OVERFLOW (${overflow.docWidth}px > ${overflow.vpWidth}px)` : 'OK';
    console.log(`  ${route.name}: ${status}`);
    if (overflow.overflowEls.length > 0) {
      for (const e of overflow.overflowEls) {
        console.log(`    ${e.tag}.${e.class} extends to ${e.right}px`);
      }
    }
  }

  // Test 5: Touch targets
  console.log('\n=== Test: Touch target sizes (< 44px) ===');
  for (const route of routes) {
    await page.goto(`${BASE}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);

    const small = await page.evaluate(() => {
      const MIN = 44;
      const issues = [];
      for (const el of document.querySelectorAll('a, button')) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && (rect.height < MIN || rect.width < MIN)) {
          issues.push({
            tag: el.tagName,
            text: el.textContent?.trim().slice(0, 30),
            w: Math.round(rect.width),
            h: Math.round(rect.height),
          });
        }
      }
      return issues;
    });

    if (small.length > 0) {
      console.log(`  ${route.name}: ${small.length} undersized`);
      for (const s of small) {
        console.log(`    ${s.tag} "${s.text}" ${s.w}x${s.h}`);
      }
    } else {
      console.log(`  ${route.name}: all OK`);
    }
  }

  // Test 6: Image in footer area
  console.log('\n=== Test: Footer details ===');
  await page.goto(`${BASE}/saloon`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  const footerDetails = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    if (!footer) return null;
    const styles = window.getComputedStyle(footer);
    const children = Array.from(footer.children).map(c => ({
      tag: c.tagName,
      class: c.className?.toString().slice(0, 50),
      height: Math.round(c.getBoundingClientRect().height),
      text: c.textContent?.trim().slice(0, 60),
    }));
    return {
      totalHeight: Math.round(footer.getBoundingClientRect().height),
      padding: `${styles.paddingTop} / ${styles.paddingBottom}`,
      children,
    };
  });
  console.log('  Footer structure:', JSON.stringify(footerDetails, null, 2));

  // Test 7: Check the GHL calendar embed
  console.log('\n=== Test: Calendar embed ===');
  const calInfo = await page.evaluate(() => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      const rect = iframe.getBoundingClientRect();
      return { src: iframe.src?.slice(0, 100), w: rect.width, h: rect.height };
    }
    // Check for calendar div
    const cal = document.querySelector('[class*="calendar"], [class*="Calendar"], [id*="calendar"]');
    if (cal) {
      const rect = cal.getBoundingClientRect();
      return { class: cal.className?.slice(0, 80), w: rect.width, h: rect.height };
    }
    return 'no calendar found';
  });
  console.log('  Calendar:', JSON.stringify(calInfo));

  await browser.close();
  console.log('\nDone!');
})();
