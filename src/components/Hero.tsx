import aboutImg from '../assets/about.webp'
import aboutSize from '../assets/about.webp?intrinsic'
import photo from '../assets/sunny/jump.webp'
import photoSize from '../assets/sunny/jump.webp?intrinsic'
import { FlowerDoodle, HeartDoodle, Sparkle, Squiggle, StarDoodle } from './Doodles'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__top">
        <div className="hero__namecol">
          <h1 className="hero__name">
            Nithya
            <em>Appannagaari</em>
          </h1>
          <div className="hero__doodles" aria-hidden="true">
            <Sparkle className="doodle doodle--pink" />
            <FlowerDoodle className="doodle doodle--blush" />
            <StarDoodle className="doodle doodle--lavender" />
            <HeartDoodle className="doodle doodle--heart" />
            <Squiggle className="doodle doodle--squiggle" />
          </div>
        </div>
        <div className="hero__about" id="about">
          <p className="kicker">About</p>
          <p>hi, i&apos;m nithya. i&apos;m at berkeley, and i photograph clubs, grads, and events.</p>
          <div className="hero__actions">
            <a href="#highlights" className="text-link">see the photos</a>
            <a href="#contact" className="sticker sticker--pink">say hi</a>
          </div>
          <figure className="pinned">
            <span className="washi washi--lavender" aria-hidden="true" />
            <span className="frame">
              <img
                src={aboutImg}
                alt="Portrait of Nithya Appannagaari"
                width={aboutSize.width}
                height={aboutSize.height}
                decoding="async"
                fetchPriority="high"
              />
            </span>
          </figure>
        </div>
      </div>
      <figure className="hero__photo pinned">
        <span className="confetti" aria-hidden="true">
          <span /><span /><span /><span /><span /><span />
        </span>
        <span className="washi washi--pink" aria-hidden="true" />
        <span className="frame">
          <img
            src={photo}
            alt="Two dancers jumping, blue sky behind them."
            width={photoSize.width}
            height={photoSize.height}
            decoding="async"
            loading="lazy"
          />
        </span>
        <span className="sticker sticker--lavender sticker--pin">daylight</span>
      </figure>
    </section>
  )
}
