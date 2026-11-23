import { useEffect, useRef } from 'react'
import { gsap, REDUCED } from '../lib/scroll'
import { PORTRAIT_PHONE } from '../lib/media'

export const PlayIcon = () => (
  <svg viewBox="0 0 10 12" aria-hidden="true" focusable="false"><path d="M1 .9v10.2a.5.5 0 0 0 .77.42l8-5.1a.5.5 0 0 0 0-.84l-8-5.1A.5.5 0 0 0 1 .9Z" fill="currentColor" /></svg>
)
export const ArrowIcon = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M1 6h9.2M6.4 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
)

// Live headline sizes by title length (getHeadlineSize): over 23 characters the headline steps down.
const headlineTier = (len) => (len > 40 ? 5 : len > 30 ? 4 : len > 23 ? 3 : len > 13 ? 2 : 1)

// One card of the Meet the Developer / Services sections.
// variant: wide | project | tall | short. art: { desktop, mobile?, pos? }. The card is a link; the button inside is part of it.
export default function Card({ variant, href, eyebrow, title, text, cta, icon = 'play', art, centerPlay = false, className = '' }) {
  const root = useRef(null)
  const titleText = Array.isArray(title) ? title.join(' ') : title

  // Live card motion: scale .985 -> 1 over the first half of its pass through the viewport; the art drifts with the pointer.
  useEffect(() => {
    const el = root.current
    if (!el || REDUCED) return
    const pic = el.querySelector('picture')
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
      tl.fromTo(el, { scale: 0.985 }, { scale: 1, duration: 50 }, 0).to(el, { scale: 1, duration: 50 }, 50)
    }, el)
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const x = gsap.quickTo(pic, 'xPercent', { duration: 0.3, ease: 'none' })
    const y = gsap.quickTo(pic, 'yPercent', { duration: 0.3, ease: 'none' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      x(-gsap.utils.clamp(-1, 1, ((e.clientX - r.left) / r.width - 0.5) * 2) * 1.8)
      y(-gsap.utils.clamp(-1, 1, ((e.clientY - r.top) / r.height - 0.5) * 2) * 1.2)
    }
    const leave = () => { x(0); y(0) }
    if (fine) {
      el.addEventListener('pointermove', move, { passive: true })
      el.addEventListener('pointerleave', leave, { passive: true })
    }
    return () => {
      ctx.revert()
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <a ref={root} className={`card card--${variant} ${className}`} href={href}>
      <picture>
        {art.mobile && <source media={PORTRAIT_PHONE} srcSet={art.mobile} />}
        <img src={art.desktop} alt="" loading="lazy" style={art.pos ? { objectPosition: art.pos } : undefined} />
      </picture>
      {centerPlay && (
        <span className="card__play" aria-hidden="true"><PlayIcon /></span>
      )}
      <div className="card__text">
        {eyebrow && <p className="card__eyebrow">{eyebrow}</p>}
        <h3 className="card__title" data-tier={headlineTier(titleText.length)}>
          {Array.isArray(title) ? title.map((line, i) => <span key={line}>{line}{i < title.length - 1 && <br />}</span>) : title}
        </h3>
        {text && <p className="card__copy">{text}</p>}
        {cta && (
          <span className="card__btn">
            {icon === 'play' ? <PlayIcon /> : null}
            {cta}
            {icon === 'arrow' ? <ArrowIcon /> : null}
          </span>
        )}
      </div>
    </a>
  )
}
