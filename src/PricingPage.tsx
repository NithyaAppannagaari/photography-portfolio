import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './components/Reveal'
import SiteFooter from './components/SiteFooter'
import SiteNav from './components/SiteNav'
import './PricingPage.css'

const TIERS = [
  {
    id: 'graduation',
    title: 'graduation photoshoots',
    price: '$70',
    unit: 'per hour',
    badge: 'grads',
    features: [
      'up to 4 locations',
      'editing included',
      'a digital gallery',
      'print-ready files',
    ],
    note: 'we can sort hours and timing when you write.',
    highlight: true,
  },
  {
    id: 'club-small',
    title: 'club photoshoots',
    price: '$65',
    unit: 'per hour',
    badge: 'under 25 people',
    features: [
      'individual and group shots',
      'editing included',
      'a digital gallery',
    ],
    note: 'headshots and team photos.',
    highlight: false,
  },
  {
    id: 'club-large',
    title: 'club photoshoots',
    price: '$70-75',
    unit: 'per hour',
    badge: '25 or more people',
    features: [
      'individual and group shots',
      'editing included',
      'a digital gallery',
    ],
    note: 'headshots and team photos.',
    highlight: false,
  },
]

export default function PricingPage() {
  useEffect(() => {
    document.title = 'Rates · Nithya Appannagaari Photography'
  }, [])

  return (
    <div className="pricing-page">
      <SiteNav active="pricing" />
      <header className="intro">
        <h1>Rates</h1>
        <p>
          editing and a gallery are included.{' '}
          <Link to="/#contact">say hi</Link>
          {' '}if you need something else.
        </p>
      </header>
      <main className="rates">
        {TIERS.map((tier, index) => (
          <Reveal key={tier.id} delay={index * 80}>
          <article className={tier.highlight ? 'rate rate--lead' : 'rate'}>
            <p className="kicker">{tier.badge}</p>
            <h2>{tier.title}</h2>
            <p className="rate__price">
              {tier.price} <span>{tier.unit}</span>
            </p>
            <ul>
              {tier.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            <p className="rate__note">{tier.note}</p>
            <Link className={tier.highlight ? 'btn btn-solid' : 'btn'} to="/#contact">say hi</Link>
          </article>
          </Reveal>
        ))}
      </main>
      <p className="rates-note">
        not sure which one?{' '}
        <Link to="/#contact">say hi</Link>
        {' '}and tell me about the club.
      </p>
      <SiteFooter />
    </div>
  )
}
