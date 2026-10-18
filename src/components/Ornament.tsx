type OrnamentProps = {
  tone?: 'gold' | 'vermilion'
}

export default function Ornament({ tone = 'vermilion' }: OrnamentProps) {
  return (
    <div className={`ornament ornament--${tone}`} aria-hidden="true">
      <span className="ornament__line" />
      <svg className="ornament__mark" viewBox="0 0 72 28">
        <ellipse cx="26" cy="16" rx="6" ry="10" transform="rotate(-30 26 16)" />
        <ellipse cx="46" cy="16" rx="6" ry="10" transform="rotate(30 46 16)" />
        <ellipse cx="36" cy="13" rx="5" ry="11" />
        <circle cx="36" cy="18" r="2.4" className="ornament__seed" />
      </svg>
      <span className="ornament__line" />
    </div>
  )
}
