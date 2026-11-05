import { useEffect, useState } from 'react'
import Mark from './Mark'
import { reducedMotion } from '../useCycle'

const LINE = 'Hi, I am Nithya.'
const KEY = 'nithya:intro'

type Phase = 'draw' | 'cover' | 'type' | 'hold' | 'leave' | 'done'

export default function Intro({ onDone }: { onDone: (done: boolean) => void }) {
  const [phase, setPhase] = useState<Phase>('draw')
  const [count, setCount] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const replay = params.has('intro')
    if (replay) {
      params.delete('intro')
      const rest = params.toString()
      window.history.replaceState(null, '', window.location.pathname + (rest ? `?${rest}` : '') + window.location.hash)
    }
    if (!replay && (reducedMotion() || sessionStorage.getItem(KEY) === '1')) {
      setPhase('done')
      onDone(true)
      return
    }
    document.documentElement.classList.add('is-intro')
    onDone(false)
    return () => document.documentElement.classList.remove('is-intro')
  }, [onDone])

  useEffect(() => {
    if (phase === 'done') {
      document.documentElement.classList.remove('is-intro')
      sessionStorage.setItem(KEY, '1')
      onDone(true)
      return
    }
    const wait = phase === 'draw' ? 1100 : phase === 'cover' ? 420 : phase === 'hold' ? 520 : phase === 'leave' ? 700 : 0
    if (phase === 'type') return
    const id = window.setTimeout(() => {
      setPhase(phase === 'draw' ? 'cover' : phase === 'cover' ? 'type' : phase === 'hold' ? 'leave' : 'done')
    }, wait)
    return () => window.clearTimeout(id)
  }, [phase, onDone])

  useEffect(() => {
    if (phase !== 'type') return
    if (count >= LINE.length) {
      const id = window.setTimeout(() => setPhase('hold'), 280)
      return () => window.clearTimeout(id)
    }
    const id = window.setTimeout(() => setCount((value) => value + 1), count < 4 ? 78 : 42)
    return () => window.clearTimeout(id)
  }, [phase, count])

  if (phase === 'done') return null

  return (
    <div className={`intro-screen intro-screen--${phase}`} role="dialog" aria-label="Hello">
      <div className="intro-screen__paper" aria-hidden="true">
        <Mark className="intro-screen__mark" />
      </div>
      <div className="intro-screen__stage">
        <p className="intro-screen__hi">
          {LINE.slice(0, count)}
          <span className="caret" />
        </p>
        <button
          type="button"
          className={`intro-screen__skip${phase === 'draw' ? '' : ' is-on'}`}
          onClick={() => setPhase('done')}
        >
          Skip
        </button>
      </div>
    </div>
  )
}
