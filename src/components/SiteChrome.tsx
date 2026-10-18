import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import CustomCursor from './CustomCursor'
import './SiteChrome.css'

const LINKS = [
  { href: '/#about', label: 'About', match: 'about' },
  { href: '/#work', label: 'Work', match: 'work' },
  { href: '/pricing', label: 'Pricing', match: 'pricing' },
  { href: '/#contact', label: 'Contact', match: 'contact' },
] as const

function Corner({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 86 86" aria-hidden="true">
      <path d="M8 70C8 34 34 8 70 8" fill="none" stroke="#E8B54A" strokeWidth="1.4" />
      <path d="M16 74C16 42 42 16 74 16" fill="none" stroke="#E44512" strokeWidth="3.2" />
      <path d="M28 62c8-14 22-20 34-18" fill="none" stroke="#1F7A72" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="30" cy="30" r="4.2" fill="#E8B54A" />
      <circle cx="30" cy="30" r="1.7" fill="#541028" />
      <circle cx="62" cy="22" r="2.2" fill="#E43778" />
    </svg>
  )
}

export function Sheet({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`sheet ${className}`.trim()}>
      <Corner className="sheet__corner sheet__corner--tl" />
      <Corner className="sheet__corner sheet__corner--tr" />
      <Corner className="sheet__corner sheet__corner--bl" />
      <Corner className="sheet__corner sheet__corner--br" />
      {children}
    </div>
  )
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="kicker">
      <span className="kicker__gem" aria-hidden="true" />
      {children}
    </p>
  )
}

export function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <span />
      <svg viewBox="0 0 72 28" className="divider__mark">
        <path
          fill="#E44512"
          d="M36 2c6 4 12 10 11 18-1 6-5 8-8 7-3 0-6-2-6-5 0-2 1-3 1-5 0-3-2-4-1-7 2-3 2-5 3-8z"
        />
        <circle cx="37" cy="14" r="1.6" fill="#E8B54A" />
        <path d="M8 14h16M48 14h16" stroke="#C48A1A" strokeWidth="1" />
      </svg>
      <span />
    </div>
  )
}

function Nav() {
  const { pathname, hash } = useLocation()
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname, hash])

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    if (open) closeRef.current?.focus()
    return () => document.body.classList.remove('menu-open')
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const onHashClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('/#') || pathname !== '/') return
    event.preventDefault()
    const id = href.slice(2)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    window.history.pushState(null, '', href)
    setOpen(false)
  }

  const current = (match: (typeof LINKS)[number]['match']) => {
    if (match === 'pricing') return pathname.startsWith('/pricing')
    if (match === 'work') return pathname.startsWith('/gallery') || (pathname === '/' && hash === '#work')
    if (match === 'about') return pathname === '/' && hash === '#about'
    if (match === 'contact') return pathname === '/' && hash === '#contact'
    return false
  }

  return (
    <>
      <a className="skip" href="#content">Skip to content</a>
      <header className="nav">
        <a className="brand" href="/">
          <span className="brand__first">Nithya</span>
          <span className="brand__last">Appannagaari</span>
        </a>
        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={current(link.match) ? 'is-current' : undefined}
              onClick={(event) => onHashClick(event, link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a className="btn btn--light nav__book" href="mailto:nithya.app@berkeley.edu">
          <span className="nav__book-long">Book a session</span>
          <span className="nav__book-short">Book</span>
        </a>
        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
      </header>

      <div className={`menu${open ? ' is-open' : ''}`} id="site-menu" hidden={!open}>
        <div className="menu__bar">
          <span className="brand__first">Nithya</span>
          <button
            ref={closeRef}
            type="button"
            className="menu__close"
            onClick={() => {
              setOpen(false)
              toggleRef.current?.focus()
            }}
          >
            Close
          </button>
        </div>
        <nav className="menu__links" aria-label="Mobile">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={(event) => onHashClick(event, link.href)}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="btn btn--light menu__book" href="mailto:nithya.app@berkeley.edu">
          Book a session
        </a>
      </div>
    </>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <p>© 2026 Nithya Appannagaari Photography. All rights reserved.</p>
      <div className="footer__mark" aria-hidden="true">NA</div>
    </footer>
  )
}

export default function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="site">
      <CustomCursor />
      <div className="site-paisley" aria-hidden="true" />
      <Nav />
      <main className="site-main" id="content">
        {children}
      </main>
      <Footer />
    </div>
  )
}
