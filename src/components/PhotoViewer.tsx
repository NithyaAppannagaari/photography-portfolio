import { useEffect, useRef, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'

type PhotoViewerProps = {
  src: string
  alt: string
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
  const dragX = useRef<number | null>(null)

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
    dragX.current = event.clientX
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragX.current == null) return
    const dx = event.clientX - dragX.current
    dragX.current = null
    if (dx > 48) actions.current.onPrev()
    else if (dx < -48) actions.current.onNext()
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
          <img src={src} alt={alt} />
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
