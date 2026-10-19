'use client'

import { useEffect, useRef, useState } from 'react'
import { projects } from '../data/site'
import { smoothScrollTo } from '../lib/smoothScroll'

const COUNT = projects.length
const VISIBLE_BEHIND = 3
// How much page scroll (in viewport heights) each card change takes.
const SCROLL_PER_CARD = 0.8

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
const smoothstep = (t: number) => t * t * (3 - 2 * t)

/**
 * Turn raw scroll progress (0..COUNT-1) into the deck position, with a pause on every card:
 * the middle half of each step animates, the rest holds still so each project can be read.
 */
function settle(raw: number) {
  const step = Math.min(Math.floor(raw), COUNT - 2)
  const f = raw - step
  return step + smoothstep(clamp((f - 0.25) / 0.5))
}

/** Where card `i` sits given its distance `d` from the front (0 = front, 1 = next, -1 = gone). */
function cardStyle(i: number, d: number) {
  if (d < 0) {
    // Leaving: swipe off to the side like a flicked card; it stays solid while it overlaps the next card
    // (no muddy see-through blend) and only fades in the last stretch.
    const t = Math.min(1, -d)
    const side = i % 2 ? 1 : -1
    return {
      transform: `translate3d(${side * t * 125}%, ${-t * 6}%, 0) rotate(${side * t * 16}deg)`,
      opacity: clamp((1 - t) * 2.5),
    }
  }
  // Alternate cards lean opposite ways; the lean shrinks smoothly to 0 as a card reaches the front.
  const tilt = (i % 2 ? -1 : 1) * d * 1.4
  return {
    transform: `translate3d(0, ${-d * 22}px, 0) scale(${1 - d * 0.055}) rotate(${tilt}deg)`,
    opacity: d > VISIBLE_BEHIND ? 0 : 1,
  }
}

/** Projects pin to the screen while you scroll; each bit of scroll swaps in the next card. */
export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const [pos, setPos] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = section.getBoundingClientRect()
      const scrollable = r.height - window.innerHeight
      const progress = scrollable > 0 ? clamp(-r.top / scrollable) : 0
      // Pad both ends by a quarter step so the first and last cards hold as long as the middle ones.
      setPos(settle(clamp(progress * (COUNT - 0.5) - 0.25, 0, COUNT - 1)))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const active = Math.round(pos)

  // The dots and arrows scroll the page to the matching card, so scroll stays the single source of truth.
  const goTo = (i: number) => {
    const section = sectionRef.current
    if (!section) return
    const target = clamp(i, 0, COUNT - 1)
    const top = section.getBoundingClientRect().top + window.scrollY
    const scrollable = section.offsetHeight - window.innerHeight
    // Inverse of the mapping in update(): aim for the middle of that card's hold window.
    const progress = (target + 0.25) / (COUNT - 0.5)
    smoothScrollTo(top + clamp(progress) * scrollable)
  }

  return (
    <section
      ref={sectionRef}
      className="projects"
      id="projects"
      aria-labelledby="projects-heading"
      style={{ height: `calc(100vh + ${(COUNT - 1) * SCROLL_PER_CARD * 100}vh)` }}
    >
      <div className="projects__pin">
        <div className="projects__intro">
          <p className="projects__eyebrow">Personal projects</p>
          <h2 className="projects__title" id="projects-heading">
            Projects
          </h2>
          <p className="projects__lede">Things I’ve built while learning — keep scrolling to flip through them.</p>
        </div>

        <div className="projects__cards">
          <div className="stack">
            <div className="stack__deck">
              {projects.map((p, i) => {
                const d = i - pos
                const isTop = i === active
                return (
                  <article
                    key={p.title}
                    className={`stack__card${isTop ? ' is-top' : ''}`}
                    style={{ ...cardStyle(i, d), zIndex: COUNT - i, background: p.bg }}
                    aria-hidden={!isTop}
                  >
                    <div className="stack__text">
                      <p className="stack__meta">
                        <span className="stack__tags">
                          {p.stack.map((t) => (
                            <span key={t}>{t}</span>
                          ))}
                        </span>
                        <span>{p.year}</span>
                      </p>
                      <h3 className="stack__title">{p.title}</h3>
                      <p className="stack__summary">{p.summary}</p>
                      <div className="stack__links">
                        {/* Only show "Live demo" when the project actually has a live URL. */}
                        {p.live && (
                          <a className="stack__link" href={p.live} target="_blank" rel="noopener noreferrer" tabIndex={isTop ? 0 : -1}>
                            Live demo <span aria-hidden="true">→</span>
                          </a>
                        )}
                        <a className={`stack__link${p.live ? ' stack__link--ghost' : ''}`} href={p.code} target="_blank" rel="noopener noreferrer" tabIndex={isTop ? 0 : -1}>
                          View code {!p.live && <span aria-hidden="true">→</span>}
                        </a>
                      </div>
                    </div>
                    <div className="stack__shot">
                      <div className="stack__browser" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </div>
                      <img src={p.image} alt="" draggable={false} />
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="stack__controls">
              <button type="button" className="stack__btn" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous project">
                ←
              </button>
              <div className="stack__dots">
                {projects.map((p, i) => (
                  <button
                    key={p.title}
                    type="button"
                    className={i === active ? 'is-active' : ''}
                    onClick={() => goTo(i)}
                    aria-label={`Show ${p.title}`}
                    aria-current={i === active}
                  />
                ))}
              </div>
              <span className="stack__count" aria-hidden="true">
                {String(active + 1).padStart(2, '0')} / {String(COUNT).padStart(2, '0')}
              </span>
              <button type="button" className="stack__btn" onClick={() => goTo(active + 1)} disabled={active === COUNT - 1} aria-label="Next project">
                →
              </button>
            </div>
            <p className="sr-only" aria-live="polite">
              Showing {projects[active].title}
            </p>
          </div>
        </div>

        {/* Progress along the right edge: how far through the projects you are. */}
        <div className="projects__progress" aria-hidden="true">
          <span style={{ transform: `scaleY(${COUNT > 1 ? pos / (COUNT - 1) : 1})` }} />
        </div>
      </div>
    </section>
  )
}
