import { useEffect, useRef } from 'react'

const HOT = 'a, button, .photo-frame, .highlights__item, .work-row, .frames button, .lightbox__frame'

export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ring.current
    if (!el) return
    const fine = window.matchMedia('(pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduced.matches) return

    document.documentElement.classList.add('has-cursor')

    const onMove = (event: PointerEvent) => {
      el.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      el.classList.add('is-on')
      const target = event.target
      const typing = target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"]')
      const hot = !typing && target instanceof Element && target.closest(HOT)
      el.classList.toggle('is-hot', Boolean(hot))
      el.classList.toggle('is-hidden', Boolean(typing))
    }

    const onLeave = () => el.classList.remove('is-on')

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <div ref={ring} className="cursor" aria-hidden="true" />
}
