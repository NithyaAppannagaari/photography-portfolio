import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { INSTAGRAM } from '../content'

const LINKS = [
  { href: '/#about', label: 'About' },
  { href: '/#works', label: 'Work' },
  { href: '/#rates', label: 'Rates' },
  { href: '/#contact', label: 'Contact' },
] as const

export default function Menu({ hidden = false }: { hidden?: boolean }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { setOpen(false) }, [location.pathname, location.hash])

  useEffect(() => {
    document.body.classList.toggle('nav-open', open)
    return () => document.body.classList.remove('nav-open')
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={`topbar${hidden ? ' is-hidden' : ''}`}>
      <Link className="topbar__mark" to="/">Nithya Appannagaari</Link>
      <nav className="topbar__links" aria-label="Primary">
        {LINKS.map((link) => (
          <Link key={link.href} to={link.href}>{link.label}</Link>
        ))}
        <a href={INSTAGRAM} target="_blank" rel="noopener">Instagram</a>
      </nav>
      <button
        type="button"
        className={`topbar__toggle${open ? ' is-open' : ''}`}
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Menu'}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Close' : 'Menu'}
      </button>
      <div className={`drawer${open ? ' is-open' : ''}`} aria-hidden={!open}>
        {LINKS.map((link) => (
          <Link key={link.href} to={link.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>{link.label}</Link>
        ))}
        <a href={INSTAGRAM} target="_blank" rel="noopener" tabIndex={open ? 0 : -1}>Instagram</a>
      </div>
    </header>
  )
}
