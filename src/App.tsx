import { lazy, Suspense, useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import GalleryPage from './GalleryPage'
import PricingPage from './PricingPage'
import SiteFooter from './components/SiteFooter'
import SiteNav from './components/SiteNav'
import titleImg from './assets/title.jpg'
import aboutImg from './assets/about.JPG'
import clubCover from './assets/club_photoshoots/DSC08853 (1).jpg'
import eventCover from './assets/event_photography/vertical7.jpeg'

const ShareAlbumPage = lazy(() => import('./ShareAlbumPage'))
const ShareAdminPage = lazy(() => import('./ShareAdminPage'))

const WORK = [
  {
    title: 'Club photoshoots',
    desc: 'Professional headshot and team sessions tailored to your club\'s brand and recruitment goals.',
    slug: 'club-photoshoots',
    src: clubCover,
  },
  {
    title: 'Graduation photoshoots',
    desc: 'Capturing the emotion of your special day with a timeless approach so you can relive it for a lifetime.',
    slug: 'graduation-photoshoots',
    src: null,
  },
  {
    title: 'Event photography',
    desc: 'Crafting compelling visual narratives for cultural events to elevate your marketing.',
    slug: 'event-photography',
    src: eventCover,
  },
]

function HomePage() {
  useEffect(() => {
    document.title = 'Nithya Appannagaari · Photography'
  }, [])

  return (
    <div className="home">
      <section className="statement">
        <SiteNav tone="magenta" />
        <p className="statement__text">
          Professional photography for your campus story — <em>event coverage</em>, <em>club headshots</em>, and <em>graduation</em> sessions.
        </p>
      </section>

      <figure className="hero-photo">
        <img src={titleImg} alt="Event photograph by Nithya Appannagaari" />
      </figure>

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
                <div className="work-card__soon"><span>Coming soon</span></div>
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
            Hi! I&apos;m a photographer based at UC Berkeley specialising in event coverage,
            club &amp; recruitment headshots, and graduation sessions.
          </p>
          <p className="about__tags">Event photography, club headshots, graduation.</p>
          <a href="#work" className="text-link">View my work</a>
        </div>
      </section>

      <section className="contact" id="contact">
        <p className="kicker">Contact</p>
        <h2>Ready to capture your next moment?</h2>
        <p>
          Reach out to discuss your project — event coverage, headshots,
          or graduation sessions. Response within 24 hours.
        </p>
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
