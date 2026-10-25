import { Link } from 'react-router-dom'
import './SiteFooter.css'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>© 2026 Nithya Appannagaari</p>
      <div>
        <a href="https://www.instagram.com/nithya.app/">Instagram</a>
        <a href="https://www.linkedin.com/in/nithyaappannagaari/">LinkedIn</a>
        <Link to="/#contact">Say hi</Link>
      </div>
    </footer>
  )
}
