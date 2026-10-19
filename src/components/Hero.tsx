import { useEffect, useState } from 'react'
import SiteNav from './SiteNav'
import skyDancers from '../assets/sunny/sky-dancers.webp'
import jump from '../assets/sunny/jump.webp'
import garbaSun from '../assets/sunny/garba-sun.webp'
import trees from '../assets/sunny/trees.webp'
import './Hero.css'

const FRAMES = [skyDancers, jump, garbaSun, trees]
const INTERVAL = 7000

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
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % FRAMES.length)
    }, INTERVAL)
    return () => window.clearTimeout(timer)
  }, [index, reduced])

  return (
    <section className="hero">
      <div className="hero__photos" aria-hidden="true">
        {FRAMES.map((src, frame) => (
          <img
            key={src}
            src={src}
            alt=""
            className={frame === index ? 'is-active' : undefined}
            decoding="async"
          />
        ))}
      </div>
      <div className="hero__veil" aria-hidden="true" />
      <SiteNav tone="magenta" />
      <div className="hero__copy">
        <h1>Nithya <em>Appannagaari</em></h1>
        <p>Photography</p>
      </div>
      <a className="hero__scroll" href="#highlights">scroll</a>
    </section>
  )
}
