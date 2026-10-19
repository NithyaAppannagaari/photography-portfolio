import { useCallback, useEffect, useRef, useState, type PointerEvent, type TouchEvent } from 'react'
import dancer from '../assets/highlights/dancer.webp'
import columns from '../assets/highlights/columns.webp'
import threeDancers from '../assets/highlights/three-dancers.webp'
import portrait from '../assets/highlights/portrait.webp'
import night from '../assets/highlights/night.webp'
import golden from '../assets/highlights/golden.webp'
import duo from '../assets/highlights/duo.webp'
import laugh from '../assets/highlights/laugh.webp'
import circle from '../assets/highlights/circle.webp'
import lawn from '../assets/highlights/lawn.webp'
import './Highlights.css'

const SLIDES = [
  { src: dancer, alt: 'A dancer lifted in white during a performance.' },
  { src: columns, alt: 'Four women standing together in front of stone columns.' },
  { src: threeDancers, alt: 'Three dancers in pink and gold, outdoors in the sun.' },
  { src: portrait, alt: 'A portrait of a woman in a white top, smiling.' },
  { src: night, alt: 'A crowd at night under blue and green light.' },
  { src: golden, alt: 'Three women in gold and black, standing in warm light.' },
  { src: duo, alt: 'Two dancers in pink and gold mid-step.' },
  { src: laugh, alt: 'A woman laughing, one hand near her face.' },
  { src: circle, alt: 'A large circle of dancers on a lawn.' },
  { src: lawn, alt: 'A group seated on the grass in white and gold.' },
]

const INTERVAL = 5000

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(media.matches)
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])
  return reduced
}

export default function Highlights() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [seen, setSeen] = useState(() => new Set([0, 1]))
  const reduced = useReducedMotion()
  const count = SLIDES.length

  const go = useCallback((next: number) => {
    const i = (next + count) % count
    setIndex(i)
    setSeen((prev) => {
      const upcoming = (i + 1) % count
      if (prev.has(i) && prev.has(upcoming)) return prev
      const withNext = new Set(prev)
      withNext.add(i)
      withNext.add(upcoming)
      return withNext
    })
  }, [count])

  useEffect(() => {
    if (paused || reduced) return
    const timer = window.setTimeout(() => go(index + 1), INTERVAL)
    return () => window.clearTimeout(timer)
  }, [index, paused, reduced, go])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target
      if (target instanceof HTMLElement) {
        const tag = target.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        go(index + 1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        go(index - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, index])

  const dragX = useRef<number | null>(null)
  const lastNav = useRef(0)

  const nudge = (dx: number) => {
    const now = Date.now()
    if (now - lastNav.current < 400 || Math.abs(dx) < 48) return
    lastNav.current = now
    go(dx > 0 ? index - 1 : index + 1)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    dragX.current = event.clientX
    try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* pointer already gone */ }
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragX.current == null) return
    const dx = event.clientX - dragX.current
    dragX.current = null
    nudge(dx)
  }

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    dragX.current = event.changedTouches[0]?.clientX ?? null
  }

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const end = event.changedTouches[0]?.clientX
    if (dragX.current == null || end == null) return
    const dx = end - dragX.current
    dragX.current = null
    nudge(dx)
  }

  return (
    <section
      className="highlights"
      id="highlights"
      aria-roledescription="carousel"
      aria-label="Highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement)) setPaused(false)
      }}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
    >
      <div className="highlights__label">
        <p className="kicker">Highlights</p>
      </div>
      <div
        className="highlights__stage"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {SLIDES.map((slide, slideIndex) => (
          seen.has(slideIndex) ? (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              width={2000}
              height={1400}
              loading={slideIndex === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className={slideIndex === index ? 'is-active' : undefined}
              aria-hidden={slideIndex === index ? undefined : true}
            />
          ) : null
        ))}
      </div>
      <div className="highlights__bar">
        <button type="button" className="text-btn" onClick={() => go(index - 1)}>Prev</button>
        <div className="highlights__dots" role="tablist" aria-label="Slides">
          {SLIDES.map((slide, slideIndex) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-label={`Photo ${slideIndex + 1}`}
              aria-selected={slideIndex === index}
              className={slideIndex === index ? 'is-active' : undefined}
              onClick={() => go(slideIndex)}
            />
          ))}
        </div>
        <p className="kicker highlights__count">
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </p>
        <button type="button" className="text-btn" onClick={() => go(index + 1)}>Next</button>
      </div>
    </section>
  )
}
