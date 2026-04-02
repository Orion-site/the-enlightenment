# The Enlightenment — Full Project Scope

> **Status:** Ready for design & build
> **Last updated:** 2026-03-31
> **Stack:** Next.js · Sanity CMS · Vercel · Stripe (placeholder) · GHL Calendar
> **Domain:** the-enlightenment.salon

---

## 1. Project Overview

**What it is:**
The Enlightenment is a private gentlemen's network and intellectual club based in Madrid, targeting high-achieving entrepreneurs (21–45 years old, €1M+ annual revenue). It is a physical and digital community organised around three pillars: **Ownership, Reason, and Potential.**

**Business goal:**
Drive paid memberships and booking enquiries via paid advertising (primarily Meta). The site must convert cold ad traffic into either a direct purchase or a booked 15-minute founder call. There is no organic/gating — all pages are public-facing.

**Audience:**
Male entrepreneurs, founders, investors. 21–45. Madrid-based or internationally mobile. Fluent in English. High standards, high taste. They will judge the site the same way they judge a suit.

**Tone of voice:**
Mysterious. Earned. Sparse. Copy should feel like it knows more than it says — like a door that's slightly open, not one that's been thrown wide. No hype. No exclamation marks. No emojis. No chest-beating. Write as a gentleman who has nothing to prove and nowhere to be. Short sentences. Long silences between them. Think: a well-worn leather chair, low piano, a man cutting a cigar who hasn't looked up yet.

**Copy rules:**
- Less is more. Always cut the last sentence — it's usually unnecessary.
- Never explain what something *is* when you can make them *feel* what it is.
- Avoid: "world-class", "exclusive", "premium", "luxury" — show it, don't say it.
- Use second person sparingly. When you do, make it feel like a private address, not a sales pitch.
- Rhetorical restraint: one strong line beats three clever ones.

**Brand taglines (use across site):**
- *"Enter with intention."*
- *"Live committed. Or don't live here."*
- *"We Own Madrid."*
- *"Delivering more gentlemen to the world is our duty."*
- *"Our people are our artwork."*

---

## 2. Brand Identity & Design System

### 2.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-black` | `#0a0907` | Primary background |
| `--color-near-black` | `#111009` | Secondary background, cards |
| `--color-surface` | `#161310` | Elevated surfaces, nav, footer |
| `--color-accent` | `#6d3e1d` | Brown accent — CTAs, borders, dividers |
| `--color-gold` | `#b8924a` | Gold — hero video border, fine lines, base of metallic shimmer |
| `--color-gold-light` | `#d4aa6a` | Metallic shimmer highlight peak |
| `--color-gold-dark` | `#7a5c28` | Metallic shimmer shadow trough |
| `--color-white` | `#f5f0ea` | Warm white — primary text |
| `--color-muted` | `#7a7068` | Secondary text, labels, captions |
| `--color-overlay` | `rgba(10,9,7,0.72)` | Video overlays, modal backdrops |

**Rule:** Never use pure `#ffffff` or `#000000`. Always use warm near-blacks and warm whites. The palette should feel like aged paper, dark wood, amber glass.

### 2.2 Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display / Hero titles | Cormorant Garamond | 300–400 | Large, cinematic, old money. Pull from Google Fonts. |
| Section headings (H2, H3) | Libre Baskerville | 400 | Dignified serif |
| Body copy | Libre Baskerville | 400 | Comfortable reading size, 1.7 line height |
| Labels / caps / nav | Libre Baskerville | 400 | Uppercase, tracked wide (0.15–0.2em letter-spacing) |
| Prices / numbers | Cormorant Garamond | 300 | Large, elegant |

**Scale (mobile-first, rem):**
```
Display:   clamp(3rem, 8vw, 7rem)
H1:        clamp(2.2rem, 5vw, 4rem)
H2:        clamp(1.6rem, 3.5vw, 2.6rem)
H3:        clamp(1.2rem, 2.5vw, 1.8rem)
Body:      1rem (16px base) / line-height: 1.75
Small:     0.8rem
Label:     0.7rem uppercase tracked
```

### 2.3 Spacing & Layout

- **Base unit:** 8px
- **Max content width:** 1200px (centered)
- **Section padding:** `clamp(4rem, 10vw, 8rem)` top and bottom
- **Grid:** CSS Grid. 12-column on desktop, single column on mobile.
- **No border-radius anywhere.** Every element has sharp corners. This is non-negotiable.
- **No shadows** that feel soft or consumer. If used, only sharp box-shadows with the accent color.

