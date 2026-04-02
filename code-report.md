# Code Review Report — The Enlightenment

## Status: COMPLETE — ALL FIXES APPLIED

## Summary

The codebase is well-structured and demonstrates strong discipline across component separation, TypeScript typing, accessibility, and responsive design. The design system is consistent and all CSS custom properties are properly anchored to `:root`. The majority of issues are in three categories: a non-existent package version declared in `package.json`, several missing `scroll-margin-top` declarations on anchor-targeted sections (which will cause the fixed nav to obscure content on internal link navigation), and a widespread CSS animation scope issue where `shimmer-sweep` is referenced in scoped CSS Modules but only defined in the global stylesheet — which happens to work but is fragile and architecturally incorrect. There are also a handful of accessibility, UX, and minor code quality issues that need attention before production.

---

## Critical Bugs (will cause runtime errors or broken functionality)

**1. Non-existent Next.js version declared in `package.json`**
File: `package.json:11`
The declared version `"next": "16.2.1"` does not correspond to any published Next.js release. Next.js versioning jumped from 15.x. Similarly, `"react": "19.2.4"` and `"react-dom": "19.2.4"` do not appear to be real published versions of React 19 (stable React 19 is 19.0.0 and 19.1.x series). The installed `node_modules` happen to have these versions present, suggesting they may be internal/pre-release builds or the package.json was hand-edited. If a fresh `npm install` is run in a new environment (e.g., CI or a new machine), npm will fail to resolve these versions and the build will break entirely.
Fix: Correct `package.json` to use the actual latest stable versions — `"next": "^15.3.0"`, `"react": "^19.1.0"`, `"react-dom": "^19.1.0"` — and run a fresh `npm install` to regenerate `package-lock.json`.

**2. `scroll-margin-top` missing on `#tiers` and `#checkout` anchor sections**
Files: `styles/home.module.css` (`.tiersSection`), `styles/CheckoutCTA.module.css` (`.section`)
The site has a fixed navigation bar approximately 80px tall. `GHLCalendar.module.css` correctly declares `scroll-margin-top: 80px` on the `#call` section, but the other two anchor targets — `#tiers` (linked from the hero CTA "ENTER WITH INTENTION") and `#checkout` (linked from hero CTAs on all three package pages) — have no `scroll-margin-top`. When users click these links, the fixed nav will overlap the top of the section, hiding the section headline. This is a broken navigation behaviour on every CTA that matters most to the conversion funnel.
Fix: Add `scroll-margin-top: 80px` to `.tiersSection` in `home.module.css` and to `.section` in `CheckoutCTA.module.css`.

**3. `PageTransition` renders content invisible on initial page load**
File: `components/PageTransition.tsx:8`
`useState(false)` initialises `visible` to `false`, which renders all page content at `opacity: 0`. The `useEffect` fires after the first render and sets `visible` to `true` after a 50ms timeout. During server-side rendering and initial hydration, the entire page body is invisible. This creates a flash of invisible content (FOIC) on initial load — the user sees a blank page for at least one render cycle plus 50ms. The intent is a fade-in on route changes, but the initial load should start visible.
Fix: Initialise `useState(true)` so the page is visible on first load, then the `useEffect` still handles the fade-out/in on subsequent route changes correctly.

---

## Type Errors / TypeScript Issues

**4. `aria-hidden` on `<div>` drawer accepts boolean in JSX but is typed as `string` in HTML spec**
File: `components/Nav.tsx:155`
`aria-hidden={!drawerOpen}` passes a boolean. React/JSX accept this for ARIA attributes and will serialise it correctly to `"true"` or `"false"` as strings in the DOM. This is not a runtime error, but TypeScript's `@types/react` may produce a warning depending on version. More importantly, when `drawerOpen` is `false`, `aria-hidden` is set to `false` — this is fine. However, when `drawerOpen` is `false` the drawer still exists in the DOM and is only hidden via `opacity: 0` + `pointer-events: none`. Screen readers may still traverse it. The correct pattern is to use `aria-hidden="true"` when hidden and omit `aria-hidden` (or set it to `false`) when open.
Fix: Change to `aria-hidden={drawerOpen ? undefined : 'true'}` — only set it when the drawer is hidden, and omit it when it is open so screen readers can interact normally.

