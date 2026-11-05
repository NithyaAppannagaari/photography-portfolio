import { useEffect, useState } from 'react'
import { reducedMotion } from '../useCycle'

const KEY = 'nithya:intro'

function stored(): boolean {
  try { return sessionStorage.getItem(KEY) === '1' } catch { return false }
}

function remember() {
  try { sessionStorage.setItem(KEY, '1') } catch { /* private mode */ }
}

type Phase = 'show' | 'leave' | 'done'

export default function Intro({ onDone }: { onDone: (done: boolean) => void }) {
  const [phase, setPhase] = useState<Phase>('show')
  const [risen, setRisen] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const replay = params.has('intro')
    if (replay) {
      params.delete('intro')
      const rest = params.toString()
      window.history.replaceState(null, '', window.location.pathname + (rest ? `?${rest}` : '') + window.location.hash)
    }
    if (!replay && (reducedMotion() || stored())) {
      setPhase('done')
      onDone(true)
      return
    }
    document.documentElement.classList.add('is-intro')
    onDone(false)
    const frame = window.requestAnimationFrame(() => setRisen(true))
    return () => {
      window.cancelAnimationFrame(frame)
      document.documentElement.classList.remove('is-intro')
    }
  }, [onDone])

  useEffect(() => {
    if (phase === 'done') {
      document.documentElement.classList.remove('is-intro')
      remember()
      onDone(true)
      return
    }
    const wait = phase === 'show' ? 1100 : 420
    const id = window.setTimeout(() => setPhase(phase === 'show' ? 'leave' : 'done'), wait)
    return () => window.clearTimeout(id)
  }, [phase, onDone])

  if (phase === 'done') return null

  return (
    <div className={`intro-fade${risen ? ' is-in' : ''}${phase === 'leave' ? ' is-leave' : ''}`} role="dialog" aria-label="Nithya Appannagaari">
      <p className="intro-fade__name">Nithya</p>
      <p className="intro-fade__line">Photography</p>
      <button type="button" className="intro-fade__skip" onClick={() => setPhase('done')}>Skip</button>
    </div>
  )
}
