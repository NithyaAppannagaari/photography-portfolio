import { useEffect, useState, type MouseEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import CategoryBar from './components/CategoryBar'
import ContactForm from './components/ContactForm'
import Intro from './components/Intro'
import Menu from './components/Menu'
import Rates from './components/Rates'
import { ABOUT, INSTAGRAM, SERVICES, WORKS, type Work } from './content'
import { reducedMotion } from './useCycle'

export default function HomePage() {
  const [introDone, setIntroDone] = useState(false)
  const [params] = useSearchParams()
  const requested = params.get('category')
  const active = WORKS.some((work) => work.slug === requested) ? requested : null
  const navigate = useNavigate()
  const shown = WORKS.filter((work) => !active || work.slug === active)
  const current = WORKS.find((work) => work.slug === active)
  const label = current?.title ?? 'All work'

  function openWork(event: MouseEvent<HTMLAnchorElement>, work: Work) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    navigate(`/gallery/${work.slug}`)
  }

  function pick(slug: string | null) {
    navigate({ pathname: '/', search: slug ? `?category=${slug}` : '', hash: 'work-grid' }, { preventScrollReset: true })
    window.setTimeout(() => {
      const node = document.getElementById('work-grid')
      node?.focus({ preventScroll: true })
      node?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })
    }, 0)
  }

  useEffect(() => {
    document.title = 'Nithya Appannagaari Photography'
  }, [])

  return (
    <div className="home">
      <Intro onDone={setIntroDone} />
      <Menu hidden={!introDone} />
      <section className="hero" id="home" data-surface="light">
        <div className="hero__wrap">
          <p className="hero__place">Berkeley</p>
          <h1>Nithya Appannagaari</h1>
          <p className="hero__tagline">Campus life, photographed in daylight.</p>
          <div className="hero__note">
            <p>I&apos;m Nithya. I&apos;m at Berkeley, and I photograph clubs, grads, and events.</p>
            <p>Editing and digital gallery are included in rates. Contact to book a shoot. Scroll to view previous work.</p>
          </div>
          <p className="hero__links">
            <a className="text-link" href="#works">See the photographs</a>
            <a className="text-link" href={INSTAGRAM} target="_blank" rel="noopener">Instagram</a>
            <a className="text-link" href="#rates">Rates</a>
          </p>
        </div>
      </section>

      <CategoryBar active={active} hidden={!introDone} onPick={pick} />

      <section className="about" id="about" data-surface="dark">
        <div className="about__wrap">
          <p className="about__kicker">About</p>
          <h2>The work</h2>
          <div className="about__text">
            {ABOUT.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <ul className="about__chips">
            {SERVICES.filter((item) => item !== '& more').map((item) => <li key={item}>{item}</li>)}
          </ul>
          <a className="btn" href="#contact">Book a shoot</a>
        </div>
      </section>

      <section className="selected" id="works" data-surface="dark">
        <p className="selected__kicker">Browse by category</p>
        <h2 className="selected__title" id="work-grid" tabIndex={-1}>Showing: {label}</h2>
        <p className="selected__hint">Pick a kind of shoot to filter the work</p>
      </section>

      <div className="works" data-surface="light">
        {shown.length === 0 || shown.every((work) => work.photos === 0) ? (
          <div className="work-empty">
            <p>No photographs in {label} yet.</p>
            <a className="u" href="#contact">Contact to book a shoot</a>
          </div>
        ) : shown.map((work) => (
          <Link
            key={work.slug}
            id={`work-${work.slug}`}
            to={`/gallery/${work.slug}`}
            className={`work${work.photos === 0 ? ' work--soon' : ''}`}
            onClick={(event) => openWork(event, work)}
          >
            {work.cover ? (
              <img
                src={work.cover.src}
                alt=""
                width={work.cover.width}
                height={work.cover.height}
                decoding="async"
                loading="lazy"
              />
            ) : <span className="work__soon">No photos yet</span>}
            <span className="work__caption">
              <strong>{work.title}</strong>
              <span>{work.photos === 0 ? 'No photos yet' : `${work.photos} photographs`}</span>
            </span>
          </Link>
        ))}
        <p className="got"><a className="u" href="#contact">Got a project?</a></p>
      </div>

      <section className="contact" id="contact" data-surface="dark">
        <div className="contact__form">
          <h2>want to book a shoot? fill out this inquiry to get started!</h2>
          <ContactForm />
        </div>
        <h2 className="contact__rates-title">Rates</h2>
        <Rates tone="dark" />
      </section>
      <footer className="colophon">
        <p>Nithya Appannagaari · Berkeley</p>
        <a href={INSTAGRAM} target="_blank" rel="noopener">Instagram</a>
        <p>© {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
