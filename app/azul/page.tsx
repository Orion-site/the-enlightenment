import type { Metadata } from 'next'
import HeroVideo from '@/components/HeroVideo'
import VideoPlayer from '@/components/VideoPlayer'
import TwoColumn from '@/components/TwoColumn'
import Pillars from '@/components/Pillars'
import ScrollReveal from '@/components/ScrollReveal'
import s from './azul.module.css'

export const metadata: Metadata = {
  title: 'Salon 06 - The Standard | The Enlightenment Madrid',
  description: '50 founders. One evening. Salon Azul - 29 May 2026.',
  openGraph: {
    title: 'Salon 06 - The Standard',
    description: '50 founders. One evening. Salon Azul - 29 May 2026.',
    type: 'website',
    images: [{ url: '/te-3.jpeg', width: 1200, height: 630, alt: 'Salon 06 - The Enlightenment' }],
  },
}

const agenda = [
  { time: '19:30 - 19:50', moment: 'Arrival & personal welcome - first drink served' },
  { time: '20:00 - 20:05', moment: 'Opening - Tom & Maarten frame the night' },
  { time: '20:05 - 20:10', moment: 'Speaker I - Tom sets the tone' },
  { time: '20:10 - 20:50', moment: 'First Connection Block - guided networking' },
  { time: '20:50 - 21:00', moment: 'Speaker II - sponsor insight' },
  { time: '21:00 - 22:20', moment: 'Open networking - peak energy - bar active' },
  { time: '22:20 - 22:30', moment: 'Speaker III + collective toast' },
  { time: '22:30 - 23:00', moment: 'Soft close' },
  { time: 'After-hours', moment: 'Nightcap, cigars & deal-making lounge' },
]

const icps = [
  {
    numeral: 'I',
    label: 'THE ISOLATED ENTREPRENEUR',
    body: "You've built something real - but the higher you've gone, the harder it is to find men who can match the conversation. You're not looking for a mentor or a mastermind. You're looking for peers.",
  },
  {
    numeral: 'II',
    label: 'THE MAN OF STANDARDS',
    body: "Presence, elegance, and how you carry yourself aren't trends to you - they're convictions. You want a room that operates at the same level. Where the standard is assumed, not explained.",
  },
  {
    numeral: 'III',
    label: 'THE BROTHERHOOD SEEKER',
    body: "You've done the networking events. You're done with surface-level. What you want is a handful of men - met in person, built over time - who will still be in your life a decade from now.",
  },
]

const includesItems = [
  'Open bar - welcome cocktail or whisky on arrival',
  'Three curated speaker moments',
  'Guided connection blocks',
  'Standing reception in Salon Azul - jazz, fireplaces, Chesterfield sofas',
  'Eligibility to apply for The Network',
]

const details = [
  { label: 'Date',     value: 'Thursday 29 May 2026' },
  { label: 'Time',     value: '19:30 - 23:00' },
  { label: 'Venue',    value: 'Salon Azul - Only You Madrid - C/ Barquillo, 21' },
  { label: 'Dress',    value: 'Suit required. No ties.' },
  { label: 'Capacity', value: '50 founders' },
]

const STRIPE = 'https://buy.stripe.com/28EcN501L73W2c90ula7C0d'

