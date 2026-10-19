'use client'

import { useEffect, useRef } from 'react'

type Props = {
  spacing?: number
  radius?: number
  strength?: number
  background?: string
  dotColor?: string
  lineColor?: string
}

/** A canvas grid of dots + hairlines that gently breathes and bends away from the cursor. */
export function DisplacementGrid({
  spacing = 28,
  radius = 160,
  strength = 48,
  background = '#ffffff',
  dotColor = 'rgba(28, 24, 20, 0.16)',
  lineColor = 'rgba(28, 24, 20, 0.055)',
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { alpha: false })
    if (!wrap || !canvas || !ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 }
    let w = 0
    let h = 0
    let cols = 0
    let rows = 0
    // Per point: restX, restY, x, y, vx, vy
    let pts = new Float32Array(0)
    let raf = 0
    let visible = true
    const t0 = performance.now()

    const resize = () => {
      const r = wrap.getBoundingClientRect()
      w = Math.max(1, Math.floor(r.width))
      h = Math.max(1, Math.floor(r.height))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(w / spacing) + 3
      rows = Math.ceil(h / spacing) + 3
      pts = new Float32Array(cols * rows * 6)
      const ox = (w - (cols - 1) * spacing) / 2
      const oy = (h - (rows - 1) * spacing) / 2
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
          const k = (j * cols + i) * 6
          const x = ox + i * spacing
          const y = oy + j * spacing
          pts[k] = pts[k + 2] = x
          pts[k + 1] = pts[k + 3] = y
          pts[k + 4] = pts[k + 5] = 0
        }
    }

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      if (x < -40 || y < -40 || x > r.width + 40 || y > r.height + 40) {
        mouse.tx = mouse.ty = -9999
        return
      }
      mouse.tx = x
      mouse.ty = y
    }
    const onLeave = () => {
      mouse.tx = mouse.ty = -9999
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      const still = reduce.matches
      const t = (now - t0) / 1000
      const ease = still ? 1 : 0.18
      // Snap when the cursor re-enters from far away so the bulge doesn't sweep across the page.
      if (mouse.x < -500 || mouse.tx < -500) {
        mouse.x = mouse.tx
        mouse.y = mouse.ty
      } else {
        mouse.x += (mouse.tx - mouse.x) * ease
        mouse.y += (mouse.ty - mouse.y) * ease
      }
      const hasMouse = mouse.x > -500
      const stiff = still ? 1 : 0.12
      const damp = still ? 0 : 0.78

      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
          const k = (j * cols + i) * 6
          const rx = pts[k]
          const ry = pts[k + 1]
          let gx = rx
          let gy = ry
          if (!still) {
            gx += 1.2 * Math.sin(0.7 * t + 0.02 * ry)
            gy += 1.2 * Math.cos(0.55 * t + 0.018 * rx)
          }
          if (hasMouse) {
            const dx = rx - mouse.x
            const dy = ry - mouse.y
            const d = Math.hypot(dx, dy) || 1e-4
            if (d < radius) {
              const f = (1 - d / radius) ** 2 * strength
              gx += (dx / d) * f
              gy += (dy / d) * f
            }
          }
          let vx = (pts[k + 4] + (gx - pts[k + 2]) * stiff) * damp
          let vy = (pts[k + 5] + (gy - pts[k + 3]) * stiff) * damp
          if (still) {
            vx = 0
            vy = 0
            pts[k + 2] = gx
            pts[k + 3] = gy
          } else {
            pts[k + 2] += vx
            pts[k + 3] += vy
          }
          pts[k + 4] = vx
          pts[k + 5] = vy
        }

      ctx.fillStyle = background
      ctx.fillRect(0, 0, w, h)

      ctx.strokeStyle = lineColor
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
          const k = (j * cols + i) * 6
          const x = pts[k + 2]
          const y = pts[k + 3]
          if (i + 1 < cols) {
            ctx.moveTo(x, y)
            ctx.lineTo(pts[k + 8], pts[k + 9])
          }
          if (j + 1 < rows) {
            const b = k + cols * 6
            ctx.moveTo(x, y)
            ctx.lineTo(pts[b + 2], pts[b + 3])
          }
        }
      ctx.stroke()

      ctx.fillStyle = dotColor
      for (let n = 0; n < cols * rows; n++) {
        const k = n * 6
        ctx.fillRect(pts[k + 2] - 0.9, pts[k + 3] - 0.9, 1.8, 1.8)
      }
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    io.observe(wrap)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [spacing, radius, strength, background, dotColor, lineColor])

  return (
    <div ref={wrapRef} className="displacement-grid" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
