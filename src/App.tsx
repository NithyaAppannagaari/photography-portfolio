import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import GalleryPage  from './GalleryPage'
import PricingPage  from './PricingPage'
import PixelCard    from './components/PixelCard'
import CustomCursor from './components/CustomCursor'
import { usePixelCanvas } from './hooks/usePixelCanvas'
import titleImg   from './assets/title.jpg'
import aboutImg   from './assets/about.JPG'
import clubCover  from './assets/club_photoshoots/DSC08853 (1).jpg'
import eventCover from './assets/event_photography/vertical7.jpeg'

const IMGS = {
  hero:       titleImg,
  about:      aboutImg,
  workClub:   clubCover,
  workEvent:  eventCover,
}

const WORK_CATEGORIES = [
  {
    num:    '01',
    title:  'club photoshoots',
    desc:   'Professional headshot and team sessions tailored to your club\'s brand and recruitment goals.',
    slug:   'club-photoshoots',
    src:    IMGS.workClub,
    aspect: 'portrait' as const,
  },
  {
    num:    '02',
    title:  'graduation photoshoots',
    desc:   'Capturing the emotion of your special day with a timeless approach so you can relive it for a lifetime.',
    slug:   'graduation-photoshoots',
    src:    null,
    aspect: 'portrait' as const,
  },
  {
    num:    '03',
    title:  'event photography',
    desc:   'Crafting compelling visual narratives for cultural events to elevate your marketing.',
    slug:   'event-photography',
    src:    IMGS.workEvent,
    aspect: 'portrait' as const,
  },
]

function HomePage() {
  // Pixel spotlight effect for hero — smaller maxPx + larger radius than PixelCard
  const hero = usePixelCanvas(IMGS.hero,  { maxPx: 10, radius: 230, ease: 0.10 })
  // Pixel spotlight effect for about portrait — even subtler
  const about = usePixelCanvas(IMGS.about, {
    maxPx: 8,
    radius: 170,
    ease: 0.09,
    objectFit: 'contain',
    objectPosition: 'right center',
  })

  return (
    <div className="portfolio">
      <CustomCursor />

      {/* ── NAV ── */}
      <nav className="nav">
        <div className="nav-logo">Nithya Appannagaari</div>
        <ul className="nav-links">
          <li><a href="#about">about</a></li>
          <li><a href="#work">work</a></li>
          <li><Link to="/pricing">pricing</Link></li>
          <li><a href="#contact">contact</a></li>
        </ul>
        <a href="mailto:nithya.app@berkeley.edu" className="nav-cta">book a session</a>
      </nav>

      {/* ── HERO ──
          Mouse events on <section> → spotlight tracks cursor over the full hero.
          Canvas is positioned absolute inside .hero-bg, matching hero dimensions.
      ── */}
      <section className="hero" id="home" {...hero.handlers}>
        <div className="hero-bg">
          <img src={IMGS.hero} alt="Photography hero" className="hero-bg-img" />
          {/* Canvas overlay — renders full quality normally, pixelated spotlight on hover */}
          <canvas ref={hero.canvasRef} className="hero-bg-canvas" />
          <div className="hero-overlay" />
        </div>

        <div className="hero-content">
          {/* Pill badge — B2B SaaS style section marker */}
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span>UC Berkeley · Photography</span>
          </div>

          <h1 className="hero-title">
            <span className="hero-title-line">Professional Photography</span>
            <span className="hero-title-line hero-title-line--accent">for your campus story.</span>
          </h1>

          <p className="hero-sub">
            Event coverage, club headshots, and graduation sessions!
          </p>

          <div className="hero-ctas">
            <a href="#contact" className="btn btn-cream">book a session →</a>
            <a href="#work"    className="btn btn-ghost-outline">view work ↓</a>
          </div>
        </div>
      </section>

      {/* ── ABOUT ──
          Pixel effect tracks mouse over the portrait image only (.about-right).
      ── */}
      <section className="about" id="about">
        <div className="about-left">
          <span className="section-tag">about me</span>
          <h2 className="about-name">Nithya Appannagaari</h2>
          <div className="about-rule" />
          <p className="about-bio">
            Hi! I'm a photographer based at UC Berkeley specialising in event coverage,
            club &amp; recruitment headshots, and graduation sessions. 
          </p>

          {/* Specialty chips */}
          <div className="about-specs">
            <span className="spec-chip">event photography</span>
            <span className="spec-chip">club headshots</span>
            <span className="spec-chip">graduation</span>
          </div>

          <a href="#work" className="btn-link">view my work →</a>
        </div>

        {/* Image column — pixel effect activates when cursor is over the portrait */}
        <div className="about-right" {...about.handlers}>
          <img src={IMGS.about} alt="Portrait of Nithya Appannagaari" className="about-img" />
          <canvas ref={about.canvasRef} className="about-canvas" />
          {/* Fade gradient (replaces the old ::after pseudo-element so canvas stays on top) */}
          <div className="about-right-fade" />
        </div>
      </section>

      {/* ── WORK ── */}
      <section className="work" id="work">
        <div className="work-section-header">
          <div className="work-label-row">
            <div className="work-label-left">
              <span className="section-tag">portfolio</span>
              <h2 className="work-heading">Selected work</h2>
            </div>
            <span className="work-count">{WORK_CATEGORIES.length} categories</span>
          </div>
        </div>

        <div className="work-pixel-grid">
          {WORK_CATEGORIES.map((cat, i) => (
            <div key={cat.slug} className={`work-pixel-cell work-pixel-cell--${i}`}>
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
                <Link to={`/gallery/${cat.slug}`} className="work-placeholder">
                  <div className="work-placeholder-inner">
                    <span className="work-placeholder-num">{cat.num}</span>
                    <h3 className="work-placeholder-title">{cat.title}</h3>
                    <p className="work-placeholder-status">coming soon</p>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT / CTA ── */}
      <section className="cta" id="contact">
        <div className="cta-inner">
          <div className="cta-left">
            <span className="section-tag section-tag--light">let's work together</span>
            <h2 className="cta-heading">
              Ready to capture<br />your next moment?
            </h2>
            <p className="cta-body">
              Reach out to discuss your project — event coverage, headshots,
              or graduation sessions. Response within 24 hours.
            </p>
          </div>
          <div className="cta-right">
            <a href="mailto:nithya.app@berkeley.edu" className="btn btn-cta-primary">
              email to book →
            </a>
            <p className="cta-email-label">nithya.app@berkeley.edu</p>
            <div className="social-row">
              <a href="https://www.linkedin.com/in/nithyaappannagaari/" className="social-link">
                linkedin
              </a>
              <span className="social-sep">·</span>
              <a href="https://www.instagram.com/nithya.app/" className="social-link">
                instagram
              </a>
            </div>
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
      <Route path="/"                  element={<HomePage />} />
      <Route path="/gallery/:category" element={<GalleryPage />} />
      <Route path="/pricing"           element={<PricingPage />} />
    </Routes>
  )
}
