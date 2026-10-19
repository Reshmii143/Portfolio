'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'
import { setLenis } from '../lib/smoothScroll'

/**
 * Buttery, momentum-style scrolling for mouse wheels and trackpads (Lenis).
 * Touch screens keep their native scrolling, and it's skipped entirely for reduced-motion users.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085, // lower = floatier glide, higher = snappier
      wheelMultiplier: 1,
      anchors: true, // plain <a href="#id"> links glide too
    })
    setLenis(lenis)
    return () => {
      setLenis(null)
      lenis.destroy()
    }
  }, [])

  return null
}
