/**
 * CustomCursor — editorial dual-ring cursor
 *
 * Two elements:
 *  - dot:  tiny 6px dot, follows mouse instantly (RAF, no lag)
 *  - ring: larger 36px ring, follows with a lerp lag for that
 *          satisfying "behind" spring feel
 *
 * Ring expands to 72px + shows "view" when hovering .pxcard elements.
 * Uses CSS :has() to detect hover state — zero JS overhead.
 *
 * cursor: none is set on .portfolio in App.css.
 */

import { useEffect, useRef } from 'react'
import './CustomCursor.css'

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos     = useRef({ x: -200, y: -200 })   // cursor position (screen px)
  const ring    = useRef({ x: -200, y: -200 })   // ring position (lags behind)
  const rafId   = useRef<number>(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      // Dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    // Animate ring with lerp
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.1
      ring.current.y += (pos.current.y - ring.current.y) * 0.1
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`
      }
      rafId.current = requestAnimationFrame(animate)
    }
    rafId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <div className="cc" aria-hidden="true">
      {/* Outer ring (lags, expands on card hover) */}
      <div ref={ringRef} className="cc__ring">
        <span className="cc__label">view</span>
      </div>
      {/* Inner dot (instant follow) */}
      <div ref={dotRef} className="cc__dot" />
    </div>
  )
}
