import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/HeroImage.module.css'

interface HeroImageCTA {
  label: string
  href: string
}

interface HeroImageProps {
  src: string
  headline: string
  subline: string
  cta?: HeroImageCTA & { secondary?: HeroImageCTA }
  imagePosition?: string
}

export default function HeroImage({ src, headline, subline, cta, imagePosition }: HeroImageProps) {
  return (
    <section className={styles.hero} aria-label="Hero">
      {/* Background image */}
      <Image
        src={src}
        alt=""
        fill
        className={styles.image}
        priority
        aria-hidden="true"
        style={imagePosition ? { objectPosition: imagePosition } : undefined}
      />

      {/* Dark gradient overlay */}
      <div className={styles.overlay} aria-hidden="true" />

      {/* Hero content */}
      <div className={styles.content}>
        <h1 className={styles.headline}>{headline}</h1>
        <p className={styles.subline}>{subline}</p>

        {cta && (
          <div className={styles.ctas}>
            <Link href={cta.href} className={styles.ctaPrimary}>
              <span className={styles.ctaPrimaryText}>{cta.label}</span>
            </Link>
            {cta.secondary && (
              <Link href={cta.secondary.href} className={styles.ctaSecondary}>
                {cta.secondary.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
