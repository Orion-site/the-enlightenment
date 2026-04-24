# PRD — `/azul` Landing Page & `/confirmed` Payment Confirmation

**Project:** The Enlightenment Madrid (`the-enlightenment.salon`)
**Stack:** Next.js 14+ App Router, TypeScript, CSS Modules, Google Fonts (Cormorant Garamond + Libre Baskerville)
**Document status:** Implementation-ready
**Author:** Product Spec Writer
**Date:** 2026-04-23

---

## 1. Overview & Goals

### 1.1 Context

The Enlightenment Salon is running its 6th edition — **Salon 06: "THE STANDARD"** — on Thursday 29 May 2026 at Salón Azul, Only You Boutique Hotel Madrid. The event is a single-evening, standing cocktail gathering for up to 50 hand-picked founders.

To sell the remaining seats we need a dedicated, conversion-optimised landing page at `/azul` that can be sent to paid traffic (Meta ads, WhatsApp, direct) without the distractions of the main site navigation. Payment is handled by a single Stripe Payment Link; after successful payment, Stripe redirects to `/confirmed`.

### 1.2 Primary goal

Convert qualified paid traffic into €300 Salon 06 ticket purchases with the minimum possible friction. One page → one decision → one Stripe checkout.

### 1.3 Success criteria

- Developer can build both pages directly from this PRD without asking clarifying questions.
- Page renders without layout shift, passes Lighthouse ≥90 on mobile performance.
- Every CTA button on `/azul` routes to the Stripe Payment Link, opening in a new tab.
- `/confirmed` renders correctly when linked to from the Stripe success URL.
- Neither page appears in the main Nav menu.
- `/azul` has no exit routes to other pages on the site beyond the footer.
- Page is indexable by search but **not** linked from any internal nav (orphan by design).
- Meta Pixel (if `NEXT_PUBLIC_META_PIXEL_ID` is set) fires `PageView` on both pages and `Purchase` can be wired from `/confirmed` in a follow-up (out of scope for v1).

### 1.4 Non-goals (v1)

