/**
 * PixelCard — Awwwards-level hover interaction
 *
 * How the pixel effect works:
 *  1. A hidden <canvas> sits on top of the base <img>.
 *  2. On hover, the canvas fades in while we simultaneously draw
 *     the image at a tiny downsampled resolution (e.g., 480÷18 = 26px wide)
 *     then stretch it back to full size with imageSmoothingEnabled=false —
 *     giving us big, chunky pixel blocks.
 *  3. An easing loop (lerp) smoothly animates the block size 1 → MAX_PX.
 *  4. A separate offscreen canvas prevents the self-read artifact that
 *     would occur if we tried to read from the main canvas while writing to it.
 *  5. 3D perspective tilt (CSS transform) tracks mouse X/Y within the card.
 *  6. Framer Motion staggers the text overlay lines in/out.
 */

import { useRef, useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PORTFOLIO_PIXEL_MAX_PX } from '../constants/pixelHover'
import './PixelCard.css'

export interface PixelCardProps {
  src: string
  alt: string
  title: string
  desc?: string
  /** Internal route — renders a <Link> */
  to: string
  /** Display number e.g. "01" */
  num?: string
  /** Controls the CSS aspect-ratio class */
  aspect?: 'portrait' | 'landscape' | 'square'
}

/** Maximum pixel-block size reached at peak of hover (shared with about `usePixelCanvas`) */
const MAX_PX = PORTFOLIO_PIXEL_MAX_PX
/** Lerp factor — lower = slower/smoother ease */
const EASE = 0.14

export default function PixelCard({ src, alt, title, desc, to, num, aspect = 'portrait' }: PixelCardProps) {
  const cardRef    = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const imgRef     = useRef<HTMLImageElement | null>(null)
  const offRef     = useRef<HTMLCanvasElement | null>(null) // offscreen scratch canvas
  const rafRef     = useRef<number>(0)
  const stRef      = useRef({ px: 1, target: 1 })           // animation state (no re-render)
  const [hovered, setHovered] = useState(false)

  // Create the persistent offscreen canvas once; cancel RAF on unmount
  useEffect(() => {
    offRef.current = document.createElement('canvas')
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Load the image into memory for canvas drawing
  useEffect(() => {
    const img = new Image()
    img.onload = () => { imgRef.current = img }
    img.src = src
  }, [src])

  // ─── Core draw routine ──────────────────────────────────────────────────────
  const draw = useCallback((ps: number) => {
    const c   = canvasRef.current
    const img = imgRef.current
    const off = offRef.current
    if (!c || !img || !off) return
    const ctx = c.getContext('2d')
    if (!ctx) return

    const W = c.width
    const H = c.height

    if (ps <= 1.5) {
      // Full resolution pass
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(img, 0, 0, W, H)
      return
    }

    // Pixelation: shrink onto offscreen canvas, then stretch back (nearest-neighbor)
    const bw = Math.max(1, Math.round(W / ps))
    const bh = Math.max(1, Math.round(H / ps))
    off.width  = bw
    off.height = bh

    const oc = off.getContext('2d')!
    oc.imageSmoothingEnabled = true
    oc.drawImage(img, 0, 0, bw, bh)      // ← shrink to "pixel" resolution

    ctx.imageSmoothingEnabled = false     // ← nearest-neighbor: no interpolation = chunky blocks
    ctx.clearRect(0, 0, W, H)
    ctx.drawImage(off, 0, 0, W, H)       // ← stretch tiny version back to full size
  }, [])

  // ─── Animation loop (lerp pixelSize toward target) ─────────────────────────
  const loop = useCallback(() => {
    const s = stRef.current
    const delta = s.target - s.px
    if (Math.abs(delta) < 0.05) {
      s.px = s.target
      draw(s.px)
      return
    }
    s.px += delta * EASE
    draw(s.px)
    rafRef.current = requestAnimationFrame(loop)
  }, [draw])

  const animateTo = useCallback((target: number) => {
    stRef.current.target = target
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(loop)
  }, [loop])

  // ─── Mouse events ───────────────────────────────────────────────────────────
  const onEnter = () => {
    setHovered(true)
    animateTo(MAX_PX)
  }

  const onLeave = () => {
    setHovered(false)
    animateTo(1)
    const el = cardRef.current
    if (el) {
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)'
      el.style.transition = 'transform 0.65s cubic-bezier(0.23, 1, 0.32, 1)'
    }
  }

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    // Normalise mouse position to [-0.5, 0.5] within the card
    const x = (e.clientX - r.left)  / r.width  - 0.5
    const y = (e.clientY - r.top)   / r.height - 0.5
    el.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale(1.025)`
    el.style.transition = 'transform 0.08s ease-out'
  }

  // ─── Framer Motion variants for staggered text reveal ──────────────────────
  // easeOutQuart as an explicit function (FM v12 strict TS — no raw number[] ease)
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 4)

  const wrapV = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
    exit:   { transition: { staggerChildren: 0.03, staggerDirection: -1 as const } },
  }
  const lineV = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.42, ease: easeOut } },
    exit:   { opacity: 0, y: 10, filter: 'blur(2px)', transition: { duration: 0.18 } },
  }

  return (
    <div
      ref={cardRef}
      className={`pxcard pxcard--${aspect}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <Link to={to} className="pxcard__link">
        {/* Base image — always visible; canvas overlays on hover */}
        <img src={src} alt={alt} className="pxcard__img" />

        {/* Canvas fades in on hover and renders the pixelated version */}
        <canvas
          ref={canvasRef}
          width={480}
          height={600}
          className={`pxcard__canvas${hovered ? ' pxcard__canvas--on' : ''}`}
        />

        {/* Gradient darkens the image on hover to make text legible */}
        <div className={`pxcard__grad${hovered ? ' pxcard__grad--on' : ''}`} />

        {/* Staggered text overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="pxcard__text"
              variants={wrapV}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {num && (
                <motion.span className="pxcard__num" variants={lineV}>
                  {num}
                </motion.span>
              )}
              <motion.h3 className="pxcard__title" variants={lineV}>
                {title}
              </motion.h3>
              {desc && (
                <motion.p className="pxcard__desc" variants={lineV}>
                  {desc}
                </motion.p>
              )}
              <motion.span className="pxcard__cta" variants={lineV}>
                view gallery →
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </div>
  )
}
