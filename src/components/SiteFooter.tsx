import { Link } from 'react-router-dom'
import { INSTAGRAM } from '../content'
import './SiteFooter.css'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>© 2026 Nithya Appannagaari</p>
      <div>
        <a href={INSTAGRAM} target="_blank" rel="noopener">Instagram</a>
        <Link to="/#contact">Say hi</Link>
      </div>
    </footer>
  )
}
