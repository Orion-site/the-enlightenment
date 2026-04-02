'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 400ms cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
    >
      {children}
    </div>
  )
}