### 2.4 Motion & Animation

- **Principle:** Cinematic, deliberate, unhurried. Nothing bounces or pops. Everything fades or slides with weight.
- **Default transition:** `opacity` + `transform: translateY(12px)` → `translateY(0)`, duration `600ms`, easing `cubic-bezier(0.25, 0.1, 0.25, 1)`
- **Scroll-triggered reveals:** Sections fade in as they enter the viewport (use Intersection Observer). Each element staggers by `120ms`.
- **Hover states:** Underlines draw from left. Borders thicken. Gold tones emerge. Duration `300ms`.
- **Page transitions:** Cross-fade (opacity) — `400ms`. No sliding pages.
- **Video:** Autoplay, muted, loop. No controls visible. Fades in on load.
- **No parallax.** No jarring scroll effects. No spinning, bouncing, or elastic motion.

### 2.5 UI Rules (Design Directives)

1. **Sharp edges only.** `border-radius: 0` globally.
2. **Horizontal rules** use `1px solid var(--color-accent)` or `var(--color-gold)` — thin and precise.
3. **Buttons** are outlined or ghost by default. On hover: filled with accent. No pill shapes, no rounded corners.
4. **Spacing is generous.** White (dark) space is luxury. Do not crowd elements.
5. **Photography** is dark, moody, high-contrast. Always full-bleed or precisely cropped. Never floated or centered with padding.
6. **Dividers** between sections: a single `1px` gold or accent line, or simply generous negative space.
7. **Metallic gold shimmer** — applied to all gold elements (hero border, dividers, button borders, decorative lines). Implemented as an animated `background-image` linear gradient that sweeps across the element. See Section 2.6 for full implementation spec.
7. **No gradients** except extremely subtle background depth (e.g., `radial-gradient` from near-black to black, centered).
8. **Icons** — if used, must be bespoke or thin-stroke. No icon libraries with rounded aesthetics. Feather icons (stroke, no fill) if needed.
9. **Navigation:** Minimal. No hamburger with animation theatrics — simple, clean. Logo left, links right on desktop; stacked drawer on mobile.
10. **Forms and embeds** should be styled to match: dark background, white/gold border, no rounded inputs.

### 2.6 Metallic Gold Shimmer

All gold elements use a metallic shimmer effect — a sweeping highlight that mimics light catching real gold or polished brass. This is the primary premium feel signal throughout the site.

#### Static metallic texture (always-on for borders and lines)
```css
.gold-metallic {
  background: linear-gradient(
    105deg,
    var(--color-gold-dark)  0%,
    var(--color-gold)       30%,
    var(--color-gold-light) 50%,
    var(--color-gold)       70%,
    var(--color-gold-dark)  100%
  );
}
```
Apply to: hero video border, `<hr>` dividers, decorative lines, section rule elements.

#### Animated shimmer sweep (hover on buttons and interactive elements)
```css
@keyframes shimmer-sweep {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.gold-shimmer-hover {
  background: linear-gradient(
    105deg,
    var(--color-gold-dark)  0%,
    var(--color-gold)       25%,
    var(--color-gold-light) 45%,
    #f0d080                 50%,   /* peak — near white-gold */
    var(--color-gold-light) 55%,
    var(--color-gold)       75%,
    var(--color-gold-dark)  100%
  );
  background-size: 200% auto;
  background-clip: text;            /* for text shimmer */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer-sweep 1.8s linear infinite;
}
```

#### Button shimmer (border + text)
On hover, a CTA button should:
1. Border transitions from `1px solid var(--color-accent)` → `1px solid var(--color-gold)` with the metallic gradient painted on the border (use `border-image` with the gradient)
2. Button label text receives the shimmer sweep animation
3. Transition into the hover state: `300ms ease`

```css
.btn-primary:hover {
  border-image: linear-gradient(
    105deg,
    var(--color-gold-dark),
    var(--color-gold-light),
    var(--color-gold-dark)
  ) 1;
  /* text shimmer applied via span inside button */
}
.btn-primary:hover span {
  background: linear-gradient(105deg, var(--color-gold-dark), var(--color-gold-light) 50%, var(--color-gold-dark));
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer-sweep 1.8s linear infinite;
}
```

#### Hero video border
The inset golden border around the hero video is always-on with the static metallic gradient — it never fully animates on the hero (too distracting). Only the hover state adds the sweep animation on interactive elements.

