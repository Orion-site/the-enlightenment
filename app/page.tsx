import type { Metadata } from 'next'
import HeroVideo from '@/components/HeroVideo'
import Pillars from '@/components/Pillars'
import TwoColumn from '@/components/TwoColumn'
import TierCard from '@/components/TierCard'
import PullQuote from '@/components/PullQuote'
import CTASection from '@/components/CTASection'
import ScrollReveal from '@/components/ScrollReveal'
import SilhouetteAnimation from '@/components/SilhouetteAnimation'
import VideoPlayer from '@/components/VideoPlayer'
import styles from '@/styles/home.module.css'

export const metadata: Metadata = {
  title: "The Enlightenment — Madrid's Private Gentlemen's Network",
  description: 'Enter with intention. A private network for entrepreneurs in Madrid.',
  openGraph: {
    title: "The Enlightenment — Madrid's Private Gentlemen's Network",
    description: 'Enter with intention. A private network for entrepreneurs in Madrid.',
    type: 'website',
    images: [{ url: '/te-1.jpeg', width: 1200, height: 630, alt: 'The Enlightenment' }],
  },
}

export default function HomePage() {
  return (
    <>
      {/* Section 1 — Hero Video */}
      <HeroVideo
        src="/heroloop.mp4"
        headline="The Enlightenment"
        subline="A private network for gentlemen who lead. Madrid. By invitation and application only."
        ctas={[
          { label: 'ENTER WITH INTENTION →', href: '/#tiers' },
        ]}
      />

      {/* Section 2 — Feature Video */}
      <section className={styles.videoSection} aria-label="About The Enlightenment">
        <div className={styles.videoSectionInner}>
          <h2 className={styles.videoSectionTitle}>Recent Brotherhood Saloon</h2>
          <ScrollReveal>
            <VideoPlayer
              src="https://assets.cdn.filesafe.space/hpKwInwbfTwt06Jy5Y9f/media/69cccb21a0e4042cefbb5ce3.mp4"
              poster="/TEtb.png"
              label="Watch — The Enlightenment"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* Section 3 — Three Pillars */}
      <Pillars />

      {/* Section 4 — About */}
      <hr className="gold-rule" aria-hidden="true" />
      <section className={styles.aboutSection}>
        <ScrollReveal>
          <TwoColumn
            imageLeft={false}
            imageSrc="/te-2.jpeg"
            imageAlt="The Enlightenment — Madrid's private network"
            imagePosition="center 40%"
            headline='"The most powerful house in Madrid."'
            body={
              <>
                <p>We are a private gentlemen&rsquo;s network of entrepreneurs, founders, and leaders. Located in the heart of Madrid, we gather to build, to think, and to hold each other to an uncommon standard.</p>
                <p>Our members are not defined by what they own — but by who they are. Every member does over &euro;1M in annual revenue. Every member speaks the language of a brother, not a friend.</p>
                <p>Limiting membership to 100 ensures that every man in this room earned his seat.</p>
              </>
            }
          />
        </ScrollReveal>
        <span className={styles.aboutSubtext}>We Own Madrid.</span>
      </section>

      {/* Section 5 — Tiers */}
      <section className={styles.tiersSection} id="tiers" aria-label="Membership tiers">
        <div className={styles.tiersInner}>
          <h2 className={styles.tiersSectionHeadline}>Choose your entry.</h2>
          <div className={styles.tiersGrid}>
            <ScrollReveal delay={0}>
              <TierCard
                image="/te-3.jpeg"
                title="The Saloon"
                price="€300"
                description="Your first evening in the room. One paid Salon — no commitment."
                href="/saloon"
              />
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <TierCard
                image="/te-4.jpeg"
                title="The Network"
                price="€2,000 / yr"
                description="Five Gentleman Salons, private dinners, WhatsApp community."
                href="/network"
              />
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <TierCard
                image="/te-6.jpeg"
                title="The Brotherhood"
                price="€5,500 / yr"
                description="The inner circle. 15 men. Monthly mastermind. The highest standard."
                href="/brotherhood"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Section 5 — Pull Quote + Instagram CTA (two-column) */}
      <section className={styles.quoteSection} id="quote-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <SilhouetteAnimation sectionId="quote-section" />
        <div className={styles.quoteSectionInner} style={{ position: 'relative', zIndex: 1 }}>
          {/* Left: Pull Quote */}
          <ScrollReveal delay={0}>
            <div className={styles.quoteColumn}>
              <PullQuote
                quote="Every man in this room earned his seat."
                attribution="Tom Salters, Founder"
              />
            </div>
          </ScrollReveal>

          {/* Right: Instagram CTA */}
          <ScrollReveal delay={150}>
            <div className={styles.instagramColumn}>
              <span className={styles.instagramLabel}>Follow the network.</span>
              <a
                href="https://www.instagram.com/te.madrid"
                className={styles.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow @te.madrid on Instagram — opens in new tab"
              >
                <span className={styles.instagramHandle}>@te.madrid</span>
                <span className={styles.instagramArrow} aria-hidden="true">&thinsp;→</span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 6 — Final CTA */}
      <ScrollReveal>
        <CTASection
          headline="Live committed."
          subline="Or don't live here."
          buttons={[
            { label: 'ENTER WITH INTENTION →', href: '/#tiers' },
          ]}
        />
      </ScrollReveal>
    </>
  )
}
