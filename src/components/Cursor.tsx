import { useEffect, useRef } from 'react'

const HOT = 'a, button, .pinned, .frame, .work-card, .sticker, .inquiry button, .lightbox__frame'
const COLORS = ['#FF4FA3', '#FFC2DC', '#FAF6FF', '#D7C6FF', '#ffffff']

export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ring.current
    if (!el) return
    const fine = window.matchMedia('(pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduced.matches) return

    document.documentElement.classList.add('has-cursor')
    let last = 0
    let tick = 0
    const sparks: HTMLSpanElement[] = []

    const onMove = (event: PointerEvent) => {
      el.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      el.classList.add('is-on')
      const target = event.target
      const typing = target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"]')
      const hot = !typing && target instanceof Element && target.closest(HOT)
      el.classList.toggle('is-hot', Boolean(hot))
      el.classList.toggle('is-hidden', Boolean(typing))

      const now = performance.now()
      if (typing || now - last < 46) return
      last = now
      const spark = document.createElement('span')
      spark.className = 'spark'
      spark.style.left = `${event.clientX}px`
      spark.style.top = `${event.clientY}px`
      spark.style.color = COLORS[tick % COLORS.length]
      tick += 1
      document.body.appendChild(spark)
      sparks.push(spark)
      window.setTimeout(() => {
        spark.remove()
        const index = sparks.indexOf(spark)
        if (index >= 0) sparks.splice(index, 1)
      }, 700)
    }

    const onLeave = () => el.classList.remove('is-on')

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      sparks.forEach((spark) => spark.remove())
    }
  }, [])

  return <div ref={ring} className="cursor" aria-hidden="true" />
}
