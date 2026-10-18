import { useEffect } from 'react'
import SiteFooter from './components/SiteFooter'
import SiteNav from './components/SiteNav'
import './PricingPage.css'

const TIERS = [
  {
    id: 'graduation',
    title: 'Graduation photoshoots',
    price: '$70',
    unit: 'per hour',
    badge: 'Most popular',
    features: [
      'Up to 4 different locations',
      'Full editing & color grading',
      'Digital gallery delivery',
      'Print-ready resolution',
    ],
    note: 'Exact hours, timeline, and additional details discussed over email.',
    href: 'mailto:nithya.app@berkeley.edu?subject=Graduation Photoshoot Inquiry',
    highlight: true,
  },
  {
    id: 'club-small',
    title: 'Club photoshoots',
    price: '$65',
    unit: 'per hour',
    badge: 'Small – medium clubs',
    sublabel: 'Under 25 people',
    features: [
      'Individual + group shots',
      'Full editing & color grading',
      'Digital gallery delivery',
      'Brand-aligned composition',
    ],
    note: 'Ideal for recruitment headshots and team portraits.',
    href: 'mailto:nithya.app@berkeley.edu?subject=Club Photoshoot Inquiry (Small–Medium)',
    highlight: false,
  },
  {
    id: 'club-large',
    title: 'Club photoshoots',
    price: '$70–75',
    unit: 'per hour',
    badge: 'Large clubs',
    sublabel: '25+ people',
    features: [
      'Individual + group shots',
      'Full editing & color grading',
      'Digital gallery delivery',
      'Coordinated shoot planning',
    ],
    note: 'Rate reflects coordination overhead for larger groups.',
    href: 'mailto:nithya.app@berkeley.edu?subject=Club Photoshoot Inquiry (Large)',
    highlight: false,
  },
]

export default function PricingPage() {
  useEffect(() => {
    document.title = 'Pricing · Nithya Appannagaari'
  }, [])

  return (
    <div className="pricing-page">
      <SiteNav active="pricing" />
      <header className="intro">
        <p className="kicker">Pricing</p>
        <h1>Simple, transparent rates</h1>
        <p>All packages include editing, color grading, and a digital gallery. Email to discuss your specific needs.</p>
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
            <a className={tier.highlight ? 'btn btn-solid' : 'btn'} href={tier.href}>Email to book</a>
          </article>
        ))}
      </main>
      <p className="rates-note">
        Not sure which package fits? Reach out and we&apos;ll figure it out together —{' '}
        <a href="mailto:nithya.app@berkeley.edu">nithya.app@berkeley.edu</a>
      </p>
      <SiteFooter />
    </div>
  )
}
