import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { REDUCED as REDUCED_MOTION, isMobile } from '../lib/scroll'
import { HERO, LINKS, SITE } from '../content'
import { artSet, loadImage } from '../lib/hero-assets'
import { createIntro, introLayers } from '../lib/intro'
import posterDesktop from '/assets/site/hero/desktop/poster.avif'
import logoDesktop from '/assets/site/hero/desktop/poster-logo.avif'
import posterMobile from '/assets/site/hero/mobile/poster.avif'
import logoMobile from '/assets/site/hero/mobile/poster-logo.avif'

// Square art for portrait viewports, 16:9 art otherwise. Same breakpoint as the CSS aspect-ratio.
const PORTRAIT = '(max-aspect-ratio: 1/1)'

export default function Hero({ phase, enabled, onPrepared, onDone }) {
  const root = useRef(null)
  const canvas = useRef(null)
  const art = useRef(null)
  const intro = useRef(null)

  // While the loader is up: load the layers, pre-render everything the intro needs and warm the canvas up (lib/intro.js).
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    const defs = introLayers(artSet())
    Promise.all(defs.map((d) => loadImage(d.url)))
      .then((images) => {
        if (cancelled) return
        const i = createIntro({
          canvas: canvas.current,
          box: art.current,
          layers: defs,
          images,
          ultrawide: window.matchMedia('(min-aspect-ratio: 2.25/1)').matches,
          // The canvas is resampled differently from the <img> poster (edge pixels differ slightly), so hand over with a short crossfade.
          onComplete: () => gsap.to(art.current.querySelectorAll('picture'), { opacity: 1, duration: 0.25, ease: 'none', onComplete: onDone }),
        })
        i.tl.to('[data-intro-ui]', { opacity: 1, duration: 0.8, ease: 'sine.inOut' }, 2.8)
        i.warm()
        intro.current = i
        window.__intro = i.tl // lets tools/intro-sheet.mjs step the timeline
      })
      .catch(() => {}) // no intro is better than a stuck loader: App plays nothing and shows the poster
      .finally(() => !cancelled && onPrepared())
    return () => {
      cancelled = true
      intro.current?.kill()
      intro.current = null
    }
  }, [enabled, onPrepared, onDone])

  useEffect(() => {
    if (phase !== 'playing') return
    if (!intro.current) onDone()
    else if (!window.__introHold) intro.current.tl.play() // tools set __introHold to step the timeline by hand
  }, [phase, onDone])

  // Scroll exit (live: pinned hero, pinSpacing off, scrubbed over one viewport). Created once the intro has finished, so it never
  // fights the intro's own opacity tweens. Timeline is 180 units long: the logo fades last.
  useEffect(() => {
    if (phase !== 'done' || REDUCED_MOTION) return
    const el = root.current
    const ctx = gsap.context(() => {
      const mobile = isMobile()
      const tl = gsap.timeline({
        defaults: { duration: 100, ease: 'none' },
        scrollTrigger: { trigger: el, pin: true, pinSpacing: false, start: 'top top', end: 'bottom top', scrub: true, refreshPriority: 3 },
      })
      tl.fromTo('.hero__chevron', { autoAlpha: 1 }, { autoAlpha: 0, duration: 40, ease: 'circ.out' }, 0)
      tl.fromTo(el, { scale: 1 }, { scale: mobile ? 0.85 : 0.9 }, 0)
      tl.fromTo('.hero__tagline, .hero__cta, .hero__tags, .hero__fan, .hero__art picture:first-of-type', { autoAlpha: 1 }, { autoAlpha: 0, duration: 70, ease: 'power3.out' }, 50)
      tl.fromTo(el, { pointerEvents: 'auto' }, { pointerEvents: 'none', duration: 0 }, 50)
      tl.fromTo('.hero__art picture:nth-of-type(2)', { autoAlpha: 1 }, { autoAlpha: 0, duration: 130, ease: 'power3.out' }, 50)
    }, el)
    return () => ctx.revert()
  }, [phase])

  return (
    <section className="hero" id="top" ref={root}>
      <h1 className="sr-only">{HERO.logoAlt}</h1>
      <div className="hero__frame">
        <div className="hero__inner">
          <div className="hero__art" ref={art}>
            <picture>
              <source media={PORTRAIT} srcSet={posterMobile} />
              <img src={posterDesktop} alt="" />
            </picture>
            <picture>
              <source media={PORTRAIT} srcSet={logoMobile} />
              <img src={logoDesktop} alt="" />
            </picture>
            <canvas className="hero__canvas" ref={canvas} aria-hidden="true" />
          </div>

          <div className="hero__tagline" data-intro-ui>
            <p className="hero__tagline-main">{HERO.tagline[0]}</p>
            <p className="hero__tagline-sub">{HERO.tagline[1]}</p>
          </div>

          <a className="hero__cta" href={LINKS.hire} data-intro-ui>
            {HERO.cta}
          </a>

          <ul className="hero__tags" data-intro-ui>
            {HERO.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="hero__fan" data-intro-ui>{SITE.disclaimer}</p>
      <span className="sr-only">{HERO.scrollLabel}</span>
      <svg className="hero__chevron" data-intro-ui width="34" height="14" viewBox="0 0 34 14" fill="none" aria-hidden="true" focusable="false">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="currentColor"
          d="M33.5609 1.54346C34.0381 2.5875 33.6881 3.87821 32.7791 4.42633L17.0387 13.9181L1.48663 4.42115C0.580153 3.86761 0.235986 2.57483 0.717909 1.53365C1.19983 0.492464 2.32535 0.097152 3.23182 0.650692L17.0497 9.08858L31.051 0.64551C31.96 0.0973872 33.0837 0.499411 33.5609 1.54346Z"
        />
      </svg>
    </section>
  )
}