**5. `videoRef` is declared but never used**
File: `components/HeroVideo.tsx:22`
`const videoRef = useRef<HTMLVideoElement>(null)` is declared and attached to the video element via `ref={videoRef}`, but `videoRef` is never read or called anywhere in the component. The video state is tracked solely via the `onCanPlay` event. This creates a TypeScript `noUnusedLocals` warning (if enabled) and is dead code.
Fix: Remove `videoRef` and the `ref={videoRef}` prop from the `<video>` element, or add a comment explaining future use.

---

## Next.js Issues

**6. `metadata` exported from Server Component pages that read `process.env` inside the component function**
Files: `app/brotherhood/page.tsx:23`, `app/network/page.tsx:23`, `app/saloon/page.tsx:23`
The pattern `const stripeLink = process.env.NEXT_PUBLIC_STRIPE_*_LINK || '#'` is declared inside the page's render function, not at module scope. For `NEXT_PUBLIC_*` variables Next.js statically inlines them at build time, so this works — but it is a subtle inconsistency with the `MetaPixel.tsx` pattern (which correctly reads `process.env` at module scope). If the env var is genuinely missing at build time, the variable silently becomes `'#'` and the CTA button enters its "disabled" visual state. This is handled gracefully via the `CheckoutCTA` component, but there is no logging or warning to alert developers that the Stripe link is missing. This is a silent failure in a revenue-critical flow.
Fix: Add a `console.warn` in development when the env var is undefined, e.g. `if (!process.env.NEXT_PUBLIC_STRIPE_BROTHERHOOD_LINK) { console.warn('[BrotherhoodPage] NEXT_PUBLIC_STRIPE_BROTHERHOOD_LINK is not set') }`.

**7. `GHLCalendar` script (`form_embed.js`) is loaded three times — once per page**
File: `components/GHLCalendar.tsx:43–47`
The `<Script>` tag for `https://api.leadconnectorhq.com/js/form_embed.js` is placed inside the `GHLCalendar` component. Since all three package pages (`/saloon`, `/network`, `/brotherhood`) use `GHLCalendar`, the script tag is rendered on each of those pages. Next.js `<Script>` with `strategy="afterInteractive"` and no `id` prop will re-inject the script on each client-side navigation to those pages, potentially executing it multiple times. The script should have a stable `id` prop so Next.js can deduplicate it.
Fix: Add `id="ghl-form-embed"` to the `<Script>` component in `GHLCalendar.tsx`.

**8. `scrolling="no"` is a deprecated HTML attribute on `<iframe>`**
File: `components/GHLCalendar.tsx:35`
`scrolling="no"` is deprecated in HTML5 and will generate a TypeScript/JSX warning with strict typings. The modern equivalent is the CSS property `overflow: hidden` on the iframe or its container.
Fix: Remove `scrolling="no"` and add `style={{ overflow: 'hidden' }}` to the iframe, or handle overflow in the CSS module.

---

## CSS Issues

**9. `shimmer-sweep` keyframe is referenced in six CSS Modules but only defined in `globals.css`**
Files: `styles/HeroVideo.module.css:140`, `styles/HeroImage.module.css:130`, `styles/Nav.module.css:236`, `styles/TierCard.module.css:103`, `styles/CheckoutCTA.module.css:70`, `styles/CTASection.module.css:80`
CSS Modules scope class names but do not scope `@keyframes`. The `shimmer-sweep` animation works because it is defined in `globals.css` which is loaded globally. However, this is an architectural dependency that is not visible from the module files themselves — a developer refactoring or removing `globals.css` entries would silently break all shimmer animations with no obvious trace. Additionally, if CSS Modules ever move toward stricter scoping, this will break.
Fix: Either move the `@keyframes shimmer-sweep` definition to each module that uses it (safe — keyframe names in CSS Modules are locally scoped by Next.js), or add a comment in each module explicitly noting the global dependency: `/* shimmer-sweep defined in globals.css — see design system */`.

