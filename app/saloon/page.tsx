import type { Metadata } from 'next'
import HeroImage from '@/components/HeroImage'
import TwoColumn from '@/components/TwoColumn'
import PriceBlock from '@/components/PriceBlock'
import IncludesList from '@/components/IncludesList'
import CheckoutCTA from '@/components/CheckoutCTA'
import GHLCalendar from '@/components/GHLCalendar'
import ScrollReveal from '@/components/ScrollReveal'
import styles from '@/styles/package.module.css'

export const metadata: Metadata = {
  title: 'The Saloon — The Enlightenment Madrid',
  description: 'One evening. One standard. €300.',
  openGraph: {
    title: 'The Saloon — The Enlightenment Madrid',
    description: 'One evening. One standard. €300.',
    type: 'website',
    images: [{ url: '/te-2.jpeg', width: 1200, height: 630, alt: 'The Saloon — The Enlightenment' }],
  },
}

export default function SaloonPage() {
  const stripeLink = process.env.NEXT_PUBLIC_STRIPE_SALOON_LINK || '#'
  if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_STRIPE_SALOON_LINK) {
    console.warn('[SaloonPage] NEXT_PUBLIC_STRIPE_SALOON_LINK is not set — checkout button will be disabled')
  }

  return (
    <>
      {/* Hero */}
      <HeroImage
        src="/te-3.jpeg"
        headline="The Saloon"
        subline="Your first evening in the room."
        imagePosition="center 60%"
        cta={{
          label: 'RESERVE YOUR SEAT →',
          href: '#call',
        }}
      />

      {/* About */}
      <ScrollReveal>
        <TwoColumn
          imageLeft={false}
          imageSrc="/te-1.jpeg"
          imageAlt="The Saloon — an evening among gentlemen"
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

      {/* Includes + Price — side by side on desktop */}
      <div className={styles.priceIncludesGrid}>
        <section className={styles.pageSectionDark} aria-label="What's included">
          <div className={styles.inner}>
            <p className={styles.sectionLabel}>{"What's included"}</p>
            <ScrollReveal>
              <IncludesList
                items={[
                  'Access to one Gentleman Salon',
                  'An evening with The Enlightenment',
                  'Eligibility to apply for The Network',
                ]}
              />
            </ScrollReveal>
          </div>
        </section>

        <section className={styles.pageSection} aria-label="Pricing">
          <div className={styles.inner}>
            <p className={styles.sectionLabel}>Investment</p>
            <ScrollReveal>
              <PriceBlock price="€300" period="One time" />
            </ScrollReveal>
          </div>
        </section>
      </div>

      {/* Checkout */}
      <ScrollReveal>
        <CheckoutCTA
          href={stripeLink}
          label="RESERVE YOUR SEAT"
          price="€300"
          headline="Reserve your seat."
          subline="Seats are limited. No exceptions."
        />
      </ScrollReveal>

      {/* Founder call */}
      <GHLCalendar
        heading="Apply to join."
        subline="A 15-minute conversation. No pitch."
      />
    </>
  )
}
