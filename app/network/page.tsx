import type { Metadata } from 'next'
import HeroImage from '@/components/HeroImage'
import TwoColumn from '@/components/TwoColumn'
import PriceBlock from '@/components/PriceBlock'
import IncludesList from '@/components/IncludesList'
import GHLCalendar from '@/components/GHLCalendar'
import ScrollReveal from '@/components/ScrollReveal'
import styles from '@/styles/package.module.css'

export const metadata: Metadata = {
  title: 'The Enlightenment Network — Private Membership Madrid',
  description: 'Annual membership. Five Salons. The inner circle.',
  openGraph: {
    title: 'The Enlightenment Network — Private Membership Madrid',
    description: 'Annual membership. Five Salons. The inner circle.',
    type: 'website',
    images: [{ url: '/te-1.jpeg', width: 1200, height: 630, alt: 'The Enlightenment Network' }],
  },
}

export default function NetworkPage() {
  return (
    <>
      {/* Hero */}
      <HeroImage
        src="/te-4.jpeg"
        imagePosition="center 40%"
        headline="The Network"
        subline="Madrid's private intellectual network."
        cta={{
          label: 'JOIN THE NETWORK →',
          href: '#call',
        }}
      />

      {/* About */}
      <ScrollReveal>
        <TwoColumn
          imageLeft={true}
          imageSrc="/te-4.jpeg"
          imageAlt="The Enlightenment Network — Madrid's private intellectual community"
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

      {/* Includes + Price — side by side on desktop */}
      <div className={styles.priceIncludesGrid}>
        <section className={styles.pageSectionDark} aria-label="What's included">
          <div className={styles.inner}>
            <p className={styles.sectionLabel}>{"What's included"}</p>
            <ScrollReveal>
              <IncludesList
                items={[
                  '5 Gentleman Salons (core intellectual events)',
                  '6–8 Casual Dinners & Sports events',
                  'WhatsApp Community Access (Requests, Gentleman, Business, Wins)',
                  'One guest Salon pass (€300 value)',
                  'Access to apply for The Brotherhood',
                ]}
              />
            </ScrollReveal>
          </div>
        </section>

        <section className={styles.pageSection} aria-label="Pricing">
          <div className={styles.inner}>
            <p className={styles.sectionLabel}>Investment</p>
            <ScrollReveal>
              <PriceBlock price="€2,000" period="Per year" />
            </ScrollReveal>
          </div>
        </section>
      </div>

      {/* Founder call */}
      <GHLCalendar
        heading="Apply to join."
        subline="A direct conversation to answer your questions."
      />
    </>
  )
}
