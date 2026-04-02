'use client'

export default function SilhouetteAnimation({ sectionId: _ = 'tiers' }: { sectionId?: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        opacity: 0.03,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/1.png"
        alt=""
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '55%',
          height: '90%',
          objectFit: 'contain',
          objectPosition: 'bottom right',
          mixBlendMode: 'screen',
          filter: 'invert(1)',
        }}
      />
    </div>
  )
}
