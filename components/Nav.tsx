'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import styles from '@/styles/Nav.module.css'

const navLinks = [
  { label: 'Salon', href: '/salon' },
  { label: 'The Network', href: '/network' },
  { label: 'The Brotherhood', href: '/brotherhood' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()
  if (pathname === '/azul') return null
  const drawerCloseRef = useRef<HTMLButtonElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // check on mount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  // Auto-focus close button when drawer opens; return focus to hamburger on close
  const wasOpen = useRef(false)
  useEffect(() => {
    if (drawerOpen) {
      wasOpen.current = true
      drawerCloseRef.current?.focus()
    } else if (wasOpen.current) {
      // Only return focus after the drawer was open at least once (not on initial mount)
      hamburgerRef.current?.focus()
    }
  }, [drawerOpen])

  // Focus trap + Escape key handler for drawer
  const handleDrawerKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      setDrawerOpen(false)
      return
    }

    if (e.key !== 'Tab') return

    const drawer = drawerRef.current
    if (!drawer) return

    const focusable = drawer.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const focusableArr = Array.from(focusable).filter((el) => !el.hasAttribute('disabled'))
    if (focusableArr.length === 0) return

    const first = focusableArr[0]
    const last = focusableArr[focusableArr.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }, [])

  // Context-aware nav CTA
  const ctaConfig: Record<string, { label: string; href: string; mobileLabel?: string }> = {
    '/':            { label: 'APPLY →',   href: '/#tiers', mobileLabel: '' },
    '/salon':      { label: 'RESERVE →', href: 'https://buy.stripe.com/28EcN501L73W2c90ula7C0d' },
    '/network':     { label: 'JOIN →',    href: '/network#call' },
    '/brotherhood': { label: 'APPLY →',   href: '/brotherhood#call' },
  }
  const cta = ctaConfig[pathname] ?? { label: 'APPLY →', href: '/#tiers', mobileLabel: '' }

  return (
    <>
      <nav
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="The Enlightenment  -  Home">
          <Image
            src="/big.png"
            alt="The Enlightenment"
            width={160}
            height={40}
            className={styles.logoImg}
            priority
          />
        </Link>

        {/* Desktop Links */}
        <div className={styles.desktopLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.desktopLink} ${pathname === link.href ? styles.active : ''}`}
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
        </div>

        {/* Desktop CTA  -  context-aware per page */}
        <Link href={cta.href} className={`${styles.ctaBtn} ${styles.enterBtn}`}>
          <span className={styles.enterBtnText}>{cta.label}</span>
        </Link>

        {/* Mobile Hamburger  -  hidden when drawer is open so it doesn't float over the overlay */}
        <button
          ref={hamburgerRef}
          className={`${styles.hamburger} ${drawerOpen ? styles.hamburgerHidden : ''}`}
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={drawerOpen}
          aria-controls="mobile-drawer"
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div
        ref={drawerRef}
        id="mobile-drawer"
        className={`${styles.drawer} ${drawerOpen ? styles.open : ''}`}
        aria-hidden={drawerOpen ? undefined : 'true'}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        onKeyDown={handleDrawerKeyDown}
      >
        <button
          ref={drawerCloseRef}
          className={styles.drawerClose}
          onClick={() => setDrawerOpen(false)}
          aria-label="Close navigation menu"
        >
          ×
        </button>

        <nav className={styles.drawerLinks}>
          <Link
            href="/"
            className={`${styles.drawerLink} ${pathname === '/' ? styles.active : ''}`}
            tabIndex={drawerOpen ? 0 : -1}
          >
            HOME
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.drawerLink} ${pathname === link.href ? styles.active : ''}`}
              tabIndex={drawerOpen ? 0 : -1}
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
