import photo from '../assets/sunny/jump.webp'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__body">
        <div className="hero__intro">
          <h1 className="hero__name">
            Nithya <em>Appannagaari</em>
          </h1>
          <p className="hero__role">Photography</p>
        </div>
        <figure className="hero__photo photo-frame">
          <img
            src={photo}
            alt="Two dancers jumping, blue sky behind them."
            width={2000}
            height={1425}
            decoding="async"
          />
        </figure>
        <div className="hero__foot">
          <p className="hero__meta">Berkeley, CA · events, portraits, clubs</p>
          <a className="hero__scroll" href="#highlights">scroll</a>
        </div>
      </div>
    </section>
  )
}
