'use client'

import { useState } from 'react'
import { type ReactNode } from 'react'
import Link from 'next/link'
import styles from '@/styles/HeroVideo.module.css'

interface CTA { label: string; href: string }

interface HeroPill {
  label: string
  duration: string
  href: string
}

interface HeroVideoProps {
  src: string
  headline: ReactNode
  subline: string
  ctas: CTA[]
  badge?: ReactNode
  pill?: HeroPill
}

function scrollToHash(href: string) {
  const hash = href.includes('#') ? href.split('#')[1] : null
  if (!hash) return false
  const target = document.getElementById(hash)
  if (!target) return false
  const navHeight = (document.querySelector('nav') as HTMLElement)?.offsetHeight ?? 80
  const top = target.getBoundingClientRect().top + window.scrollY - navHeight
  window.scrollTo({ top, behavior: 'smooth' })
  return true
}

export default function HeroVideo({ src, headline, subline, ctas, badge, pill }: HeroVideoProps) {
  const [videoLoaded, setVideoLoaded] = useState(false)

  return (
    <section className={styles.hero} aria-label="Hero">
      <video
        className={`${styles.video} ${videoLoaded ? styles.loaded : ''}`}
        autoPlay muted loop playsInline preload="auto"
        poster="/te-1.jpeg" aria-hidden="true"
        onCanPlay={() => setVideoLoaded(true)}
      >
        <source src={src} type="video/mp4" />
      </video>

      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.content}>
        {badge && (
          <div className={styles.badge}>{badge}</div>
        )}
        <h1 className={styles.headline}>{headline}</h1>
        <p className={styles.subline}>{subline}</p>

        {pill && (
          <Link
            href={pill.href}
            className={styles.pill}
            onClick={(e) => { if (scrollToHash(pill.href)) e.preventDefault() }}
          >
            <span className={styles.pillIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor" width="8" height="8">
                <polygon points="4,3 20,12 4,21" />
              </svg>
            </span>
            <span className={styles.pillLabel}>{pill.label}</span>
            <span className={styles.pillSep} aria-hidden="true">·</span>
            <span className={styles.pillDuration}>{pill.duration}</span>
          </Link>
        )}

        {ctas.length > 0 && (
          <div className={styles.ctas}>
            {ctas.map((cta, i) => (
              i === 0 ? (
                <Link key={cta.href} href={cta.href} className={styles.ctaPrimary}
                  onClick={(e) => { if (scrollToHash(cta.href)) e.preventDefault() }}>
                  <span className={styles.ctaPrimaryText}>{cta.label}</span>
                </Link>
              ) : (
                <Link key={cta.href} href={cta.href} className={styles.ctaSecondary}
                  onClick={(e) => { if (scrollToHash(cta.href)) e.preventDefault() }}>
                  {cta.label}
                </Link>
              )
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
