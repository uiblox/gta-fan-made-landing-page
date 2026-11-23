import gsap from 'gsap'
import { heroFile } from './hero-assets'

// Hero intro, ported from the live site's canvas timeline (rockstargames.com/VI, chunk with "fob timeline").
// Every layer is a full-canvas image flown in along z with a perspective of 5000; nothing moves in x or y.
const BG = '#0C0D1B'
const TOTAL = 2.6
// Playback speed. 1 = the live site's pace (4.1s). 0.85 plays it in about 4.9s.
export const INTRO_SPEED = 0.85
const SHARD_FADE = 0.5571428571428572

// Paint order = array order. file = our shard number; z = start depth; rd = reveal delay (seconds).
const DESKTOP = [
  { file: 'shard-02', z: -4314, rd: 0.4642857142857143 },
  { file: 'shard-01', z: -5337, rd: 0.5571428571428572 },
  { file: 'shard-05', z: -6533, rd: 0.65 },
  { file: 'shard-06', z: -7760, rd: 0.7428571428571429 },
  { file: 'shard-03', z: -9177, rd: 0.8357142857142859 },
  { file: 'shard-07', z: -9440, rd: 0.9285714285714286 },
  { file: 'shard-09', z: -19197, rd: 1.0214285714285714 },
  { file: 'shard-04', z: -15243, rd: 1.1142857142857143 },
  { file: 'shard-08', z: -16634, rd: 1.2071428571428573 },
]
// The square collage's centre piece is shard-06, so its pieces are numbered differently.
const MOBILE = [
  { file: 'shard-02', z: -4314, rd: 0.4642857142857143 },
  { file: 'shard-08', z: -5486, rd: 0.5571428571428572 },
  { file: 'shard-05', z: -6533, rd: 0.65 },
  { file: 'shard-09', z: -7759, rd: 0.7428571428571429 },
  { file: 'shard-10', z: -8923, rd: 0.8357142857142859 },
  { file: 'shard-01', z: -10080, rd: 0.9285714285714286 },
  { file: 'shard-04', z: -11246, rd: 1.0214285714285714 },
  { file: 'shard-07', z: -12331, rd: 1.1142857142857143 },
  { file: 'shard-03', z: -13335, rd: 1.2071428571428573 },
]

const newLayer = (index, z, alpha) => ({
  index, z: 0, startZ: z, alpha, reveal: 0, mask: 1, maskSoftness: 200,
  shadowOpacity: 0, shadowBlur: 0,
})

/** Layer list in paint order, with the file each one draws. */
export function introLayers(set) {
  const pieces = set === 'mobile' ? MOBILE : DESKTOP
  const hole = set === 'mobile' ? 'shard-06' : 'shard-10'
  return [
    // backdrop: the final poster (purple gutters and frame), faded in as the pieces land so the swap to the real poster is seamless
    { name: 'poster', file: 'poster', z: 0, kind: 'poster' },
    ...pieces.map((p) => ({ ...p, name: p.file, kind: 'shard' })),
    { name: hole, file: hole, z: -13435, kind: 'hole' },
    { name: 'logo-vi', file: 'logo-vi', z: -13435, kind: 'vi' },
    { name: 'logo-gta', file: 'logo-gta', z: -15853, kind: 'gta' },
  ].map((l) => ({ ...l, url: heroFile(set, l.file) }))
}

/**
 * Prepares every layer (heavy, done while the loader is up) and builds the paused timeline.
 * Preparation: each image is downscaled once to about the size it is drawn at, cropped to its visible box, and its
 * bg-coloured silhouette (reveal) and tinted copy (glow) are pre-rendered. A frame is then only a handful of small draws.
 * @param {{canvas: HTMLCanvasElement, box: HTMLElement, layers: ReturnType<typeof introLayers>, images: HTMLImageElement[], ultrawide?: boolean, onComplete?: () => void}} o
 */
