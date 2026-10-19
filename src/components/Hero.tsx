import { useEffect, useRef, useState } from 'react'
import SiteNav from './SiteNav'
import sky from '../assets/sunny/sky-dancers.webp'
import jump from '../assets/sunny/jump.webp'
import trees from '../assets/sunny/trees.webp'
import './Hero.css'

const PRINTS = [
  { src: sky, alt: 'Three dancers outdoors, sun and blue sky behind them.', className: 'hero__frame--a' },
  { src: jump, alt: 'Two dancers jumping against a blue sky.', className: 'hero__frame--b' },
  { src: trees, alt: 'Three people smiling in bright daylight, green trees behind them.', className: 'hero__frame--c' },
]

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(media.matches)
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])
  return reduced
}

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = root.current
    if (!el || reduced) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    const onMove = (event: MouseEvent) => {
      el.style.setProperty('--mx', String(event.clientX / window.innerWidth - 0.5))
      el.style.setProperty('--my', String(event.clientY / window.innerHeight - 0.5))
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced])

  return (
    <section className="hero" ref={root}>
      <SiteNav tone="magenta" />
      <h1 className="hero__name">
        Nithya <em>Appannagaari</em>
      </h1>
      <p className="hero__role">Photography</p>
      <div className="hero__frames">
        {PRINTS.map((print) => (
          <figure key={print.src} className={`hero__frame ${print.className}`}>
            <img src={print.src} alt={print.alt} decoding="async" />
          </figure>
        ))}
      </div>
      <p className="hero__meta">Berkeley, CA · events, portraits, clubs</p>
      <a className="hero__scroll" href="#highlights">scroll</a>
    </section>
  )
}
