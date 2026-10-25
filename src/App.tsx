import { lazy, Suspense, useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import GalleryPage from './GalleryPage'
import PricingPage from './PricingPage'
import ContactForm from './components/ContactForm'
import Cursor from './components/Cursor'
import { Sparkle } from './components/Doodles'
import Hero from './components/Hero'
import Highlights from './components/Highlights'
import Reveal from './components/Reveal'
import SiteFooter from './components/SiteFooter'
import SiteNav from './components/SiteNav'
import { homeLayout, type HomeBlock } from './homeLayout'
import clubCover from './assets/club_photoshoots/DSC08853 (1).jpg'
import clubSize from './assets/club_photoshoots/DSC08853 (1).jpg?intrinsic'
import eventCover from './assets/event_photography/vertical7.jpeg'
import eventSize from './assets/event_photography/vertical7.jpeg?intrinsic'

const ShareAlbumPage = lazy(() => import('./ShareAlbumPage'))
const ShareAdminPage = lazy(() => import('./ShareAdminPage'))

const WORK = [
  {
    title: 'club photoshoots',
    desc: 'headshots and team photos for clubs.',
    slug: 'club-photoshoots',
    src: clubCover,
    width: clubSize.width,
    height: clubSize.height,
    tape: 'lavender',
    flip: false,
  },
  {
    title: 'graduation photoshoots',
    desc: 'grad photos around campus.',
    slug: 'graduation-photoshoots',
    src: null,
    width: 0,
    height: 0,
    tape: 'blush',
    flip: true,
  },
  {
    title: 'event photography',
    desc: 'photos from campus events.',
    slug: 'event-photography',
    src: eventCover,
    width: eventSize.width,
    height: eventSize.height,
    tape: 'pink',
    flip: false,
  },
]

function HashScroll() {
  const { hash, pathname } = useLocation()
  useEffect(() => {
    if (!hash) return
    const node = document.getElementById(hash.slice(1))
    if (!node) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    node.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }, [hash, pathname])
  return null
}

function HomePage() {
  useEffect(() => {
    document.title = 'Nithya Appannagaari Photography'
  }, [])

  return (
    <div className="home">
      <SiteNav tone="magenta" />
      {homeLayout.map((block) => (
        <HomeBlockView key={`${block.kind}-${'tone' in block ? block.tone : ''}`} block={block} />
      ))}
      <SiteFooter />
    </div>
  )
}

function HomeBlockView({ block }: { block: HomeBlock }) {
  if (block.kind === 'hero') return <Hero />
  if (block.kind === 'highlights') return <Highlights />
  if (block.kind === 'scallop') return <div className={`scallop scallop--${block.tone}`} aria-hidden="true" />
  if (block.kind === 'contact') return <ContactSection />
  return <WorkSection />
}

function WorkSection() {
  return (
    <section className="work band" id="work">
        <div className="section-head">
          <p className="kicker">Work</p>
        </div>
        <div className="work__list">
          {WORK.map((item, index) => (
            <Reveal key={item.slug} delay={index * 50}>
              <Link to={`/gallery/${item.slug}`} className={`work-card${item.flip ? ' work-card--flip' : ''}`}>
                <div className="work-card__copy">
                  <p className="kicker">{String(index + 1).padStart(2, '0')}</p>
                  <h2>{item.title}</h2>
                  <p>{item.desc}</p>
                </div>
                {item.src ? (
                  <span className="pinned">
                    <span className={`washi washi--${item.tape}`} aria-hidden="true" />
                    <span className="frame">
                      <img
                        src={item.src}
                        alt=""
                        width={item.width}
                        height={item.height}
                        decoding="async"
                        loading="lazy"
                      />
                    </span>
                  </span>
                ) : (
                  <span className="pinned">
                    <span className={`washi washi--${item.tape}`} aria-hidden="true" />
                    <span className="frame work-card__soon">coming soon</span>
                  </span>
                )}
              </Link>
            </Reveal>
          ))}
        </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section className="sayhi band" id="contact">
        <div className="sayhi__intro">
          <p className="kicker">say hi</p>
          <h2>tell me about the shoot</h2>
          <p>clubs, events, grads, whatever you need. i&apos;ll write back.</p>
          <Sparkle className="sayhi__spark" />
        </div>
        <ContactForm />
    </section>
  )
}

export default function App() {
  return (
    <Suspense fallback={<div className="route-fallback" />}>
      <HashScroll />
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
