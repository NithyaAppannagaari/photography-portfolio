import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import CategoryBar from './components/CategoryBar'
import Menu from './components/Menu'
import PhotoViewer from './components/PhotoViewer'
import { SUNNY_ALT, WORKS, workBySlug, type Shot } from './content'
import { reducedMotion } from './useCycle'

type Size = { width: number; height: number }
type Flight = { src: string; top: number; left: number; width: number; height: number }

function collect(urls: Record<string, string>, sizes: Record<string, Size>, label: string): Shot[] {
  return Object.keys(urls).sort((a, b) => a.localeCompare(b)).map((key, index) => {
    const size = sizes[key]
    if (!size) throw new Error(`Missing intrinsic size for ${key}`)
    const file = key.split('/').pop() ?? ''
    const alt = SUNNY_ALT[file] || `${label} photograph ${index + 1}`
    return { src: urls[key], width: size.width, height: size.height, alt }
  })
}

const clubImages = collect(
  import.meta.glob('./assets/club_photoshoots/*', { eager: true, import: 'default' }) as Record<string, string>,
  import.meta.glob('./assets/club_photoshoots/*', { eager: true, query: '?intrinsic', import: 'default' }) as Record<string, Size>,
  'Club',
)

const eventImages = collect(
  import.meta.glob('./assets/event_photography/*', { eager: true, import: 'default' }) as Record<string, string>,
  import.meta.glob('./assets/event_photography/*', { eager: true, query: '?intrinsic', import: 'default' }) as Record<string, Size>,
  'Event',
)

const dayImages = collect(
  import.meta.glob('./assets/sunny/*.webp', { eager: true, import: 'default' }) as Record<string, string>,
  import.meta.glob('./assets/sunny/*.webp', { eager: true, query: '?intrinsic', import: 'default' }) as Record<string, Size>,
  'Daylight',
)

const SETS: Record<string, Shot[]> = {
  'club-photoshoots': clubImages,
  'event-photography': eventImages,
  daylight: dayImages,
  'graduation-photoshoots': [],
}

function lead(shots: Shot[], prefer: string): Shot[] {
  if (!prefer) return shots
  const index = shots.findIndex((shot) => shot.src.includes(prefer))
  if (index <= 0) return shots
  return [shots[index], ...shots.slice(0, index), ...shots.slice(index + 1)]
}

export default function GalleryPage() {
  const { category } = useParams<{ category: string }>()
  const work = workBySlug(category)
  const images = work ? lead(SETS[work.slug] ?? [], work.prefer) : []
  const location = useLocation()
  const navigate = useNavigate()
  const flight = (location.state as { flight?: Flight } | null)?.flight
  const heroRef = useRef<HTMLImageElement>(null)
  const [ghost, setGhost] = useState<Flight | null>(flight && work?.cover ? flight : null)
  const [target, setTarget] = useState<Flight | null>(null)
  const [open, setOpen] = useState<number | null>(null)
  const played = useRef(false)

  useEffect(() => {
    document.title = work ? `${work.title} · Nithya Appannagaari Photography` : 'Nithya Appannagaari Photography'
    setOpen(null)
  }, [work])

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    if (!flight || !work?.cover || played.current || reducedMotion()) {
      setGhost(null)
      return
    }
    played.current = true
    const hero = heroRef.current?.getBoundingClientRect()
    if (!hero) {
      setGhost(null)
      return
    }
    const next = { src: flight.src, top: hero.top, left: hero.left, width: hero.width, height: hero.height }
    const id = window.requestAnimationFrame(() => setTarget(next))
    const done = window.setTimeout(() => setGhost(null), 700)
    return () => {
      window.cancelAnimationFrame(id)
      window.clearTimeout(done)
    }
  }, [flight, work])

  const index = WORKS.findIndex((item) => item.slug === work?.slug)
  const next = index >= 0 ? WORKS[(index + 1) % WORKS.length] : null

  function back(event: MouseEvent) {
    event.preventDefault()
    navigate('/#works')
  }

  function pick(slug: string | null) {
    if (!slug) {
      navigate('/#works')
      return
    }
    if (slug === work?.slug) {
      document.getElementById('set-photos')?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })
      return
    }
    navigate(`/gallery/${slug}`)
  }

  function onward(event: MouseEvent) {
    if (!next) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(`/gallery/${next.slug}`)
  }

  return (
    <div className="case">
      <Menu />
      {!work ? (
        <div className="case-missing">
          <p>That gallery isn&apos;t here.</p>
          <Link to="/" className="u">Back home</Link>
        </div>
      ) : (
        <>
          <header className="case-head" style={{ backgroundColor: work.color }} data-surface="dark">
            <a className="back" href="/#works" aria-label="Back to previous pictures" onClick={back}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7" /></svg>
            </a>
            <nav className="crumb" aria-label="Breadcrumb">
              <a href="/#works" onClick={back}>All pictures</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{work.title}</span>
            </nav>
            <div className="case-meta">
              <div>
                <h1>{work.title}</h1>
                <ul>
                  {work.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </div>
              <p>{work.desc}</p>
            </div>
          </header>
          {work.soon || images.length === 0 ? (
            <div className="case-soon" id="set-photos" data-surface="light">
              <p>No photographs in {work.title} yet.</p>
              <Link className="u" to="/#contact">Contact to book a shoot</Link>
            </div>
          ) : (
            <div className="gallery" id="set-photos" data-surface="light">
              {images.map((photo, photoIndex) => (
                <figure key={photo.src}>
                  <button type="button" onClick={() => setOpen(photoIndex)} aria-label={`Open ${photo.alt}`}>
                    <img
                      ref={photoIndex === 0 ? heroRef : undefined}
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      style={photoIndex === 0 && ghost ? { opacity: 0 } : undefined}
                      loading={photoIndex < 4 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  </button>
                  <figcaption>{work.title} · {String(photoIndex + 1).padStart(2, '0')}</figcaption>
                </figure>
              ))}
            </div>
          )}
          {next ? (
            <Link className="next-work" to={`/gallery/${next.slug}`} onClick={onward}>
              <span>Next</span>
              <strong>{next.title}</strong>
            </Link>
          ) : null}
          {open !== null && images[open] ? (
            <PhotoViewer
              src={images[open].src}
              alt={images[open].alt}
              width={images[open].width}
              height={images[open].height}
              index={open}
              count={images.length}
              onPrev={() => setOpen((open - 1 + images.length) % images.length)}
              onNext={() => setOpen((open + 1) % images.length)}
              onClose={() => setOpen(null)}
            />
          ) : null}
        </>
      )}
      {ghost ? (
        <img
          className="ghost"
          alt=""
          src={ghost.src}
          style={{
            top: target?.top ?? ghost.top,
            left: target?.left ?? ghost.left,
            width: target?.width ?? ghost.width,
            height: target?.height ?? ghost.height,
          }}
        />
      ) : null}
      {work ? <CategoryBar active={work.slug} onPick={pick} /> : null}
    </div>
  )
}