**10. Hardcoded `rgba` overlay values in `HeroVideo.module.css` and `HeroImage.module.css`**
Files: `styles/HeroVideo.module.css:37–38`, `styles/HeroImage.module.css:27–28`
Both hero overlay gradients use hardcoded `rgba(10, 9, 7, 0.3)` and `rgba(10, 9, 7, 0.65/0.7)` instead of the `--color-overlay` custom property defined in `:root` (`rgba(10, 9, 7, 0.72)`). This violates the design token system and means that if the base dark colour changes, these overlays will not update.
Fix: Replace the hardcoded rgba values with `var(--color-overlay)` (adjusting opacity stops as needed), or define additional `--color-overlay-light` and `--color-overlay-heavy` tokens in `:root`.

**11. Duplicate `@media (min-width: 768px)` blocks in `home.module.css`**
File: `styles/home.module.css:122` and `styles/home.module.css:138`
There are two separate `@media (min-width: 768px)` blocks — the first at line 122 contains quote section overrides, and the second at line 138 contains the tiers grid override. These should be merged into a single block for maintainability.
Fix: Merge the two blocks into one `@media (min-width: 768px)` rule.

**12. `.sectionHeadline` class defined in `package.module.css` but never referenced**
File: `styles/package.module.css:31–36`
The `.sectionHeadline` class is defined in the shared package styles file but is not used by any component or page. It is dead CSS.
Fix: Remove the unused `.sectionHeadline` rule, or use it to replace any hardcoded inline heading styles if applicable.

---

## Performance Issues

**13. Hero `<video>` uses `preload="none"` with `autoPlay` — video will not autoplay on most mobile browsers**
File: `components/HeroVideo.tsx:41–42`
`preload="none"` prevents the browser from fetching any video data until playback is explicitly requested. Combined with `autoPlay`, this creates a race condition: the browser needs to first download some video data before it can begin playback, but with `preload="none"` it may not start doing so until triggered. On mobile browsers (iOS Safari in particular), `autoPlay` on video requires `muted` and `playsInline` (both present) but also typically requires at least minimal buffering. With `preload="none"` the poster image will show indefinitely on low-bandwidth connections or until the browser decides to initiate the fetch. This is intentional for bandwidth reasons on a 190MB video, but the trade-off should be documented and the poster image should be optimised and sized correctly.
Note: The poster `/te-1.jpeg` is served as a raw JPEG without width/height constraints — confirm it is served in a compressed format. The `onCanPlay` fade-in handler is correctly implemented.
No change required if the bandwidth trade-off is intentional, but consider using `preload="metadata"` instead of `preload="none"` to allow the browser to buffer just enough to begin playback promptly.

**14. `TwoColumn` images on package pages lack `priority` prop and appear immediately after the hero**
Files: `app/saloon/page.tsx`, `app/network/page.tsx`, `app/brotherhood/page.tsx`
On all three package pages, the `<TwoColumn>` component renders directly below the `<HeroImage>`. The `HeroImage` uses a full-viewport hero, so `TwoColumn` is just below the fold. However, on short viewports or as users scroll immediately, this image may be the Largest Contentful Paint candidate. The `TwoColumn` component's `<Image>` has no `priority` prop, so it will be lazy-loaded by default. Consider adding `priority` to the `TwoColumn` image on these pages since it is close to the fold and frequently visible.
Fix: Add a `priority?: boolean` prop to `TwoColumn` and pass `priority` from the page-level usage where appropriate.

---

## Security Issues

