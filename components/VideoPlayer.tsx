'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import styles from '@/styles/VideoPlayer.module.css'

interface VideoPlayerProps {
  /** Direct video file URL — used when self-hosting on a CDN */
  src?: string
  /** Vimeo or YouTube embed URL — used when embedding from a platform */
  embedUrl?: string
  /** Poster / thumbnail image path */
  poster: string
  /** Accessible label for the play button */
  label?: string
}

export default function VideoPlayer({
  src,
  embedUrl,
  poster,
  label = 'Play video',
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  function handlePlay() {
    setPlaying(true)
    if (src && videoRef.current) {
      videoRef.current.play()
    }
  }

  return (
    <div className={styles.player}>
      {/* Thumbnail — hidden once playing */}
      {!playing && (
        <div className={styles.thumbnail}>
          <Image
            src={poster}
            alt="The Enlightenment — video preview"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            style={{ objectFit: 'cover' }}
            priority
          />
          {/* Dark overlay */}
          <div className={styles.overlay} aria-hidden="true" />

          {/* Play button */}
          <button
            className={styles.playBtn}
            onClick={handlePlay}
            aria-label={label}
          >
            <span className={styles.playBtnInner}>
              <svg
                className={styles.playIcon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <polygon
                  points="6,3 21,12 6,21"
                  fill="currentColor"
                />
              </svg>
            </span>
          </button>
        </div>
      )}

      {/* Self-hosted video player */}
      {playing && src && (
        <video
          ref={videoRef}
          className={styles.video}
          src={src}
          controls
          autoPlay
          playsInline
          preload="auto"
          poster={poster}
        />
      )}

      {/* Vimeo / platform embed */}
      {playing && embedUrl && (
        <iframe
          className={styles.embed}
          src={`${embedUrl}?autoplay=1`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
          title="The Enlightenment"
        />
      )}
    </div>
  )
}
