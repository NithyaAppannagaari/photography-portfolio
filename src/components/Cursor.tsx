import { useEffect, useRef } from 'react'

const HOT = 'a, button, .photo-frame, .highlights__stage, .work-card, .frames button, .lightbox__frame'

export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ring.current
    if (!el) return
    const fine = window.matchMedia('(pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduced.matches) return

    document.documentElement.classList.add('has-cursor')
    let x = -100
    let y = -100
    let cx = -100
    let cy = -100
    let frame = 0

    const onMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      el.classList.add('is-on')
      const target = event.target
      const typing = target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"]')
      const hot = !typing && target instanceof Element && target.closest(HOT)
      el.classList.toggle('is-hot', Boolean(hot))
      el.classList.toggle('is-hidden', Boolean(typing))
    }

    const onLeave = () => el.classList.remove('is-on')

    const tick = () => {
      cx += (x - cx) * 0.32
      cy += (y - cy) * 0.32
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('pointerleave', onLeave)
    frame = requestAnimationFrame(tick)

    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={ring} className="cursor" aria-hidden="true" />
}
