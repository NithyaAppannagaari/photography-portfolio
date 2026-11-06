import { useEffect, useState } from 'react'

const KEY = 'nithya:intro'

function prefersStill(): boolean {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch { return false }
}

function alreadySeen(): boolean {
  try { return sessionStorage.getItem(KEY) === '1' } catch { return false }
}

function remember() {
  try { sessionStorage.setItem(KEY, '1') } catch { /* private mode */ }
}

function shouldSkip(): boolean {
  try {
    if (new URLSearchParams(window.location.search).has('intro')) return false
  } catch { /* ignore */ }
  return prefersStill() || alreadySeen()
}

type Phase = 'show' | 'leave' | 'done'

export default function Intro({ onDone }: { onDone?: (done: boolean) => void }) {
  const [phase, setPhase] = useState<Phase>(() => (shouldSkip() ? 'done' : 'show'))
  const [risen, setRisen] = useState(false)

  useEffect(() => {
    if (phase === 'done') {
      onDone?.(true)
      return
    }
    const params = new URLSearchParams(window.location.search)
    if (params.has('intro')) {
      params.delete('intro')
      const rest = params.toString()
      window.history.replaceState(null, '', window.location.pathname + (rest ? `?${rest}` : '') + window.location.hash)
    }
    document.documentElement.classList.add('is-intro')
    const frame = window.requestAnimationFrame(() => setRisen(true))
    return () => {
      window.cancelAnimationFrame(frame)
      document.documentElement.classList.remove('is-intro')
    }
  }, [onDone, phase])

  useEffect(() => {
    if (phase !== 'show') return
    const id = window.setTimeout(() => setPhase('leave'), 900)
    return () => window.clearTimeout(id)
  }, [phase])

  useEffect(() => {
    if (phase !== 'leave') return
    const id = window.setTimeout(() => {
      remember()
      setPhase('done')
      onDone?.(true)
    }, 420)
    return () => window.clearTimeout(id)
  }, [phase, onDone])

  if (phase === 'done') return null

  return (
    <div className={`intro-fade${risen ? ' is-in' : ''}${phase === 'leave' ? ' is-leave' : ''}`} role="dialog" aria-label="Nithya Appannagaari">
      <p className="intro-fade__name">Nithya</p>
      <p className="intro-fade__line">Photography</p>
      <button type="button" className="intro-fade__skip" onClick={() => { remember(); setPhase('done'); onDone?.(true) }}>Skip</button>
    </div>
  )
}
