import type { Metadata } from 'next'
import ScrollReveal from '@/components/ScrollReveal'
import styles from '@/styles/welcome.module.css'

export const metadata: Metadata = {
  title: 'Welcome to The Enlightenment',
  description: 'You are now a member of The Enlightenment. Madrid awaits.',
}

export default function WelcomePage() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <ScrollReveal>
          <h1 className={styles.headline}>Welcome to The&nbsp;Enlightenment.</h1>
          <p className={styles.subline}>You didn&rsquo;t just join something. You entered&nbsp;it.</p>
        </ScrollReveal>

        <hr className="gold-rule" aria-hidden="true" />

        <ScrollReveal>
          <div className={styles.body}>
            <p>Everything you need will arrive shortly in your inbox &mdash; your confirmation, your access details, and your invitation to the private community. If anything is unclear, reply directly. Someone real will answer.</p>
            <p>You are now one of a very small number of men in Madrid who hold this membership. That is not a marketing line. It is arithmetic. We keep the room small because the room matters.</p>
            <p>We look forward to meeting you in person. The first Salon will feel like coming home to a room you didn&rsquo;t know existed.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <p className={styles.closing}>Madrid awaits.</p>
        </ScrollReveal>
      </div>
    </section>
  )
}
