import type { Metadata } from 'next'
import HeroVideo from '@/components/HeroVideo'
import TwoColumn from '@/components/TwoColumn'
import GHLCalendar from '@/components/GHLCalendar'
import ScrollReveal from '@/components/ScrollReveal'
import s from './network.module.css'

export const metadata: Metadata = {
  title: 'The Enlightenment Network  -  Private Membership Madrid',
  description: 'Annual membership. Five Salons. The inner circle.',
  openGraph: {
    title: 'The Enlightenment Network  -  Private Membership Madrid',
    description: 'Annual membership. Five Salons. The inner circle.',
    type: 'website',
    images: [{ url: '/te-1.jpeg', width: 1200, height: 630, alt: 'The Enlightenment Network' }],
  },
}

const STRIPE = 'https://buy.stripe.com/8x24gz01LfAs2c9fpfa7C09'

const includesItems = [
  '5 Gentleman Salons per year  -  core intellectual events',
  '6 - 8 Casual Dinners & Sports events',
  'WhatsApp Community Access  -  Requests, Gentleman, Business, Wins',
  'One guest Salon pass (€300 value)',
  'Access to apply for The Brotherhood',
]

export default function NetworkPage() {
  return (
    <div className={s.page}>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <HeroVideo
        src="/heroloop.mp4"
        headline={<>The Network.<br />Madrid's private inner circle.</>}
        subline="Annual membership for the men who stay."
        ctas={[
          { label: 'JOIN THE NETWORK →', href: STRIPE },
        ]}
      />

      {/* ── About ─────────────────────────────────────────────────────────────── */}
      <ScrollReveal>
        <TwoColumn
          imageLeft={true}
          imageSrc="/te-4.jpeg"
          imageAlt="The Enlightenment Network  -  Madrid's private intellectual community"
          imagePosition="center 60%"
          framedImage
          headline="The network."
          body={
            <>
              <p>The Enlightenment Network is the foundation. Five Gentleman Salons a year, private dinners, curated sports events, and an active WhatsApp community of Madrid&apos;s most capable entrepreneurs.</p>
              <p>Membership is intentionally limited. No exceptions on standard. No exceptions on commitment.</p>
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
              <h2 className={s.sectionHeadline}>Five salons. One community. No compromises.</h2>
            </div>
          </ScrollReveal>

          <div className={s.includesPriceGrid}>
            {/* Poster card */}
            <ScrollReveal>
              <div className={s.posterCard}>
                <div className={s.posterStats}>
                  {[
                    { num: '5',   label: 'Salons'    },
                    { num: '8+',  label: 'Events'    },
                    { num: '∞',   label: 'Community' },
                    { num: '1',   label: 'Guest Pass' },
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
                  Not a club. A standard with a community behind it.
                </div>
              </div>
            </ScrollReveal>

            {/* Price + CTA */}
            <ScrollReveal delay={120}>
              <div className={s.priceBox}>
                <p className={s.eyebrow}>◆ INVESTMENT</p>
                <p className={s.priceAmount}>€2,000</p>
                <p className={s.pricePeriod}>Annual membership</p>
                <p className={s.priceScarcity}>Membership by application</p>
                <a href={STRIPE} className={s.stripeBtn} data-cta="network-price">
                  <span className={s.stripeBtnText}>JOIN THE NETWORK →</span>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Questions / Calendar ──────────────────────────────────────────────── */}
      <GHLCalendar
        eyebrow="◆ HAVE QUESTIONS FIRST?"
        heading="Speak with one of the founders."
        subline="Book a 15-minute call. No sales pitch - a direct conversation to see if this is the right room for you."
      />

    </div>
  )
}
