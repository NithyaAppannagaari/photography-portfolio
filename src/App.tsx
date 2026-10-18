import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import GalleryPage from './GalleryPage'
import PricingPage from './PricingPage'
import PixelCard from './components/PixelCard'
import ArchFrame from './components/ArchFrame'
import SiteChrome, { Divider, Kicker, Sheet } from './components/SiteChrome'
import titleImg from './assets/title.jpg'
import aboutImg from './assets/about.JPG'
import clubCover from './assets/club_photoshoots/DSC08853 (1).jpg'
import eventCover from './assets/event_photography/vertical7.jpeg'

const WORK = [
  {
    num: '01',
    title: 'Club photoshoots',
    desc: 'Professional headshot and team sessions tailored to your club\'s brand and recruitment goals.',
    slug: 'club-photoshoots',
    src: clubCover,
    alt: 'Club group portrait outdoors',
  },
  {
    num: '02',
    title: 'Graduation photoshoots',
    desc: 'Capturing the emotion of your special day with a timeless approach so you can relive it for a lifetime.',
    slug: 'graduation-photoshoots',
    src: null,
    alt: '',
  },
  {
    num: '03',
    title: 'Event photography',
    desc: 'Crafting compelling visual narratives for cultural events to elevate your marketing.',
    slug: 'event-photography',
    src: eventCover,
    alt: 'Dancers at a colorful cultural celebration',
  },
]

function HomePage() {
  const club = WORK[0]
  const graduation = WORK[1]
  const event = WORK[2]

  return (
    <>
      <Sheet>
        <section className="hero" id="home">
          <div className="hero__copy">
            <Kicker>UC Berkeley · Photography</Kicker>
            <h1 className="display hero__title">
              <span>Professional</span>
              <span>Photography</span>
            </h1>
            <p className="hero__invite">for your campus story.</p>
            <p className="hero__sub">
              Event coverage, club headshots, and graduation sessions!
            </p>
            <div className="hero__actions">
              <a href="#contact" className="btn btn--solid">Book a session</a>
              <a href="#work" className="btn btn--line">View work</a>
            </div>
          </div>
          <ArchFrame className="hero__arch">
            <img
              src={titleImg}
              alt="Dancer in a red lehenga at a cultural celebration"
              className="hero__photo"
            />
          </ArchFrame>
        </section>

        <Divider />

        <section className="about" id="about">
          <div className="about__copy">
            <Kicker>About me</Kicker>
            <h2 className="display about__name">Nithya Appannagaari</h2>
            <p className="about__bio">
              Hi! I'm a photographer based at UC Berkeley specialising in event coverage,
              club &amp; recruitment headshots, and graduation sessions.
            </p>
            <ul className="specs">
              <li>Event photography</li>
              <li>Club headshots</li>
              <li>Graduation</li>
            </ul>
            <a href="#work" className="text-link">View my work →</a>
          </div>
          <ArchFrame className="about__arch">
            <img
              src={aboutImg}
              alt="Portrait of Nithya Appannagaari"
              className="about__photo"
            />
          </ArchFrame>
        </section>

        <Divider />

        <section className="work" id="work">
          <header className="section-head">
            <div>
              <Kicker>Portfolio</Kicker>
              <h2 className="display section-title">Selected work</h2>
            </div>
            <p className="count">3 categories</p>
          </header>

          <div className="work-pair">
            <PixelCard
              src={club.src!}
              alt={club.alt}
              title={club.title}
              desc={club.desc}
              to={`/gallery/${club.slug}`}
              num={club.num}
            />
            <PixelCard
              src={event.src!}
              alt={event.alt}
              title={event.title}
              desc={event.desc}
              to={`/gallery/${event.slug}`}
              num={event.num}
            />
          </div>
          <Link to={`/gallery/${graduation.slug}`} className="soon-band is-viewable">
            <svg className="soon-band__crown" viewBox="0 0 220 64" aria-hidden="true">
              <path className="soon-band__crown-fill" d="M2 64V34C24 34 44 16 74 10 94 6 104 16 110 4 116 16 126 6 146 10 176 16 196 34 218 34V64Z" />
              <path className="soon-band__crown-line" d="M2 34C24 34 44 16 74 10 94 6 104 16 110 4 116 16 126 6 146 10 176 16 196 34 218 34" fill="none" />
            </svg>
            <span className="soon-band__num">{graduation.num}</span>
            <span className="soon-band__title">{graduation.title}</span>
            <span className="soon-band__status">Coming soon</span>
          </Link>
        </section>
      </Sheet>

      <section className="invite" id="contact">
        <div className="panel">
          <svg className="panel__crown" viewBox="0 0 240 86" aria-hidden="true">
            <path
              className="panel__crown-fill"
              d="M4 86V46C28 46 52 24 86 16 104 11 116 22 120 6 124 22 136 11 154 16 188 24 212 46 236 46V86Z"
            />
            <path
              className="panel__crown-line"
              d="M4 46C28 46 52 24 86 16 104 11 116 22 120 6 124 22 136 11 154 16 188 24 212 46 236 46"
              fill="none"
            />
          </svg>
          <Kicker>Let's work together</Kicker>
          <h2 className="display invite__title">
            Ready to capture<br />your next moment?
          </h2>
          <p className="lede invite__body">
            Reach out to discuss your project — event coverage, headshots,
            or graduation sessions. Response within 24 hours.
          </p>
          <a href="mailto:nithya.app@berkeley.edu" className="btn btn--solid">Email to book</a>
          <p className="invite__mail">
            <a href="mailto:nithya.app@berkeley.edu">nithya.app@berkeley.edu</a>
          </p>
          <div className="socials">
            <a href="https://www.linkedin.com/in/nithyaappannagaari/">LinkedIn</a>
            <a href="https://www.instagram.com/nithya.app/">Instagram</a>
          </div>
        </div>
      </section>
    </>
  )
}

export default function App() {
  return (
    <SiteChrome>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery/:category" element={<GalleryPage />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Routes>
    </SiteChrome>
  )
}
