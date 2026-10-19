import type Lenis from 'lenis'

// The one Lenis instance for the page (set by <SmoothScroll />). Null when the user prefers reduced motion.
let lenis: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenis = instance
}

/**
 * Scroll to a y position, an element, or a selector like "#projects".
 * Uses Lenis's eased scroll when it's running, and native scrolling otherwise.
 */
export function smoothScrollTo(target: number | string | HTMLElement, options: { immediate?: boolean } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4, immediate: options.immediate })
    return
  }
  const behavior: ScrollBehavior = options.immediate ? 'auto' : 'smooth'
  if (typeof target === 'number') return window.scrollTo({ top: target, behavior })
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView({ behavior })
}
