import type { CSSProperties } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Kicker, Sheet } from './components/SiteChrome'
import ArchFrame from './components/ArchFrame'
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

function GalleryItem({ src, alt, index }: { src: string; alt: string; index: number }) {
  const delay = Math.min(index * 0.035, 0.45)

  return (
    <figure
      className="gi"
      style={{ '--delay': `${delay}s` } as CSSProperties}
    >
      <div className="gi__wrap">
        <img src={src} alt={alt} className="gi__img" loading="lazy" />
      </div>
      <figcaption className="gi__idx">{String(index + 1).padStart(2, '0')}</figcaption>
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

  if (!data) {
    return (
      <Sheet>
        <div className="gallery-empty">
          <button type="button" onClick={handleBack} className="back">← Back</button>
          <p className="display gallery-missing">Gallery not found.</p>
        </div>
      </Sheet>
    )
  }

  return (
    <Sheet>
      <header className="page-head page-head--split">
        <div>
          <button type="button" onClick={handleBack} className="back">← Back</button>
          <Kicker>Portfolio</Kicker>
          <h1 className="display">{data.title}</h1>
          <p className="lede">{data.desc}</p>
        </div>
        {!data.comingSoon && (
          <p className="count">{data.images.length} images</p>
        )}
      </header>

      {data.comingSoon ? (
        <div className="coming">
          <ArchFrame className="coming__arch">
            <div className="soon__inner">
              <p className="coming__word">Coming soon...</p>
              <p className="lede coming__desc">{data.desc}</p>
            </div>
          </ArchFrame>
        </div>
      ) : (
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
      )}
    </Sheet>
  )
}
