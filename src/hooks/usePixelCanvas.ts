/**
 * usePixelCanvas — spotlight pixel-hover effect for background images
 *
 * Unlike PixelCard (which pixelates the whole image), this hook draws a
 * circular "spotlight" of pixelation that follows the mouse cursor.
 * Everything outside the spotlight stays at full quality, creating a
 * subtle "magic lens" effect rather than a full-screen distortion.
 *
 * Usage:
 *   const { canvasRef, handlers } = usePixelCanvas(src, { maxPx: 10, radius: 220 })
 *   // Spread handlers onto whichever element you want to track mouse on:
 *   <section {...handlers}>
 *     <img src={src} />
 *     <canvas ref={canvasRef} className="pixel-canvas-overlay" />
 *   </section>
 *
 * The canvas must be positioned absolute/inset-0 over the image.
 * Mouse coordinates are computed relative to the canvas bounding rect.
 */

import { useRef, useEffect, useCallback } from 'react'

interface Options {
  /** Max pixel block size in the spotlight (default 10 — subtler than PixelCard's 18) */
  maxPx?: number
  /** Spotlight radius in CSS pixels (default 200) */
  radius?: number
  /** Lerp smoothing factor — lower = slower ease (default 0.1) */
  ease?: number
}

export function usePixelCanvas(src: string, { maxPx = 10, radius = 200, ease = 0.1 }: Options = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef    = useRef<HTMLImageElement | null>(null)
  const offRef    = useRef<HTMLCanvasElement | null>(null)   // scratch canvas for downsampling
  const rafRef    = useRef<number>(0)
  // All mutable animation state in a single ref — avoids stale closure issues
  const st = useRef({ px: 1, target: 1, mx: -999, my: -999, active: false })

  // One-time setup: offscreen canvas + RAF cleanup on unmount
  useEffect(() => {
    offRef.current = document.createElement('canvas')
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Load image into memory for canvas drawing
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      // Size the canvas to its rendered dimensions, then draw
      sync()
    }
    img.src = src
  }, [src]) // eslint-disable-line react-hooks/exhaustive-deps

  // Measure the canvas's rendered rect and set its internal resolution to match
  const sync = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    const r = c.getBoundingClientRect()
    if (r.width > 0 && r.height > 0) {
      c.width  = Math.round(r.width)
      c.height = Math.round(r.height)
      render()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Core render: full-quality base + pixelated spotlight on top
  const render = useCallback(() => {
    const c   = canvasRef.current
    const img = imgRef.current
    const off = offRef.current
    const s   = st.current
    if (!c || !img || !off) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const W = c.width
    const H = c.height
    if (!W || !H) return

    // ── 1. Draw full-quality image as the base ──────────────────────────────
    ctx.imageSmoothingEnabled      = true
    ctx.imageSmoothingQuality      = 'high'
    ctx.clearRect(0, 0, W, H)
    ctx.drawImage(img, 0, 0, W, H)

    // ── 2. If active, overlay pixelated spotlight around cursor ─────────────
    if (!s.active || s.px <= 1.3 || s.mx < 0) return

    const bw = Math.max(1, Math.round(W / s.px))
    const bh = Math.max(1, Math.round(H / s.px))
    off.width  = bw
    off.height = bh

    // Downsample onto offscreen canvas (smooth bilinear → tiny "pixel" grid)
    const oc = off.getContext('2d')!
    oc.imageSmoothingEnabled = true
    oc.drawImage(img, 0, 0, bw, bh)

    // Clip a circle at the cursor, then draw the pixelated version inside it.
    // nearest-neighbor upscale = chunky pixel blocks — visible only in the circle.
    ctx.save()
    ctx.beginPath()
    ctx.arc(s.mx, s.my, radius, 0, Math.PI * 2)
    ctx.clip()
    ctx.imageSmoothingEnabled = false   // ← nearest-neighbor = pixel blocks
    ctx.drawImage(off, 0, 0, W, H)
    ctx.restore()
  }, [radius])

  // Animation loop — lerps pixelSize toward target, then keeps running while
  // the section is hovered so the spotlight tracks cursor movement every frame
  const loop = useCallback(() => {
    const s = st.current
    const d = s.target - s.px
    if (Math.abs(d) >= 0.05) s.px += d * ease
    render()
    // Keep running while hovered to track cursor; stop when inactive + settled
    if (s.active || Math.abs(d) >= 0.05) {
      rafRef.current = requestAnimationFrame(loop)
    }
  }, [render, ease])

  const startAnim = useCallback((target: number) => {
    st.current.target = target
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(loop)
  }, [loop])

  // Resize observer keeps canvas sized correctly on layout changes
  useEffect(() => {
    const ro = new ResizeObserver(sync)
    if (canvasRef.current) ro.observe(canvasRef.current)
    return () => ro.disconnect()
  }, [sync])

  // ── Event handlers — spread onto the section/container element ─────────────
  const handlers = {
    onMouseEnter: () => {
      st.current.active = true
      startAnim(maxPx)
    },
    onMouseLeave: () => {
      st.current.active = false
      st.current.mx     = -999
      startAnim(1)
    },
    onMouseMove: (e: React.MouseEvent) => {
      const c = canvasRef.current
      if (!c) return
      const r    = c.getBoundingClientRect()
      st.current.mx = e.clientX - r.left
      st.current.my = e.clientY - r.top
      // No need to call render() — the RAF loop running while active handles it
    },
  }

  return { canvasRef, handlers }
}
