import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/TwoColumn.module.css'

interface TwoColumnProps {
  imageLeft: boolean
  imageSrc: string
  imageAlt?: string
  headline: string
  body: React.ReactNode
  cta?: {
    label: string
    href: string
  }
  className?: string
  imagePosition?: string
  framedImage?: boolean
  hideImageMobile?: boolean
}

export default function TwoColumn({
  imageLeft,
  imageSrc,
  imageAlt = '',
  headline,
  body,
  cta,
  className,
  imagePosition,
  framedImage,
  hideImageMobile,
}: TwoColumnProps) {
  return (
    <section className={`${styles.section} ${className ?? ''}`}>
      <div className={`${styles.inner} ${imageLeft ? styles.imageLeft : styles.imageRight}`}>
        {/* Image */}
        <div className={`${styles.imageWrap} ${hideImageMobile ? styles.imageHideMobile : ''}`}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className={styles.image}
            sizes="(min-width: 768px) 50vw, 100vw"
            style={imagePosition ? { objectPosition: imagePosition } : undefined}
          />
          {framedImage && <div className={styles.frameOverlay} aria-hidden="true" />}
        </div>

        {/* Text */}
        <div className={styles.textWrap}>
          <h2 className={styles.headline}>{headline}</h2>
          <div className={styles.body}>{body}</div>
          {cta && (
            <Link href={cta.href} className={styles.cta}>
              {cta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
