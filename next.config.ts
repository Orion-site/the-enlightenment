import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

const nextConfig: NextConfig = {
  // Disable the default x-powered-by header
  poweredByHeader: false,

  // Image domains (for next/image remote sources if needed later)
  images: {
    formats: ['image/avif', 'image/webp'],
    // Local images served from /public — no remote domains needed yet
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            // 'unsafe-inline' in script-src is required for two reasons:
            // 1. MetaPixel uses dangerouslySetInnerHTML (numeric PIXEL_ID is validated before use)
            // 2. The GHL form_embed.js script injects inline scripts at runtime
            // This is acceptable for a marketing site with no user-generated content.
            // Revisit with a nonce-based approach once both GHL and Meta support it.
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://api.leadconnectorhq.com https://connect.facebook.net https://js.stripe.com`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https://www.facebook.com",
              "frame-src https://api.leadconnectorhq.com https://checkout.stripe.com",
              "connect-src 'self' https://api.leadconnectorhq.com https://www.facebook.com https://connect.facebook.net",
              "media-src 'self' https://assets.cdn.filesafe.space",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
