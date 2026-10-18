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
  return (
    <figure className="viewer">
      <div className="viewer__stage">
        <img src={src} alt={alt} />
      </div>
      <figcaption className="viewer__controls">
        {count > 1 ? (
          <>
            <button type="button" className="text-btn" onClick={onPrev}>Prev</button>
            <button type="button" className="text-btn" onClick={onNext}>Next</button>
          </>
        ) : null}
        <button type="button" className="text-btn" onClick={onClose}>Show thumbnails</button>
        {downloadHref ? <a className="text-btn" href={downloadHref}>Download</a> : null}
        <span className="kicker">{String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
      </figcaption>
    </figure>
  )
}
