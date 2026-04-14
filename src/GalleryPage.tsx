import { useParams, Link, useNavigate } from 'react-router-dom'
import { useRef, useState, useCallback } from 'react'
import './GalleryPage.css'

const clubImages = Object.values(
  import.meta.glob('./assets/club_photoshoots/*', { eager: true, import: 'default' })
) as string[]

const eventImages = Object.values(
  import.meta.glob('./assets/event_photography/*', { eager: true, import: 'default' })
) as string[]

const CATEGORIES = {
  'club-photoshoots': {
    title:     'club photoshoots',
    desc:      'professional headshot and team sessions tailored to your club\'s brand and recruitment goals.',
    images:    clubImages,
    comingSoon: false,
  },
  'graduation-photoshoots': {
    title:     'graduation photoshoots',
    desc:      'capturing the emotion of your special day with a timeless approach so you can relive the experience for a lifetime.',
    images:    [],
    comingSoon: true,
  },
  'event-photography': {
    title:     'event photography',
    desc:      'crafting compelling visual narratives for cultural events to elevate your marketing.',
    images:    eventImages,
    comingSoon: false,
  },
}

/* ─── Single gallery item with hover overlay ─────────────────────────── */
interface GalleryItemProps {
  src: string
  alt: string
  index: number
}

function GalleryItem({ src, alt, index }: GalleryItemProps) {
  const itemRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  /* 3D tilt — same mechanic as PixelCard but lighter (no canvas) */
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = itemRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width  - 0.5
    const y = (e.clientY - r.top)  / r.height - 0.5
    el.style.transform = `perspective(700px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) scale(1.02)`
    el.style.transition = 'transform 0.07s ease-out'
  }, [])

  const onLeave = useCallback(() => {
    setHovered(false)
    const el = itemRef.current
    if (el) {
      el.style.transform = ''
      el.style.transition = 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)'
    }
  }, [])

  /* Stagger entrance — slight delay per item index */
  const delay = Math.min(index * 0.04, 0.5)

  return (
    <div
      ref={itemRef}
      className={`gi${hovered ? ' gi--hovered' : ''}`}
      style={{ '--delay': `${delay}s` } as React.CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
    >
      <div className="gi__wrap">
        <img src={src} alt={alt} className="gi__img" loading="lazy" />
        {/* Overlay revealed on hover */}
        <div className="gi__overlay">
          <span className="gi__idx">{String(index + 1).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Gallery page ───────────────────────────────────────────────────── */
export default function GalleryPage() {
  const { category } = useParams<{ category: string }>()
  const navigate     = useNavigate()
  const data = CATEGORIES[category as keyof typeof CATEGORIES]

  // Go back in browser history (preserves scroll position).
  // Falls back to /#work if the page was opened directly (no history).
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/#work')
    }
  }

  if (!data) {
    return (
      <div className="gallery-not-found">
        <Link to="/" className="gallery-back">← back</Link>
        <p>gallery not found.</p>
      </div>
    )
  }

  return (
    <div className="gallery-page">
      <header className="gallery-header">
        <button onClick={handleBack} className="gallery-back">← back</button>
        <div className="gallery-header-text">
          <h1 className="gallery-title">{data.title}</h1>
          <p className="gallery-desc">{data.desc}</p>
        </div>
        <a href="mailto:nithya.app@berkeley.edu" className="gallery-book-btn">
          book a session
        </a>
      </header>

      {data.comingSoon ? (
        <div className="gallery-coming-soon">
          <p>coming soon...</p>
        </div>
      ) : (
        <>
          {/* Count label */}
          <div className="gallery-meta">
            <span className="gallery-meta-count">{data.images.length} images</span>
          </div>

          {/* Masonry grid with individual hover effects */}
          <div className="gallery-collage">
            {data.images.map((src, i) => (
              <GalleryItem
                key={i}
                src={src}
                alt={`${data.title} ${i + 1}`}
                index={i}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
