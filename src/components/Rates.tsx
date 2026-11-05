import { Link } from 'react-router-dom'
import { RATES } from '../content'

export default function Rates({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <div className={`rates rates--${tone}`} id={tone === 'dark' ? 'rates' : undefined}>
      {RATES.map((tier) => (
        <article key={tier.id} className="rate">
          <p className="rate__badge">{tier.badge}</p>
          <h3>{tier.title}</h3>
          <p className="rate__price">{tier.price} <span>{tier.unit}</span></p>
          <ul>
            {tier.features.map((feature) => <li key={feature}>{feature}</li>)}
          </ul>
          <p className="rate__note">{tier.note}</p>
          <Link className="pill" to="/#contact">Inquire</Link>
        </article>
      ))}
    </div>
  )
}
