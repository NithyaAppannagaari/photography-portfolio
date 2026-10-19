import { lazy, Suspense, useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import GalleryPage from './GalleryPage'
import PricingPage from './PricingPage'
import Hero from './components/Hero'
import Highlights from './components/Highlights'
import SiteFooter from './components/SiteFooter'
import aboutImg from './assets/about.JPG'
import clubCover from './assets/club_photoshoots/DSC08853 (1).jpg'
import eventCover from './assets/event_photography/vertical7.jpeg'

const ShareAlbumPage = lazy(() => import('./ShareAlbumPage'))
const ShareAdminPage = lazy(() => import('./ShareAdminPage'))

const WORK = [
  {
    title: 'club photoshoots',
    desc: 'headshots and team photos for clubs.',
    slug: 'club-photoshoots',
    src: clubCover,
  },
  {
    title: 'graduation photoshoots',
    desc: 'grad photos around campus.',
    slug: 'graduation-photoshoots',
    src: null,
  },
  {
    title: 'event photography',
    desc: 'photos from campus events.',
    slug: 'event-photography',
    src: eventCover,
  },
]

function HomePage() {
  useEffect(() => {
    document.title = 'Nithya Appannagaari Photography'
  }, [])

  return (
    <div className="home">
      <Hero />

      <Highlights />

      <section className="work" id="work">
        <div className="section-head">
          <p className="kicker">Work</p>
        </div>
        <div className="work__grid">
          {WORK.map((item) => (
            <Link key={item.slug} to={`/gallery/${item.slug}`} className="work-card">
              {item.src ? (
                <img src={item.src} alt="" />
              ) : (
                <div className="work-card__soon"><span>coming soon</span></div>
              )}
              <h2>{item.title}</h2>
              <p>{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="about" id="about">
        <figure>
          <img src={aboutImg} alt="Portrait of Nithya Appannagaari" />
        </figure>
        <div>
          <p className="kicker">About</p>
          <h2>Nithya Appannagaari</h2>
          <p>
            hi, i&apos;m nithya. i&apos;m at berkeley, and i photograph clubs, grads, and events.
          </p>
          <a href="#work" className="text-link">see the photos</a>
        </div>
      </section>

      <section className="contact" id="contact">
        <h2>Contact</h2>
        <p>for club shoots, grad photos, or events, email me.</p>
        <a className="contact__email" href="mailto:nithya.app@berkeley.edu">nithya.app@berkeley.edu</a>
      </section>

      <SiteFooter />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<div className="route-fallback" />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery/:category" element={<GalleryPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/share/admin" element={<ShareAdminPage />} />
        <Route path="/share/admin/:slug" element={<ShareAdminPage />} />
        <Route path="/share/:slug" element={<ShareAlbumPage />} />
      </Routes>
    </Suspense>
  )
}
