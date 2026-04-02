# Security Report -- Completion

**Status:** ALL CLEAR -- SHIP READY
**Completed:** 2026-04-01

All 3 identified security issues have been resolved. Re-scan found zero new issues.

## Resolved Issues

1. **Security headers missing (HIGH)** -- `next.config.ts` now exports `headers()` with HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, and Content-Security-Policy covering Meta Pixel, GHL, Stripe, and Google Fonts.
2. **GHL iframe missing sandbox (HIGH)** -- `components/GHLCalendar.tsx` iframe now has `sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox"`. No allow-top-navigation.
3. **MetaPixel CSP trade-off (MEDIUM)** -- Resolved via documented `unsafe-inline` exception. Numeric PIXEL_ID guard validated. Rationale documented in both `MetaPixel.tsx` and `next.config.ts`.

## Additional Checks Passing

- No hardcoded secrets
- `.env.local` gitignored
- `.env.example` contains only placeholders
- All `target="_blank"` links have `rel="noopener noreferrer"`
- No API routes (zero backend attack surface)
- `SANITY_API_TOKEN` is server-side only

## Files Changed

- `next.config.ts` -- security headers function
- `components/GHLCalendar.tsx` -- sandbox attribute
- `components/MetaPixel.tsx` -- CSP documentation comments
