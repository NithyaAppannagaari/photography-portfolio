import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { FlightContext, type FlightRun } from '../useFlight'
import { reducedMotion } from '../useCycle'

export function FlightProvider({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<{ title: string; color: string; leaving: boolean } | null>(null)
  const timers = useRef<number[]>([])

  const clear = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }

  useEffect(() => clear, [])

  const run = useCallback<FlightRun>((title, color, go) => {
    clear()
    if (reducedMotion()) {
      go()
      return
    }
    setPanel({ title, color, leaving: false })
    timers.current.push(window.setTimeout(() => {
      go()
      timers.current.push(window.setTimeout(() => {
        setPanel((current) => (current ? { ...current, leaving: true } : current))
      }, 40))
      timers.current.push(window.setTimeout(() => setPanel(null), 820))
    }, 700))
  }, [])

  return (
    <FlightContext.Provider value={run}>
      {children}
      {panel ? <FlightOverlay title={panel.title} color={panel.color} leaving={panel.leaving} /> : null}
    </FlightContext.Provider>
  )
}

function FlightOverlay({ title, color, leaving }: { title: string; color: string; leaving: boolean }) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setOn(true))
    return () => window.cancelAnimationFrame(id)
  }, [])
  const cls = leaving ? 'is-out' : on ? 'is-in' : ''
  return (
    <div className={`flight ${cls}`} style={{ backgroundColor: color }} aria-hidden="true">
      <p>{title}</p>
    </div>
  )
}