#### Gold rule lines / dividers
```css
.gold-rule {
  height: 1px;
  background: linear-gradient(
    to right,
    transparent 0%,
    var(--color-gold-dark) 15%,
    var(--color-gold-light) 50%,
    var(--color-gold-dark) 85%,
    transparent 100%
  );
  border: none;
}
```

---

## 3. Site Architecture

### 3.1 Sitemap

```
/                    → Home
/saloon              → The Saloon (€300 entry event)
/network             → The Enlightenment Network (€1,500–2,000/year)
/brotherhood         → The Brotherhood (€5,500/year)
```

### 3.2 Navigation

**Desktop:**
```
[Logo: big.png]                    [SALOON]  [THE NETWORK]  [THE BROTHERHOOD]  [ENTER →]
```

**Mobile:**
- Hamburger icon (minimal, two lines, not three — more refined)
- Full-screen overlay drawer, dark background
- Stacked links, centered, large Cormorant Garamond type
- Close button (×) top right

**Behaviour:**
- Nav is transparent over the hero video, transitions to `var(--color-surface)` with `border-bottom: 1px solid var(--color-accent)` on scroll (threshold: 80px).
- Active page link underlined with a `1px` gold underline.
- "ENTER →" is a styled CTA button linking to `#tiers` on homepage, or to `/network` if on another page.

### 3.3 Footer

```
[Logo: small.png]
[Tagline: "Enter with intention."]

[SALOON]  [THE NETWORK]  [THE BROTHERHOOD]

[Instagram: @te.madrid]

© 2026 The Enlightenment. All rights reserved.
```

- Background: `var(--color-surface)`
- Top border: `1px solid var(--color-accent)`
- Minimal. Single column on mobile.

---

## 4. Page-by-Page Specifications

---

### 4.1 Home Page (`/`)

#### Section 1 — Hero (Full Viewport)

- **Asset:** `TE Hero.mp4`
- Fullscreen, `object-fit: cover`, `position: absolute`, fills 100vh
- Autoplay, muted, loop, `playsinline`
- **Overlay:** Dark gradient overlay — `linear-gradient(to bottom, rgba(10,9,7,0.3) 0%, rgba(10,9,7,0.65) 100%)`
- **Golden border:** A `2px solid var(--color-gold)` inset border around the video frame — implemented as a `::before` pseudo-element or a positioned `<div>` overlay, `inset: 24px` on desktop, `inset: 12px` on mobile. This gives the "framed painting" feel.
- **Content (centered, lower third):**
  ```
  [Display: Cormorant Garamond, 300]
  THE ENLIGHTENMENT

  [Body: Libre Baskerville]
  A private network for gentlemen who lead.
  Madrid. By invitation and application only.

  [Two CTAs side by side]
  [ENTER WITH INTENTION →]   [BOOK A CALL WITH THE FOUNDER]
  ```
- **Scroll indicator:** Single thin vertical line, 60px, gold, centered bottom. Fades out on scroll.

#### Section 2 — The Three Pillars (Values)

- Background: `var(--color-black)`
- Layout: 3 columns on desktop, stacked on mobile
- Each pillar:
  ```
  [Roman numeral: I / II / III — Cormorant, large, muted]
  [Pillar name: OWNERSHIP / REASON / POTENTIAL — uppercase, tracked]
  [Short copy — 2–3 sentences from vision doc]
  ```
- Thin `1px` gold vertical dividers between columns (desktop only)
- Copy:
  - **Ownership:** *We do not wait for permission. We build, we decide, we own the outcome. Every gentleman here is the author of his life.*
  - **Reason:** *Clarity over chaos. We think before we act. Every conversation here is deliberate.*
  - **Potential:** *We hold each other to the highest standard — not out of competition, but brotherhood. This is a safe, unsafe environment.*

#### Section 3 — About The Enlightenment

- Background: `var(--color-near-black)`
- Two-column layout: left text, right full-bleed image (TE 1 or TE 2)
- On mobile: image first, then text below
- Headline: *"The most powerful house in Madrid."*
- Body copy (drawn from vision doc, refined):
  > *We are a private gentlemen's network of entrepreneurs, founders, and leaders. Located in the heart of Madrid, we gather to build, to think, and to hold each other to an uncommon standard.*
  >
  > *Our members are not defined by what they own — but by who they are. Every member does over €1M in annual revenue. Every member speaks the language of a brother, not a friend.*
  >
  > *Limiting membership to 100 intelligentsia ensures that every man in this room earned his seat.*
