import Link from 'next/link'
import styles from '@/styles/CTASection.module.css'

interface CTAButton {
  label: string
  href: string
}

interface CTASectionProps {
  headline: string
  subline?: string
  buttons: CTAButton[]
}

export default function CTASection({ headline, subline, buttons }: CTASectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.headline}>{headline}</h2>
        {subline && <p className={styles.subline}>{subline}</p>}
        <div className={styles.buttons}>
          {buttons.map((btn) => (
            <Link key={btn.href} href={btn.href} className={styles.btn}>
              <span className={styles.btnText}>{btn.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
