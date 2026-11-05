import { useEffect, useState, type CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'

const LINKS = [
  { href: '/#about', label: 'About' },
  { href: '/#works', label: 'Works' },
  { href: '/#contact', label: 'Contact' },
  { href: '/#rates', label: 'Rates' },
] as const

export default function Menu({ hidden = false }: { hidden?: boolean }) {
  const [open, setOpen] = useState(false)
  const [light, setLight] = useState(true)
  const location = useLocation()

  useEffect(() => { setOpen(false) }, [location.pathname, location.hash])

  useEffect(() => {
    document.body.classList.toggle('nav-open', open)
    return () => document.body.classList.remove('nav-open')
  }, [open])

  useEffect(() => {
    let frame = 0
    const pick = () => {
      frame = 0
      const nodes = document.querySelectorAll<HTMLElement>('[data-surface]')
      let surface = 'light'
      nodes.forEach((node) => {
        const box = node.getBoundingClientRect()
        if (box.top <= 88 && box.bottom > 88) surface = node.dataset.surface || 'light'
      })
      setLight(surface !== 'dark')
    }
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(pick)
    }
    pick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [location.pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        className={`burger${open ? ' is-open' : ''}${light && !open ? ' is-light' : ''}${hidden ? ' is-hidden' : ''}`}
        aria-label={open ? 'Close menu' : 'Menu'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
      </button>
      <nav className={`menu${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <ul>
          {LINKS.map((link, index) => (
            <li key={link.href} style={{ '--i': index } as CSSProperties}>
              <Link to={link.href} className="u" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>{link.label}.</Link>
            </li>
          ))}
        </ul>
        <p className="menu__social">
          <a className="u" href="https://www.instagram.com/nithya.app/" tabIndex={open ? 0 : -1}>Instagram</a>
          <a className="u" href="https://www.linkedin.com/in/nithyaappannagaari/" tabIndex={open ? 0 : -1}>LinkedIn</a>
        </p>
      </nav>
    </>
  )
}
