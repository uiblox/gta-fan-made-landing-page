import { useEffect, useRef } from 'react'
import gsap from 'gsap'
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

  return (
    <section className="hero" id="top">
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
