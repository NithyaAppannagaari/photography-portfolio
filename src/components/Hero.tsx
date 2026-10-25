import aboutImg from '../assets/about.webp'
import aboutSize from '../assets/about.webp?intrinsic'
import photo from '../assets/sunny/jump.webp'
import photoSize from '../assets/sunny/jump.webp?intrinsic'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__layout">
        <figure className="hero__photo">
          <img
            src={photo}
            alt="Two dancers jumping, blue sky behind them."
            width={photoSize.width}
            height={photoSize.height}
            decoding="async"
            fetchPriority="high"
          />
          <div className="hero__nameblock">
            <p className="eyebrow">Photography</p>
            <h1 className="hero__name">
              Nithya
              <em>Appannagaari</em>
            </h1>
          </div>
        </figure>
        <div className="hero__about" id="about">
          <div className="hero__aboutcopy">
            <p className="eyebrow">About</p>
            <p className="hero__quote">hi, i&apos;m nithya. i&apos;m at berkeley, and i photograph clubs, grads, and events.</p>
            <div className="hero__actions">
              <a href="#highlights" className="text-link">see the photos</a>
              <a href="#contact" className="text-link">inquire</a>
            </div>
          </div>
          <figure className="hero__portrait">
            <img
              src={aboutImg}
              alt="Portrait of Nithya Appannagaari"
              width={aboutSize.width}
              height={aboutSize.height}
              decoding="async"
            />
          </figure>
        </div>
      </div>
    </section>
  )
}
