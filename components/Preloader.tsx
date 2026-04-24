'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from '@/styles/Preloader.module.css'

export default function Preloader() {
  const [show, setShow] = useState(false)
  const [fading, setFading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem('te-preloader')) {
      return
    }
    sessionStorage.setItem('te-preloader', '1')
    setShow(true)

    let faded = false

    function startFade() {
      if (faded) return
      faded = true
      // Pause preloader video so the hero video beneath can fully claim the resource
      videoRef.current?.pause()
      setFading(true)
      setTimeout(() => setShow(false), 800)
    }

    const timer = setTimeout(startFade, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  if (!show) return null

  return (
    <div className={`${styles.overlay} ${fading ? styles.fading : ''}`} aria-hidden="true">
      <video
        ref={videoRef}
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        src="/heroloop.mp4"
      />
      <div className={styles.darkLayer} />
      <Image
        src="/big.png"
        alt="The Enlightenment"
        width={140}
        height={35}
        className={styles.logo}
        priority
      />
      <div className={styles.center}>
        <div className={styles.spinner} />
      </div>
    </div>
  )
}
