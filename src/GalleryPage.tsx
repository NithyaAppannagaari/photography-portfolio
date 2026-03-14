import { useParams, Link } from 'react-router-dom'
import './GalleryPage.css'

const clubImages = Object.values(
  import.meta.glob('./assets/club_photoshoots/*', { eager: true, import: 'default' })
) as string[]

const eventImages = Object.values(
  import.meta.glob('./assets/event_photography/*', { eager: true, import: 'default' })
) as string[]

const CATEGORIES = {
  'club-photoshoots': {
    title: 'club photoshoots',
    desc:  'professional headshot and team sessions tailored to your club\'s brand and recruitment goals.',
    images: clubImages,
    comingSoon: false,
  },
  'graduation-photoshoots': {
    title: 'graduation photoshoots',
    desc:  'capturing the emotion of your special day with a timeless approach so you can relive the experience for a lifetime.',
    images: [],
    comingSoon: true,
  },
  'event-photography': {
    title: 'event photography',
    desc:  'crafting compelling visual narratives for cultural events to elevate your marketing.',
    images: eventImages,
    comingSoon: false,
  },
}

export default function GalleryPage() {
  const { category } = useParams<{ category: string }>()
  const data = CATEGORIES[category as keyof typeof CATEGORIES]

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
        <Link to="/#work" className="gallery-back">← back</Link>
        <div className="gallery-header-text">
          <h1 className="gallery-title">{data.title}</h1>
          <p className="gallery-desc">{data.desc}</p>
        </div>
        <a href="mailto:nithya.app@berkeley.edu" className="gallery-book-btn">book a session</a>
      </header>

      {data.comingSoon ? (
        <div className="gallery-coming-soon">
          <p>coming soon...</p>
        </div>
      ) : (
        <div className="gallery-collage">
          {data.images.map((src, i) => (
            <div className="gallery-item" key={i}>
              <img src={src} alt={`${data.title} ${i + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
