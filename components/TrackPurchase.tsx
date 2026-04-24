'use client'

import { useEffect } from 'react'

export default function TrackPurchase() {
  useEffect(() => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Purchase', { currency: 'EUR', value: 125 })
    }
  }, [])

  return null
}