- Subtext: *"We Own Madrid."* — in Cormorant Garamond, large, light weight, right-aligned.
- Thin gold rule above section.

#### Section 4 — The Tiers (id="tiers")

- Background: `var(--color-black)`
- Headline: *"Choose your entry."*
- 3 cards, equal width, horizontal on desktop, stacked on mobile
- Each card:
  ```
  [Top: Full-bleed photography — TE photos]
  [Bottom: Dark panel]
    [Tier name — H2 Libre Baskerville]
    [Price — Cormorant Garamond, large]
    [2-line description]
    [CTA: "LEARN MORE →" — outlined button]
  ```
- Card hover: thin gold border appears (`1px solid var(--color-gold)`), image subtly brightens (brightness filter 1.0 → 1.08), `transform: translateY(-4px)`, `transition: 200ms`
- Card border default: `1px solid var(--color-accent)`

**Card content:**

| Card | Image | Title | Price | Copy | CTA Link |
|---|---|---|---|---|---|
| 1 | TE 3.jpeg | The Saloon | €300 once | *Your first evening in the room. One paid Salon — no commitment.* | `/saloon` |
| 2 | TE 4.jpeg | The Network | €1,500–2,000/yr | *Five Gentleman Salons, private dinners, WhatsApp intelligentsia.* | `/network` |
| 3 | TE 5.jpeg | The Brotherhood | €5,500/yr | *The inner circle. 15 men. Monthly mastermind. The highest standard.* | `/brotherhood` |

#### Section 5 — Social Proof / Instagram

- Background: `var(--color-surface)`
- Left: Pull quote from vision doc:
  > *"Three years ago this was a vision. Now people are paying €18,000 a year just to step inside."*
  - Attribution: *— Tom Salters, Founder*
- Right: Instagram CTA
  - *Follow the network* → `@te.madrid`
  - Thin gold arrow link
- Optional: Static grid of 4–6 Instagram images (manually curated, not live API for now — speeds up performance)

#### Section 6 — Final CTA

- Background: `var(--color-black)`
- Full-width section, vertically centered text
- Large Cormorant Garamond display text: *"Live committed."*
- Subline: *"Or don't live here."*
- Two CTAs:
  - `[ENTER WITH INTENTION →]` — links to `/network`
  - `[BOOK A CALL →]` — scrolls to or links to booking

---

### 4.2 The Saloon (`/saloon`)

**Purpose:** Explain the Saloon as an entry-point experience. Drive a direct €300 payment.

#### Hero Section
- Full-bleed image (TE 2.jpeg or TE 6.jpeg)
- Overlay with: `THE SALOON` (display) + *"Your first evening in the room."*
- No video on this page

#### About Section
- Two-column: text left, image right
- Copy:
  > *The Enlightenment Salon is a core intellectual gathering. A single evening among gentlemen. Speakers, conversation, and connection at a level you will not find elsewhere.*
  >
  > *This is not a networking event. This is a standard.*
  >
  > *Attend once. Decide what kind of man you are.*
- Price callout: **€300** — Cormorant Garamond, large

#### Includes Section
- 3-item horizontal list (icon-free, simple numbered list):
  1. Access to one Gentleman Salon
  2. Curated evening with The Enlightenment intelligentsia
  3. Eligibility to apply for The Network

#### Checkout Section
- Headline: *"Reserve your seat."*
- Subline: *"Seats are limited. No exceptions."*
- Primary CTA button: `[RESERVE YOUR SEAT — €300 →]`
  - This links to `process.env.NEXT_PUBLIC_STRIPE_SALOON_LINK` (placeholder: `#`)
- Secondary CTA: *"Have a question? Book a 15-minute call with the founder."*
  - Links to GHL calendar embed section (anchor below) or separate booking page

#### Founder Call Section
- Headline: *"Speak with the founder."*
- Copy: *"If you'd like to understand what The Enlightenment is before committing, Tom is available for a direct 15-minute conversation. No sales pitch. A gentleman's conversation."*
- Embedded GHL calendar (see Section 7.1 for embed code and styling)

---

### 4.3 The Network (`/network`)

**Purpose:** The main membership tier. Drive €1,500–2,000/year purchase or a founder call.

#### Hero Section
- Full-bleed image (TE 1.jpeg)
- `THE ENLIGHTENMENT NETWORK`
- *"Madrid's private intellectual network for entrepreneurs."*