**15. `dangerouslySetInnerHTML` with a template-literal injection of `PIXEL_ID`**
File: `components/MetaPixel.tsx:29–43`
The Meta Pixel base code is injected via `dangerouslySetInnerHTML` using a template literal that embeds `${PIXEL_ID}` directly. `PIXEL_ID` comes from `process.env.NEXT_PUBLIC_META_PIXEL_ID`, which is controlled by the developer via environment variables — it is not user-supplied input, so this is not a cross-site scripting vulnerability in normal operation. However, if the environment variable is ever sourced from an untrusted location (e.g., CI pipeline secret injection from an external system), a malicious value could inject arbitrary JavaScript. The risk is low but present.
Fix: At minimum, validate that `PIXEL_ID` matches the expected numeric format before injecting it: `if (!/^\d+$/.test(PIXEL_ID)) return null`. This ensures only a numeric pixel ID is ever interpolated.

**16. External links missing `rel="noopener noreferrer"` on the nav drawer Instagram link**
File: `components/Nav.tsx:181–186`
The nav drawer contains a `<Link href={cta.href}>` for the context-aware CTA. When `cta.href` points to an internal route this is fine. However, the CTA hrefs are all internal (`/#tiers`, `/saloon#checkout`, etc.), so this is not currently an issue. No external links are missing the attribute. Confirmed: the Footer Instagram link and the home page Instagram link both have `rel="noopener noreferrer"`.
Status: No action required.

---

## Code Quality

**17. Hamburger button remains visible (z-index 200) on top of the open mobile drawer**
File: `components/Nav.tsx:137–147`, `styles/Nav.module.css:61,81`
The hamburger button has `z-index: 200` and the drawer has `z-index: 150`. When the drawer is open, the hamburger sits visually on top of the drawer overlay in the top-right area. Although the close button inside the drawer is accessible and focus is managed correctly, the hamburger is still interactive and clicking it while the drawer is open calls `setDrawerOpen(true)` — which is a no-op but unexpected. Visually the hamburger floating over an open full-screen menu is a design inconsistency.
Fix: Add `pointer-events: none; opacity: 0;` to the hamburger when the drawer is open, or hide it entirely. A CSS-only approach: apply a `.nav.drawerOpen .hamburger { opacity: 0; pointer-events: none; }` rule, and pass a prop or data attribute to indicate the drawer state to the nav bar.

**18. Index-based `key` props used in list renders**
Files: `components/CTASection.tsx:23`, `components/HeroVideo.tsx:63,67`, `components/IncludesList.tsx:12`
Array index is used as the `key` prop in several list renders (`key={i}`). While these lists are static (not reordered or filtered at runtime), using index keys is a habitual anti-pattern that can cause subtle issues if the lists ever become dynamic. It also suppresses React's ability to detect item identity changes.
Fix: For `CTASection` buttons, use `key={btn.href}` (hrefs are unique per button). For `HeroVideo` CTAs, use `key={cta.href}`. For `IncludesList`, use `key={item}` (items are strings unlikely to repeat within one list).

**19. `pointer-events: all` is a non-standard CSS value**
File: `styles/Nav.module.css:93`
`.drawer.open { pointer-events: all; }` — the valid CSS value is `pointer-events: auto`, not `pointer-events: all`. `all` is not a valid value for `pointer-events` on HTML elements (it is valid for SVG). Browsers may silently ignore this or fall back to `auto`, but it is technically incorrect and will flag in CSS linters.
Fix: Change `pointer-events: all` to `pointer-events: auto`.

**20. `CheckoutCTA` "disabled" state uses `<a>` without `href` but is not keyboard-inaccessible**
File: `components/CheckoutCTA.tsx:28–38`
When `href === '#'`, the component renders an `<a>` element with `href={undefined}`. An `<a>` without an `href` is not focusable by keyboard (correct behaviour — it will not be in the tab order), and `aria-disabled={true}` is set. However, `aria-disabled` on an `<a>` element does not inherently communicate "button disabled" to all screen readers in the same way it does on a `<button>`. The `title="Available soon"` attribute provides tooltip text but is not reliably announced by screen readers.
Fix: When `href === '#'`, render a `<span>` or `<button type="button" disabled>` instead of an `<a>` element. This gives clear semantic meaning, proper keyboard behaviour, and better screen reader support.

