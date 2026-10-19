'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'

const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const
type Handle = (typeof HANDLES)[number]

type Box = { x: number; y: number; w: number | null; h: number | null }

type Gesture =
  | { type: 'move'; startX: number; startY: number; origin: Box }
  | { type: 'resize'; handle: Handle; startX: number; startY: number; origin: Box & { w: number; h: number } }

const MIN = 32

type Props = {
  label: string
  children: ReactNode
  className?: string
  surfaceClassName?: string
  sticker?: boolean
  defaultSelected?: boolean
}

/** A Figma-like selectable frame: click to select, drag to move, pull a handle to resize. */
export function InteractiveFrame({ label, children, className = '', surfaceClassName = '', sticker = false, defaultSelected = false }: Props) {
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const gesture = useRef<Gesture | null>(null)
  const [box, setBox] = useState<Box>({ x: 0, y: 0, w: null, h: null })
  const boxRef = useRef(box)
  useLayoutEffect(() => {
    boxRef.current = box
  }, [box])
  const [selected, setSelected] = useState(defaultSelected)
  const [mode, setMode] = useState<'idle' | 'dragging' | 'resizing'>('idle')

  // Deselect when clicking anywhere else on the page.
  useEffect(() => {
    if (!selected) return
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setSelected(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [selected])

  const begin = (e: ReactPointerEvent, g: Gesture) => {
    e.preventDefault()
    e.stopPropagation()
    gesture.current = g
    setSelected(true)
    setMode(g.type === 'move' ? 'dragging' : 'resizing')

    const onMove = (ev: PointerEvent) => {
      const cur = gesture.current
      if (!cur) return
      const dx = ev.clientX - cur.startX
      const dy = ev.clientY - cur.startY
      if (cur.type === 'move') {
        setBox({ ...cur.origin, x: cur.origin.x + dx, y: cur.origin.y + dy })
        return
      }
      const o = cur.origin
      let { x, y, w, h } = o
      if (cur.handle.includes('e')) w = Math.max(MIN, o.w + dx)
      if (cur.handle.includes('s')) h = Math.max(MIN, o.h + dy)
      if (cur.handle.includes('w')) {
        w = Math.max(MIN, o.w - dx)
        x = o.x + (o.w - w)
      }
      if (cur.handle.includes('n')) {
        h = Math.max(MIN, o.h - dy)
        y = o.y + (o.h - h)
      }
      setBox({ x, y, w, h })
    }
    const onUp = () => {
      gesture.current = null
      setMode('idle')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
  }

  const startResize = (e: ReactPointerEvent, handle: Handle) => {
    const rect = surfaceRef.current?.getBoundingClientRect()
    if (!rect) return
    const b = boxRef.current
    begin(e, {
      type: 'resize',
      handle,
      startX: e.clientX,
      startY: e.clientY,
      origin: { ...b, w: b.w ?? surfaceRef.current!.offsetWidth, h: b.h ?? surfaceRef.current!.offsetHeight },
    })
  }

  const showHandles = selected || sticker
  const sized = box.w !== null

  return (
    <div
      ref={rootRef}
      className={`interactive-frame${sticker ? ' interactive-frame--sticker' : ''}${selected ? ' is-selected' : ''}${sized ? ' is-sized' : ''} ${className}`}
      style={{ transform: `translate(${box.x}px, ${box.y}px)` }}
    >
      <div
        ref={surfaceRef}
        className={`interactive-frame__surface ${surfaceClassName}${mode === 'dragging' ? ' is-dragging' : ''}${mode === 'resizing' ? ' is-resizing' : ''}`}
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        aria-labelledby={id}
        style={{ width: box.w ?? undefined, height: box.h ?? undefined, touchAction: 'none' }}
        onPointerDown={(e) => begin(e, { type: 'move', startX: e.clientX, startY: e.clientY, origin: { ...boxRef.current } })}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setSelected((s) => !s)
            return
          }
          if (e.key === 'Escape') return setSelected(false)
          const dir = ({ ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] } as Record<string, number[]>)[e.key]
          if (!dir) return
          e.preventDefault()
          const step = e.shiftKey ? 10 : 1
          setBox((b) => ({ ...b, x: b.x + dir[0] * step, y: b.y + dir[1] * step }))
        }}
      >
        <span id={id} className="sr-only">
          {label}
        </span>
        {!sticker && (
          <div className="interactive-frame__corners" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
        <div className="interactive-frame__content">{children}</div>
        <div className="interactive-frame__handles" aria-hidden={!showHandles}>
          {HANDLES.map((h) => (
            <span
              key={h}
              data-frame-handle={h}
              className={`interactive-frame__handle interactive-frame__handle--${h}`}
              onPointerDown={(e) => startResize(e, h)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
