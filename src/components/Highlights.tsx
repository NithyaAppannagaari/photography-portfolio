import { useState, type CSSProperties } from 'react'
import PhotoViewer from './PhotoViewer'
import Reveal from './Reveal'
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
  { src: goldenTrio, alt: 'Three women in warm golden-hour light.', span: 7, ratio: '3 / 2', tape: 'sage', sticker: '', tone: '' },
  { src: blueSky, alt: 'A portrait in direct sun, blue sky behind her.', span: 5, ratio: '4 / 5', tape: '', sticker: 'golden hour', tone: 'rose' },
  { src: lift, alt: 'A dancer lifted outdoors in daylight, smiling.', span: 4, ratio: '3 / 4', tape: '', sticker: '', tone: '' },
  { src: trees, alt: 'Three people smiling in bright light, green trees behind them.', span: 4, ratio: '1 / 1', tape: 'gold', sticker: '', tone: '' },
  { src: columns, alt: 'Four women in daylight in front of stone columns.', span: 4, ratio: '3 / 4', tape: '', sticker: 'sunny', tone: 'marigold' },
  { src: daylightPair, alt: 'Two women standing together in bright daylight.', span: 5, ratio: '4 / 5', tape: 'rose', sticker: '', tone: '' },
  { src: candid, alt: 'People talking outdoors, trees and daylight behind them.', span: 7, ratio: '3 / 2', tape: '', sticker: '', tone: '' },
  { src: goldenGreen, alt: 'A group in golden light with green trees behind them.', span: 8, ratio: '3 / 2', tape: 'sage', sticker: '', tone: '' },
  { src: jump, alt: 'Two dancers jumping, blue sky behind them.', span: 4, ratio: '3 / 4', tape: '', sticker: '', tone: '' },
  { src: circle, alt: 'A circle of dancers on a sunny lawn.', span: 4, ratio: '1 / 1', tape: '', sticker: '', tone: '' },
  { src: lawn, alt: 'A group seated on the grass in the sun.', span: 4, ratio: '4 / 5', tape: 'gold', sticker: '', tone: '' },
  { src: goldenPortrait, alt: 'A close portrait in warm golden light.', span: 4, ratio: '3 / 4', tape: '', sticker: 'daylight', tone: 'sage' },
  { src: laugh, alt: 'A woman laughing in bright outdoor light.', span: 7, ratio: '3 / 2', tape: '', sticker: '', tone: '' },
  { src: skyDancers, alt: 'Three dancers outdoors, sun and blue sky behind them.', span: 5, ratio: '4 / 5', tape: 'rose', sticker: '', tone: '' },
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
          <Reveal key={photo.src} className={`span-${photo.span}`} delay={Math.min(index, 5) * 40}>
            <button type="button" className="pinned" onClick={() => setOpen(index)}>
              {photo.tape ? <span className={`washi washi--${photo.tape}`} aria-hidden="true" /> : null}
              <span className="frame">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.ratio === '3 / 2' ? 1200 : 900}
                  height={photo.ratio === '3 / 2' ? 800 : photo.ratio === '1 / 1' ? 900 : 1120}
                  style={{ '--shot': photo.ratio } as CSSProperties}
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