- Server-side Stripe webhook handling.
- Personalised thank-you content (the user's name, ticket number, etc.).
- Multi-language support. English only.
- A/B testing infrastructure.
- Capacity counter (live "X of 50 seats remaining").

---

## 2. User Stories

### 2.1 Primary persona
A founder (€1M+ rev, 22–45, Madrid/Barcelona/Lisbon) arrives via a paid ad, video, or a direct share from a friend. They have ~30 seconds of patience.

### 2.2 Stories

- **US-01 (primary):** As a founder who clicked an ad, I want to immediately understand *what* this is, *when* it is, and *why I should care*, so that I can decide within 30 seconds whether to keep reading or bounce.
- **US-02:** As an interested founder, I want to watch a 2–3 minute talking-head video that sets the tone and makes the case, so that I can trust the hosts before spending €300.
- **US-03:** As a decision-ready founder, I want a single, obvious, always-visible path to buy my seat, so that I don't have to hunt for a button.
- **US-04:** As a cautious founder, I want to see the venue, the programme, the dress code, and what's included, so that I understand exactly what I'm paying for.
- **US-05:** As a founder considering bringing a peer, I want to send the link and have them arrive at the same page with the same pitch, so that I don't have to explain it myself.
- **US-06 (post-purchase):** As a founder who just paid, I want to land on a reassuring, on-brand confirmation page, so that I know the transaction worked and I know what happens next.
- **US-07 (post-purchase):** As a founder who has a question or didn't receive my confirmation, I want an obvious channel (Instagram DM) to get help, so that I don't feel abandoned after paying.
- **US-08 (search):** As a founder searching "the enlightenment salon madrid", I want to find the Salon 06 page with correct meta title/description/OG preview when shared, so that shared links look on-brand.

---

## 3. Page Sections Spec

### 3.1 `/azul` — Salon 06 landing page

Route: `app/azul/page.tsx`
Rendering: Server Component (default) with client components nested where required (`HeroVideo`, `VideoPlayer`, `Pillars`, `ScrollReveal` are `'use client'` — unchanged).

Global layout behaviour on `/azul`:
- **Nav:** suppressed (see §5.3 for implementation options).
- **Footer:** shown as normal.
- **PageTransition:** shown as normal.

#### Section order

| # | Section               | Component           | Notes                                                         |
|---|-----------------------|---------------------|---------------------------------------------------------------|
| 1 | Hero                  | `HeroVideo`         | Uses existing `/heroloop.mp4`. Single primary CTA to Stripe.  |
| 2 | VSL                   | `VideoPlayer`       | `src="/azul.mp4"`, `poster="/te-3.jpeg"`. Audio ON.           |
| 3 | What this is          | `TwoColumn`         | Image right, positioning copy.                                |
| 4 | Event details strip   | NEW component / inline | Gold labels + white values, 5-column grid on desktop.      |
| 5 | Who this is for       | NEW inline 3-up (or adapted Pillars) | Three ICPs as cards.                                 |
| 6 | The evening           | NEW agenda timeline | 8-row time/moment list.                                       |
| 7 | What's included       | `IncludesList`      | 5 items.                                                      |
| 8 | Price + CTA           | `PriceBlock` + custom Stripe button | Side-by-side grid like `/salon`.              |
| 9 | Standards block       | `Pillars` (reused as-is) | 3 pillars: Ownership · Reason · Potential.              |
| 10 | Final CTA            | NEW inline Stripe-CTA block (see §5.2) | `CTASection` cannot be reused — see §5.2.    |

Each section **must** be wrapped in `<ScrollReveal>` for the fade-in reveal, except the Hero (already above-the-fold) and Section 4 (details strip — should appear instantly so skimmers can scan facts).

#### 3.1.1 Section 1 — Hero

- **Component:** `HeroVideo`
- **Props:**
  ```tsx
  <HeroVideo
    src="/heroloop.mp4"
    headline="Gentlemen don't follow standards. They set them."
    subline="An evening to illuminate ideas, capital & connection."
    ctas={[{ label: 'SECURE YOUR SEAT → €300', href: '#secure' }]}
  />
  ```
- **Critical behaviour deviation:** `HeroVideo`'s first CTA is rendered as a Next.js `<Link>` and its `onClick` tries to smooth-scroll to a hash. It does **not** support `target="_blank"` to Stripe. Two valid resolutions, pick one:
  1. **(Preferred)** Pass `href="#secure"` so the hero CTA scrolls to Section 8 (Price + CTA) where a fully-fledged Stripe button lives. Add `id="secure"` to Section 8. This keeps `HeroVideo` untouched.
  2. Extend `HeroVideo` to accept an optional `external: boolean` per-CTA flag that renders an `<a target="_blank" rel="noopener noreferrer">` instead of a `<Link>`. Touches a shared component — only do this if hero-to-Stripe is worth the API change.
- **Implementation decision for v1:** Use option 1. The hero CTA scrolls to `#secure`, which houses the canonical Stripe button.

#### 3.1.2 Section 2 — VSL

- **Wrapper:** `<section id="vsl">` with dark background, generous vertical padding (match `.pageSectionDark` in `package.module.css`).
- **Headline above video:** `Watch before you decide.`
- **Component:** `VideoPlayer` with `src="/azul.mp4"` and `poster="/te-3.jpeg"`.
- **Copy below video (2 lines, centred, muted):**
  > Two minutes with Tom & Maarten.
  > What this night is — and who it's for.
- Must be wrapped in `<ScrollReveal>`.

#### 3.1.3 Section 3 — What this is

- **Component:** `TwoColumn`
- **Props:**
  ```tsx
  <TwoColumn
    imageLeft={false}
    imageSrc="/te-3.jpeg"
    imageAlt="Salón Azul — Only You Boutique Hotel Madrid"
    framedImage
    headline="One evening. One standard."
    body={<>
      <p>Salón Azul is a jewel-box of deep navy velvet, gilded mirrors and fireplaces. Antique portraits watch over Chesterfield sofas. A room built for the kind of conversation most rooms can't hold.</p>
      <p>Fifty founders. One standing reception. Three curated speaker moments. Open bar. Jazz. A suit. No small talk, no spectators.</p>
      <p>Attend once. Decide what kind of man you are.</p>
    </>}
  />
  ```

#### 3.1.4 Section 4 — Event details strip

NEW block — no existing component. Inline JSX or a small new component `<EventDetailsStrip>` co-located in `app/azul/page.tsx` (preferred — not reused elsewhere).

- **Layout:** Full-bleed dark section (`--color-black`), 5-column grid on desktop (min-width 768px), stacked on mobile.
- **Each cell:**
  - Top line: label (gold, uppercase, `--text-label`, letter-spacing ~0.12em, `--color-gold`)
  - Bottom line: value (white, `--font-display`, `--text-h3` on desktop, `--text-body` on mobile)
- **Content (5 cells in order):**

  | Label     | Value                                                                 |
  |-----------|-----------------------------------------------------------------------|
  | DATE      | Thursday 29 May 2026                                                  |
  | TIME      | 19:30 – 23:00                                                         |
  | VENUE     | Salón Azul · Only You Madrid · C/ Barquillo, 21                       |
  | DRESS     | Suit required. No ties.                                                |
  | CAPACITY  | 50 founders                                                           |

- **Optional sub-note under grid (centred, muted):** `Pre-event podcast taping at the venue · 18:00–18:45 · members only.`
- **No CTA in this section.**

#### 3.1.5 Section 5 — Who this is for

- **Wrapper:** Standard section, light-on-dark.
- **Headline:** `Built for founders who are done with the wrong rooms.`
- **Subline (optional, muted):** `Three men walk into Salón Azul. These are the three.`
- **Three blocks (cards):**

  | # | Label            | Body                                                                                      |
  |---|------------------|-------------------------------------------------------------------------------------------|
  | I | THE ISOLATED     | You've built the business. The peers you had when you started can no longer hold the conversation. You need a room that can. |
  | II | THE IDENTITY    | The suit, the standard, the posture — these aren't aesthetics to you. They're how you move. You want a room that matches. |
  | III | THE BROTHERHOOD | You're tired of transactional networking. You want a few men, met in person, who will still be in your life in ten years. |

- **Component choice:** Do **not** reuse `<Pillars>` here — that component is hardcoded to Ownership/Reason/Potential and is reused as Section 9. Build a simple inline 3-column grid, mirroring the visual rhythm of `Pillars` (Roman numerals I · II · III, uppercase label, body copy) so the page has visual coherence between Sections 5 and 9 without code duplication.
- Wrap each block in `<ScrollReveal delay={i * 150}>`.

#### 3.1.6 Section 6 — The evening (agenda)

- **Wrapper:** Standard section.
- **Headline:** `The programme.`
- **Subline (muted):** `A night engineered for momentum.`
- **Layout:** Two-column timeline on desktop (time | moment), stacked on mobile. Gold vertical rule between columns on desktop. Each row separated by a thin `--color-gold-dark` hairline.
- **Rows:**

  | Time         | Moment                                                            |
  |--------------|-------------------------------------------------------------------|
  | 19:30–19:50  | Arrival & personal welcome · first drink served                   |
  | 20:00–20:05  | Opening — Tom & Maarten frame the night                           |
  | 20:05–20:10  | Speaker I — Tom sets the tone                                     |
  | 20:10–20:50  | First Connection Block — guided networking                        |
  | 20:50–21:00  | Speaker II — sponsor insight                                      |
  | 21:00–22:20  | Open networking — peak energy · bar active                        |
  | 22:20–22:30  | Speaker III + collective toast                                    |
  | 22:30–23:00  | Soft close                                                        |

- **No CTA in this section.**

#### 3.1.7 Section 7 — What's included

- **Component:** `IncludesList`
- **Wrapper:** Half of a two-up grid (see Section 8).
- **Props:**
  ```tsx
  <IncludesList
    items={[
      'Open bar · welcome cocktail or whisky on arrival',
      'Three curated speaker moments',
      'Guided connection blocks',
      'Standing reception in Salón Azul — jazz, fireplaces, Chesterfield sofas',
      'Eligibility to apply for The Network',
    ]}
  />
  ```
- Reuse the `priceIncludesGrid` layout from `styles/package.module.css` as precedent.

#### 3.1.8 Section 8 — Price + CTA (anchor target `#secure`)

- **Wrapper:** `<section id="secure">` so the hero CTA and all in-page scroll-to links land here.
- **Layout:** Side-by-side on desktop, stacked on mobile. Matches the two-column pattern already used on `/salon`.
- **Left column — `PriceBlock`:**
  ```tsx
  <PriceBlock
    price="€300"
    period="One evening · Salon 06"
    scarcityNote="50 seats · limited release"
  />
  ```
- **Right column — primary Stripe CTA:**
  - Render an `<a>` tag, **not** a Next.js `<Link>` and **not** `CTASection` (see §5.2).
  - Use the same visual style as the shimmer-gold button from `CTASection.module.css` / `HeroVideo.module.css` `.ctaPrimary`. The cleanest option is to add a new `.stripeBtn` class in a new `app/azul/azul.module.css` that mirrors the existing primary-button token chain (gold border, shimmer hover, no border-radius).
  - **Exact markup:**
    ```tsx
    <a
      href="https://buy.stripe.com/28EcN501L73W2c90ula7C0d"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.stripeBtn}
      data-cta="azul-primary"
    >
      <span className={styles.stripeBtnText}>SECURE YOUR SEAT →</span>
    </a>
    ```
- **Under the button (small muted caption):** `Secure checkout · Stripe · €300 · EUR`

#### 3.1.9 Section 9 — Standards block

- **Component:** `<Pillars />` reused as-is.
- **Wrapper:** Standard section with a preceding headline and subline (NOT rendered by `Pillars` itself; `Pillars` only has a visually-hidden h2). Add above the component:
  - **Headline:** `We live by three principles.`
  - **Subline:** `Suit required. No ties. No small talk. No spectators.`
- **Important:** `Pillars` is hardcoded to Ownership/Reason/Potential — that's intentional and matches the brand pillars, so no changes required.

#### 3.1.10 Section 10 — Final CTA

- **Component:** Inline replica of `CTASection`'s visual — **not** the `CTASection` component itself (see §5.2 — `CTASection` renders `<Link>` only and can't open Stripe in a new tab).
- **Markup shape:**
  ```tsx
  <section className={styles.finalCta}>
    <div className={styles.finalCtaInner}>
      <h2 className={styles.finalCtaHeadline}>50 seats. One standard.</h2>
      <p className={styles.finalCtaSubline}>Thursday 29 May · Salón Azul · Madrid.</p>
      <a
        href="https://buy.stripe.com/28EcN501L73W2c90ula7C0d"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.stripeBtn}
        data-cta="azul-final"
      >
        <span className={styles.stripeBtnText}>SECURE YOUR SEAT → €300</span>
      </a>
    </div>
  </section>
  ```
