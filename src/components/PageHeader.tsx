import { Link } from 'react-router-dom'

type PageHeaderProps = {
  kicker: string
  title: string
  lede?: string
  onBack: () => void
  actionHref: string
  actionLabel: string
}

export default function PageHeader({
  kicker,
  title,
  lede,
  onBack,
  actionHref,
  actionLabel,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header__bar">
        <button type="button" className="page-header__back" onClick={onBack}>
          Back
        </button>
        <Link to="/" className="page-header__mark">
          Nithya
        </Link>
        <a className="btn btn-solid page-header__action" href={actionHref}>
          {actionLabel}
        </a>
      </div>
      <div className="page-header__intro">
        <p className="eyebrow eyebrow--ink">{kicker}</p>
        <h1>{title}</h1>
        {lede ? <p className="page-header__lede">{lede}</p> : null}
      </div>
    </header>
  )
}
