import type { Metadata } from 'next'
import Image from 'next/image'
import styles from './confirmed.module.css'
import TrackPurchase from '@/components/TrackPurchase'

export const metadata: Metadata = {
  title: "You're in  -  The Enlightenment Madrid",
  description: 'Your seat for Salon 06 is confirmed. See you on 29 May.',
  robots: { index: false, follow: false },
  openGraph: {
    title: "You're in",
    description: 'Your seat for Salon 06 is confirmed. See you on 29 May.',
    type: 'website',
    images: [{ url: '/te-3.jpeg', width: 1200, height: 630, alt: 'The Enlightenment' }],
  },
}

export default function ConfirmedPage() {
  return (
    <>
      <TrackPurchase />
      <div className={styles.page}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>◆ CONFIRMED</p>

          <h1 className={styles.headline}>You&apos;re in.</h1>

          <p className={styles.receiptLine}>
            Salon 06 - Thursday 29 May - Salon Azul - Madrid
          </p>

          <p className={styles.subline}>
            Your confirmation will be sent to your email shortly.
          </p>

          {/* What happens next card */}
          <div className={styles.nextCard}>
            <p className={styles.nextCardEyebrow}>◆ WHAT HAPPENS NEXT</p>
            <ol className={styles.nextList}>
              <li className={styles.nextItem}>
                <span className={styles.nextNum}>01</span>
                <span>Confirmation email within 5 minutes - check your spam if it doesn&apos;t arrive.</span>
              </li>
              <li className={styles.nextItem}>
                <span className={styles.nextNum}>02</span>
                <span>Calendar invite and full venue details sent 7 days before the event.</span>
              </li>
              <li className={styles.nextItem}>
                <span className={styles.nextNum}>03</span>
                <span>
                  Questions? Email{' '}
                  <a href="mailto:team@the-enlightenment.salon" className={styles.emailLink}>
                    team@the-enlightenment.salon
                  </a>
                </span>
              </li>
            </ol>
          </div>

          <a
            href="https://www.instagram.com/te.madrid"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.igBtn}
            aria-label="Follow us on Instagram @te.madrid"
          >
            <svg
              className={styles.igIcon}
              viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            <span>@te.madrid</span>
          </a>
        </div>
      </div>

      <section className={styles.bottomStrip} aria-label="Closing">
        <hr className="gold-rule" />
        <p className={styles.closing}>We&apos;ll see you on 29 May.</p>
      </section>
    </>
  )
}