- **Styling:** Copy the `section` / `inner` / `headline` / `subline` / `btn` styles from `styles/CTASection.module.css` into `app/azul/azul.module.css` and adapt the button rule to accept an `<a>` instead of a `<Link>`. This keeps `CTASection` untouched.

---

### 3.2 `/confirmed` — Post-payment confirmation page

Route: `app/confirmed/page.tsx`
Layout: **Uses the default root layout** (Nav + Footer both shown). This is intentional — after paying, the buyer can explore other parts of the site.

#### Section order

| # | Section           | Notes                                           |
|---|-------------------|-------------------------------------------------|
| 1 | Centred hero block | Monogram + headline + subline + Instagram CTA |
| 2 | Bottom CTA strip   | Closing line + gold divider                    |

#### 3.2.1 Section 1 — Centred hero block

- **Wrapper:** Full-viewport-height centred block (`min-height: calc(100vh - [nav] - [footer])`).
- **Background:** `--color-black` with optional film grain (reuse existing grain treatment from `globals.css`).
- **Contents, stacked, centre-aligned:**
  1. **Monogram image** — use `/small.png` (the site's small logo mark), max-width 80px.
  2. **Headline** — `You're in.` (`--font-display`, `--text-display`, `--color-white`).
  3. **Sub-headline** — `Your confirmation will be sent to your email shortly.` (`--font-body`, `--text-body`, `--color-muted`).
  4. **Body paragraph** — `If you have any questions or don't receive your confirmation within 24 hours, reach us on Instagram.`
  5. **Instagram CTA button** — gold-bordered button (reuse primary-button styling), opens in a new tab:
     ```tsx
     <a
       href="https://www.instagram.com/te.madrid"
       target="_blank"
       rel="noopener noreferrer"
       className={styles.igBtn}
       aria-label="Message us on Instagram"
     >
       <span className={styles.igIcon} aria-hidden="true">{/* inline IG SVG */}</span>
       <span>@te.madrid</span>
     </a>
     ```

#### 3.2.2 Section 2 — Bottom CTA strip

- **Full-width section, dark, centred.**
- **Gold horizontal rule** (1px, `--color-gold`, 80px wide) above the line.
- **Closing line:** `We'll see you on 29 May.` (`--font-display`, italic, `--text-h2`).
- **No button.** This is the emotional close.

#### 3.2.3 Optional — auto-fire a Meta Pixel Purchase event

Out of scope for v1, but noted here so the dev does not "forget" it: on a follow-up, wire a `Purchase` event via the existing `MetaPixel` component when `/confirmed` mounts. Requires importing `fbq` from the Pixel client helper. **Do not block v1 on this.**

---

## 4. Copy Spec (single source of truth)

Use these strings verbatim. If a string appears in both the spec and a component prop example, the string below is authoritative.

### 4.1 `/azul`

| Location | Copy |
|---|---|
| Meta title | `Salon 06 — The Standard \| The Enlightenment Madrid` |
| Meta description | `50 founders. One evening. Salón Azul · 29 May 2026. €300.` |
| OG title | `Salon 06 — The Standard` |
| OG description | `50 founders. One evening. Salón Azul · 29 May 2026. €300.` |
| OG image | `/te-3.jpeg` |
| Hero headline | `Gentlemen don't follow standards. They set them.` |
| Hero subline | `An evening to illuminate ideas, capital & connection.` |
| Hero CTA | `SECURE YOUR SEAT → €300` |
| VSL headline | `Watch before you decide.` |
| VSL sub-copy line 1 | `Two minutes with Tom & Maarten.` |
| VSL sub-copy line 2 | `What this night is — and who it's for.` |
| Section 3 headline | `One evening. One standard.` |
| Section 3 paragraph 1 | `Salón Azul is a jewel-box of deep navy velvet, gilded mirrors and fireplaces. Antique portraits watch over Chesterfield sofas. A room built for the kind of conversation most rooms can't hold.` |
| Section 3 paragraph 2 | `Fifty founders. One standing reception. Three curated speaker moments. Open bar. Jazz. A suit. No small talk, no spectators.` |
| Section 3 paragraph 3 | `Attend once. Decide what kind of man you are.` |
| Section 4 labels | `DATE · TIME · VENUE · DRESS · CAPACITY` |
| Section 4 values | (see §3.1.4 table) |
| Section 4 sub-note | `Pre-event podcast taping at the venue · 18:00–18:45 · members only.` |
| Section 5 headline | `Built for founders who are done with the wrong rooms.` |
| Section 5 subline | `Three men walk into Salón Azul. These are the three.` |
| Section 5 ICP I — label | `THE ISOLATED` |
| Section 5 ICP I — body | `You've built the business. The peers you had when you started can no longer hold the conversation. You need a room that can.` |
| Section 5 ICP II — label | `THE IDENTITY` |
| Section 5 ICP II — body | `The suit, the standard, the posture — these aren't aesthetics to you. They're how you move. You want a room that matches.` |
| Section 5 ICP III — label | `THE BROTHERHOOD` |
| Section 5 ICP III — body | `You're tired of transactional networking. You want a few men, met in person, who will still be in your life in ten years.` |
| Section 6 headline | `The programme.` |
| Section 6 subline | `A night engineered for momentum.` |
| Section 6 rows | (see §3.1.6 table) |
| Section 7 items | (see §3.1.7 props) |
| Section 8 price | `€300` |
| Section 8 period | `One evening · Salon 06` |
| Section 8 scarcity | `50 seats · limited release` |
| Section 8 CTA | `SECURE YOUR SEAT →` |
| Section 8 caption | `Secure checkout · Stripe · €300 · EUR` |
| Section 9 headline | `We live by three principles.` |
| Section 9 subline | `Suit required. No ties. No small talk. No spectators.` |
| Section 10 headline | `50 seats. One standard.` |
| Section 10 subline | `Thursday 29 May · Salón Azul · Madrid.` |
| Section 10 CTA | `SECURE YOUR SEAT → €300` |

### 4.2 `/confirmed`

| Location | Copy |
|---|---|
| Meta title | `You're in — The Enlightenment Madrid` |
| Meta description | `Your seat for Salon 06 is confirmed. See you on 29 May.` |
| OG image | `/te-3.jpeg` |
| Hero headline | `You're in.` |
| Hero sub-headline | `Your confirmation will be sent to your email shortly.` |
| Body paragraph | `If you have any questions or don't receive your confirmation within 24 hours, reach us on Instagram.` |
| Instagram CTA | `@te.madrid` · `https://www.instagram.com/te.madrid` |
| Bottom line | `We'll see you on 29 May.` |

---

## 5. Technical Implementation Notes

### 5.1 File structure

```
app/
  azul/
    page.tsx          # new — the landing page
    azul.module.css   # new — styles unique to /azul (details strip, ICP grid, agenda, stripeBtn, finalCta)
  confirmed/
    page.tsx          # new — the confirmation page
    confirmed.module.css  # new — hero block, IG button, bottom strip
docs/
  azul-prd.md         # this document
public/
  azul.mp4            # NEW ASSET — see §5.4
```

No changes to `app/layout.tsx`, `components/*`, or any existing file — **with one possible exception** covered in §5.3 (Nav suppression).

### 5.2 Stripe CTAs — why we can't reuse existing CTA components

The Stripe Payment Link **must** open in a new tab (`target="_blank" rel="noopener noreferrer"`) so the user doesn't lose the landing page state if they abandon checkout. Three of the existing components do **not** support this:

- `CTASection` (`components/CTASection.tsx`) — renders `<Link>`, no `target` passthrough.
- `HeroVideo` (`components/HeroVideo.tsx`) — first CTA is a `<Link>` with scroll-to-hash behaviour.
- `TwoColumn` CTA — same issue.

**Resolution for v1 (no shared-component changes):**
- Hero CTA → scrolls to `#secure` (Section 8).
- All Stripe CTAs (Section 8 button + Section 10 button) → raw `<a>` tags styled via `app/azul/azul.module.css`.
- Copy the visual styles (border, padding, shimmer hover, typography) from `styles/CTASection.module.css` into `app/azul/azul.module.css` under new class names (`.stripeBtn`, `.stripeBtnText`, `.finalCta`, etc.). Small duplication is acceptable; changing shared components for one page is not.

**Resolution if the team wants to reuse:** extend `CTASection` and `HeroVideo` to accept an optional `external?: boolean` per CTA. Opens that CTA as `<a href target="_blank" rel="noopener noreferrer">`. Out of scope for this PRD unless explicitly requested; track as a follow-up refactor.

### 5.3 Suppressing the Nav on `/azul`

`Nav` is rendered in the root layout (`app/layout.tsx`) so it appears on every route by default. We need it hidden on `/azul` only. Three valid options — pick one:

| # | Approach | Pros | Cons |
|---|----------|------|------|
| A | Add `usePathname()` check inside `Nav.tsx`, early-return `null` when `pathname === '/azul'`. | Smallest diff. One file. | Nav now has page-specific logic. |
| B | Move `/azul` under a route group with its own layout: `app/(landing)/azul/page.tsx` + `app/(landing)/layout.tsx` that omits `Nav`. | Clean separation; extensible for future landers. | Needs a layout that re-imports fonts & `PageTransition`. |
| C | Add a `data-no-nav` attribute via a client effect on `/azul` and hide `Nav` via CSS. | No component changes. | Hacky; Nav still renders briefly before CSS hides it. |

**Recommendation for v1: Option A.** One-line change inside `Nav.tsx` at the top of the component body:

```tsx
const pathname = usePathname()
if (pathname === '/azul') return null
```

Keep the Footer. The main Nav links (`/salon`, `/network`, `/brotherhood`) should not be visible on `/azul`. The Footer is fine since it's an exit below the fold.

**Note on the nav CTA config:** `Nav.tsx` has a `ctaConfig` keyed by pathname for the top-right CTA. Since Nav is suppressed on `/azul`, no entry needs to be added. Leave `ctaConfig` untouched.

### 5.4 Video asset task

The VSL video is not yet in the repo. Ship task:

1. Copy `~/Downloads/02.mp4` → `public/azul.mp4`.
2. Verify file size. If > 20 MB, consider adding a note to host the video off a CDN (e.g., Cloudflare Stream or Vimeo) and switching `VideoPlayer` to `embedUrl` mode. For v1, self-hosting is acceptable up to ~40 MB.
3. Confirm `poster="/te-3.jpeg"` is the right thumbnail — the brief specifies this. If a frame grab from the video would be better, export a still and save as `public/azul-poster.jpg`.

### 5.5 Meta tags

- `app/azul/page.tsx` must export a `metadata: Metadata` object (same pattern as `app/salon/page.tsx`).
- `app/confirmed/page.tsx` ditto.
- **Do NOT** set `robots: 'noindex'` on `/azul` — we want the page indexable so organic searches can find it. We **do** want `/confirmed` as `noindex, nofollow` (there's no reason for it to appear in search results; it's a post-transaction page).
- Both pages should set `openGraph.images` so WhatsApp/Slack/iMessage previews render correctly.

### 5.6 Accessibility & performance

- All `<a>` CTAs to Stripe must have visible text (not icon-only).
- `<a target="_blank">` links must include `rel="noopener noreferrer"` — both for security and to prevent `window.opener` leaks.
- The VSL video poster image (`/te-3.jpeg`) should use `priority` since it will be ATF on tall viewports after the hero. `VideoPlayer` already sets `priority` on the `<Image>`.
- The details strip (Section 4) and agenda (Section 6) are content-heavy — make sure `font-display: swap` is honoured (already handled by root layout font config) so FOIT doesn't delay LCP.
- All section headings use `<h2>` (`<h1>` is the hero headline inside `HeroVideo`). Maintain one `<h1>` per page.
- Meta Pixel is already wired globally via `components/MetaPixel.tsx` — no changes needed here, but `PageView` will fire automatically on both routes.

### 5.7 Styling rules

- Reuse design tokens from `globals.css` (colors, fonts, type scale). **Do not** introduce new colors.
- No border-radius anywhere (project-wide rule — confirmed by brief).
- Film grain treatment is global; don't re-apply per-section.
- Consistent vertical rhythm: use the same section padding as `/salon`'s `.pageSection` / `.pageSectionDark` from `styles/package.module.css` as precedent.

### 5.8 Server/Client component boundaries

- Both pages are Server Components by default.
- `HeroVideo`, `VideoPlayer`, `Pillars`, `ScrollReveal` are already `'use client'` — they'll nest cleanly inside the Server Component page. No serialization issues: all props passed are primitives, JSX, or plain-object records.
- The new inline `<EventDetailsStrip>` and agenda table are static markup — keep them server-rendered. No need for `'use client'`.

### 5.9 No data fetching, no Server Actions

Neither page fetches data or has Server Actions. This means:
- No async component bodies.
- No `cookies()` / `headers()`.
- No rate-limiting, no webhook validation, no DB calls.

Stripe payment confirmation is handled entirely by Stripe → `/confirmed` is just a static destination. If/when webhook-driven confirmation becomes a requirement, that's a separate spec.

---

## 6. Open Questions & Assumptions

### 6.1 Open questions (flag before shipping)

| # | Question | Default assumption |
|---|----------|-------------------|
| Q1 | Is the `public/azul.mp4` VSL the final cut, or a rough? | Assumed final. If rough, treat the video asset step as "placeholder — swap when final cut is delivered". |
| Q2 | Is the Stripe Payment Link's success URL configured to `https://the-enlightenment.salon/confirmed`? | Assumed yes. If not, update the Payment Link settings in the Stripe Dashboard — this PRD assumes the redirect is already set. |
| Q3 | Is the Instagram handle `@theenlightenment.salon`? The brief says "confirm handle in spec as TBC — use this as placeholder". | Used as placeholder. Must be verified before go-live. |
| Q4 | Should we add a capacity counter ("31 of 50 seats left")? | No, out of scope for v1. Noted in §1.4. |
| Q5 | Do we want a `/azul` sitemap entry? | Yes — `next-sitemap` or `app/sitemap.ts` should include it. `/confirmed` should be excluded. Check if sitemap config exists; if not, treat as future task. |
| Q6 | Is the pre-event podcast mention (18:00–18:45) for paid attendees only, or public? | Treated as "members only" in the sub-note copy — confirm. |
| Q7 | For option A of §5.3 (Nav suppression via `usePathname`), is it acceptable to add page-specific logic to the shared `Nav` component? | Yes — simplest path; confirmed by "Spec should note whether to use a custom layout or suppress nav links" in brief. |

### 6.2 Assumptions made

- **A1** — Video `public/heroloop.mp4` already exists and is thematically appropriate to use as the hero background on `/azul`. (Verified: file is present in `public/`.)
- **A2** — `public/te-3.jpeg` is the correct image for the Section 3 two-column and OG preview. (Brief specifies this.)
- **A3** — Design tokens in `globals.css` cover everything needed; no new tokens required.
- **A4** — The project uses CSS Modules (confirmed: `styles/*.module.css` throughout).
- **A5** — The footer is unchanged and fine to show on `/azul`.
- **A6** — `Pillars` being hardcoded to Ownership/Reason/Potential is intentional and aligned with the brand pillars named in the brief. We do not parameterise it.
- **A7** — No internationalisation; English only.
- **A8** — No cookie banner considerations specific to this page (Meta Pixel disclosure should already be handled site-wide if required).

---

## 7. Acceptance Criteria

### 7.1 `/azul` acceptance

- [ ] Route `app/azul/page.tsx` exists and renders.
- [ ] Visiting `/azul` shows **no** top-level Nav menu (logo-only or fully hidden per §5.3 Option A). The Footer is still visible.
- [ ] Page renders in this section order: Hero → VSL → What this is → Event details strip → Who this is for → The evening → What's included → Price + CTA → Standards block → Final CTA.
- [ ] Hero headline reads exactly: `Gentlemen don't follow standards. They set them.`
- [ ] Hero CTA button reads exactly: `SECURE YOUR SEAT → €300` and scrolls smoothly to the `#secure` anchor when clicked.
- [ ] The `#secure` anchor is attached to the Price + CTA section (Section 8).
- [ ] VSL player shows a static poster (`/te-3.jpeg`) with a centred play button; clicking the play button starts playback **with audio on** (not autoplay-muted).
- [ ] `public/azul.mp4` file exists and loads correctly in the VSL player.
- [ ] Event details strip renders 5 cells on desktop (≥ 768px), stacked on mobile, with gold labels and white values.
- [ ] Agenda section renders all 8 time/moment rows.
- [ ] The Includes list renders 5 items in the exact order specified.
- [ ] Both Stripe buttons (Section 8 and Section 10) are `<a>` tags with `href="https://buy.stripe.com/28EcN501L73W2c90ula7C0d"`, `target="_blank"`, `rel="noopener noreferrer"`.
- [ ] Clicking either Stripe button opens the Stripe Payment Link in a new tab and leaves the `/azul` tab intact.
- [ ] `Pillars` component renders in Section 9 with its three hardcoded principles (Ownership · Reason · Potential).
- [ ] Meta title is exactly `Salon 06 — The Standard | The Enlightenment Madrid`.
- [ ] Meta description is exactly `50 founders. One evening. Salón Azul · 29 May 2026. €300.`.
- [ ] OG image resolves to `/te-3.jpeg`.
- [ ] Page is responsive: renders cleanly at 320 / 375 / 768 / 1024 / 1440 viewport widths.
- [ ] Lighthouse mobile performance ≥ 90; accessibility ≥ 95; best practices ≥ 95.
- [ ] No console errors or hydration warnings at any viewport.
- [ ] No Next.js `<Link>` references to the Stripe URL (verified by grep — must be `<a>` only).
- [ ] Running the site locally (`npm run dev`) and navigating to `/azul` matches the spec end-to-end.

### 7.2 `/confirmed` acceptance

- [ ] Route `app/confirmed/page.tsx` exists and renders.
- [ ] Page uses the default root layout (Nav + Footer both visible).
- [ ] Centred hero block shows monogram (`/small.png`), `You're in.` headline, sub-headline, body paragraph, and Instagram CTA.
- [ ] Instagram CTA is an `<a href="https://www.instagram.com/theenlightenment.salon" target="_blank" rel="noopener noreferrer">` (handle pending confirmation — see Q3).
- [ ] Bottom strip shows a gold divider followed by the italic `We'll see you on 29 May.` line.
- [ ] No payment logic or Stripe references live on this page.
- [ ] Meta tags include `robots: noindex, nofollow`.
- [ ] Loading `/confirmed` directly (without having paid) still renders correctly — the page is self-contained and does not check any cookie or query param.
- [ ] Stripe Payment Link success URL is confirmed to redirect here (operational task — owner: Tom/Maarten).

### 7.3 Cross-page acceptance

- [ ] Neither `/azul` nor `/confirmed` appear in the main Nav menu.
- [ ] Neither `/azul` nor `/confirmed` break any existing pages (`/`, `/salon`, `/network`, `/brotherhood`, `/welcome`, `/booked`).
- [ ] Typecheck passes (`tsc --noEmit` clean).
- [ ] Build passes (`next build` clean — no new warnings).

---

## 8. What the Code Builder should tackle first

Suggested order of work for a code-building agent:

1. **Copy the video asset** into place: `cp ~/Downloads/02.mp4 "public/azul.mp4"`. Verify playback locally.
2. **Create `app/azul/page.tsx`** as a Server Component with `metadata` export, skeleton of all 10 sections (empty divs with section labels as placeholders).
3. **Create `app/azul/azul.module.css`** with the custom classes (`.stripeBtn`, `.detailsStrip`, `.icpGrid`, `.agenda`, `.finalCta`, etc.).
4. **Wire up Sections 1–3** (Hero, VSL, What this is) using existing components. Verify visually.
5. **Build Section 4** (Event details strip) and **Section 6** (agenda) — these are pure layout/typography.
6. **Build Section 5** (Who this is for) — inline 3-up grid mirroring Pillars' rhythm.
7. **Wire up Sections 7–10** (Includes, Price + CTA, Pillars, Final CTA). Double-check that Stripe CTAs are raw `<a>` tags with `target="_blank" rel="noopener noreferrer"`.
8. **Suppress Nav on `/azul`** via the one-line `usePathname` early-return in `components/Nav.tsx` (§5.3 Option A).
9. **Create `app/confirmed/page.tsx`** and `app/confirmed/confirmed.module.css`.
10. **Run the full acceptance checklist** in §7 end-to-end at 375/768/1440 viewports.
11. **Verify Stripe Payment Link** success URL points to `/confirmed` (operator task, not code).

---

## 9. Summary

One paid-traffic landing page (`/azul`) with ten sections driving to a single Stripe Payment Link, plus one minimal post-payment confirmation page (`/confirmed`). No shared-component changes except a one-line suppression of Nav on `/azul`. All new styling lives in two new CSS module files co-located with the page routes. No data fetching, no Server Actions, no database work. One new video asset (`public/azul.mp4`) needs to be copied into place before ship.

**Total new files:** 4 (`app/azul/page.tsx`, `app/azul/azul.module.css`, `app/confirmed/page.tsx`, `app/confirmed/confirmed.module.css`)
**Total files modified:** 1 (`components/Nav.tsx`, one line)
**Total new assets:** 1 (`public/azul.mp4`)
