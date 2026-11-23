// Page-level scrolling: GSAP ScrollTrigger plus Lenis smooth scroll, set up like the live site
// (Lenis lerp 0.07, wheelMultiplier 1.2, not on touch devices; ScrollTrigger ignores mobile resize).
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

export const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches
// Same breakpoint as the live site's "mobile".
export const MOBILE_QUERY = '(max-width: 767.98px)'
export const isMobile = () => window.matchMedia(MOBILE_QUERY).matches

let lenis = null
let locked = false

export function startSmoothScroll() {
  if (lenis || REDUCED || ScrollTrigger.isTouch === 1) return
  lenis = new Lenis({ lerp: 0.07, wheelMultiplier: 1.2 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  if (locked) lenis.stop()
}

// The page can't be scrolled while the loader and intro play (live: "enable-scroll" after the intro).
const block = (e) => e.preventDefault()
const blockKeys = (e) => {
  if ([' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) e.preventDefault()
}
export function lockScroll() {
  if (locked) return
  locked = true
  window.addEventListener('wheel', block, { passive: false })
  window.addEventListener('touchmove', block, { passive: false })
  window.addEventListener('keydown', blockKeys)
  lenis?.stop()
}
export function unlockScroll() {
  if (!locked) return
  locked = false
  window.removeEventListener('wheel', block)
  window.removeEventListener('touchmove', block)
  window.removeEventListener('keydown', blockKeys)
  lenis?.start()
}

export { gsap, ScrollTrigger }
