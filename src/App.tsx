import { lazy, Suspense, useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import GalleryPage from './GalleryPage'
import PricingPage from './PricingPage'
import Cursor from './components/Cursor'
import Hero from './components/Hero'
import Highlights from './components/Highlights'
import Reveal from './components/Reveal'
import SiteFooter from './components/SiteFooter'
import SiteNav from './components/SiteNav'
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
      <SiteNav tone="magenta" />
      <Hero />

      <Reveal>
        <section className="about" id="about">
          <figure className="photo-frame">
            <img
              src={aboutImg}
              alt="Portrait of Nithya Appannagaari"
              width={3456}
              height={2304}
              decoding="async"
              loading="lazy"
            />
          </figure>
          <div>
            <p className="kicker">About</p>
            <h2>Nithya Appannagaari</h2>
            <p>
              hi, i&apos;m nithya. i&apos;m at berkeley, and i photograph clubs, grads, and events.
            </p>
            <a href="#highlights" className="text-link">see the photos</a>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <Highlights />
      </Reveal>

      <section className="work" id="work">
        <div className="section-head">
          <p className="kicker">Work</p>
        </div>
        <div className="work__list">
          {WORK.map((item, index) => (
            <Reveal key={item.slug} delay={index * 70}>
              <Link to={`/gallery/${item.slug}`} className="work-row">
                <div className="work-row__copy">
                  <h2>{item.title}</h2>
                  <p>{item.desc}</p>
                </div>
                {item.src ? (
                  <span className="photo-frame">
                    <img
                      src={item.src}
                      alt=""
                      width={1200}
                      height={800}
                      decoding="async"
                      loading="lazy"
                    />
                  </span>
                ) : (
                  <div className="work-row__soon"><span>coming soon</span></div>
                )}
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <section className="contact" id="contact">
          <p className="kicker">Contact</p>
          <h2>
            <a href="mailto:nithya.app@berkeley.edu">Email me</a>
          </h2>
          <p>for club shoots, grad photos, or events.</p>
          <a className="contact__email" href="mailto:nithya.app@berkeley.edu">nithya.app@berkeley.edu</a>
        </section>
      </Reveal>

      <SiteFooter />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<div className="route-fallback" />}>
      <Cursor />
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