#### About Section
- Copy:
  > *The Enlightenment Network is the foundation. Five Gentleman Salons a year, private dinners, curated sports events, and an active WhatsApp community of Madrid's most capable entrepreneurs.*
  >
  > *100 members. No exceptions on standard. No exceptions on commitment.*
- Price: **€1,500–€2,000 / year**

#### What's Included
- List format (no icons, numbered or simple dashes):
  - 5 Gentleman Salons (core intellectual events)
  - 6–8 Casual Dinners & Sports events
  - WhatsApp Community Access (Requests, Gentleman, Business, Wins channels)
  - Access to apply for The Brotherhood
  - One guest pass to a paid Salon (€300 value)

#### Checkout Section
- Primary CTA: `[JOIN THE NETWORK →]`
  - Links to `process.env.NEXT_PUBLIC_STRIPE_NETWORK_LINK` (placeholder: `#`)
- Secondary CTA: *"Prefer to speak first? Book 15 minutes with the founder."*

#### Founder Call Section
- Same as Saloon page — embedded GHL calendar, styled to match

---

### 4.4 The Brotherhood (`/brotherhood`)

**Purpose:** The inner circle. Highest-tier, most exclusive. Drive €5,500/year application or call.

#### Hero Section
- Full-bleed image (TE 5.jpeg or TE 6.jpeg, darkest/moodiest)
- `THE BROTHERHOOD`
- *"The inner circle. 15 men."*

#### About Section
- Copy:
  > *The Brotherhood is not open to the public. It is earned.*
  >
  > *Fifteen men. Monthly masterminds. Private Salons with a higher intellectual standard. A room where you cannot drift — because every man in it will not allow it.*
  >
  > *You are held here. And you hold others.*
- Price: **€5,500 / year**
- Scarcity note: *"Cap: 15 members. Currently [X] seats available."* — editable via Sanity CMS

#### What's Included
- Everything in The Network, plus:
  - Monthly 90-minute Brotherhood Mastermind
  - 2 Brotherhood-only Salons per year
  - Private Brotherhood WhatsApp group
  - Access to the highest-trust room in the network

#### Checkout Section
- Primary CTA: `[APPLY FOR THE BROTHERHOOD →]`
  - Links to `process.env.NEXT_PUBLIC_STRIPE_BROTHERHOOD_LINK` (placeholder: `#`)
- Secondary CTA: *"A Brotherhood seat is a serious commitment. Tom reviews every application personally. If you're ready, book your 15-minute conversation."*

#### Founder Call Section
- GHL calendar embed — same as other pages

---

## 5. Component Library

All components are server components where possible. Client components only when interactivity is required (scroll events, mobile nav, video controls).

### 5.1 `<Nav>`
- Props: `transparent: boolean` (transparent over hero, solid on scroll)
- Logo: `big.png` from `public/` folder
- Mobile: full-screen overlay drawer
- Active state: `1px underline` gold

### 5.2 `<HeroVideo>`
- Props: `src`, `headline`, `subline`, `ctas[]`
- Video: autoplay, muted, loop, playsInline
- Golden inset border overlay (CSS pseudo-element, not on the video tag itself)
- Overlay gradient

### 5.3 `<HeroImage>`
- Props: `src`, `headline`, `subline`
- Used on package pages

### 5.4 `<SectionPillars>`
- 3-column grid, roman numerals, title, body

### 5.5 `<TierCard>`
- Props: `image`, `title`, `price`, `description`, `href`
- Sharp edges, accent border, hover state

### 5.6 `<TwoColumn>`
- Props: `imageLeft: boolean`, `image`, `headline`, `body`, `cta?`
- Reverses on mobile (image always top)

### 5.7 `<PullQuote>`
- Large Cormorant Garamond quote, attribution below

### 5.8 `<CTASection>`
- Full-width dark section
- Display headline + subline + 1–2 buttons

### 5.9 `<PriceBlock>`
- Price display: Cormorant Garamond large + `/year` or `once` in Libre Baskerville small
- Optional scarcity note

### 5.10 `<IncludesList>`
- Numbered or dashed list
- No icons
- Generous spacing between items

### 5.11 `<GHLCalendar>`
- Wrapper div with custom CSS to override GHL iframe default styling
- Background forced to `var(--color-near-black)`
- Borders changed to `var(--color-accent)` or `var(--color-gold)`
- Font injection via `:root` CSS override where possible
- **Embed code:**
  ```html
  <iframe
    src="https://api.leadconnectorhq.com/widget/booking/CLTUl2Ny1H2FWwoPo8T9"
    style="width: 100%; border: none; overflow: hidden;"
    scrolling="no"
    id="CLTUl2Ny1H2FWwoPo8T9_1774982228067"
  />
  <script
    src="https://api.leadconnectorhq.com/js/form_embed.js"
    type="text/javascript"
  />
  ```