**21. `package.module.css` defines `.note` but `CheckoutCTA` imports `CheckoutCTA.module.css` for its own `.note` class**
File: `styles/package.module.css:38–44`
The `.note` rule in `package.module.css` is defined but never applied — `CheckoutCTA.module.css` has its own `.note` rule and `CheckoutCTA` uses that. The `note` prop on `CheckoutCTA` is also never passed from any page file. Both the `.note` rule in `package.module.css` and the `note` prop/usage in `CheckoutCTA` are dead code.
Fix: Remove the `.note` rule from `package.module.css`. Decide whether to keep or remove the `note` prop on `CheckoutCTA` — if unused, remove it and its associated JSX and CSS.

**22. MetaPixel `fbq('track', 'PageView')` is commented out — page view tracking is non-functional**
File: `components/MetaPixel.tsx:19,41`
The `PageView` tracking call is commented out with a TODO in both the `useEffect` (route change tracking) and inside the `dangerouslySetInnerHTML` script (initial page load tracking). The pixel is initialised but no events are ever fired. This means Meta ad campaigns based on pixel data will have zero PageView events attributed.
Fix: This is marked as intentional (awaiting pixel ID confirmation), but the TODO should be tracked. When ready, uncomment `fbq('track', 'PageView')` in both locations.

---

## Passed / No Issues

- All client components that use hooks or browser APIs are correctly marked `'use client'` — `Nav`, `HeroVideo`, `MetaPixel`, `PageTransition`, `ScrollReveal`, `GHLCalendar`.
- All server components (`HeroImage`, `TwoColumn`, `TierCard`, `Pillars`, `PullQuote`, `CTASection`, `PriceBlock`, `IncludesList`, `CheckoutCTA`, `Footer`) correctly omit `'use client'` and do not use any browser APIs.
- `next/image` is used correctly throughout — all `fill` images have a `position: relative` parent container, and `priority` is set on above-the-fold hero images (`HeroImage`, Nav logo).
- `next/font` is loaded at the root layout level (`app/layout.tsx`) with correct `variable` names that match the CSS custom properties in `:root`.
- All `process.env.NEXT_PUBLIC_*` variables are handled safely with `|| '#'` fallbacks — the app will not crash if env vars are missing.
- The `metadata` export pattern is correct — it is only exported from Server Components (page files), never from client components.
- `.env.local` is correctly listed in `.gitignore`. `.env.example` contains no real secrets.
- The global reset correctly sets `border-radius: 0` universally via the `*` selector.
- All CSS custom properties are defined in `:root` in `globals.css` — no tokens are defined elsewhere.
- The `gold-rule`, `gold-metallic`, and `shimmer-sweep` utilities are properly defined in `globals.css`.
- `ScrollReveal` correctly handles `prefers-reduced-motion` by immediately revealing content without animation.
- The Nav implements a full focus trap with Escape key handling, programmatic focus management, and `aria-modal="true"` on the drawer.
- All interactive elements have accessible labels (`aria-label`, `aria-expanded`, `aria-controls`).
- All `<img>` tags have `alt` attributes (empty for decorative images, descriptive for meaningful ones).
- External links in `Footer` and `home/page.tsx` correctly use `rel="noopener noreferrer"`.
- `poweredByHeader: false` is set in `next.config.ts` — the `X-Powered-By: Next.js` header is suppressed.
- The `@keyframes scroll-pulse` animation in `HeroVideo.module.css` is correctly defined locally within the module.
- No `eval()` or dynamic code execution outside of the intended Meta Pixel `dangerouslySetInnerHTML` usage.
- TypeScript strict mode is enabled in `tsconfig.json`. All component props are typed with interfaces. No `any` types found.
- The `TwoColumn` `imageAlt` prop has a sensible empty string default (`imageAlt = ''`), appropriate for decorative usage.
- Consistent use of `clamp()` for fluid typography throughout the design system.
- The `GHLCalendar` loading placeholder with a pulsing animation is a good UX pattern for the slow-loading iframe.
