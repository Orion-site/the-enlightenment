'use client'

import { useState } from 'react'
import Script from 'next/script'
import styles from '@/styles/GHLCalendar.module.css'

interface GHLCalendarProps {
  heading?: string
  subline?: string
}

export default function GHLCalendar({
  heading = 'Speak with the founder.',
  subline = 'A 15-minute conversation. No sales pitch.',
}: GHLCalendarProps) {
  const [calendarLoaded, setCalendarLoaded] = useState(false)

  return (
    <section className={styles.section} id="call" aria-label="Book a call with the founder">
      <div className={styles.inner}>
        <h2 className={styles.heading}>{heading}</h2>
        <p className={styles.subline}>{subline}</p>

        <div className={styles.calendarWrapper}>
          {/* Loading placeholder — hidden once iframe fires onLoad */}
          {!calendarLoaded && (
            <div className={styles.loadingPlaceholder} aria-hidden="true">
              <div className={styles.loadingRule} />
              <span className={styles.loadingText}>Loading calendar&hellip;</span>
            </div>
          )}
          <iframe
            src="https://api.leadconnectorhq.com/widget/booking/CLTUl2Ny1H2FWwoPo8T9"
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            className={styles.iframe}
            style={{ overflow: 'hidden' }}
            id="CLTUl2Ny1H2FWwoPo8T9_1774982228067"
            title="Book a 15-minute call with Tom Baltus"
            onLoad={() => setCalendarLoaded(true)}
          />
        </div>
      </div>

      <Script
        id="ghl-form-embed"
        src="https://api.leadconnectorhq.com/js/form_embed.js"
        strategy="afterInteractive"
      />
    </section>
  )
}
