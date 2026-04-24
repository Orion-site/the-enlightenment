'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import styles from '@/styles/VideoPlayer.module.css'

interface VideoPlayerProps {
  src?: string
  embedUrl?: string
  poster: string
  label?: string
  modal?: boolean
}

export default function VideoPlayer({
  src,
  embedUrl,
  poster,
  label = 'Play video',
  modal = false,
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (modal && playing) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [modal, playing])

  useEffect(() => {
    if (!modal || !playing) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setPlaying(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [modal, playing])

  function handlePlay() {
    setPlaying(true)
    if (!modal && src && videoRef.current) videoRef.current.play()
  }

  return (
    <>
      <div className={styles.player}>
        {!playing && (
          <div className={styles.thumbnail}>
            <Image
              src={poster}
              alt="The Enlightenment  -  video preview"
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              style={{ objectFit: 'cover' }}
              priority
            />
            <div className={styles.overlay} aria-hidden="true" />
            <button className={styles.playBtn} onClick={handlePlay} aria-label={label}>
              <span className={styles.playBtnInner}>
                <svg className={styles.playIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <polygon points="6,3 21,12 6,21" fill="currentColor" />
                </svg>
              </span>
            </button>
          </div>
        )}

        {playing && !modal && src && (
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

        {playing && !modal && embedUrl && (
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

      {modal && playing && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setPlaying(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Video player"
        >
          <div className={styles.modalPopup} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={() => setPlaying(false)}
              aria-label="Close video"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {src && (
              <video
                className={styles.modalVideo}
                src={src}
                autoPlay
                playsInline
                preload="auto"
                poster={poster}
              />
            )}
            {embedUrl && (
              <iframe
                className={styles.modalEmbed}
                src={`${embedUrl}?autoplay=1`}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
                title="The Enlightenment"
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}
