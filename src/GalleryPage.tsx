import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PhotoViewer from './components/PhotoViewer'
import SiteFooter from './components/SiteFooter'
import SiteNav from './components/SiteNav'
import './GalleryPage.css'

const clubImages = Object.entries(
  import.meta.glob('./assets/club_photoshoots/*', { eager: true, import: 'default' })
).sort(([a], [b]) => a.localeCompare(b)).map(([, src]) => src as string)

const eventImages = Object.entries(
  import.meta.glob('./assets/event_photography/*', { eager: true, import: 'default' })
).sort(([a], [b]) => a.localeCompare(b)).map(([, src]) => src as string)

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
              <a className="text-link" href="mailto:nithya.app@berkeley.edu?subject=Graduation photoshoot">
                Email me
              </a>
            </div>
          ) : (
            <div className="frames gallery-frames">
              {data.images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setOpen(index)}
                >
                  <img
                    src={src}
                    alt={`${data.title} ${index + 1}`}
                    width={index % 5 === 0 ? 1200 : 900}
                    height={index % 5 === 0 ? 800 : 1200}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </button>
              ))}
            </div>
          )}
          {open !== null ? (
            <PhotoViewer
              src={data.images[open]}
              alt={`${data.title} ${open + 1}`}
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
