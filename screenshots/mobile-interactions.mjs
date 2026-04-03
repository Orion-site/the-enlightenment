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

  // Test 1: Nav hamburger menu
  console.log('=== Test: Nav hamburger ===');
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Click the hamburger
  const hamburger = await page.$('button[aria-label*="menu"], button[aria-label*="Menu"], nav button, .hamburger, [class*="hamburger"], [class*="burger"], [class*="toggle"]');
  if (hamburger) {
    await hamburger.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${DIR}/nav-open-mobile.png`, fullPage: false });
    console.log('  Saved nav-open-mobile.png');

    // Try clicking a nav link
    const navLinks = await page.$$('nav a:visible, [class*="nav"] a:visible');
    console.log(`  Found ${navLinks.length} nav links`);

    // Close nav
    await hamburger.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${DIR}/nav-closed-mobile.png`, fullPage: false });
    console.log('  Saved nav-closed-mobile.png');
  } else {
    console.log('  No hamburger found, trying other selectors...');
    // Try clicking any button in the nav area
    const navBtns = await page.$$('header button, nav button');
    console.log(`  Found ${navBtns.length} header/nav buttons`);
    for (const btn of navBtns) {
      const text = await btn.textContent();
      console.log(`    Button text: "${text}"`);
    }
  }

  // Test 2: Check the hero section heights more precisely
  console.log('\n=== Test: Hero section measurements ===');

  const routes = [
    { path: '/', name: 'home' },
    { path: '/saloon', name: 'saloon' },
    { path: '/network', name: 'network' },
    { path: '/brotherhood', name: 'brotherhood' },
  ];

  for (const route of routes) {
    await page.goto(`${BASE}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Measure hero section
    const heroInfo = await page.evaluate(() => {
      // Try various hero selectors
      const selectors = [
        '[class*="hero"]', '[class*="Hero"]',
        'section:first-of-type', 'main > *:first-child',
      ];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) {
          const rect = el.getBoundingClientRect();
          return {
            selector: sel,
            height: rect.height,
            width: rect.width,
            viewportHeight: window.innerHeight,
            ratio: (rect.height / window.innerHeight * 100).toFixed(1),
          };
        }
      }
      return null;
    });
    console.log(`  ${route.name}: hero ${heroInfo ? `h=${heroInfo.height}px (${heroInfo.ratio}% of viewport), sel=${heroInfo.selector}` : 'not found'}`);
  }

  // Test 3: Footer measurements
  console.log('\n=== Test: Footer measurements ===');
  await page.goto(`${BASE}/saloon`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  const footerInfo = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    if (footer) {
      const rect = footer.getBoundingClientRect();
      const styles = window.getComputedStyle(footer);
      return {
        height: rect.height,
        paddingTop: styles.paddingTop,
        paddingBottom: styles.paddingBottom,
        viewportHeight: window.innerHeight,
        ratio: (rect.height / window.innerHeight * 100).toFixed(1),
      };
    }
    return null;
  });
  console.log(`  Footer: ${footerInfo ? `h=${footerInfo.height}px (${footerInfo.ratio}% of viewport), pt=${footerInfo.paddingTop}, pb=${footerInfo.paddingBottom}` : 'not found'}`);

  // Test 4: Check for horizontal overflow
  console.log('\n=== Test: Horizontal overflow ===');
  for (const route of [...routes, { path: '/booked', name: 'booked' }, { path: '/welcome', name: 'welcome' }]) {
    await page.goto(`${BASE}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);

    const overflow = await page.evaluate(() => {
      return {
        docWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    console.log(`  ${route.name}: docW=${overflow.docWidth}, vpW=${overflow.viewportWidth}, overflow=${overflow.hasOverflow}`);
  }

  // Test 5: Check touch targets (buttons/links too small)
  console.log('\n=== Test: Touch target sizes ===');
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  const smallTargets = await page.evaluate(() => {
    const MIN_SIZE = 44; // Apple HIG minimum
    const issues = [];
    const interactives = document.querySelectorAll('a, button, input, select, textarea');
    for (const el of interactives) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        if (rect.height < MIN_SIZE || rect.width < MIN_SIZE) {
          issues.push({
            tag: el.tagName,
            text: el.textContent?.trim().slice(0, 40),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          });
        }
      }
    }
    return issues;
  });
  console.log(`  Found ${smallTargets.length} undersized touch targets:`);
  for (const t of smallTargets) {
    console.log(`    ${t.tag} "${t.text}" - ${t.width}x${t.height}px`);
  }

  // Test 6: Check the Nav component structure
  console.log('\n=== Test: Nav structure ===');
  const navHTML = await page.evaluate(() => {
    const nav = document.querySelector('nav') || document.querySelector('header');
    return nav ? nav.outerHTML.slice(0, 2000) : 'no nav found';
  });
  console.log(`  Nav HTML (truncated): ${navHTML.slice(0, 500)}`);

  // Test 7: CTA button visibility on hero
  console.log('\n=== Test: CTA button visibility ===');
  for (const route of routes) {
    await page.goto(`${BASE}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    const ctaInfo = await page.evaluate(() => {
      const ctas = document.querySelectorAll('a[class*="cta"], a[class*="Cta"], a[class*="button"], a[class*="Button"], button[class*="cta"]');
      return Array.from(ctas).map(el => {
        const rect = el.getBoundingClientRect();
        return {
          text: el.textContent?.trim().slice(0, 50),
          top: Math.round(rect.top),
          bottom: Math.round(rect.bottom),
          visible: rect.top < window.innerHeight,
          viewportH: window.innerHeight,
        };
      });
    });
    console.log(`  ${route.name}: ${ctaInfo.length} CTAs`);
    for (const c of ctaInfo) {
      console.log(`    "${c.text}" top=${c.top} bottom=${c.bottom} visible=${c.visible} (vh=${c.viewportH})`);
    }
  }

  await browser.close();
  console.log('\nDone!');
})();
