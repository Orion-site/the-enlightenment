import type { Metadata } from 'next'
import HeroVideo from '@/components/HeroVideo'
import TwoColumn from '@/components/TwoColumn'
import ScrollReveal from '@/components/ScrollReveal'
import s from './salon.module.css'

export const metadata: Metadata = {
  title: 'The Salon  -  The Enlightenment Madrid',
  description: 'One evening. One standard. €300.',
  openGraph: {
    title: 'The Salon  -  The Enlightenment Madrid',
    description: 'One evening. One standard. €300.',
    type: 'website',
    images: [{ url: '/te-2.jpeg', width: 1200, height: 630, alt: 'The Salon  -  The Enlightenment' }],
  },
}

const STRIPE = 'https://buy.stripe.com/28EcN501L73W2c90ula7C0d'

const includesItems = [
  'Access to one Gentleman Salon',
  'An evening of speakers, connection, and open bar',
  'Eligibility to apply for The Network',
]

export default function SalonPage() {
  return (
    <div className={s.page}>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <HeroVideo
        src="/heroloop.mp4"
        headline={<>The Salon.<br />One evening. One standard.</>}
        subline="Your first evening in the room."
        ctas={[
          { label: 'SECURE YOUR SEAT →', href: STRIPE },
        ]}
      />

      {/* ── About ─────────────────────────────────────────────────────────────── */}
      <ScrollReveal>
        <TwoColumn
          imageLeft={false}
          imageSrc="/te-1.jpeg"
          imageAlt="The Salon  -  an evening among gentlemen"
          framedImage
          headline="One evening. One standard."
          body={
            <>
              <p>The Enlightenment Salon is a core intellectual gathering. A single evening among gentlemen. Speakers, conversation, and connection at a level you will not find elsewhere.</p>
              <p>This is not a networking event. This is a standard.</p>
              <p>Attend once. Decide what kind of man you are.</p>
            </>
          }
        />
      </ScrollReveal>

      {/* ── What You Get ──────────────────────────────────────────────────────── */}
      <section className={s.includesSection} aria-label="What's included">
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
                <p className={s.pricePeriod}>One evening</p>
                <p className={s.priceScarcity}>Limited seats per salon</p>
                <a href={STRIPE} className={s.stripeBtn} data-cta="salon-price">
                  <span className={s.stripeBtnText}>SECURE YOUR SEAT →</span>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────────── */}
      <section className={s.finalCta} aria-label="Final call to action">
        <div className={s.finalCtaInner}>
          <h2 className={s.finalCtaHeadline}>One standard.<br />Are you in?</h2>
          <p className={s.finalCtaSubline}>Seats are limited. The room is curated.</p>
          <a href={STRIPE} className={s.stripeBtn} data-cta="salon-final">
            <span className={s.stripeBtnText}>SECURE YOUR SEAT →</span>
          </a>
        </div>
      </section>

    </div>
  )
}
