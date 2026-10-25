import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PhotoViewer from './components/PhotoViewer'
import SiteFooter from './components/SiteFooter'
import SiteNav from './components/SiteNav'
import './GalleryPage.css'

type Shot = { src: string; width: number; height: number }
type Size = { width: number; height: number }

function collect(urls: Record<string, string>, sizes: Record<string, Size>): Shot[] {
  return Object.keys(urls).sort((a, b) => a.localeCompare(b)).map((key) => {
    const size = sizes[key]
    if (!size) throw new Error(`Missing intrinsic size for ${key}`)
    return { src: urls[key], width: size.width, height: size.height }
  })
}

const clubImages = collect(
  import.meta.glob('./assets/club_photoshoots/*', { eager: true, import: 'default' }) as Record<string, string>,
  import.meta.glob('./assets/club_photoshoots/*', { eager: true, query: '?intrinsic', import: 'default' }) as Record<string, Size>,
)

const eventImages = collect(
  import.meta.glob('./assets/event_photography/*', { eager: true, import: 'default' }) as Record<string, string>,
  import.meta.glob('./assets/event_photography/*', { eager: true, query: '?intrinsic', import: 'default' }) as Record<string, Size>,
)

const CATEGORIES = {
  'club-photoshoots': {
    title: 'club photoshoots',
    desc: 'headshots and team photos for clubs.',
    images: clubImages,
    comingSoon: false,
  },
  'graduation-photoshoots': {
    title: 'graduation photoshoots',
    desc: 'grad photos around campus.',
    images: [],
    comingSoon: true,
  },
  'event-photography': {
    title: 'event photography',
    desc: 'photos from campus events.',
    images: eventImages,
    comingSoon: false,
  },
}

export default function GalleryPage() {
  const { category } = useParams<{ category: string }>()
  const data = CATEGORIES[category as keyof typeof CATEGORIES]
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => { setOpen(null) }, [category])

  useEffect(() => {
    document.title = data
      ? `${data.title} · Nithya Appannagaari Photography`
      : 'Nithya Appannagaari Photography'
  }, [data])

  return (
    <div className="gallery-page">
      <SiteNav active="work" />
      {!data ? (
        <div className="gallery-empty">
          <p>that gallery isn&apos;t here.</p>
          <Link to="/" className="text-link">back home</Link>
        </div>
      ) : (
        <>
          <header className="intro">
            <p className="kicker">Work</p>
            <h1>{data.title}</h1>
            <p>{data.desc}</p>
          </header>
          {data.comingSoon ? (
            <div className="gallery-soon">
              <p>coming soon</p>
              <Link className="text-link" to="/#contact">say hi</Link>
            </div>
          ) : (
            <div className="frames gallery-frames">
              {data.images.map((photo, index) => (
                <button
                  key={photo.src}
                  type="button"
                  className={index % 3 === 2 ? 'has-tape' : undefined}
                  onClick={() => setOpen(index)}
                >
                  <img
                    src={photo.src}
                    alt={`${data.title} ${index + 1}`}
                    width={photo.width}
                    height={photo.height}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </button>
              ))}
            </div>
          )}
          {open !== null ? (
            <PhotoViewer
              src={data.images[open].src}
              alt={`${data.title} ${open + 1}`}
              width={data.images[open].width}
              height={data.images[open].height}
              index={open}
              count={data.images.length}
              onPrev={() => setOpen((open - 1 + data.images.length) % data.images.length)}
              onNext={() => setOpen((open + 1) % data.images.length)}
              onClose={() => setOpen(null)}
            />
          ) : null}
        </>
      )}
      <SiteFooter />
    </div>
  )
}
