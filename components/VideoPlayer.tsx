'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
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
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const modalContent = open && (
    <div className={styles.modalBackdrop} onClick={() => setOpen(false)}>
      <button
        className={styles.modalClose}
        onClick={() => setOpen(false)}
        aria-label="Close video"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
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
            title="Video"
          />
        )}
      </div>
    </div>
  )

  return (
    <>
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
          <button className={styles.playBtn} onClick={() => setOpen(true)} aria-label={label}>
            <span className={styles.playBtnInner}>
              <svg className={styles.playIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <polygon points="6,3 21,12 6,21" fill="currentColor" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {mounted && createPortal(modalContent, document.body)}
    </>
  )
}
