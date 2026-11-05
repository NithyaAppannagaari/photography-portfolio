import { useEffect, useState } from 'react'

export function useCycle(length: number, ms: number, paused = false): number {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (paused || length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setIndex((value) => (value + 1) % length), ms)
    return () => window.clearInterval(id)
  }, [length, ms, paused])
  return index
}

export function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
