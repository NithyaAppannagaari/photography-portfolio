import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './SiteNav.css'

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'work', label: 'Portfolio' },
  { id: 'pricing', label: 'Rates' },
  { id: 'contact', label: 'Inquire' },
] as const

type Active = 'home' | 'about' | 'highlights' | 'work' | 'pricing' | 'contact' | ''

export default function SiteNav({
  active,
  trailing,
  flow = false,
}: {
  tone?: 'paper' | 'magenta'
  active?: Active
  trailing?: ReactNode
  flow?: boolean
}) {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [here, setHere] = useState<Active>('')
  const [stuck, setStuck] = useState(false)
  const home = location.pathname === '/'
  const navRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

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
    const sentinel = sentinelRef.current
    if (!sentinel || flow) return
    const observer = new IntersectionObserver(([entry]) => {
      setStuck(entry ? !entry.isIntersecting : false)
    })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [flow])

  useEffect(() => {
    if (!home || active) return
    const ids = ['about', 'highlights', 'work', 'contact'] as const
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node))
    const seen = new Set<string>()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) seen.add(entry.target.id)
        else seen.delete(entry.target.id)
      }
      const current = [...ids].reverse().find((id) => seen.has(id)) ?? ''
      setHere(current)
    }, { rootMargin: '-12% 0px -55% 0px', threshold: 0 })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [home, active])

  const current = active || (home ? here : '')

  const hrefFor = (id: string) => {
    if (id === 'home') return '/'
    if (id === 'pricing') return '/pricing'
    return home ? `#${id}` : `/#${id}`
  }

  const items = LINKS.map((item) => {
    const href = hrefFor(item.id)
    const marked = current === item.id || (home && !current && item.id === 'home')
    if (item.id === 'pricing' || item.id === 'home') {
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
    <>
    <div ref={sentinelRef} className="nav-sentinel" aria-hidden="true" />
    <div ref={navRef} className={`nav${flow ? ' nav--flow' : ''}${open ? ' nav--open' : ''}${stuck ? ' is-stuck' : ''}`}>
      <nav className="nav__links" aria-label="Primary">
        {items.slice(0, 3)}
        <span className="nav__ornament" aria-hidden="true">
          <svg viewBox="0 0 96 24" width="78" height="20">
            <path d="M8 12c7-6 14-6 18-1 3 4 6 5 10 2 4-3 8-6 12-6s8 3 12 6c4 3 7 2 10-2 4-5 11-5 18 1" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
            <path d="M8 12c7 6 14 6 18 1 3-4 6-5 10-2 4 3 8 6 12 6s8-3 12-6c4-3 7-2 10 2 4 5 11 5 18-1" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
          </svg>
        </span>
        {items.slice(3)}
      </nav>
      <div className="nav__side">
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
    </>
  )
}
