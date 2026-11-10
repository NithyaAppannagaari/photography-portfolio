import { useRef, type KeyboardEvent } from 'react'
import { WORKS } from '../content'

type Props = {
  active: string | null
  hidden?: boolean
  onPick: (slug: string | null) => void
}

export default function CategoryBar({ active, hidden = false, onPick }: Props) {
  const row = useRef<HTMLDivElement>(null)
  const total = WORKS.reduce((sum, work) => sum + work.photos, 0)

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const buttons = [...(row.current?.querySelectorAll('button') ?? [])]
    const index = buttons.findIndex((button) => button === document.activeElement)
    if (index < 0) return
    const next = event.key === 'Home' ? 0
      : event.key === 'End' ? buttons.length - 1
      : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? index - 1
      : event.key === 'ArrowRight' || event.key === 'ArrowDown' ? index + 1
      : null
    if (next === null) return
    event.preventDefault()
    buttons[(next + buttons.length) % buttons.length]?.focus()
  }

  return (
    <div className={`browse-bar${hidden ? ' is-hidden' : ''}`} data-surface="dark">
      <p className="browse-bar__label">
        Browse by category
        <svg viewBox="0 0 15 9" width="15" height="9" aria-hidden="true">
          <path d="m1 1 6.5 6.5L14 1" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </p>
      <p className="browse-bar__hint">Pick a kind of shoot to see those pictures</p>
      <div
        ref={row}
        className="browse-bar__pills"
        role="toolbar"
        aria-label="Browse by category"
        aria-controls="work-grid"
        onKeyDown={onKeyDown}
      >
        <button
          type="button"
          className={active === null ? 'is-on' : ''}
          aria-pressed={active === null}
          onClick={() => onPick(null)}
        >
          All pictures <span>{total}</span>
        </button>
        {WORKS.map((work) => (
          <button
            key={work.slug}
            type="button"
            className={active === work.slug ? 'is-on' : ''}
            aria-pressed={active === work.slug}
            onClick={() => onPick(work.slug)}
          >
            {work.title} <span>{work.photos}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