export default function AzulPage() {
  return (
    <div className={s.page}>

      {/* ── 1. Hero ───────────────────────────────────────────────────────────── */}
      <HeroVideo
        src="/heroloop.mp4"
        headline={<>Gentlemen don't follow standards.<br />They set them.</>}
        subline="An evening to illuminate ideas, capital & connection."
        badge={
          <div className={s.badgeCard}>
            <span className={s.badgeEyebrow}>◆ SALON 06</span>
            <p className={s.badgeDate}>Thursday 29 May 2026</p>
            <p className={s.badgeVenue}>Salon Azul - Madrid</p>
            <p className={s.badgeCapacity}>50 seats - by application</p>
          </div>
        }
        ctas={[
          { label: 'SECURE YOUR SEAT →', href: STRIPE },
        ]}
      />

      {/* ── 2. VSL ────────────────────────────────────────────────────────────── */}
      <section id="vsl" className={s.vslSection}>
        <div className={s.sectionInner}>
          <ScrollReveal>
            <p className={s.eyebrow}>◆ WATCH BEFORE YOU DECIDE</p>
            <h2 className={s.vslHeadline}>Two minutes with Tom & Maarten.</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <VideoPlayer src="/azul.mp4" poster="/te-3.jpeg" label="Play - Salon 06" modal />
          </ScrollReveal>
        </div>
      </section>

      {/* ── 3. What this is ───────────────────────────────────────────────────── */}
      <ScrollReveal>
        <TwoColumn
          imageLeft={false}
          imageSrc="/te-3.jpeg"
          imageAlt="Salon Azul - Only You Boutique Hotel Madrid"
          framedImage
          hideImageMobile
          headline="One evening. One standard."
          body={
            <>
              <p>Salon Azul is a jewel-box of deep navy velvet, gilded mirrors and fireplaces. Antique portraits watch over Chesterfield sofas. A room built for the kind of conversation most rooms can&apos;t hold.</p>
              <p>Fifty founders. One standing reception. Three curated speaker moments. Open bar. Jazz. A suit. No small talk, no spectators.</p>
              <p>Attend once. Decide what kind of man you are.</p>
            </>
          }
        />
      </ScrollReveal>

      {/* ── 4. Event details strip ────────────────────────────────────────────── */}
      <section className={s.detailsStrip} aria-label="Event details">
        <div className={s.detailsGrid}>
          {details.map((cell) => (
            <div key={cell.label} className={s.detailsCell}>
              <span className={s.detailsLabel}>{cell.label}</span>
              <span className={s.detailsValue}>{cell.value}</span>
            </div>
          ))}
        </div>
        <p className={s.detailsNote}>
          Pre-event podcast taping at the venue - 18:00 - 18:45 - members only.
        </p>
      </section>

      {/* ── 5. Who this is for ────────────────────────────────────────────────── */}
      <section className={s.icpSection} aria-label="Who this is for">
        <div className={s.sectionInner}>
          <ScrollReveal>
            <div className={s.sectionHeader}>
              <p className={s.eyebrow}>◆ WHO THIS IS FOR</p>
              <h2 className={s.sectionHeadline}>
                Built for founders who are done with the wrong rooms.
              </h2>
              <p className={s.sectionSubline}>
                Three men walk into Salon Azul. These are the three.
              </p>
            </div>
          </ScrollReveal>

          <div className={s.icpGrid}>
            {icps.map((icp, i) => (
              <ScrollReveal key={icp.numeral} delay={i * 120}>
                <div className={s.icpCard}>
                  <div className={s.icpCardTop}>
                    <span className={s.icpNumeral}>{icp.numeral}</span>
                    <span className={s.icpLabel}>{icp.label}</span>
                  </div>
                  <p className={s.icpBody}>{icp.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={200}>
            <div className={s.centeredCta}>
              <a href={STRIPE} className={s.stripeBtn} data-cta="azul-icp">
                <span className={s.stripeBtnText}>SECURE YOUR SEAT →</span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 6+7. Includes poster card + Price ────────────────────────────────── */}
      <section id="secure" className={s.includesSection} aria-label="What's included">
        <div className={s.sectionInner}>
          <ScrollReveal>
            <div className={s.sectionHeader}>
              <p className={s.eyebrow}>◆ WHAT YOU GET</p>
              <h2 className={s.sectionHeadline}>Everything included. Nothing held back.</h2>
            </div>
          </ScrollReveal>

          <div className={s.includesPriceGrid}>
            {/* Poster card */}
            <ScrollReveal>
              <div className={s.posterCard}>
                <div className={s.posterStats}>
                  {[
                    { num: '3',    label: 'Speakers'  },
                    { num: '50',   label: 'Founders'  },
                    { num: '∞',    label: 'Open Bar'  },
                    { num: 'Jazz', label: 'All Night' },
                  ].map((stat) => (
                    <div key={stat.label} className={s.posterStat}>
                      <span className={s.posterStatNum}>{stat.num}</span>
                      <span className={s.posterStatLabel}>{stat.label}</span>
                    </div>
                  ))}
                </div>

                <ol className={s.posterList}>
                  {includesItems.map((item, i) => (
                    <li key={i} className={s.posterListItem}>
                      <span className={s.posterNum}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={s.posterItemText}>{item}</span>
                    </li>
                  ))}
                </ol>

                <div className={s.posterBanner}>
                  One night. One room. No small talk.
                </div>
              </div>
            </ScrollReveal>

            {/* Price + CTA */}
            <ScrollReveal delay={120}>
              <div className={s.priceBox}>
                <p className={s.eyebrow}>◆ INVESTMENT</p>
                <p className={s.priceAmount}>€300</p>
                <p className={s.pricePeriod}>One evening - Salon 06</p>
                <p className={s.priceScarcity}>50 seats - limited release</p>
                <a href={STRIPE} className={s.stripeBtn} data-cta="azul-price">
                  <span className={s.stripeBtnText}>SECURE YOUR SEAT →</span>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 8. Programme (INVERTED - ivory band) ─────────────────────────────── */}
      <section className={s.agendaSection} aria-label="Programme">
        <div className={s.agendaInner}>
          <ScrollReveal>
            <p className={s.agendaEyebrow}>◆ THE EVENING</p>
            <h2 className={s.agendaHeadline}>The programme.</h2>
            <p className={s.agendaSubline}>A night engineered for momentum.</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className={s.agendaTable} role="list">
              {agenda.map((row) => (
                <div key={row.time} className={s.agendaRow} role="listitem">
                  <span className={s.agendaTime}>{row.time}</span>
                  <span className={s.agendaMoment}>{row.moment}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 9. Standards + Pillars ───────────────────────────────────────────── */}
      <section className={s.standardsSection} aria-label="Our principles">
        <div className={s.sectionInner}>
          <ScrollReveal>
            <div className={s.sectionHeader}>
              <p className={s.eyebrow}>◆ THE STANDARD</p>
              <h2 className={s.sectionHeadline}>We live by three principles.</h2>
              <p className={s.sectionSubline}>
                Suit required. No ties. No small talk. No spectators.
              </p>
            </div>
          </ScrollReveal>
        </div>
        <Pillars />
      </section>

      {/* ── 10. Final CTA ────────────────────────────────────────────────────── */}
      <section className={s.finalCta} aria-label="Final call to action">
        <div className={s.finalCtaInner}>
          <ScrollReveal>
            <h2 className={s.finalCtaHeadline}>50 seats. One standard.</h2>
            <p className={s.finalCtaSubline}>Thursday 29 May - Salon Azul - Madrid.</p>
            <a href={STRIPE} className={s.stripeBtn} data-cta="azul-final">
              <span className={s.stripeBtnText}>SECURE YOUR SEAT →</span>
            </a>
          </ScrollReveal>
        </div>
      </section>

    </div>
  )
}
