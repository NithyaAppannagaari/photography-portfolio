import { createContext, useContext } from 'react'

export type FlightRun = (title: string, color: string, go: () => void) => void

export const FlightContext = createContext<FlightRun>(() => {})

export function useFlight(): FlightRun {
  return useContext(FlightContext)
}
