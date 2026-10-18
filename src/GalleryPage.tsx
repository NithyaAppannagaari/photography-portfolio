import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import PageHeader from './components/PageHeader'
import SiteFooter from './components/SiteFooter'
import './GalleryPage.css'

const clubImages = Object.values(
  import.meta.glob('./assets/club_photoshoots/*', { eager: true, import: 'default' })
) as string[]

const eventImages = Object.values(
  import.meta.glob('./assets/event_photography/*', { eager: true, import: 'default' })
) as string[]

const CATEGORIES = {
  'club-photoshoots': {
    title: 'Club photoshoots',
    desc: 'Professional headshot and team sessions tailored to your club\'s brand and recruitment goals.',
    images: clubImages,
    comingSoon: false,
  },
  'graduation-photoshoots': {
    title: 'Graduation photoshoots',
    desc: 'Capturing the emotion of your special day with a timeless approach so you can relive the experience for a lifetime.',
    images: [],
    comingSoon: true,
  },
  'event-photography': {
    title: 'Event photography',
    desc: 'Crafting compelling visual narratives for cultural events to elevate your marketing.',
    images: eventImages,
    comingSoon: false,
  },
}

interface GalleryItemProps {
  src: string
  alt: string
  index: number
}

function GalleryItem({ src, alt, index }: GalleryItemProps) {
  const delay = Math.min(index * 0.035, 0.45)
  return (
    <figure className="gi" style={{ '--delay': `${delay}s` } as React.CSSProperties}>
      <div className="gi__frame">
        <img src={src} alt={alt} className="gi__img" loading="lazy" />
        <span className="gi__idx">{String(index + 1).padStart(2, '0')}</span>
      </div>
    </figure>
  )
}

export default function GalleryPage() {
  const { category } = useParams<{ category: string }>()
  const navigate = useNavigate()
  const data = CATEGORIES[category as keyof typeof CATEGORIES]

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate('/#work')
  }

  useEffect(() => {
    document.title = data
      ? `${data.title} · Nithya Appannagaari`
      : 'Gallery · Nithya Appannagaari'
  }, [data])

  if (!data) {
    return (
      <div className="gallery-page linen">
        <div className="gallery-empty">
          <Link to="/" className="text-link">Back home</Link>
          <p>Gallery not found.</p>
        </div>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="gallery-page linen">
      <PageHeader
        kicker="Portfolio"
        title={data.title}
        lede={data.desc}
        onBack={handleBack}
        actionHref="mailto:nithya.app@berkeley.edu"
        actionLabel="Book a session"
      />

      {data.comingSoon ? (
        <div className="gallery-soon pattern">
          <div className="gallery-soon__card">
            <p className="eyebrow eyebrow--ink">Graduation</p>
            <h2>Coming soon</h2>
            <p>This gallery is on its way. Write to reserve a session in the meantime.</p>
            <a className="btn btn-solid" href="mailto:nithya.app@berkeley.edu?subject=Graduation Photoshoot Inquiry">
              Email to book
            </a>
          </div>
        </div>
      ) : (
        <>
          <div className="gallery-meta">
            <span>{data.images.length} images</span>
          </div>
          <div className="gallery-collage">
            {data.images.map((src, i) => (
              <GalleryItem
                key={src}
                src={src}
                alt={`${data.title} ${i + 1}`}
                index={i}
              />
            ))}
          </div>
        </>
      )}
      <SiteFooter />
    </div>
  )
}
