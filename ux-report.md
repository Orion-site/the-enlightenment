# UX Report -- Completion

**Status:** ALL CLEAR
**Completed:** 2026-04-01

All 6 critical issues, 9 improvements, 6 mobile fixes, 15 accessibility findings, and 9 minor polish items have been resolved.

## Critical Issues -- All Resolved

1. **Hero video 190MB** -- Poster image (`/te-1.jpeg`) added to `<video>` tag. Users see a styled frame immediately instead of black void.
2. **Stripe CTA silent failure** -- `CheckoutCTA.tsx` renders disabled state (opacity 0.5, cursor not-allowed, "Available soon" tooltip) when `href="#"`.
3. **Keyboard/focus trap** -- `Nav.tsx` implements full focus trap in mobile drawer, Escape key handler, auto-focus on open, and focus return on close.
4. **prefers-reduced-motion** -- `globals.css` includes `@media (prefers-reduced-motion: reduce)` that disables all animations and transitions. `ScrollReveal.tsx` checks `matchMedia` and reveals immediately.
5. **GHL calendar** -- Loading placeholder with gold rule added. Strategy changed to `afterInteractive`. Mobile min-height reduced to 580px via media query.
6. **MetaPixel not imported** -- `MetaPixel` is imported and rendered in `app/layout.tsx`. Self-disables when env var is empty.

## Improvements -- All Resolved

1. **Brotherhood duplicate note/subline** -- `note` prop removed. Only `subline` renders.
2. **Gold rule above About** -- `<hr className="gold-rule">` added before aboutSection on home page.
3. **Instagram CTA column** -- Two-column layout: pull quote left, Instagram CTA right with `@te.madrid` link.
4. **Hero CTA hierarchy** -- Primary CTA (gold border + shimmer) vs. secondary (plain text with draw-in underline).
5. **Saloon subline** -- Updated to "Seats are limited. No exceptions."
6. **Brotherhood scarcity** -- Updated to "Cap: 15 members. Enquire for availability."
7. **ScrollReveal integration** -- Wrapped around Pillars, TierCards (staggered), TwoColumn, PullQuote, CTASection, VideoPlayer, PriceBlock, IncludesList, CheckoutCTA across all pages.
8. **HeroImage CTA** -- Optional `cta` prop added with primary/secondary pattern. All package pages use it.
9. **Nav context-aware CTA** -- Per-page labels and destinations (RESERVE/JOIN/APPLY) pointing to page-specific anchors.

## Mobile Fixes -- All Resolved

1. Poster image on hero video
2. Hamburger touch target 44x44px
3. TierCard button padding increased to 0.9rem (44px+ height)
4. Drawer close button 44x44px with flexbox centering
5. Short device breakpoint (`max-height: 580px`) reduces hero bottom padding
6. GHL calendar mobile min-height 580px

## Accessibility -- All Resolved

1. Hamburger 44px touch target
2. TierCard CTA 44px+ touch target
3. Drawer close 44px touch target
4. Global `*:focus-visible` rule (2px solid gold, 3px offset)
5. Mobile drawer focus trap + Escape key
6-9. Decorative media correctly hidden, semantic HTML passing
10. IncludesList `<ol>` has `role="list"` for Safari VoiceOver
11. CheckoutCTA `aria-label` includes "opens in new tab" when `target="_blank"`
12-15. Colour contrast passing WCAG AA

## Minor Polish -- All Resolved

1. TierCard hover uses `brightness(1.06)` instead of translateY pop
2. IncludesList `<ol>` no redundant aria-label
3. Footer link font-size bumped to 0.75rem (12px)
4. PullQuote wrapper semantics acceptable (has gold-rule divider)
5. aboutSubtext opacity increased to 0.75 for better contrast
6. Pillars section has visually hidden `<h2>` for heading hierarchy
7. MetaPixel imported in layout.tsx
8. Brotherhood CTA label includes arrow
9. Hero border inset matches spec (12px mobile, 24px desktop)

## Files Changed

- `components/Nav.tsx` -- focus trap, context-aware CTA, mobileLabel
- `components/HeroVideo.tsx` -- poster, CTA hierarchy
- `components/HeroImage.tsx` -- optional CTA prop with primary/secondary
- `components/CheckoutCTA.tsx` -- disabled state, aria-label for new tab
- `components/GHLCalendar.tsx` -- loading placeholder, sandbox, afterInteractive
- `components/ScrollReveal.tsx` -- prefers-reduced-motion check
- `components/MetaPixel.tsx` -- CSP documentation
- `components/IncludesList.tsx` -- role="list"
- `components/Pillars.tsx` -- visually hidden h2
- `app/layout.tsx` -- MetaPixel import
- `app/page.tsx` -- ScrollReveal wrappers, gold rule, Instagram column, CTA hierarchy
- `app/saloon/page.tsx` -- HeroImage CTA, subline update, ScrollReveal
- `app/network/page.tsx` -- HeroImage CTA, ScrollReveal
- `app/brotherhood/page.tsx` -- HeroImage CTA, scarcity note, note removed, ScrollReveal
- `styles/globals.css` -- text-display clamp, focus-visible, prefers-reduced-motion
- `styles/Nav.module.css` -- enterBtn fix, hamburger 44px, drawerClose 44px
- `styles/HeroVideo.module.css` -- CTA primary/secondary styles, short device fix
- `styles/HeroImage.module.css` -- CTA styles, inset 12px/24px
- `styles/GHLCalendar.module.css` -- centering, loading placeholder, mobile min-height
- `styles/CheckoutCTA.module.css` -- existing styles (no changes needed)
- `styles/TierCard.module.css` -- brightness hover, padding increase
- `styles/home.module.css` -- aboutSubtext opacity, Instagram column styles
- `styles/Footer.module.css` -- link font-size to 0.75rem
- `next.config.ts` -- security headers
