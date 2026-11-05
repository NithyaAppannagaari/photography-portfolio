import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ContactForm from './components/ContactForm'
import FilterIsland from './components/FilterIsland'
import Intro from './components/Intro'
import Mark from './components/Mark'
import Menu from './components/Menu'
import Rates from './components/Rates'
import { ABOUT, INSTAGRAM, KINDS, LINKEDIN, SERVICES, SHOOTS, WORKS, type Work } from './content'
import { useFlight } from './useFlight'
import { useCycle } from './useCycle'

const ROLES = [
  ['photo', 'grapher'],
  ['event', 'portraits'],
  ['campus', 'clubs'],
] as const

const NOTES = [
  "I'm Nithya. I'm at Berkeley, and I photograph clubs, grads, and events.",
  "Editing and a digital gallery are included. Tell me about the shoot and I'll write back.",
]

export default function HomePage() {
  const [introDone, setIntroDone] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [note, setNote] = useState(0)
  const [islandOn, setIslandOn] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const fly = useFlight()
  const role = useCycle(ROLES.length, 3200, !introDone)
  const shoot = useCycle(SHOOTS.length, 2200, Boolean(active))
  const kind = useCycle(KINDS.length, 2600, Boolean(active))

  useEffect(() => {
    document.title = 'Nithya Appannagaari Photography'
  }, [])

  useEffect(() => {
    const node = listRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      setIslandOn(Boolean(entry?.isIntersecting))
    }, { threshold: 0.08 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const counts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const work of WORKS) {
      for (const tag of work.tags) map[tag] = (map[tag] ?? 0) + 1
    }
    return map
  }, [])

  const shown = WORKS.filter((work) => !active || work.tags.includes(active))

  function openWork(event: MouseEvent<HTMLAnchorElement>, work: Work) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    const image = event.currentTarget.querySelector('img')
    const box = image?.getBoundingClientRect()
    const flight = box && work.cover
      ? { src: work.cover.src, top: box.top, left: box.left, width: box.width, height: box.height }
      : null
    fly(work.title, work.color, () => {
      navigate(`/gallery/${work.slug}`, { state: flight ? { flight } : null })
    })
  }

  return (
    <div className="home">
      <Intro onDone={setIntroDone} />
      <Menu hidden={!introDone} />
      <section className="hero" id="home" data-surface="light">
        <Mark className={`hero__mark${introDone ? ' is-in' : ''}`} />
        <div className="hero__wrap">
          <nav className="hero__nav" aria-label="Primary">
            <a className="u" href="#about">About</a>
            <a className="u" href="#works">Works</a>
            <a className="u" href="#contact">Contact</a>
          </nav>
          <p className="hero__hi">
            <span>Hi,</span>
            <span>I am Nithya.</span>
          </p>
          <h1 className="role" aria-label="photographer">
            {ROLES.map((lines, index) => (
              <span key={lines[0]} className={index === role ? 'is-current' : ''} aria-hidden="true">
                <span>{lines[0]}</span>
                <span>{lines[1]}</span>
              </span>
            ))}
          </h1>
          <div className="hero__foot">
            <div className="hero__note">
              <p>{NOTES[note]}</p>
              <div className="hero__arrows">
                <button type="button" aria-label="Previous" onClick={() => setNote((value) => (value + NOTES.length - 1) % NOTES.length)}>
                  <Chevron />
                </button>
                <button type="button" aria-label="Next" onClick={() => setNote((value) => (value + 1) % NOTES.length)}>
                  <Chevron />
                </button>
              </div>
            </div>
            <div className="hero__links">
              <p>Berkeley</p>
              <p><a className="u" href={INSTAGRAM}>Instagram</a></p>
              <p><a className="u" href={LINKEDIN}>LinkedIn</a></p>
              <p><a className="u" href="#rates">Rates</a></p>
            </div>
          </div>
        </div>
        <a className="hint" href="#works">
          <span>Explore my work</span>
        </a>
      </section>

      <section className="selected" id="works" data-surface="dark">
        <div className="selected__grid">
          <div>
            <p className="selected__lead">
              As a campus photographer, I shoot
              <span className="slot">{active && (SHOOTS as readonly string[]).includes(active) ? active : SHOOTS[shoot]}</span>
            </p>
            <div className="selected__pills">
              {SHOOTS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`pill-btn${active === tag ? ' is-on' : ''}`}
                  aria-pressed={active === tag}
                  onClick={() => setActive((value) => value === tag ? null : tag)}
                >
                  {tag}
                  <span className="pill-btn__count">{counts[tag] ?? 0}</span>
                </button>
              ))}
              <button type="button" className="all u" aria-pressed={active === null} onClick={() => setActive(null)}>all</button>
            </div>
          </div>
          <div>
            <p className="selected__lead">
              for
              <span className="slot">{active && (KINDS as readonly string[]).includes(active) ? active : KINDS[kind]}</span>
            </p>
            <div className="selected__pills">
              {KINDS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`pill-btn${active === tag ? ' is-on' : ''}`}
                  aria-pressed={active === tag}
                  onClick={() => setActive((value) => value === tag ? null : tag)}
                >
                  {tag}
                  <span className="pill-btn__count">{counts[tag] ?? 0}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <h2 className="selected__title">
          selected works
          <span className="selected__count">{shown.length}</span>
        </h2>
      </section>

      <div className="works" ref={listRef} data-surface="light">
        {shown.map((work) => (
          <Link
            key={work.slug}
            to={`/gallery/${work.slug}`}
            className={`work${work.soon ? ' work--soon' : ''}`}
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
            ) : <span className="work__soon">Coming soon</span>}
            <span className="work__veil" aria-hidden="true" />
            <span className="work__name">{work.title}</span>
            <span className="work__tags">
              {work.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
            </span>
          </Link>
        ))}
        <p className="got"><a className="u" href="#contact">Got a project?</a></p>
      </div>

      <FilterIsland
        counts={counts}
        active={active}
        shown={shown.length}
        visible={islandOn}
        hidden={!introDone}
        onPick={setActive}
      />

      <section className="talk" data-surface="dark" data-reveal>
        <Mark className="talk__mark" />
        <h2>let&apos;s talk</h2>
        <p>I&apos;m available for clubs, grads, and events.</p>
        <a className="pill" href="#contact">Get in touch</a>
      </section>

      <section className="about" id="about" data-surface="dark">
        <div className="about__wrap">
          <p className="about__kicker">Few words</p>
          <div className="about__grid">
            <h2>about me</h2>
            <ul className="about__list">
              {SERVICES.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <div className="about__marquee" aria-hidden="true">
              <ul>
                {[...SERVICES, ...SERVICES].map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
              </ul>
            </div>
            <div className="about__text">
              {ABOUT.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <a className="pill" href="#contact">Get in touch</a>
            </div>
          </div>
        </div>
      </section>

      <section className="contact" id="contact" data-surface="dark">
        <Mark className="talk__mark" />
        <ul className="contact__social">
          <li><a className="u" href={INSTAGRAM}>instagram.</a></li>
          <li><a className="u" href={LINKEDIN}>linkedin</a></li>
        </ul>
        <p className="contact__where">Berkeley</p>
        <Rates tone="dark" />
        <div className="contact__form">
          <h2>tell me about the shoot</h2>
          <p>Clubs, events, grads, whatever you need. I&apos;ll write back.</p>
          <ContactForm />
        </div>
        <p className="contact__copy">© {new Date().getFullYear()} Nithya Appannagaari</p>
      </section>
    </div>
  )
}

function Chevron() {
  return (
    <svg width="9" height="15" viewBox="0 0 9 15" fill="none" aria-hidden="true">
      <path d="m1 14 6.5-6.5L1 1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}