export function createIntro({ canvas, box, layers: defs, images, ultrawide = false, onComplete }) {
  const ctx = canvas.getContext('2d')
  // every layer is drawn at the shard size, whatever its own pixel size (the mobile poster is smaller)
  const ref = images[defs.findIndex((d) => d.kind !== 'poster')]
  const [nw, nh] = [ref.naturalWidth, ref.naturalHeight]
  const [hw, hh] = [Math.round(-nw / 2), Math.round(-nh / 2)]

  let camera = 1
  let [cw, ch] = [0, 0]
  const measure = () => {
    const dpr = window.devicePixelRatio || 1
    const r = box.getBoundingClientRect()
    cw = canvas.clientWidth
    ch = canvas.clientHeight
    canvas.width = Math.round(cw * dpr)
    canvas.height = Math.round(ch * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.imageSmoothingQuality = 'low' // sources are pre-scaled, so cheap bilinear is enough per frame (resizing resets it)
    camera = Math.max(r.width / nw, r.height / nh) // cover, same as the poster that replaces the canvas
    return dpr
  }
  const dpr = measure()

  // ---- preparation -------------------------------------------------------------------------------------------
  const pre = Math.min(1, camera * dpr * 1.5) // pre-scale factor: a little above the final on-screen size
  const mk = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h })
  const prepared = defs.map((d, i) => {
    const [sw, sh] = [Math.round(nw * pre), Math.round(nh * pre)]
    const full = mk(sw, sh)
    const fx = full.getContext('2d')
    fx.imageSmoothingQuality = 'high'
    fx.drawImage(images[i], 0, 0, sw, sh)
    // visible box
    let [x0, y0, x1, y1] = [sw, sh, -1, -1]
    if (d.kind === 'poster') [x0, y0, x1, y1] = [0, 0, sw - 1, sh - 1]
    else {
      const px = fx.getImageData(0, 0, sw, sh).data
      for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) if (px[(y * sw + x) * 4 + 3] > 0) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y }
    }
    const bx = Math.max(0, x0 - 1), by = Math.max(0, y0 - 1)
    const bw = Math.min(sw, x1 + 2) - bx, bh = Math.min(sh, y1 + 2) - by
    const crop = mk(bw, bh)
    crop.getContext('2d').drawImage(full, bx, by, bw, bh, 0, 0, bw, bh)
    const tinted = (color) => {
      const c = mk(bw, bh), x = c.getContext('2d')
      x.drawImage(crop, 0, 0)
      x.globalCompositeOperation = 'source-in'
      x.fillStyle = color
      x.fillRect(0, 0, bw, bh)
      return c
    }
    return {
      crop, bx, by, bw, bh, sh,
      silhouette: d.kind === 'shard' ? tinted(BG) : null, // reveal overlay
      glow: d.kind === 'vi' ? tinted('#FFACFD') : d.kind === 'gta' ? tinted('#FFD398') : null,
      wipe: d.kind === 'gta' ? mk(bw, bh) : null, // scratch canvas for the top-down wipe
    }
  })

  const layers = defs.map((d, i) => newLayer(i, d.z, d.kind === 'gta' ? 1 : 0))
  const shards = layers.filter((_, i) => defs[i].kind === 'shard')
  const poster = layers[defs.findIndex((d) => d.kind === 'poster')]
  const hole = layers[defs.findIndex((d) => d.kind === 'hole')]
  const vi = layers[defs.findIndex((d) => d.kind === 'vi')]
  const gta = layers[defs.findIndex((d) => d.kind === 'gta')]

  // ---- drawing -----------------------------------------------------------------------------------------------
  const draw = () => {
    ctx.clearRect(0, 0, cw, ch)
    ctx.save()
    ctx.translate(cw / 2, ch / 2)
    ctx.scale(camera, camera)
    for (const L of layers) {
      if (L.alpha <= 0) continue
      const P = prepared[L.index]
      const m = Math.max(0, Math.min(1, L.mask))
      const p = 5000 / (5000 + Math.max(L.z, -4999))
      // destination of the cropped box, in image space (the canvas origin is the image centre)
      const [dx, dy, dw, dh] = [hw + P.bx / pre, hh + P.by / pre, P.bw / pre, P.bh / pre]
      ctx.save()
      ctx.globalAlpha = L.alpha
      if (p !== 1) ctx.scale(p, p)
      if (L.shadowOpacity > 0 && P.glow) {
        ctx.save()
        ctx.globalAlpha = L.shadowOpacity
        ctx.filter = L.shadowBlur > 0 ? `blur(${L.shadowBlur}px)` : 'none'
        ctx.drawImage(P.glow, dx, dy, dw, dh)
        ctx.restore()
      }
      if (m >= 1) {
        ctx.drawImage(P.crop, dx, dy, dw, dh)
      } else if (m > 0) {
        // top-down wipe with a soft lower edge, composited in a small scratch canvas
        const a = Math.round(P.sh * m)
        const soft = Math.min(Math.round(L.maskSoftness * pre), a, 0.5 * P.sh)
        const rel = a - P.by
        if (rel > 0) {
          const x = P.wipe.getContext('2d')
          x.clearRect(0, 0, P.bw, P.bh)
          x.drawImage(P.crop, 0, 0)
          x.clearRect(0, rel, P.bw, P.bh - rel)
          if (soft > 0) {
            const g = x.createLinearGradient(0, -P.by, 0, rel)
            g.addColorStop(0, 'rgba(255,255,255,1)')
            g.addColorStop((a - soft) / a, 'rgba(255,255,255,1)')
            g.addColorStop(1, 'rgba(255,255,255,0)')
            x.save()
            x.globalCompositeOperation = 'destination-in'
            x.fillStyle = g
            x.fillRect(0, 0, P.bw, Math.min(rel, P.bh))
            x.restore()
          }
          ctx.drawImage(P.wipe, dx, dy, dw, dh)
        }
      }
      if (L.reveal > 0 && P.silhouette && m > 0) {
        ctx.globalAlpha = L.alpha * L.reveal
        ctx.drawImage(P.silhouette, dx, dy, dw, dh)
      }
      ctx.restore()
    }
    ctx.restore()
  }

  // ---- timeline ----------------------------------------------------------------------------------------------
  const tl = gsap.timeline({ paused: true, defaults: { duration: TOTAL, ease: 'power3.inOut' }, onUpdate: draw, onComplete })
  layers.forEach((L) => tl.from(L, { z: L.startZ }, 0))
  // pieces appear at half alpha, hidden under a bg-coloured silhouette that is revealed piece by piece
  defs.forEach((d, i) => {
    if (d.kind !== 'shard') return
    tl.set(layers[i], { alpha: 0.5 }, SHARD_FADE)
    tl.from(layers[i], { reveal: 1, ease: 'power3.inOut', duration: TOTAL - d.rd }, d.rd)
  })
  tl.to(vi, { alpha: 1, duration: 0.5571428571428572, ease: 'none' }, 1.6714285714285717)
  tl.fromTo(vi, { shadowOpacity: 0, shadowBlur: 18 }, { shadowOpacity: 1, shadowBlur: 108, duration: 0.9285714285714284, ease: 'none' }, 2.0428571428571427)
  tl.from(gta, { mask: 0, duration: ultrawide ? 1.4857142857142858 : 2.1357142857142857, ease: 'power1.out' }, 1.6714285714285717)
  tl.fromTo(gta, { shadowOpacity: 0, shadowBlur: 15 }, { shadowOpacity: 1, duration: 0.5571428571428572, ease: 'none' }, 2.4699999999999998)
  tl.to(hole, { alpha: 1, duration: 0.4642857142857143, ease: 'sine.inOut' }, 2.4142857142857146)
  tl.to([vi, gta], { shadowOpacity: 0, duration: 1.1142857142857143, ease: 'power2.in' }, 3.0271428571428567)
  tl.addLabel('afterShardsLand', 2.6)
  tl.to(shards, { alpha: 1, duration: 1.1142857142857143, ease: 'sine.inOut' }, 'afterShardsLand')
  tl.to(poster, { alpha: 1, duration: 1.1142857142857143, ease: 'sine.inOut' }, 'afterShardsLand')
  tl.timeScale(INTRO_SPEED)

  const onResize = () => { measure(); draw() }
  window.addEventListener('resize', onResize)

  /** Draws representative frames once so textures are uploaded and paths compiled before the first visible frame. */
  const warm = () => {
    for (const t of [0.9, 1.6, 2.2, 2.9, 3.6]) tl.time(t, false)
    tl.time(0, false)
  }
  const kill = () => { window.removeEventListener('resize', onResize); tl.kill() }
  return { tl, draw, warm, kill }
}
