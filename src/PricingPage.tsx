import { useNavigate } from 'react-router-dom'
import { Kicker, Sheet } from './components/SiteChrome'
import './PricingPage.css'

const TIERS = [
  {
    id: 'graduation',
    num: '01',
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
    cta: 'Email to book',
    href: 'mailto:nithya.app@berkeley.edu?subject=Graduation Photoshoot Inquiry',
    highlight: true,
  },
  {
    id: 'club-small',
    num: '02',
    title: 'Club photoshoots',
    price: '$65',
    unit: 'per hour',
    badge: 'Small – medium clubs',
    sublabel: 'under 25 people',
    features: [
      'Individual + group shots',
      'Full editing & color grading',
      'Digital gallery delivery',
      'Brand-aligned composition',
    ],
    note: 'Ideal for recruitment headshots and team portraits.',
    cta: 'Email to book',
    href: 'mailto:nithya.app@berkeley.edu?subject=Club Photoshoot Inquiry (Small–Medium)',
    highlight: false,
  },
  {
    id: 'club-large',
    num: '03',
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
    cta: 'Email to book',
    href: 'mailto:nithya.app@berkeley.edu?subject=Club Photoshoot Inquiry (Large)',
    highlight: false,
  },
]

export default function PricingPage() {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate('/')
  }

  return (
    <Sheet>
      <header className="page-head">
        <button type="button" onClick={handleBack} className="back">← Back</button>
        <Kicker>Pricing</Kicker>
        <h1 className="display">Simple, transparent rates</h1>
        <p className="lede">
          All packages include editing, color grading, and a digital gallery.
          Email to discuss your specific needs.
        </p>
      </header>

      <div className="pricing-main">
        <div className="pricing-grid">
          {TIERS.map((tier) => (
            <article key={tier.id} className={`ticket${tier.highlight ? ' ticket--hot' : ''}`}>
              <svg className="ticket__crown" viewBox="0 0 200 70" aria-hidden="true">
                <path
                  className="ticket__crown-fill"
                  d="M2 70V36C22 36 40 18 68 12 86 8 96 18 100 4 104 18 114 8 132 12 160 18 178 36 198 36V70Z"
                />
                <path
                  className="ticket__crown-line"
                  d="M2 36C22 36 40 18 68 12 86 8 96 18 100 4 104 18 114 8 132 12 160 18 178 36 198 36"
                  fill="none"
                />
              </svg>
              <div className="ticket__meta">
                <span className="ticket__num">{tier.num}</span>
                <span className="ticket__badge">{tier.badge}</span>
              </div>
              <h2 className="ticket__title">{tier.title}</h2>
              {tier.sublabel && <p className="ticket__sub">{tier.sublabel}</p>}
              <p className="ticket__price">
                <span>{tier.price}</span>
                <small>{tier.unit}</small>
              </p>
              <ul className="ticket__features">
                {tier.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <p className="ticket__note">{tier.note}</p>
              <a href={tier.href} className={`btn ${tier.highlight ? 'btn--light' : 'btn--solid'} ticket__cta`}>
                {tier.cta}
              </a>
            </article>
          ))}
        </div>

        <p className="pricing-foot">
          Not sure which package fits? Reach out and we'll figure it out together —
          {' '}<a href="mailto:nithya.app@berkeley.edu">nithya.app@berkeley.edu</a>
        </p>
      </div>
    </Sheet>
  )
}
