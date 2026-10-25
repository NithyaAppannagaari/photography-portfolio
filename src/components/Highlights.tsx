import { useState } from 'react'
import PhotoViewer from './PhotoViewer'
import Reveal from './Reveal'
import './Highlights.css'

type Size = { width: number; height: number }

const sources = import.meta.glob('../assets/sunny/*.webp', { eager: true, import: 'default' }) as Record<string, string>
const sizes = import.meta.glob('../assets/sunny/*.webp', { eager: true, query: '?intrinsic', import: 'default' }) as Record<string, Size>

function shot(name: string) {
  const key = `../assets/sunny/${name}`
  const src = sources[key]
  const size = sizes[key]
  if (!src || !size) throw new Error(`Missing highlight ${name}`)
  return { src, width: size.width, height: size.height }
}

const PHOTOS = [
  { ...shot('golden-trio.webp'), alt: 'Three women in warm golden-hour light.', tape: 'lavender', sticker: '', tone: '' },
  { ...shot('blue-sky.webp'), alt: 'A portrait in direct sun, blue sky behind her.', tape: '', sticker: 'golden hour', tone: 'blush' },
  { ...shot('lift.webp'), alt: 'A dancer lifted outdoors in daylight, smiling.', tape: '', sticker: '', tone: '' },
  { ...shot('trees.webp'), alt: 'Three people smiling in bright light, green trees behind them.', tape: 'pink', sticker: '', tone: '' },
  { ...shot('columns.webp'), alt: 'Four women in daylight in front of stone columns.', tape: '', sticker: 'sunny', tone: 'pink' },
  { ...shot('daylight-pair.webp'), alt: 'Two women standing together in bright daylight.', tape: 'blush', sticker: '', tone: '' },
  { ...shot('candid.webp'), alt: 'People talking outdoors, trees and daylight behind them.', tape: '', sticker: '', tone: '' },
  { ...shot('golden-green.webp'), alt: 'A group in golden light with green trees behind them.', tape: 'lavender', sticker: '', tone: '' },
  { ...shot('jump.webp'), alt: 'Two dancers jumping, blue sky behind them.', tape: '', sticker: '', tone: '' },
  { ...shot('circle.webp'), alt: 'A circle of dancers on a sunny lawn.', tape: '', sticker: '', tone: '' },
  { ...shot('lawn.webp'), alt: 'A group seated on the grass in the sun.', tape: 'pink', sticker: '', tone: '' },
  { ...shot('golden-portrait.webp'), alt: 'A close portrait in warm golden light.', tape: '', sticker: 'daylight', tone: 'lavender' },
  { ...shot('laugh.webp'), alt: 'A woman laughing in bright outdoor light.', tape: '', sticker: '', tone: '' },
  { ...shot('sky-dancers.webp'), alt: 'Three dancers outdoors, sun and blue sky behind them.', tape: 'blush', sticker: '', tone: '' },
]

export default function Highlights() {
  const [open, setOpen] = useState<number | null>(null)
  const count = PHOTOS.length
  const active = open === null ? null : PHOTOS[open]

  return (
    <section className="highlights band" id="highlights" aria-label="Highlights">
      <p className="kicker">Highlights</p>
      <div className="board">
        {PHOTOS.map((photo, index) => (
          <Reveal key={photo.src} delay={Math.min(index, 5) * 40}>
            <button type="button" className="pinned" onClick={() => setOpen(index)}>
              {photo.tape ? <span className={`washi washi--${photo.tape}`} aria-hidden="true" /> : null}
              <span className="frame">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </span>
              {photo.sticker ? (
                <span className={`sticker sticker--${photo.tone} sticker--pin`}>{photo.sticker}</span>
              ) : null}
            </button>
          </Reveal>
        ))}
      </div>
      {active && open !== null ? (
        <PhotoViewer
          src={active.src}
          alt={active.alt}
          width={active.width}
          height={active.height}
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
