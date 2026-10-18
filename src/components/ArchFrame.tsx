import { useId, type ReactNode } from 'react'
import './ArchFrame.css'

/**
 * Cusped jharokha: a pointed arch with two shoulder lobes.
 * Coordinates are 0–1 so the stroke and the clip share one silhouette.
 */
const ARCH =
  'M0.02,0.25 C0.02,0.175 0.07,0.125 0.12,0.108 C0.17,0.09 0.2,0.145 0.25,0.15 C0.3,0.155 0.33,0.095 0.39,0.072 C0.44,0.052 0.47,0.09 0.5,0.02 C0.53,0.09 0.56,0.052 0.61,0.072 C0.67,0.095 0.7,0.155 0.75,0.15 C0.8,0.145 0.83,0.09 0.88,0.108 C0.93,0.125 0.98,0.175 0.98,0.25 L0.98,0.985 L0.02,0.985 Z'

type ArchFrameProps = {
  children: ReactNode
  className?: string
}

export default function ArchFrame({ children, className = '' }: ArchFrameProps) {
  const clipId = `jharokha-${useId().replace(/:/g, '')}`

  return (
    <div className={`arch ${className}`.trim()}>
      <svg className="arch__defs" width="0" height="0" aria-hidden="true">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={ARCH} />
          </clipPath>
        </defs>
      </svg>
      <div className="arch__window" style={{ clipPath: `url(#${clipId})` }}>
        {children}
      </div>
      <svg className="arch__frame" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">
        <path d={ARCH} className="arch__stroke arch__stroke--outer" />
        <path d={ARCH} className="arch__stroke arch__stroke--inner" />
      </svg>
    </div>
  )
}
