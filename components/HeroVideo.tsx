'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '@/styles/HeroVideo.module.css'

interface CTA {
  label: string
  href: string
}

interface HeroVideoProps {
  src: string
  headline: string
  subline: string
  ctas: CTA[]
}

export default function HeroVideo({ src, headline, subline, ctas }: HeroVideoProps) {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className={styles.hero} aria-label="Hero">
      {/* Background video — poster uses te-1.jpeg as fallback until video loads */}
      <video
        className={`${styles.video} ${videoLoaded ? styles.loaded : ''}`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/te-1.jpeg"
        aria-hidden="true"
        onCanPlay={() => setVideoLoaded(true)}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Dark gradient overlay */}
      <div className={styles.overlay} aria-hidden="true" />

      {/* Hero content */}
      <div className={styles.content}>
        <h1 className={styles.headline}>{headline}</h1>
        <p className={styles.subline}>{subline}</p>

        {ctas.length > 0 && (
          <div className={styles.ctas}>
            {/* First CTA is primary (dominant) — subsequent CTAs are secondary (text link) */}
            {ctas.map((cta, i) => (
              i === 0 ? (
                <Link key={cta.href} href={cta.href} className={styles.ctaPrimary}>
                  <span className={styles.ctaPrimaryText}>{cta.label}</span>
                </Link>
              ) : (
                <Link key={cta.href} href={cta.href} className={styles.ctaSecondary}>
                  {cta.label}
                </Link>
              )
            ))}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div
        className={`${styles.scrollIndicator} ${scrolled ? styles.hidden : ''}`}
        aria-hidden="true"
      >
        <div className={styles.scrollLine} />
      </div>
    </section>
  )
}
