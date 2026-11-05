import { useEffect, useState, type CSSProperties } from 'react'
import { KINDS, SHOOTS } from '../content'
import { useCycle } from '../useCycle'

type Props = {
  counts: Record<string, number>
  active: string | null
  shown: number
  visible: boolean
  hidden: boolean
  onPick: (tag: string | null) => void
}

export default function FilterIsland({ counts, active, shown, visible, hidden, onPick }: Props) {
  const [open, setOpen] = useState(false)
  const shootIndex = useCycle(SHOOTS.length, 2200, open || Boolean(active))
  const kindIndex = useCycle(KINDS.length, 2200, open || Boolean(active))
  const shoot = active && (SHOOTS as readonly string[]).includes(active) ? active : SHOOTS[shootIndex]
  const kind = active && (KINDS as readonly string[]).includes(active) ? active : KINDS[kindIndex]
  const state = hidden || !visible ? 'hidden' : open ? 'open' : 'bar'

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="island" data-state={state}>
      <button
        type="button"
        className="island__bar"
        aria-expanded={open}
        aria-label={`Filter works, ${shown} shown`}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="island__slot">{shoot}</span>
        <span className="island__for">for</span>
        <span className="island__slot">{kind}</span>
        <span className="island__count">{shown}</span>
      </button>
      <div className="island__panel" id="filter-island-panel">
        <p className="island__line">As a campus photographer, I shoot</p>
        <button type="button" className="island__close" aria-label="Close filters" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
        </button>
        <div className="island__lists">
          <div className="island__col">
            {SHOOTS.map((tag, index) => (
              <FilterButton key={tag} tag={tag} count={counts[tag] ?? 0} on={active === tag} index={index} onPick={onPick} />
            ))}
            <button type="button" className="island__all u" aria-pressed={active === null} onClick={() => onPick(null)}>all</button>
          </div>
          <div className="island__col island__col--right">
            {KINDS.map((tag, index) => (
              <FilterButton key={tag} tag={tag} count={counts[tag] ?? 0} on={active === tag} index={index + SHOOTS.length} onPick={onPick} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterButton({
  tag,
  count,
  on,
  index,
  onPick,
}: {
  tag: string
  count: number
  on: boolean
  index: number
  onPick: (tag: string | null) => void
}) {
  return (
    <button
      type="button"
      className={`pill-btn${on ? ' is-on' : ''}${count === 0 ? ' is-off' : ''}`}
      style={{ '--i': index } as CSSProperties}
      aria-pressed={on}
      onClick={() => onPick(on ? null : tag)}
    >
      {tag}
      <span className="pill-btn__count">{count}</span>
    </button>
  )
}
