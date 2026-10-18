import { Link } from 'react-router-dom'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <Link to="/" className="site-footer__mark">
          Nithya
        </Link>
        <p>© 2026 Nithya Appannagaari Photography. All rights reserved.</p>
        <div className="site-footer__links">
          <a href="https://www.linkedin.com/in/nithyaappannagaari/">LinkedIn</a>
          <span aria-hidden="true">·</span>
          <a href="https://www.instagram.com/nithya.app/">Instagram</a>
        </div>
      </div>
    </footer>
  )
}
