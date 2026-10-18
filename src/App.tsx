import { lazy, Suspense, useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import GalleryPage from './GalleryPage'
import PricingPage from './PricingPage'

const ShareAlbumPage = lazy(() => import('./ShareAlbumPage'))
const ShareAdminPage = lazy(() => import('./ShareAdminPage'))
import CustomCursor from './components/CustomCursor'
import Jharokha from './components/Jharokha'
import Ornament from './components/Ornament'
import PixelCard from './components/PixelCard'
import SiteFooter from './components/SiteFooter'
import titleImg from './assets/title.jpg'
import aboutImg from './assets/about.JPG'
import clubCover from './assets/club_photoshoots/DSC08853 (1).jpg'
import eventCover from './assets/event_photography/vertical7.jpeg'

const IMGS = {
  hero: titleImg,
  about: aboutImg,
  workClub: clubCover,
  workEvent: eventCover,
}

const WORK_CATEGORIES = [
  {
    num: '01',
    title: 'club photoshoots',
    desc: 'Professional headshot and team sessions tailored to your club\'s brand and recruitment goals.',
    slug: 'club-photoshoots',
    src: IMGS.workClub,
    aspect: 'portrait' as const,
  },
  {
    num: '02',
    title: 'graduation photoshoots',
    desc: 'Capturing the emotion of your special day with a timeless approach so you can relive it for a lifetime.',
    slug: 'graduation-photoshoots',
    src: null,
    aspect: 'portrait' as const,
  },
  {
    num: '03',
    title: 'event photography',
    desc: 'Crafting compelling visual narratives for cultural events to elevate your marketing.',
    slug: 'event-photography',
    src: IMGS.workEvent,
    aspect: 'portrait' as const,
  },
]

const NAV = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '/pricing', label: 'Pricing', route: true },
  { href: '#contact', label: 'Contact' },
]

function HomePage() {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    document.title = 'Nithya Appannagaari · Photography'
  }, [])

  const close = () => setOpen(false)

  return (
    <div className="home">
      <nav className={`nav${solid || open ? ' nav--solid' : ''}`} aria-label="Primary">
        <a className="nav__mark" href="#home" onClick={close}>Nithya</a>
        <ul className="nav__links">
          {NAV.map((item) => (
            <li key={item.label}>
              {item.route
                ? <Link to={item.href}>{item.label}</Link>
                : <a href={item.href}>{item.label}</a>}
            </li>
          ))}
        </ul>
        <a className="btn btn-cream nav__cta" href="mailto:nithya.app@berkeley.edu">Book a session</a>
        <button
          type="button"
          className="nav__menu"
          aria-expanded={open}
          aria-controls="nav-sheet"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>

      <div className={`nav-sheet${open ? ' nav-sheet--open' : ''}`} id="nav-sheet" hidden={!open}>
        <ul>
          {NAV.map((item) => (
            <li key={item.label}>
              {item.route
                ? <Link to={item.href} onClick={close}>{item.label}</Link>
                : <a href={item.href} onClick={close}>{item.label}</a>}
            </li>
          ))}
        </ul>
        <a className="btn btn-cream" href="mailto:nithya.app@berkeley.edu" onClick={close}>
          Book a session
        </a>
      </div>

      <header className="hero pattern" id="home">
        <div className="hero__veil" aria-hidden="true" />
        <div className="hero__inner">
          <div className="hero__copy">
            <p className="eyebrow">UC Berkeley · Photography</p>
            <h1 className="hero__title">
              <span>Professional</span>
              <span className="hero__title-em">Photography</span>
            </h1>
            <p className="hero__story">for your campus story.</p>
            <p className="hero__lede">
              Event coverage, club headshots, and graduation sessions!
            </p>
            <div className="hero__actions">
              <a href="#contact" className="btn btn-cream">Book a session</a>
              <a href="#work" className="btn btn-line">View work</a>
            </div>
          </div>
          <Jharokha
            className="hero__frame"
            src={IMGS.hero}
            alt="Photography hero"
            variant="wide"
          />
        </div>
      </header>

      <section className="about linen" id="about">
        <div className="about__inner">
          <div className="about__copy">
            <p className="eyebrow eyebrow--ink">About me</p>
            <h2>Nithya Appannagaari</h2>
            <Ornament />
            <p className="about__bio">
              Hi! I&apos;m a photographer based at UC Berkeley specialising in event coverage,
              club &amp; recruitment headshots, and graduation sessions.
            </p>
            <ul className="chips">
              <li>Event photography</li>
              <li>Club headshots</li>
              <li>Graduation</li>
            </ul>
            <a href="#work" className="text-link">View my work</a>
          </div>
          <Jharokha
            className="about__frame"
            src={IMGS.about}
            alt="Portrait of Nithya Appannagaari"
            variant="portrait"
          />
        </div>
      </section>

      <div className="textile-rule" aria-hidden="true" />

      <section className="work linen" id="work">
        <div className="work__inner">
          <div className="work__head">
            <div>
              <p className="eyebrow eyebrow--ink">Portfolio</p>
              <h2>Selected work</h2>
            </div>
            <p className="work__count">{WORK_CATEGORIES.length} categories</p>
          </div>
          <div className="work__grid">
            {WORK_CATEGORIES.map((cat) => (
              <div
                key={cat.slug}
                className={`work__cell${cat.num === '01' ? ' work__feature' : ''}`}
              >
                {cat.src ? (
                  <PixelCard
                    src={cat.src}
                    alt={cat.title}
                    title={cat.title}
                    desc={cat.desc}
                    to={`/gallery/${cat.slug}`}
                    num={cat.num}
                    aspect={cat.aspect}
                  />
                ) : (
                  <Link to={`/gallery/${cat.slug}`} className="print print--soon">
                    <div className="print__mat print__mat--soon">
                      <div className="print__soon">
                        <p>Coming soon</p>
                      </div>
                    </div>
                    <div className="print__meta">
                      <span className="print__num">{cat.num}</span>
                      <h3 className="print__title">{cat.title}</h3>
                      <p className="print__desc">{cat.desc}</p>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="invite-wrap pattern" id="contact">
        <div className="invite">
          <Ornament tone="vermilion" />
          <p className="eyebrow eyebrow--ink">Let&apos;s work together</p>
          <h2>Ready to capture your next moment?</h2>
          <p className="invite__body">
            Reach out to discuss your project — event coverage, headshots,
            or graduation sessions. Response within 24 hours.
          </p>
          <a href="mailto:nithya.app@berkeley.edu" className="btn btn-solid">
            Email to book
          </a>
          <p className="invite__email">nithya.app@berkeley.edu</p>
          <div className="invite__social">
            <a href="https://www.linkedin.com/in/nithyaappannagaari/">LinkedIn</a>
            <span aria-hidden="true">·</span>
            <a href="https://www.instagram.com/nithya.app/">Instagram</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default function App() {
  return (
    <>
      <CustomCursor />
      <Suspense fallback={<div className="route-fallback linen" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery/:category" element={<GalleryPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/share/admin" element={<ShareAdminPage />} />
          <Route path="/share/admin/:slug" element={<ShareAdminPage />} />
          <Route path="/share/:slug" element={<ShareAlbumPage />} />
        </Routes>
      </Suspense>
    </>
  )
}
