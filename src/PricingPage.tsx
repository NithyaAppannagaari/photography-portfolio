import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Menu from './components/Menu'
import Rates from './components/Rates'

export default function PricingPage() {
  useEffect(() => {
    document.title = 'Rates · Nithya Appannagaari Photography'
  }, [])

  return (
    <div className="pricing">
      <Menu />
      <header className="pricing__head" data-surface="light">
        <p className="kicker">Rates</p>
        <h1>rates</h1>
        <p>
          Editing and a gallery are included.{' '}
          <Link className="u" to="/#contact">Say hi</Link>
          {' '}if you need something else.
        </p>
      </header>
      <Rates />
      <p className="pricing__note">
        Not sure which one? <Link className="u" to="/#contact">Say hi</Link> and tell me about the club.
      </p>
    </div>
  )
}
