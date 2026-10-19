import SiteNav from './SiteNav'
import photo from '../assets/hero-low.webp'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <SiteNav tone="magenta" />
      <div className="hero__body">
        <h1 className="hero__name">
          Nithya <em>Appannagaari</em>
        </h1>
        <p className="hero__role">Photography</p>
        <figure className="hero__photo">
          <img
            src={photo}
            alt="A circle of dancers at dusk, arms raised, deep shadow around them."
            width={2000}
            height={1225}
            decoding="async"
          />
        </figure>
        <p className="hero__meta">Berkeley, CA · events, portraits, clubs</p>
        <a className="hero__scroll" href="#highlights">scroll</a>
      </div>
    </section>
  )
}
