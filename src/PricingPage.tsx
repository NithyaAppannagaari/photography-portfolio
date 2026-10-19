import { useEffect } from 'react'
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
    note: 'we can sort hours and timing over email.',
    href: 'mailto:nithya.app@berkeley.edu?subject=Graduation photoshoot',
    highlight: true,
  },
  {
    id: 'club-small',
    title: 'club photoshoots',
    price: '$65',
    unit: 'per hour',
    badge: 'smaller clubs',
    sublabel: 'under 25 people',
    features: [
      'individual and group shots',
      'editing included',
      'a digital gallery',
    ],
    note: 'headshots and team photos.',
    href: 'mailto:nithya.app@berkeley.edu?subject=Club photoshoot',
    highlight: false,
  },
  {
    id: 'club-large',
    title: 'club photoshoots',
    price: '$70-75',
    unit: 'per hour',
    badge: 'bigger clubs',
    sublabel: '25 or more',
    features: [
      'individual and group shots',
      'editing included',
      'a digital gallery',
    ],
    note: 'a bit more for bigger groups.',
    href: 'mailto:nithya.app@berkeley.edu?subject=Club photoshoot, 25 or more',
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
        <p>editing and a gallery are included. email me if you need something else.</p>
      </header>
      <main className="rates">
        {TIERS.map((tier) => (
          <article key={tier.id} className={tier.highlight ? 'rate rate--lead' : 'rate'}>
            <p className="kicker">{tier.badge}</p>
            <h2>{tier.title}</h2>
            {tier.sublabel ? <p className="rate__sub">{tier.sublabel}</p> : null}
            <p className="rate__price">
              {tier.price} <span>{tier.unit}</span>
            </p>
            <ul>
              {tier.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            <p className="rate__note">{tier.note}</p>
            <a className={tier.highlight ? 'btn btn-solid' : 'btn'} href={tier.href}>email me</a>
          </article>
        ))}
      </main>
      <p className="rates-note">
        not sure which one?{' '}
        <a href="mailto:nithya.app@berkeley.edu">nithya.app@berkeley.edu</a>
      </p>
      <SiteFooter />
    </div>
  )
}
