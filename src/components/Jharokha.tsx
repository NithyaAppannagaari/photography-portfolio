import { useId } from 'react'

type Variant = 'wide' | 'portrait'

type Shape = {
  viewBox: string
  outer: string
  photo: string
  image: { x: number; y: number; width: number; height: number }
  finial: { x: number; y: number }
  bosses: Array<{ x: number; y: number }>
}

const SHAPES: Record<Variant, Shape> = {
  wide: {
    viewBox: '0 0 920 740',
    outer:
      'M46 700 L874 700 L874 280 C874 190 786 112 670 76 C586 50 506 36 460 30 C414 36 334 50 250 76 C134 112 46 190 46 280 Z',
    photo:
      'M86 664 L834 664 L834 304 C834 226 756 156 654 122 C580 98 508 84 460 76 C412 84 340 98 266 122 C164 156 86 226 86 304 Z',
    image: { x: 86, y: 76, width: 748, height: 588 },
    finial: { x: 460, y: 34 },
    bosses: [
      { x: 46, y: 280 },
      { x: 874, y: 280 },
      { x: 46, y: 700 },
      { x: 874, y: 700 },
    ],
  },
  portrait: {
    viewBox: '0 0 480 680',
    outer:
      'M34 646 L446 646 L446 262 C446 156 370 74 240 38 C110 74 34 156 34 262 Z',
    photo:
      'M72 616 L408 616 L408 198 C408 148 328 116 240 110 C152 116 72 148 72 198 Z',
    image: { x: 72, y: 106, width: 336, height: 510 },
    finial: { x: 240, y: 42 },
    bosses: [
      { x: 34, y: 262 },
      { x: 446, y: 262 },
      { x: 34, y: 646 },
      { x: 446, y: 646 },
    ],
  },
}

type JharokhaProps = {
  src: string
  alt: string
  variant?: Variant
  className?: string
}

function Lotus() {
  return (
    <g>
      <ellipse cx="-11" cy="1" rx="7" ry="12" transform="rotate(-32)" fill="#E2B34A" />
      <ellipse cx="11" cy="1" rx="7" ry="12" transform="rotate(32)" fill="#E2B34A" />
      <ellipse cx="0" cy="-3" rx="6.2" ry="14" fill="#F0D48A" />
      <circle cy="6" r="3.3" fill="#F7F1E6" />
      <circle cy="6" r="1.5" fill="#1C7A72" />
    </g>
  )
}

export default function Jharokha({ src, alt, variant = 'wide', className }: JharokhaProps) {
  const clipId = `jh-${useId().replace(/:/g, '')}`
  const shape = SHAPES[variant]

  return (
    <div className={`jharokha jharokha--${variant}${className ? ` ${className}` : ''}`}>
      <svg viewBox={shape.viewBox} role="img" aria-label={alt}>
        <defs>
          <clipPath id={clipId}>
            <path d={shape.photo} />
          </clipPath>
        </defs>
        <path d={shape.outer} className="jharokha__plate" />
        <image
          href={src}
          x={shape.image.x}
          y={shape.image.y}
          width={shape.image.width}
          height={shape.image.height}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipId})`}
        />
        <path d={shape.outer} className="jharokha__border" />
        <path d={shape.photo} className="jharokha__inset" />
        <g transform={`translate(${shape.finial.x} ${shape.finial.y})`}>
          <Lotus />
        </g>
        {shape.bosses.map((boss) => (
          <rect
            key={`${boss.x}-${boss.y}`}
            x={boss.x - 6}
            y={boss.y - 6}
            width="12"
            height="12"
            fill="#E2B34A"
            transform={`rotate(45 ${boss.x} ${boss.y})`}
          />
        ))}
      </svg>
    </div>
  )
}
