'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from '@/styles/VideoPlayer.module.css'

interface VideoPlayerProps {
  src?: string
  embedUrl?: string
  poster: string
  label?: string
}

export default function VideoPlayer({
  src,
  embedUrl,
  poster,
  label = 'Play video',
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <div className={styles.player}>
        {src && (
          <video
            className={styles.inlineVideo}
            src={src}
            autoPlay
            controls
            playsInline
            preload="auto"
            poster={poster}
          />
        )}
        {embedUrl && (
          <iframe
            className={styles.inlineEmbed}
            src={`${embedUrl}?autoplay=1`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
            title="Video"
          />
        )}
      </div>
    )
  }

  return (
    <div className={styles.player}>
      <div className={styles.thumbnail}>
        <Image
          src={poster}
          alt="The Enlightenment - video preview"
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className={styles.overlay} aria-hidden="true" />
        <button className={styles.playBtn} onClick={() => setPlaying(true)} aria-label={label}>
          <span className={styles.playBtnInner}>
            <svg className={styles.playIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polygon points="6,3 21,12 6,21" fill="currentColor" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  )
}
