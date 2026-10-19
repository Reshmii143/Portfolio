'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { site } from '../data/site'
import { CursorArrow } from './CursorArrow'
import { DisplacementGrid } from './DisplacementGrid'
import { Eyes } from './Eyes'
import { InteractiveFrame } from './InteractiveFrame'

// three.js is heavy and browser-only, so the 3D pieces load on the client after the page has painted.
const HangingFlowerPot = dynamic(() => import('./HangingFlowerPot').then((m) => m.HangingFlowerPot), { ssr: false })
const RoamingDragon = dynamic(() => import('./RoamingDragon').then((m) => m.RoamingDragon), { ssr: false })

/** A floating label with a collaborator-style cursor that drifts and shies away from the mouse. */
function Chip({ variant, label, cursorFill }: { variant: 'role' | 'place'; label: string; cursorFill: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const target = { x: 0, y: 0 }
    const cur = { x: 0, y: 0 }
    let raf = 0
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = r.left + r.width / 2 - e.clientX
      const dy = r.top + r.height / 2 - e.clientY
      const d = Math.hypot(dx, dy)
      if (d < 220 && d > 0.001) {
        const push = ((220 - d) / 220) * 42
        target.x = (dx / d) * push
        target.y = (dy / d) * push
      } else {
        target.x = target.y = 0
      }
    }
    const loop = () => {
      cur.x += (target.x - cur.x) / 10
      cur.y += (target.y - cur.y) / 10
      el.style.setProperty('--repel-x', `${cur.x.toFixed(2)}px`)
      el.style.setProperty('--repel-y', `${cur.y.toFixed(2)}px`)
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <span ref={ref} className={`hero__chip hero__chip--${variant}`} aria-hidden="true">
      <CursorArrow fill={cursorFill} className={`hero__chip-cursor hero__chip-cursor--${variant}`} />
      <span className="hero__chip-label">{label}</span>
    </span>
  )
}

export function Hero() {
  return (
    <section className="intro" id="top" aria-labelledby="intro-heading">
      <DisplacementGrid />
      <HangingFlowerPot />
      <RoamingDragon />

      <div className="hero">
        <div className="hero__content">
          <div className="hero__identity">
            <div className="hero__eyebrow-wrap">
              <p className="hero__eyebrow">my name is</p>
              <span className="hero__eyebrow-rule" aria-hidden="true" />
            </div>

            <div className="hero__name-wrap">
              {/* A fixed Figma-style frame around the name — styled like the draggable stickers, but it stays put. */}
              <div className="name-frame">
                <div className="name-frame__corners" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                {/* Eyes peeking over the top edge of the frame, following the pointer. */}
                <span className="hero__peek">
                  <Eyes className="eyes--hero" />
                </span>
                <h1 className="hero__name" id="intro-heading">
                  {site.firstName}
                </h1>
              </div>
              <span className="hero__tag">{site.tag}</span>
            </div>

          </div>

          <div className="hero__lower">
            <p className="hero__lede">
              I build <img className="hero__inline" src="/assets/img/bulb.svg" alt="" width="48" height="48" /> interfaces with care,{' '}
              <img className="hero__inline hero__inline--spin" src="/assets/img/flower.svg" alt="" width="40" height="40" /> clarity, and clean code.
            </p>
            <div className="hero__actions">
              <a className="hero__cta" href={site.resumeUrl} download={site.resumeFile}>
                <span className="hero__cta-icon" aria-hidden="true">
                  <svg className="hero__cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4v12M7 11l5 5 5-5M5 20h14" />
                  </svg>
                  <svg className="hero__cta-spark" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z" />
                  </svg>
                </span>
                Download resume
              </a>
              <Chip variant="role" label={site.role} cursorFill="#ecb22e" />
              <Chip variant="place" label={site.city} cursorFill="#e01e5a" />
            </div>
          </div>
        </div>
      </div>

      <div className="stickers">
        <div className="stickers__slot stickers__slot--figma">
          <InteractiveFrame label="React logo sticker" sticker defaultSelected className="stickers__frame stickers__frame--figma">
            <img className="stickers__art stickers__art--figma" src="/assets/img/react.svg" alt="" width="64" height="58" draggable={false} />
          </InteractiveFrame>
        </div>
        <div className="stickers__slot stickers__slot--arrow">
          <InteractiveFrame label="Arrow sticker" sticker defaultSelected className="stickers__frame stickers__frame--arrow">
            <img className="stickers__art stickers__art--arrow" src="/assets/img/arrow.svg" alt="" width="86" height="44" draggable={false} />
          </InteractiveFrame>
        </div>
      </div>
    </section>
  )
}
