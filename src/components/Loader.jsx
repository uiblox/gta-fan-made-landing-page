import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import logo from '/assets/brand/loader-logo.svg'
import { LOADER } from '../content'

// Full-screen loading screen. `out` starts the fade; the intro is already playing behind it by then.
export default function Loader({ out }) {
  const root = useRef(null)

  useEffect(() => {
    const el = root.current
    if (!out || !el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.display = 'none'
      return
    }
    const tween = gsap.to(el, { opacity: 0, duration: 0.5, ease: 'power1.inOut', onComplete: () => { el.style.display = 'none' } })
    return () => tween.kill()
  }, [out])

  return (
    <div className="loader" ref={root} role="status" aria-label={LOADER.label} style={{ '--logo': `url(${logo})` }}>
      <div className="loader__logo" aria-hidden="true">
        <div className="loader__under">
          <span />
        </div>
        <div className="loader__mask" />
      </div>
    </div>
  )
}
