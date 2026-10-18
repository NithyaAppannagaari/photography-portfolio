import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from './components/PageHeader'
import SiteFooter from './components/SiteFooter'
import './PricingPage.css'

const TIERS = [
  {
    id: 'graduation',
    num: '01',
    title: 'graduation photoshoots',
    price: '$70',
    unit: 'per hour',
    badge: 'most popular',
    features: [
      'up to 4 different locations',
      'full editing & color grading',
      'digital gallery delivery',
      'print-ready resolution',
    ],
    note: 'Exact hours, timeline, and additional details discussed over email.',
    cta: 'email to book',
    href: 'mailto:nithya.app@berkeley.edu?subject=Graduation Photoshoot Inquiry',
    highlight: true,
  },
  {
    id: 'club-small',
    num: '02',
    title: 'club photoshoots',
    price: '$65',
    unit: 'per hour',
    badge: 'small – medium clubs',
    sublabel: 'under 25 people',
    features: [
      'individual + group shots',
      'full editing & color grading',
      'digital gallery delivery',
      'brand-aligned composition',
    ],
    note: 'Ideal for recruitment headshots and team portraits.',
    cta: 'email to book',
    href: 'mailto:nithya.app@berkeley.edu?subject=Club Photoshoot Inquiry (Small–Medium)',
    highlight: false,
  },
  {
    id: 'club-large',
    num: '03',
    title: 'club photoshoots',
    price: '$70–75',
    unit: 'per hour',
    badge: 'large clubs',
    sublabel: '25+ people',
    features: [
      'individual + group shots',
      'full editing & color grading',
      'digital gallery delivery',
      'coordinated shoot planning',
    ],
    note: 'Rate reflects coordination overhead for larger groups.',
    cta: 'email to book',
    href: 'mailto:nithya.app@berkeley.edu?subject=Club Photoshoot Inquiry (Large)',
    highlight: false,
  },
]

function label(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function sentence(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export default function PricingPage() {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate('/')
  }

  useEffect(() => {
    document.title = 'Pricing · Nithya Appannagaari'
  }, [])

  return (
    <div className="pricing-page">
      <PageHeader
        kicker="Pricing"
        title="Simple, transparent rates"
        lede="All packages include editing, color grading, and a digital gallery. Email to discuss your specific needs."
        onBack={handleBack}
        actionHref="mailto:nithya.app@berkeley.edu"
        actionLabel="Book a session"
      />

      <main className="pricing-main pattern">
        <div className="pricing-grid">
          {TIERS.map((tier) => (
            <article key={tier.id} className={`tier-card${tier.highlight ? ' tier-card--highlight' : ''}`}>
              <div className="tier-top">
                <div className="tier-meta">
                  <span className="tier-num">{tier.num}</span>
                  {tier.badge ? (
                    <span className={`tier-badge${tier.highlight ? ' tier-badge--accent' : ''}`}>
                      {label(tier.badge)}
                    </span>
                  ) : null}
                </div>
                <h2 className="tier-title">{label(tier.title)}</h2>
                {tier.sublabel ? <p className="tier-sublabel">{sentence(tier.sublabel)}</p> : null}
              </div>

              <div className="tier-price-wrap">
                <span className="tier-price">{tier.price}</span>
                <span className="tier-unit">{tier.unit}</span>
              </div>

              <ul className="tier-features">
                {tier.features.map((feature) => (
                  <li key={feature} className="tier-feature">
                    <span className="tier-feature-mark" aria-hidden="true" />
                    <span>{sentence(feature)}</span>
                  </li>
                ))}
              </ul>

              <p className="tier-note">{tier.note}</p>

              <a href={tier.href} className={`btn ${tier.highlight ? 'btn-cream' : 'btn-line-ink'} tier-cta`}>
                Email to book
              </a>
            </article>
          ))}
        </div>

        <div className="pricing-footer-note">
          <p>
            Not sure which package fits? Reach out and we&apos;ll figure it out together —{' '}
            <a href="mailto:nithya.app@berkeley.edu">nithya.app@berkeley.edu</a>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
