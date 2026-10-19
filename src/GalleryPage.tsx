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

  useEffect(() => {
    if (open === null) return
    document.querySelector('.viewer')?.scrollIntoView({ block: 'start' })
  }, [open])

  useEffect(() => {
    if (open === null || !data) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null)
      if (event.key === 'ArrowRight') setOpen((index) => (index === null ? index : (index + 1) % data.images.length))
      if (event.key === 'ArrowLeft') {
        setOpen((index) => (index === null ? index : (index - 1 + data.images.length) % data.images.length))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, data])

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
                email me
              </a>
            </div>
          ) : open !== null ? (
            <PhotoViewer
              src={data.images[open]}
              alt={`${data.title} ${open + 1}`}
              index={open}
              count={data.images.length}
              onPrev={() => setOpen((open - 1 + data.images.length) % data.images.length)}
              onNext={() => setOpen((open + 1) % data.images.length)}
              onClose={() => setOpen(null)}
            />
          ) : (
            <div className="frames gallery-frames">
              {data.images.map((src, index) => (
                <button key={src} type="button" onClick={() => setOpen(index)}>
                  <img src={src} alt={`${data.title} ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </>
      )}
      <SiteFooter />
    </div>
  )
}
