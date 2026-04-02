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
  title: 'The Brotherhood — The Enlightenment Madrid',
  description: '15 men. The inner circle. By application only.',
  openGraph: {
    title: 'The Brotherhood — The Enlightenment Madrid',
    description: '15 men. The inner circle. By application only.',
    type: 'website',
    images: [{ url: '/te-6.jpeg', width: 1200, height: 630, alt: 'The Brotherhood — The Enlightenment' }],
  },
}

export default function BrotherhoodPage() {
  const stripeLink = process.env.NEXT_PUBLIC_STRIPE_BROTHERHOOD_LINK || '#'
  if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_STRIPE_BROTHERHOOD_LINK) {
    console.warn('[BrotherhoodPage] NEXT_PUBLIC_STRIPE_BROTHERHOOD_LINK is not set — checkout button will be disabled')
  }

  return (
    <>
      {/* Hero */}
      <HeroImage
        src="/te-6.jpeg"
        headline="The Brotherhood"
        subline="15 men. The inner circle."
        cta={{
          label: 'APPLY →',
          href: '#call',
        }}
      />

      {/* About */}
      <ScrollReveal>
        <TwoColumn
          imageLeft={false}
          imageSrc="/te-5.jpeg"
          imageAlt="The Brotherhood — the inner circle"
          headline="The inner circle."
          body={
            <>
              <p>The Brotherhood is not open to the public. It is earned.</p>
              <p>Fifteen men. Monthly masterminds. Private Salons with a higher intellectual standard. A room where you cannot drift — because every man in it will not allow it.</p>
              <p>You are held here. And you hold others.</p>
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
                  'Everything in The Enlightenment Network',
                  'Monthly 90-minute Brotherhood Mastermind',
                  '2 Brotherhood-only Salons per year',
                  'Private Brotherhood WhatsApp group',
                  'The highest-trust room in the network',
                ]}
              />
            </ScrollReveal>
          </div>
        </section>

        <section className={styles.pageSection} aria-label="Pricing">
          <div className={styles.inner}>
            <p className={styles.sectionLabel}>Investment</p>
            <ScrollReveal>
              <PriceBlock
                price="€5,500"
                period="Per year"
                scarcityNote="Cap: 15 members. Enquire for availability."
              />
            </ScrollReveal>
          </div>
        </section>
      </div>

      {/* Checkout */}
      <ScrollReveal>
        <CheckoutCTA
          href={stripeLink}
          label="APPLY FOR THE BROTHERHOOD →"
          price="€5,500 / yr"
          headline="A serious commitment."
          subline="Tom reviews every application personally."
        />
      </ScrollReveal>

      {/* Founder call */}
      <GHLCalendar
        heading="Apply to join."
        subline="A Brotherhood seat is a serious commitment. Begin here."
      />
    </>
  )
}
