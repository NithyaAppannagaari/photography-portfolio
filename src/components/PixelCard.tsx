import { Link } from 'react-router-dom'
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

function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export default function PixelCard({ src, alt, title, desc, to, num, aspect = 'portrait' }: PixelCardProps) {
  const label = titleCase(title)

  return (
    <article className={`print print--${aspect}`}>
      <Link to={to} className="print__link">
        <div className="print__mat">
          <img src={src} alt={alt} className="print__img" />
        </div>
        <div className="print__meta">
          {num ? <span className="print__num">{num}</span> : null}
          <h3 className="print__title">{label}</h3>
          {desc ? <p className="print__desc">{desc}</p> : null}
          <span className="print__cta">View gallery</span>
        </div>
      </Link>
    </article>
  )
}
