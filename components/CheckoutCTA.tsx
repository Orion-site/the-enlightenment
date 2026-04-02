import styles from '@/styles/CheckoutCTA.module.css'

interface CheckoutCTAProps {
  href: string
  label: string
  price?: string
  headline?: string
  subline?: string
}

export default function CheckoutCTA({
  href,
  label,
  headline,
  subline,
}: CheckoutCTAProps) {
  return (
    <section className={styles.section} id="checkout" aria-label="Checkout">
      <div className={styles.inner}>
        {headline && <h2 className={styles.headline}>{headline}</h2>}
        {subline && <p className={styles.subline}>{subline}</p>}

        <a
          href={href === '#' ? undefined : href}
          className={styles.btn}
          rel={href === '#' ? undefined : 'noopener noreferrer'}
          target={href === '#' ? undefined : '_blank'}
          aria-label={href !== '#' ? `${label} — opens in new tab` : undefined}
          title={href === '#' ? 'Available soon' : undefined}
          aria-disabled={href === '#' ? true : undefined}
          style={href === '#' ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
        >
          <span className={styles.btnText}>{label}</span>
        </a>

      </div>
    </section>
  )
}
