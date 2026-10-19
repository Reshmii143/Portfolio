'use client'

import { useEffect, useRef } from 'react'

/**
 * A pair of cartoon eyes whose pupils follow the pointer (mouse or finger) anywhere on the page.
 * Size and colours come from CSS, so the same component works in the hero and the footer.
 */
export function Eyes({ className = '' }: { className?: string }) {
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const cur = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ]
    let raf = 0

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
    }

    const loop = () => {
      refs.current.forEach((pupil, i) => {
        const track = pupil?.parentElement
        const iris = pupil?.firstElementChild as HTMLElement | null
        if (!pupil || !track || !iris) return
        const r = track.getBoundingClientRect()
        const dx = target.x - (r.left + r.width / 2)
        const dy = target.y - (r.top + r.height / 2)
        // How far the iris can travel before it would leave the eye.
        const maxX = Math.max(0, (r.width - iris.offsetWidth) / 2)
        const maxY = Math.max(0, (r.height - iris.offsetHeight) / 2)
        const angle = Math.atan2(dy, dx)
        const pull = Math.min(1, Math.hypot(dx, dy) / 260)
        const tx = Math.cos(angle) * maxX * pull
        const ty = Math.sin(angle) * maxY * pull
        cur[i].x += (tx - cur[i].x) * 0.2
        cur[i].y += (ty - cur[i].y) * 0.2
        pupil.style.transform = `translate(${cur[i].x.toFixed(2)}px, ${cur[i].y.toFixed(2)}px)`
      })
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className={`eyes ${className}`} aria-hidden="true">
      {[0, 1].map((i) => (
        <div key={i} className="eyes__eye">
          <div className="eyes__socket" />
          <div className="eyes__track">
            <div className="eyes__follow" ref={(el) => void (refs.current[i] = el)}>
              <div className="eyes__iris">
                <span className="eyes__glint" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
