import { useNavigate } from 'react-router-dom'
import './PricingPage.css'

const TIERS = [
  {
    id:       'graduation',
    num:      '01',
    title:    'graduation photoshoots',
    price:    '$70',
    unit:     'per hour',
    badge:    'most popular',
    features: [
      'up to 4 different locations',
      'full editing & color grading',
      'digital gallery delivery',
      'print-ready resolution',
    ],
    note:     'Exact hours, timeline, and additional details discussed over email.',
    cta:      'email to book',
    href:     'mailto:nithya.app@berkeley.edu?subject=Graduation Photoshoot Inquiry',
    highlight: true,
  },
  {
    id:       'club-small',
    num:      '02',
    title:    'club photoshoots',
    price:    '$65',
    unit:     'per hour',
    badge:    'small – medium clubs',
    sublabel: 'under 25 people',
    features: [
      'individual + group shots',
      'full editing & color grading',
      'digital gallery delivery',
      'brand-aligned composition',
    ],
    note:     'Ideal for recruitment headshots and team portraits.',
    cta:      'email to book',
    href:     'mailto:nithya.app@berkeley.edu?subject=Club Photoshoot Inquiry (Small–Medium)',
    highlight: false,
  },
  {
    id:       'club-large',
    num:      '03',
    title:    'club photoshoots',
    price:    '$70–75',
    unit:     'per hour',
    badge:    'large clubs',
    sublabel: '25+ people',
    features: [
      'individual + group shots',
      'full editing & color grading',
      'digital gallery delivery',
      'coordinated shoot planning',
    ],
    note:     'Rate reflects coordination overhead for larger groups.',
    cta:      'email to book',
    href:     'mailto:nithya.app@berkeley.edu?subject=Club Photoshoot Inquiry (Large)',
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
    <div className="pricing-page">

      {/* ── HEADER ── */}
      <header className="pricing-header">
        <button onClick={handleBack} className="pricing-back">← back</button>
        <div className="pricing-header-center">
          <span className="section-tag">pricing</span>
          <h1 className="pricing-title">Simple, transparent rates</h1>
          <p className="pricing-subtitle">
            All packages include editing, color grading, and a digital gallery.
            Email to discuss your specific needs.
          </p>
        </div>
        <a href="mailto:nithya.app@berkeley.edu" className="pricing-book-btn">
          book a session
        </a>
      </header>

      {/* ── TIER CARDS ── */}
      <main className="pricing-main">
        <div className="pricing-grid">
          {TIERS.map((tier) => (
            <div key={tier.id} className={`tier-card${tier.highlight ? ' tier-card--highlight' : ''}`}>

              {/* Card header */}
              <div className="tier-top">
                <div className="tier-meta">
                  <span className="tier-num">{tier.num}</span>
                  {tier.badge && (
                    <span className={`tier-badge${tier.highlight ? ' tier-badge--accent' : ''}`}>
                      {tier.badge}
                    </span>
                  )}
                </div>
                <h2 className="tier-title">{tier.title}</h2>
                {tier.sublabel && (
                  <p className="tier-sublabel">{tier.sublabel}</p>
                )}
              </div>

              {/* Price */}
              <div className="tier-price-wrap">
                <span className="tier-price">{tier.price}</span>
                <span className="tier-unit">{tier.unit}</span>
              </div>

              {/* Divider */}
              <div className="tier-rule" />

              {/* Features */}
              <ul className="tier-features">
                {tier.features.map((f, i) => (
                  <li key={i} className="tier-feature">
                    <span className="tier-feature-check" aria-hidden="true">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Note */}
              <p className="tier-note">{tier.note}</p>

              {/* CTA */}
              <a href={tier.href} className={`tier-cta${tier.highlight ? ' tier-cta--primary' : ''}`}>
                {tier.cta} →
              </a>

            </div>
          ))}
        </div>

        {/* Bottom callout */}
        <div className="pricing-footer-note">
          <p>
            Not sure which package fits? Reach out and we'll figure it out together —
            {' '}<a href="mailto:nithya.app@berkeley.edu">nithya.app@berkeley.edu</a>
          </p>
        </div>
      </main>

    </div>
  )
}
