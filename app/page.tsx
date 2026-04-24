import type { Metadata } from 'next'
import HeroVideo from '@/components/HeroVideo'
import Pillars from '@/components/Pillars'
import TwoColumn from '@/components/TwoColumn'
import TierCard from '@/components/TierCard'
import CTASection from '@/components/CTASection'
import ScrollReveal from '@/components/ScrollReveal'
import VideoPlayer from '@/components/VideoPlayer'
import styles from '@/styles/home.module.css'

export const metadata: Metadata = {
  title: "The Enlightenment  -  Madrid's Private Gentlemen's Network",
  description: 'A private network for gentlemen who lead. Madrid.',
  openGraph: {
    title: "The Enlightenment  -  Madrid's Private Gentlemen's Network",
    description: 'A private network for gentlemen who lead. Madrid.',
    type: 'website',
    images: [{ url: '/te-1.jpeg', width: 1200, height: 630, alt: 'The Enlightenment' }],
  },
}

export default function HomePage() {
  return (
    <>
      {/* Section 1  -  Hero Video */}
      <HeroVideo
        src="/heroloop.mp4"
        headline="The Enlightenment"
        subline={"Madrid's private network for men who lead.\nBy application only."}
        ctas={[
          { label: 'APPLY →', href: '/#tiers' },
        ]}
      />

      {/* Section 2  -  Feature Video */}
      <section className={styles.videoSection} aria-label="About The Enlightenment">
        <div className={styles.videoSectionInner}>
          <h2 className={styles.videoSectionTitle}>Recent Brotherhood Salon</h2>
          <ScrollReveal>
            <VideoPlayer
              src="https://assets.cdn.filesafe.space/hpKwInwbfTwt06Jy5Y9f/media/69cccb21a0e4042cefbb5ce3.mp4"
              poster="/TEtb.png"
              label="Watch  -  The Enlightenment"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* Section 3  -  Three Pillars */}
      <Pillars />

      {/* Section 4  -  About */}
      <hr className="gold-rule" aria-hidden="true" />
      <section className={styles.aboutSection}>
        <ScrollReveal>
          <TwoColumn
            imageLeft={false}
            imageSrc="/te-2.jpeg"
            imageAlt="The Enlightenment  -  Madrid's private network"
            imagePosition="center 40%"
            headline='"The room you don\u2019t find. You\u2019re invited to."'
            body={
              <>
                <p>We are a private gentlemen&rsquo;s network of entrepreneurs, founders, and leaders. Located in the heart of Madrid, we gather to build, to think, and to hold each other to an uncommon standard.</p>
                <p>Membership is not bought. It is earned.</p>
                <p>Membership is intentionally limited.</p>
              </>
            }
          />
        </ScrollReveal>
        <span className={styles.aboutSubtext}>Madrid. By invitation only.</span>
      </section>

      {/* Section 5  -  Tiers */}
      <section className={styles.tiersSection} id="tiers" aria-label="Membership tiers">
        <div className={styles.tiersInner}>
          <h2 className={styles.tiersSectionHeadline}>Choose your entry.</h2>
          <div className={styles.tiersGrid}>
            <ScrollReveal delay={0}>
              <TierCard
                image="/te-3.jpeg"
                title="The Salon"
                price="€300"
                description="Your first evening in the room. One paid Salon  -  no commitment."
                href="/salon"
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

      {/* Section 6  -  Final CTA */}
      <ScrollReveal>
        <CTASection
          headline="Be committed."
          subline="Or don't be here."
          buttons={[
            { label: 'APPLY →', href: '/#tiers' },
          ]}
        />
      </ScrollReveal>
    </>
  )
}