- Wrap with `<section>` with `background: var(--color-near-black)`, `padding: 4rem 2rem`, `border-top: 1px solid var(--color-accent)`

### 5.12 `<CheckoutCTA>`
- Props: `href` (from env var), `label`, `price`
- Outlined button, full-width on mobile
- On hover: fills with `var(--color-accent)`, text becomes `var(--color-white)`

### 5.13 `<Footer>`
- Logo: `small.png`
- Tagline
- Nav links
- Instagram link
- Copyright

---

## 6. Tech Stack

| Layer | Tool | Notes |
|---|---|---|
| Framework | **Next.js 15** (App Router) | Server components, fast, Vercel-native |
| CMS | **Sanity v3** | For editable copy: prices, scarcity seats, testimonials, package descriptions |
| Styling | **CSS Modules** + CSS custom properties | No Tailwind — custom palette, full design control |
| Fonts | Google Fonts (Cormorant Garamond + Libre Baskerville) | Load via `next/font/google` — zero layout shift |
| Images | `next/image` | Optimised, lazy loaded, WebP |
| Video | Native `<video>` tag | No library needed |
| Deployment | **Vercel** | Auto-deploy on push to `main` |
| CMS hosting | **Sanity Cloud** (free tier) | Studio at `/studio` route |
| Payments | **Stripe** (placeholder links for now) | Full integration later |
| Calendar | **GHL embed** | iframe, styled |
| Analytics | **Meta Pixel** (to be added later) | Scaffold `<MetaPixel>` component as placeholder |
| SEO | `next/metadata` | Per-page metadata |
| Git | **GitHub** | New private repo: `the-enlightenment` |

### Folder Structure

```
the-enlightenment/
├── app/
│   ├── layout.tsx          ← Root layout: Nav + Footer + fonts
│   ├── page.tsx            ← Home page
│   ├── saloon/
│   │   └── page.tsx
│   ├── network/
│   │   └── page.tsx
│   ├── brotherhood/
│   │   └── page.tsx
│   └── studio/             ← Sanity Studio (embedded)
│       └── [[...tool]]/
│           └── page.tsx
├── components/
│   ├── Nav.tsx
│   ├── Footer.tsx
│   ├── HeroVideo.tsx
│   ├── HeroImage.tsx
│   ├── TierCard.tsx
│   ├── GHLCalendar.tsx
│   ├── CheckoutCTA.tsx
│   ├── CTASection.tsx
│   ├── TwoColumn.tsx
│   ├── PullQuote.tsx
│   ├── IncludesList.tsx
│   └── MetaPixel.tsx       ← placeholder component
├── sanity/
│   ├── schemaTypes/
│   │   ├── package.ts      ← Package page content schema
│   │   └── siteSettings.ts ← Global settings (taglines, seats, etc.)
│   ├── lib/
│   │   └── client.ts
│   └── sanity.config.ts
├── public/
│   ├── big.png
│   ├── small.png
│   ├── TE\ 1.jpeg → TE\ 6.jpeg
│   └── TE\ Hero.mp4
├── styles/
│   ├── globals.css         ← CSS custom properties, reset, typography base
│   └── modules/            ← Per-component CSS modules
├── .env.local              ← Secrets (never committed)
├── .env.example            ← Public template (committed)
└── next.config.ts
```

---

## 7. Integrations

### 7.1 GHL Calendar Embed

Applied on: `/saloon`, `/network`, `/brotherhood` — in the "Speak with the founder" section.

Embed code (store in `<GHLCalendar>` component):
```tsx
export default function GHLCalendar() {
  return (
    <section className={styles.calendarSection}>
      <h3>Speak with the founder.</h3>
      <p>A 15-minute conversation. No sales pitch.</p>
      <div className={styles.calendarWrapper}>
        <iframe
          src="https://api.leadconnectorhq.com/widget/booking/CLTUl2Ny1H2FWwoPo8T9"
          style={{ width: '100%', border: 'none', overflow: 'hidden' }}
          scrolling="no"
          id="CLTUl2Ny1H2FWwoPo8T9_1774982228067"
        />
        <script
          src="https://api.leadconnectorhq.com/js/form_embed.js"
          type="text/javascript"
          async
        />
      </div>
    </section>
  )
}
```

