'use client'

// MetaPixel.tsx — Client component for Meta Pixel base code
// Reads NEXT_PUBLIC_META_PIXEL_ID — self-disables when env var is empty
// TODO: uncomment tracking calls below when pixel ID is confirmed and ad campaigns are live

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Script from 'next/script'

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

export default function MetaPixel() {
  const pathname = usePathname()

  useEffect(() => {
    if (!PIXEL_ID) return
    // TODO: fire page view on each route change
    // fbq('track', 'PageView')
  }, [pathname])

  // Guard: only allow numeric pixel IDs to prevent injection via env var
  if (!PIXEL_ID || !/^\d+$/.test(PIXEL_ID)) return null

  return (
    <>
      {/*
        SECURITY NOTE: This inline script requires 'unsafe-inline' in the CSP script-src directive.
        The PIXEL_ID is validated as a numeric string before use (see guard above) — this prevents
        XSS injection via the env var. The 'unsafe-inline' exception is acceptable for this
        marketing site as there is no user-generated content that could be injected.
        When Meta Pixel is activated, ensure NEXT_PUBLIC_META_PIXEL_ID is a verified pixel ID.
      */}
      <Script
        id="meta-pixel-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            // TODO: fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}
