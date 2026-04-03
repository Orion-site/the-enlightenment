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

  // Test: Horizontal overflow
  console.log('=== Test: Horizontal overflow ===');
  const routes = ['/', '/saloon', '/network', '/brotherhood', '/booked', '/welcome'];
  for (const route of routes) {
    const page = await context.newPage();
    await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    const overflow = await page.evaluate(() => {
      return {
        docWidth: document.documentElement.scrollWidth,
        vpWidth: window.innerWidth,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    console.log(`  ${route}: docW=${overflow.docWidth}, vpW=${overflow.vpWidth}, overflow=${overflow.hasOverflow}`);
    await page.close();
  }

  // Test: Touch targets on home
  console.log('\n=== Test: Touch targets ===');
  for (const route of routes) {
    const page = await context.newPage();
    await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

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
      console.log(`  ${route}: ${small.length} undersized`);
      for (const s of small) {
        console.log(`    ${s.tag} "${s.text}" ${s.w}x${s.h}`);
      }
    } else {
      console.log(`  ${route}: all OK`);
    }
    await page.close();
  }

  // Test: Footer structure
  console.log('\n=== Test: Footer structure ===');
  const page = await context.newPage();
  await page.goto(`${BASE}/saloon`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  const footerDetails = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    if (!footer) return null;
    const styles = window.getComputedStyle(footer);
    return {
      totalHeight: Math.round(footer.getBoundingClientRect().height),
      padding: `top=${styles.paddingTop} bottom=${styles.paddingBottom}`,
      innerHTML: footer.innerHTML.slice(0, 1500),
    };
  });
  console.log(`  Footer height: ${footerDetails?.totalHeight}px`);
  console.log(`  Padding: ${footerDetails?.padding}`);

  // Home footer special case
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  const homeFooter = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    if (!footer) return null;
    return {
      totalHeight: Math.round(footer.getBoundingClientRect().height),
      display: window.getComputedStyle(footer).display,
      visibility: window.getComputedStyle(footer).visibility,
    };
  });
  console.log(`  Home footer: h=${homeFooter?.totalHeight}px, display=${homeFooter?.display}, visibility=${homeFooter?.visibility}`);

  // Test: Spacing between sections on home
  console.log('\n=== Test: Section spacing on home ===');
  const sections = await page.evaluate(() => {
    const main = document.querySelector('main');
    if (!main) return [];
    return Array.from(main.querySelectorAll('section, hr')).map(s => {
      const rect = s.getBoundingClientRect();
      const styles = window.getComputedStyle(s);
      return {
        tag: s.tagName,
        class: s.className?.slice(0, 60),
        height: Math.round(rect.height),
        marginTop: styles.marginTop,
        marginBottom: styles.marginBottom,
        paddingTop: styles.paddingTop,
        paddingBottom: styles.paddingBottom,
      };
    });
  });
  for (const s of sections) {
    console.log(`  ${s.tag} [${s.class}]: h=${s.height}px, mt=${s.marginTop}, mb=${s.marginBottom}, pt=${s.paddingTop}, pb=${s.paddingBottom}`);
  }

  // Test: CTA positions relative to viewport
  console.log('\n=== Test: Hero CTA visibility ===');
  for (const route of ['/', '/saloon', '/network', '/brotherhood']) {
    const p = await context.newPage();
    await p.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await p.waitForTimeout(2000);

    const cta = await p.evaluate(() => {
      const links = document.querySelectorAll('a[href], button');
      const heroCtas = [];
      for (const l of links) {
        const text = l.textContent?.trim();
        if (text && (text.includes('ENTER') || text.includes('RESERVE') || text.includes('JOIN') || text.includes('APPLY') || text.includes('LEARN'))) {
          const rect = l.getBoundingClientRect();
          heroCtas.push({
            text: text.slice(0, 40),
            top: Math.round(rect.top),
            bottom: Math.round(rect.bottom),
            inViewport: rect.bottom <= window.innerHeight,
            vh: window.innerHeight,
          });
        }
      }
      return heroCtas;
    });
    console.log(`  ${route}:`);
    for (const c of cta) {
      console.log(`    "${c.text}" bottom=${c.bottom}px, visible=${c.inViewport} (vh=${c.vh})`);
    }
    await p.close();
  }

  // Test: Image below map on footer pages
  console.log('\n=== Test: Footer map/embed area ===');
  const p2 = await context.newPage();
  await p2.goto(`${BASE}/saloon`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await p2.waitForTimeout(2000);

  // Scroll to bottom and screenshot
  await p2.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await p2.waitForTimeout(500);
  await p2.screenshot({ path: `${DIR}/saloon-footer-mobile.png`, fullPage: false });
  console.log('  Saved saloon-footer-mobile.png');

  const mapInfo = await p2.evaluate(() => {
    const iframes = document.querySelectorAll('iframe');
    return Array.from(iframes).map(i => ({
      src: i.src?.slice(0, 80),
      w: Math.round(i.getBoundingClientRect().width),
      h: Math.round(i.getBoundingClientRect().height),
    }));
  });
  console.log('  Iframes:', JSON.stringify(mapInfo));

  await browser.close();
  console.log('\nDone!');
})();