Style override goals:
- Force dark background on iframe container
- Use `postMessage` or CSS injection where possible to restyle the form fields
- At minimum, the wrapper section fully matches the brand aesthetic

### 7.2 Stripe (Placeholder)

Three payment links — stored as env vars. Currently `#` as placeholder. When ready, replace in `.env.local` and Vercel environment settings.

### 7.3 Sanity CMS

Editable content (managed in Sanity Studio at `/studio`):
- Each package page: title, description, price, includes list, scarcity note (e.g. "3 seats left")
- Site settings: taglines, footer copy
- Instagram images (if manually curated grid is added)

Sanity project setup:
```bash
npx sanity@latest init --env
```

### 7.4 Meta Pixel (Scaffolded — add later)

Create `components/MetaPixel.tsx` as a client component with `usePathname` to fire page view events. Track:
- All page views
- Video play (`TE Hero.mp4` — custom event `VideoPlay`)
- Tier card click — custom event `TierSelected` with tier name
- Checkout CTA click — `InitiateCheckout`
- Booking CTA click — `Lead`
- Successful payment redirect — `Purchase` (handled via Stripe webhook later)

Pixel ID stored in: `NEXT_PUBLIC_META_PIXEL_ID`

---

## 8. Environment Variables & Secrets

### `.env.local` (never commit — add to `.gitignore`)

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=              # write access for server-side mutations

# Stripe (payment links — public, but kept in env for easy swapping)
NEXT_PUBLIC_STRIPE_SALOON_LINK=
NEXT_PUBLIC_STRIPE_NETWORK_LINK=
NEXT_PUBLIC_STRIPE_BROTHERHOOD_LINK=

# Analytics (add later)
NEXT_PUBLIC_META_PIXEL_ID=
```

### `.env.example` (commit this)

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_token
NEXT_PUBLIC_STRIPE_SALOON_LINK=https://buy.stripe.com/...
NEXT_PUBLIC_STRIPE_NETWORK_LINK=https://buy.stripe.com/...
NEXT_PUBLIC_STRIPE_BROTHERHOOD_LINK=https://buy.stripe.com/...
NEXT_PUBLIC_META_PIXEL_ID=your_pixel_id
```

### Vercel Environment Variables

Set all `.env.local` values in the Vercel dashboard under **Project Settings → Environment Variables**. Set for Production, Preview, and Development environments as appropriate.

---

## 9. Asset Inventory

| File | Location | Used For |
|---|---|---|
| `big.png` | `public/` | Primary logo — nav, hero sections |
| `small.png` | `public/` | Footer logo |
| `TE 1.jpeg` | `public/` | Network page hero |
| `TE 2.jpeg` | `public/` | About section (home) |
| `TE 3.jpeg` | `public/` | Saloon tier card |
| `TE 4.jpeg` | `public/` | Network tier card |
| `TE 5.jpeg` | `public/` | Brotherhood tier card |
| `TE 6.jpeg` | `public/` | Brotherhood page hero |
| `TE Hero.mp4` | `public/` | Home page hero video |
| `pricing.png` | `assets/knowledge/` | Reference only — pricing details |
| `vision.pdf` | `assets/knowledge/` | Reference only — brand vision and copy |

**Note on video:** `TE Hero.mp4` is ~190MB. Before deployment, compress to <20MB using HandBrake or ffmpeg targeting H.264, 1080p, CRF 28. Provide both `.mp4` and `.webm` for browser compatibility.

**Filename note:** Rename all asset files before importing into the project to remove spaces (e.g. `TE 1.jpeg` → `te-1.jpeg`, `TE Hero.mp4` → `te-hero.mp4`).

---

## 10. Performance & SEO

### Performance Targets

| Metric | Target |
|---|---|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID / INP | < 100ms |
| CLS | < 0.1 |
| Mobile Lighthouse score | 85+ |

**Implementation:**
- All images use `next/image` with `priority` on above-fold images
- Video is lazy-loaded below the fold where possible; hero video preloads `metadata` only
- Fonts loaded via `next/font/google` — no FOUT
- No third-party scripts in `<head>` except Meta Pixel (deferred)
- GHL script is `async`
- Sanity content is fetched server-side (no client fetch waterfalls)
- Route prefetching is on by default in Next.js

### SEO

**Target keywords (Madrid-specific):**
- `madrid private network`
- `madrid entrepreneur network`
- `gentlemen's network madrid`
- `private club madrid entrepreneurs`
- `brotherhood founders network madrid`
- `private members club madrid`
- `entrepreneur mastermind madrid`

