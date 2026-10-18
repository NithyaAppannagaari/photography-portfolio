import { useState } from 'react'
import { Link } from 'react-router-dom'
import ArchFrame from './ArchFrame'
import './PixelCard.css'

export interface PixelCardProps {
  src: string
  alt: string
  title: string
  desc?: string
  to: string
  num?: string
  aspect?: 'portrait' | 'landscape' | 'square'
}

export default function PixelCard({ src, alt, title, desc, to, num }: PixelCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <article
      className={`pxcard is-viewable${hovered ? ' is-on' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <Link to={to} className="pxcard__link">
        <ArchFrame className="pxcard__arch">
          <img src={src} alt={alt} className="pxcard__img" />
          <div className="pxcard__plate">
            {num && <span className="pxcard__num">{num}</span>}
            <h3 className="pxcard__title">{title}</h3>
            {desc && <p className="pxcard__desc">{desc}</p>}
            <span className="pxcard__cta">View gallery →</span>
          </div>
        </ArchFrame>
      </Link>
    </article>
  )
}
