'use client'

import { useEffect } from 'react'

/**
 * Fade-and-rise any `.reveal` element the first time it scrolls into view.
 * Elements added later (route changes, hot reload) are picked up by a MutationObserver,
 * so nothing gets stuck invisible.
 */
export function RevealOnScroll() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('is-visible')
          io.unobserve(e.target)
        }
      },
      { threshold: 0.15 },
    )
    const observeAll = () => document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => io.observe(el))
    observeAll()

    const mo = new MutationObserver(observeAll)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}
