import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import GalleryPage from './GalleryPage'
import titleImg from './assets/title.jpg'
import aboutImg from './assets/about.JPG'
import clubCover from './assets/club_photoshoots/DSC08853 (1).jpg'
import eventCover from './assets/event_photography/vertical7.jpeg'

const IMGS = {
  hero:         titleImg,
  about:        aboutImg,
  client1:      'https://picsum.photos/seed/client1/500/700',
  client2:      'https://picsum.photos/seed/client2/500/700',
  client3:      'https://picsum.photos/seed/client3/500/700',
  cta:          'https://picsum.photos/seed/ctabg/1600/900?grayscale',
  testimonial1: 'https://picsum.photos/seed/test1/300/300',
  testimonial2: 'https://picsum.photos/seed/test2/300/300',
  workClub:     clubCover,
  workGrad:     'https://picsum.photos/seed/grad1/800/1000',
  workEvent:    eventCover,
}

const WORK_CATEGORIES = [
  {
    num:      '01',
    title:    'club photoshoots',
    desc:     'professional headshot and team sessions tailored to your club\'s brand and recruitment goals.',
    slug:     'club-photoshoots',
    preview:  IMGS.workClub,
    reversed: true,
  },
  {
    num:      '02',
    title:    'graduation photoshoots',
    desc:     'capturing the emotion of your special day with a timeless approach so you can relive the experience for a lifetime.',
    slug:     'graduation-photoshoots',
    preview:  null,
    reversed: true,
  },
  {
    num:      '03',
    title:    'event photography',
    desc:     'crafting compelling visual narratives for cultural events to elevate your marketing.',
    slug:     'event-photography',
    preview:  IMGS.workEvent,
    reversed: true,
  },
]

function HomePage() {
  return (
    <div className="portfolio">

      {/* ── NAV ── */}
      <nav className="nav">
        <div className="nav-logo">Nithya Appannagaari</div>
        <ul className="nav-links">
          <li><a href="#about">about</a></li>
          <li><a href="#work">work</a></li>
          <li><a href="#contact">contact</a></li>
        </ul>
      </nav>

      {/* ── HERO ── */}
      <section className="hero" id="home">
        <div className="hero-image">
          <img src={IMGS.hero} alt="Photography hero" />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content">
          <p className="hero-eyebrow">U.C. Berkeley Photography</p>
          <div className="hero-title-wrap">
            <h1 className="hero-title">photography</h1>
            <span className="hero-title-italic">portfolio</span>
          </div>
          <div className="hero-footer">
            <p className="hero-tagline">Capturing moments that last a lifetime</p>
            <a href="#contact" className="btn btn-brown">book a session</a>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="about" id="about">
        <div className="about-left">
          <h2 className="section-label-caps">about me</h2>
          <p className="about-name">Nithya Appannagaari</p>
          <div className="about-rule" />
          <p className="about-bio">
            hi 👋 my name is nithya! i'm a photographer based in uc berkeley. i specialize in event photography, club / recruitment photoshoots, and graduation photoshoots. check out my past work and reach out if you're interested in booking a session with me!
          </p>
          <a href="#work" className="btn-link">view my work →</a>
        </div>
        <div className="about-right">
          <img src={IMGS.about} alt="Portrait of photographer" />
        </div>
      </section>

      {/* ── WORK (services + previous work merged) ── */}
      <section className="work" id="work">
        <div className="work-section-header">
          <h2 className="script-heading dark">work</h2>
        </div>
        <div className="work-categories">
          {WORK_CATEGORIES.map((cat) => (
            <div className={`work-category${cat.reversed ? ' work-category--reversed' : ''}`} key={cat.slug}>
              {cat.preview && (
                <Link to={`/gallery/${cat.slug}`} className="work-preview-link">
                  <div className="work-preview-img-wrap">
                    <img src={cat.preview} alt={cat.title} />
                    <div className="work-preview-overlay">
                      <span>view gallery →</span>
                    </div>
                  </div>
                </Link>
              )}
              <div className="work-category-info">
                <span className="service-num">{cat.num}</span>
                <h3 className="work-category-title">{cat.title}</h3>
                <div className="service-rule" />
                <p className="work-category-desc">{cat.desc}</p>
                <Link to={`/gallery/${cat.slug}`} className="btn-link">view all →</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LET'S WORK TOGETHER ── */}
      <section className="cta" id="contact">
        <div className="cta-bg-img">
          <img src={IMGS.cta} alt="" />
        </div>
        <div className="cta-blob" />
        <div className="cta-blob-right" />
        <div className="cta-content">
          <h2 className="cta-title">
            <span>let's work</span>
            <em>together</em>
          </h2>
          <p className="cta-subtitle">photography · editing · creative direction</p>
          <a href="mailto:nithya.app@berkeley.edu" className="btn btn-dark">email to book a session</a>
          <div className="social-icons">
            <a href="https://www.linkedin.com/in/nithyaappannagaari/"><span className="social-icon">in</span></a>
            <a href="https://www.instagram.com/nithya.app/"><span className="social-icon">ig</span></a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <p>© 2026 Nithya Appannagaari Photography. All rights reserved.</p>
        <div className="footer-logo">NA</div>
      </footer>

    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/gallery/:category" element={<GalleryPage />} />
    </Routes>
  )
}
