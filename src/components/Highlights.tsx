import { useState } from 'react'
import PhotoViewer from './PhotoViewer'
import jump from '../assets/sunny/jump.webp'
import lift from '../assets/sunny/lift.webp'
import blueSky from '../assets/sunny/blue-sky.webp'
import trees from '../assets/sunny/trees.webp'
import columns from '../assets/sunny/columns.webp'
import daylightPair from '../assets/sunny/daylight-pair.webp'
import candid from '../assets/sunny/candid.webp'
import goldenGreen from '../assets/sunny/golden-green.webp'
import goldenTrio from '../assets/sunny/golden-trio.webp'
import circle from '../assets/sunny/circle.webp'
import lawn from '../assets/sunny/lawn.webp'
import goldenPortrait from '../assets/sunny/golden-portrait.webp'
import laugh from '../assets/sunny/laugh.webp'
import skyDancers from '../assets/sunny/sky-dancers.webp'
import './Highlights.css'

const PHOTOS = [
  { src: goldenTrio, alt: 'Three women in warm golden-hour light.', span: 4 },
  { src: blueSky, alt: 'A portrait in direct sun, blue sky behind her.', span: 2 },
  { src: lift, alt: 'A dancer lifted outdoors in daylight, smiling.', span: 2 },
  { src: trees, alt: 'Three people smiling in bright light, green trees behind them.', span: 2 },
  { src: columns, alt: 'Four women in daylight in front of stone columns.', span: 2 },
  { src: daylightPair, alt: 'Two women standing together in bright daylight.', span: 3 },
  { src: candid, alt: 'People talking outdoors, trees and daylight behind them.', span: 3 },
  { src: goldenGreen, alt: 'A group in golden light with green trees behind them.', span: 4 },
  { src: jump, alt: 'Two dancers jumping, blue sky behind them.', span: 2 },
  { src: circle, alt: 'A circle of dancers on a sunny lawn.', span: 2 },
  { src: lawn, alt: 'A group seated on the grass in the sun.', span: 2 },
  { src: goldenPortrait, alt: 'A close portrait in warm golden light.', span: 2 },
  { src: laugh, alt: 'A woman laughing in bright outdoor light.', span: 3 },
  { src: skyDancers, alt: 'Three dancers outdoors, sun and blue sky behind them.', span: 3 },
]

const FRAME = {
  4: { ratio: '3 / 2', width: 1200, height: 800 },
  3: { ratio: '4 / 5', width: 800, height: 1000 },
  2: { ratio: '3 / 4', width: 900, height: 1200 },
} as const

export default function Highlights() {
  const [open, setOpen] = useState<number | null>(null)
  const count = PHOTOS.length
  const active = open === null ? null : PHOTOS[open]

  return (
    <section className="highlights" id="highlights" aria-label="Highlights">
      <p className="kicker">Highlights</p>
      <div className="highlights__grid">
        {PHOTOS.map((photo, index) => {
          const frame = FRAME[photo.span as keyof typeof FRAME]
          return (
            <button
              key={photo.src}
              type="button"
              className={`photo-frame highlights__item highlights__item--${photo.span}`}
              onClick={() => setOpen(index)}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                width={frame.width}
                height={frame.height}
                style={{ aspectRatio: frame.ratio }}
                loading={index < 2 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </button>
          )
        })}
      </div>
      {active && open !== null ? (
        <PhotoViewer
          src={active.src}
          alt={active.alt}
          index={open}
          count={count}
          onPrev={() => setOpen((open - 1 + count) % count)}
          onNext={() => setOpen((open + 1) % count)}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </section>
  )
}
