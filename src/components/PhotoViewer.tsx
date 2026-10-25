import { useEffect, useRef, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'

type PhotoViewerProps = {
  src: string
  alt: string
  width?: number
  height?: number
  index: number
  count: number
  onPrev: () => void
  onNext: () => void
  onClose: () => void
  downloadHref?: string
}

export default function PhotoViewer({
  src,
  alt,
  width,
  height,
  index,
  count,
  onPrev,
  onNext,
  onClose,
  downloadHref,
}: PhotoViewerProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const actions = useRef({ onPrev, onNext, onClose })
  actions.current = { onPrev, onNext, onClose }
  const origin = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') actions.current.onClose()
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        actions.current.onNext()
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        actions.current.onPrev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    origin.current = { x: event.clientX, y: event.clientY }
    try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* pointer already gone */ }
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!origin.current) return
    const dx = event.clientX - origin.current.x
    const dy = event.clientY - origin.current.y
    origin.current = null
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy)) return
    if (dx > 0) actions.current.onPrev()
    else actions.current.onNext()
  }

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt}>
      <button type="button" className="lightbox__backdrop" aria-label="Close" onClick={onClose} />
      {count > 1 ? (
        <button type="button" className="lightbox__arrow lightbox__arrow--side" onClick={onPrev}>
          Prev
        </button>
      ) : <span className="lightbox__arrow lightbox__arrow--side" aria-hidden="true" />}
      <figure className="lightbox__figure">
        <div
          className="lightbox__frame photo-frame"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <img src={src} alt={alt} width={width} height={height} />
        </div>
        <figcaption className="lightbox__bar">
          {count > 1 ? (
            <>
              <button type="button" className="text-btn lightbox__inline" onClick={onPrev}>Prev</button>
              <button type="button" className="text-btn lightbox__inline" onClick={onNext}>Next</button>
            </>
          ) : null}
          <button ref={closeRef} type="button" className="text-btn" onClick={onClose}>Close</button>
          {downloadHref ? <a className="text-btn" href={downloadHref}>Download</a> : null}
          <span className="kicker">{String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
        </figcaption>
      </figure>
      {count > 1 ? (
        <button type="button" className="lightbox__arrow lightbox__arrow--side" onClick={onNext}>
          Next
        </button>
      ) : <span className="lightbox__arrow lightbox__arrow--side" aria-hidden="true" />}
    </div>,
    document.body,
  )
}
