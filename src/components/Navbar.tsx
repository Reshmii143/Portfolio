'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { smoothScrollTo } from '../lib/smoothScroll'

const icon = (children: ReactNode) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)

const LINKS = [
  { id: 'top', href: '/', label: 'Home', icon: icon(<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />) },
  {
    id: 'projects',
    href: '/#projects',
    label: 'Projects',
    icon: icon(
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" />
      </>,
    ),
  },
  {
    id: 'about',
    href: '/#about',
    label: 'About',
    icon: icon(
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>,
    ),
  },
  {
    id: 'skills',
    href: '/#skills',
    label: 'Skills',
    icon: icon(
      <>
        <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />
      </>,
    ),
  },
  {
    id: 'contact',
    href: '#contact',
    label: 'Contact me',
    icon: icon(
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>,
    ),
  },
]

export function Navbar() {
  const pillRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  // The section seen in view, tagged with the route it was seen on; falls back to the route's default.
  const [seen, setSeen] = useState<{ path: string; id: string } | null>(null)
  const active = seen?.path === pathname ? seen.id : pathname === '/skills' ? 'skills' : 'top'

  // Highlight whichever section is crossing the middle of the viewport.
  // Only sections that exist on the current page are observed, so this works on every route.
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter((el): el is HTMLElement => !!el)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setSeen({ path: pathname, id: e.target.id })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [pathname])

  // If the link's section is on this page, glide to it instead of jumping (and skip the route change).
  const onLinkClick = (e: MouseEvent, id: string) => {
    const el = document.getElementById(id)
    if (!el || e.metaKey || e.ctrlKey || e.shiftKey) return
    e.preventDefault()
    smoothScrollTo(id === 'top' ? 0 : el)
    history.replaceState(null, '', id === 'top' ? pathname : `${pathname}#${id}`)
  }

  // The neon edge glow tracks the pointer across the pill.
  const onMove = (e: React.PointerEvent) => {
    const pill = pillRef.current
    if (!pill) return
    const r = pill.getBoundingClientRect()
    pill.style.setProperty('--x', `${e.clientX - r.left}px`)
    pill.style.setProperty('--y', `${e.clientY - r.top}px`)
    pill.style.setProperty('--opacity', '1')
  }
  const onLeave = () => pillRef.current?.style.setProperty('--opacity', '0')

  return (
    <nav className="navbar" aria-label="Primary">
      <div ref={pillRef} className="navbar__pill" onPointerMove={onMove} onPointerLeave={onLeave}>
        <div className="navbar__neon" aria-hidden="true">
          <div className="neon-glow" />
        </div>
        {LINKS.map((l) => (
          <Link key={l.id} href={l.href} onClick={(e) => onLinkClick(e, l.id)} className={`navbar__link${active === l.id ? ' is-active' : ''}`} aria-current={active === l.id ? 'true' : undefined}>
            {active === l.id && <span className="navbar__link-bg" aria-hidden="true" />}
            <span className="navbar__link-icon" aria-hidden="true">
              {l.icon}
            </span>
            <span className="navbar__link-text">{l.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
