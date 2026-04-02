'use client'

import { Fragment, useEffect, useRef } from 'react'
import styles from '@/styles/Pillars.module.css'
import ScrollReveal from '@/components/ScrollReveal'

const pillars = [
  {
    numeral: 'I',
    name: 'Ownership',
    body: 'We do not wait for permission. We build, we decide, we own the outcome. Every gentleman here is the author of his life.',
  },
  {
    numeral: 'II',
    name: 'Reason',
    body: 'Clarity over chaos. We think before we act. Every conversation here is deliberate.',
  },
  {
    numeral: 'III',
    name: 'Potential',
    body: 'We hold each other to the highest standard — not out of competition, but brotherhood. This is a safe, unsafe environment.',
  },
]

export default function Pillars() {
  const numeralRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    // Only run scroll-trigger on mobile — desktop uses CSS :hover
    if (window.matchMedia('(min-width: 768px)').matches) return

    const observers: IntersectionObserver[] = []

    numeralRefs.current.forEach((el) => {
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add(styles.active)
          } else {
            el.classList.remove(styles.active)
          }
        },
        // fires when the numeral crosses the middle 20% band of the viewport
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <section className={styles.section} aria-label="Our three pillars">
      <div className={styles.inner}>
        {/* Visually hidden h2 for heading hierarchy — screen reader heading navigation */}
        <h2 style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>Our Three Pillars</h2>
        {pillars.map((pillar, i) => (
          <Fragment key={pillar.numeral}>
            <ScrollReveal delay={i * 150}>
              <div className={styles.pillar}>
                <span
                  className={styles.numeral}
                  aria-hidden="true"
                  ref={(el) => { numeralRefs.current[i] = el }}
                >
                  {pillar.numeral}
                </span>
                <h3 className={styles.name}>{pillar.name.toUpperCase()}</h3>
                <p className={styles.body}>{pillar.body}</p>
              </div>
            </ScrollReveal>
            {i < pillars.length - 1 && (
              <div className={styles.divider} aria-hidden="true" />
            )}
          </Fragment>
        ))}
      </div>
    </section>
  )
}
