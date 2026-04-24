import type { Metadata } from 'next'
import ScrollReveal from '@/components/ScrollReveal'
import styles from '@/styles/booked.module.css'

export const metadata: Metadata = {
  title: 'Your Conversation Is Confirmed  -  The Enlightenment',
  description: 'Your call with the founder of The Enlightenment is confirmed.',
}

export default function BookedPage() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <ScrollReveal>
          <h1 className={styles.headline}>Your conversation is&nbsp;confirmed.</h1>
          <p className={styles.subline}>A meaningful first step &mdash; taken with&nbsp;intention.</p>
        </ScrollReveal>

        <hr className="gold-rule" aria-hidden="true" />

        <ScrollReveal>
          <div className={styles.body}>
            <p>One of our founders will call you at the time you selected. The conversation will be direct, personal, and without agenda. There is no script and no sales pressure &mdash; just an honest exchange between two men exploring whether this is the right room.</p>
            <p>You may have questions about the membership, the events, or the men who sit at the table. Ask all of them. That is precisely what this call is for.</p>
            <p>The Enlightenment is a private network of entrepreneurs in Madrid &mdash; limited to one hundred members, built around intellectual rigour, mutual accountability, and an uncommon standard of conduct. We gather not to network, but to sharpen.</p>
            <p>If it&rsquo;s right, you&rsquo;ll know. And so will we. That is how every seat at this table has been filled &mdash; not through persuasion, but through recognition.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <p className={styles.closing}>We&rsquo;ll speak soon.</p>
        </ScrollReveal>
      </div>
    </section>
  )
}
