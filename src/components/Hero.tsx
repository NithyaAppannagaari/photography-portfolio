import hero from '../assets/title.jpg'
import heroSize from '../assets/title.jpg?intrinsic'
import quote from '../assets/sunny/lawn.webp'
import quoteSize from '../assets/sunny/lawn.webp?intrinsic'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero" id="home">
      <figure className="hero__figure" style={{ aspectRatio: `${heroSize.width} / ${heroSize.height}` }}>
        <img
          src={hero}
          alt="A couple walking away through a garden, photographed from behind."
          width={heroSize.width}
          height={heroSize.height}
          decoding="async"
          fetchPriority="high"
        />
        <p className="hero__edge hero__edge--left">Berkeley</p>
        <p className="hero__edge hero__edge--right">&amp; Beyond</p>
        <div className="hero__overlay">
          <div className="hero__lockup">
            <h1 className="hero__name">
              <span>Nithya Appannagaari</span>
              <span className="hero__name-line">Photography</span>
            </h1>
          </div>
          <div className="hero__about" id="about">
            <p>I&apos;m Nithya. I&apos;m at Berkeley, and I photograph clubs, grads, and events.</p>
            <p className="hero__about-links">
              <a href="#highlights">See the photos</a>
              <a href="#contact">Inquire</a>
            </p>
          </div>
          <div className="hero__tagblock">
            <p className="hero__tag">Clubs · Grads · Events</p>
            <a className="hero__sub" href="#contact">Inquire</a>
          </div>
        </div>
      </figure>
    </section>
  )
}

export function Quote() {
  return (
    <section className="epigraph" aria-label="Note" style={{ aspectRatio: `${quoteSize.width} / ${quoteSize.height}` }}>
      <img
        src={quote}
        alt="A group seated on the grass in the sun."
        width={quoteSize.width}
        height={quoteSize.height}
        decoding="async"
      />
      <div className="epigraph__copy">
        <p>I&apos;m at Berkeley, and I photograph clubs, grads, and events.</p>
        <p className="epigraph__by">Nithya Appannagaari</p>
      </div>
    </section>
  )
}
