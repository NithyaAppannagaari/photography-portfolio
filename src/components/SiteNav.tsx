import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './SiteNav.css'

const LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'pricing', label: 'Rates' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const

type Active = 'work' | 'pricing' | 'about' | 'contact' | ''

export default function SiteNav({
  tone = 'paper',
  active,
  trailing,
}: {
  tone?: 'paper' | 'magenta'
  active?: Active
  trailing?: ReactNode
}) {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [here, setHere] = useState<Active>('')
  const [stuck, setStuck] = useState(false)
  const home = location.pathname === '/'
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setOpen(false) }, [location.pathname, location.hash])

  useEffect(() => {
    const el = navRef.current
    if (!el) return
    const apply = () => {
      document.documentElement.style.setProperty('--nav-h', `${el.getBoundingClientRect().height}px`)
    }
    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(el)
    return () => observer.disconnect()
  }, [open])

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!home || active) return
    const onScroll = () => {
      let current: Active = ''
      for (const id of ['work', 'about', 'contact'] as const) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < 160) current = id
      }
      setHere(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [home, active])

  const current = active || (home ? here : '')

  const hrefFor = (id: string) => {
    if (id === 'pricing') return '/pricing'
    return home ? `#${id}` : `/#${id}`
  }

  const items = LINKS.map((item) => {
    const href = hrefFor(item.id)
    const marked = current === item.id
    if (item.id === 'pricing') {
      return (
        <Link key={item.id} to={href} aria-current={marked ? 'page' : undefined} onClick={() => setOpen(false)}>
          {item.label}
        </Link>
      )
    }
    return (
      <a key={item.id} href={href} aria-current={marked ? 'page' : undefined} onClick={() => setOpen(false)}>
        {item.label}
      </a>
    )
  })

  return (
    <div ref={navRef} className={`nav nav--${tone}${open ? ' nav--open' : ''}${stuck ? ' is-stuck' : ''}`}>
      <Link to="/" className="wordmark" onClick={() => setOpen(false)}>
        <svg className="wordmark__mark" viewBox="0 0 12 12" aria-hidden="true">
          <rect x="0.6" y="0.6" width="10.8" height="10.8" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
        <span className="wordmark__full">Nithya Appannagaari</span>
        <span className="wordmark__short">Nithya</span>
      </Link>
      <nav className="nav__links" aria-label="Primary">
        {items}
      </nav>
      <div className="nav__side">
        <div className="nav__social">
          <a href="https://www.instagram.com/nithya.app/">Instagram</a>
          <a href="https://www.linkedin.com/in/nithyaappannagaari/">LinkedIn</a>
        </div>
        {trailing}
        <button
          type="button"
          className="nav__menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      <div className="nav__sheet" hidden={!open}>
        {items}
        <a href="https://www.instagram.com/nithya.app/">Instagram</a>
        <a href="https://www.linkedin.com/in/nithyaappannagaari/">LinkedIn</a>
      </div>
    </div>
  )
}
