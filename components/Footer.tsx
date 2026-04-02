import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="The Enlightenment — Home">
          <Image
            src="/small.png"
            alt="The Enlightenment"
            width={100}
            height={32}
            className={styles.logoImg}
          />
        </Link>

        <p className={styles.tagline}>Enter with intention.</p>

        <nav className={styles.links} aria-label="Footer navigation">
          <Link href="/saloon" className={styles.link}>Saloon</Link>
          <Link href="/network" className={styles.link}>The Network</Link>
          <Link href="/brotherhood" className={styles.link}>The Brotherhood</Link>
        </nav>

        <a
          href="https://www.instagram.com/te.madrid"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.instagram}
          aria-label="Follow The Enlightenment on Instagram"
        >
          @te.madrid
        </a>

        <p className={styles.copyright}>
          &copy; 2026 The Enlightenment. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