**Per-page metadata (via `next/metadata`):**

```tsx
// Home
title: "The Enlightenment — Madrid's Private Gentlemen's Network"
description: "A private network for entrepreneurs and founders in Madrid. Ownership. Reason. Potential. Enter with intention."

// Saloon
title: "The Saloon — The Enlightenment Madrid"
description: "Your first evening in the room. A single Gentleman Salon. €300. Limited seats."

// Network
title: "The Enlightenment Network — Private Membership Madrid"
description: "Annual membership. Five Salons, private dinners, intelligentsia WhatsApp. €1,500–2,000/year. 100 members max."

// Brotherhood
title: "The Brotherhood — Inner Circle | The Enlightenment Madrid"
description: "15 men. Monthly mastermind. The highest standard. €5,500/year. By application only."
```

**Open Graph / Social:**
- `og:image` for each page — a dark, high-quality crop from the brand photography
- `og:type: website`
- Twitter card: `summary_large_image`

**Structured Data:**
- `Organization` schema on homepage (name, url, logo, sameAs: Instagram)

---

## 11. Sanity CMS Schema

### `package.ts` — editable per package page
```ts
{
  name: 'package',
  title: 'Package',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug' },    // saloon | network | brotherhood
    { name: 'price', type: 'string' }, // e.g. "€5,500 / year"
    { name: 'scarcityNote', type: 'string' }, // e.g. "3 seats remaining"
    { name: 'tagline', type: 'string' },
    { name: 'description', type: 'text' },
    { name: 'includes', type: 'array', of: [{ type: 'string' }] },
  ]
}
```

### `siteSettings.ts` — global editable settings
```ts
{
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'tagline', type: 'string' },
    { name: 'footerTagline', type: 'string' },
    { name: 'instagramHandle', type: 'string' },
    { name: 'founderCallHeadline', type: 'string' },
    { name: 'founderCallSubline', type: 'string' },
  ]
}
```

---

## 12. Recommended Tools & Extensions

### VS Code Extensions
| Extension | Purpose |
|---|---|
| **ESLint** | Lint Next.js / TypeScript |
| **Prettier** | Code formatting |
| **Tailwind CSS IntelliSense** | N/A here — but CSS Variables IntelliSense instead |
| **CSS Modules** (`clinyong.vscode-css-modules`) | Autocomplete for CSS Module class names |
| **Sanity** (official) | Sanity schema authoring |
| **GitHub Copilot** | Code assistance |
| **GitLens** | Git history in editor |
| **Error Lens** | Inline error display |
| **Auto Rename Tag** | HTML/JSX tag pairing |
| **Import Cost** | See bundle size of imports |

### CLI Tools
| Tool | Purpose |
|---|---|
| `vercel` CLI | Deploy and manage env vars from terminal |
| `sanity` CLI | Init and manage Sanity project |
| `ffmpeg` | Compress hero video before deployment |

### Design Tools
| Tool | Purpose |
|---|---|
| **Figma** | Component design and layout before build |
| **Google Fonts** | Cormorant Garamond + Libre Baskerville preview |
| **Coolors** | Palette verification |
| **Squoosh** | Image compression (for JPEGs) |

### Browser DevTools
- Chrome DevTools → Lighthouse → Mobile audit before every deploy
- Firefox Responsive Design Mode for mobile-first testing

---

## 13. Git & Deployment Workflow

```bash
# Init new repo
git init
git remote add origin git@github.com:[username]/the-enlightenment.git
git branch -M main
git push -u origin main
```

**Vercel setup:**
1. Connect GitHub repo to new Vercel project
2. Framework: Next.js (auto-detected)
3. Root directory: `.` (default)
4. Add all env vars from `.env.local` in Vercel dashboard
5. Custom domain: `the-enlightenment.salon` — update DNS to point to Vercel (CNAME `cname.vercel-dns.com` or A record `76.76.19.61`)

**Branch strategy:**
- `main` → production (auto-deploy)
- `dev` → staging (Vercel preview URL)

---

## 14. Out of Scope (Phase 2)

- Meta Pixel event tracking (scaffold ready, activate when pixel ID available)
- Full Stripe integration (webhooks, success/cancel pages)
- Members-only gated content
- Live Instagram API feed
- Multi-language support
- Email automation / CRM workflows
- Analytics dashboard
- Blog / editorial content

---

*"Our people are our artwork."*
*— The Enlightenment*
