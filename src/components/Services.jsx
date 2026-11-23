import { useEffect, useRef } from 'react'
import { gsap, REDUCED, isMobile } from '../lib/scroll'
import { LINKS, SERVICES } from '../content'
import { PORTRAIT_PHONE, videoSources } from '../lib/media'
import Card from './Card'
import { attachScrubVideo } from '../lib/scrub-video'
import tallDesktop from '/assets/site/services/card-tall-desktop.avif'
import tallMobile from '/assets/site/services/card-tall-mobile.avif'
import shortArt from '/assets/site/services/card-short.avif'

const SRC = videoSources('services')
// The clip is 34 frames (1.42s). Spread over the whole scroll range each frame would hold for ~75px, so it plays over the first
// part of the range and holds its last frame after that (see AGENTS.md, scroll-scrubbed videos).
const CLIP_END = 0.6

// Services (live: Ultimate Edition). A pinned video backdrop scrubbed by scroll, with two service cards scrolling over it.
export default function Services() {
  const wrap = useRef(null)
  const stage = useRef(null)
  const video = useRef(null)
  const promo = useRef(null)
  const backdrop = useRef(null)
  const [tall, short] = SERVICES.cards

  useEffect(() => {
    if (REDUCED) return
    const v = video.current
    const mobile = isMobile()
    const portrait = window.matchMedia(PORTRAIT_PHONE).matches
    const scrub = attachScrubVideo(v, portrait ? SRC.portrait : SRC.landscape, CLIP_END)

    const ctx = gsap.context(() => {
      const def = { paused: true, defaults: { duration: 100, ease: 'none' } }
      // Pin the video wrapper until the cards reach the top; it slowly pushes in (1 -> 1.1).
      gsap.fromTo(stage.current, { scale: 1 }, { scale: 1.1, scrollTrigger: { scrub: true, pinSpacing: false, pin: wrap.current, trigger: wrap.current, start: 'top top', endTrigger: promo.current, end: 'top top' } })
      // Progress drives the video.
      gsap.timeline({ ...def, scrollTrigger: {
        scrub: true, trigger: wrap.current, start: 'top top+=25%', endTrigger: promo.current, end: 'top top', invalidateOnRefresh: true,
        onUpdate: ({ progress }) => scrub.set(progress),
      } })
      // Arrival: fade up from dark over one viewport.
      gsap.timeline({ ...def, scrollTrigger: { scrub: true, trigger: wrap.current, start: 'top top+=25%', end: '+=100%' } })
        .fromTo(wrap.current, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'power3.in' }, 0)
        .fromTo(wrap.current, { filter: 'brightness(0.2)' }, { filter: 'brightness(1)', ease: 'power1.in', duration: 61 }, 0)
      // Exit: dims and fades as the cards arrive.
      gsap.timeline({ ...def, scrollTrigger: { scrub: true, trigger: promo.current, start: mobile ? 'top bottom-=40%' : 'top bottom-=20%', end: 'top top' } })
        .to(wrap.current, { opacity: 0 }, 0)
        .fromTo(wrap.current, { filter: 'brightness(1)' }, { filter: 'brightness(.2)', duration: 20, immediateRender: false }, 80)
        .to(backdrop.current, { opacity: 0, duration: 20 }, 80)
    })
    return () => {
      ctx.revert()
      scrub.destroy()
    }
  }, [])

  return (
    <section className="services" id="services" aria-label="Services">
      <div className="services__wrap" ref={wrap}>
        <div className="services__stage" ref={stage} aria-hidden="true">
          <picture>
            <source media={PORTRAIT_PHONE} srcSet={SRC.posterPortrait} />
            <img className="services__poster" src={SRC.posterLandscape} alt="" />
          </picture>
          <video className="services__video" ref={video} muted playsInline preload="auto" tabIndex={-1} />
        </div>
      </div>

      <div className="services__promo" ref={promo}>
        <div className="services__backdrop" ref={backdrop} aria-hidden="true" />
        <Card variant="tall" href={LINKS[tall.link]} title={tall.title} text={tall.text} cta={tall.cta} icon="arrow" art={{ desktop: tallDesktop, mobile: tallMobile, pos: '50% 50%' }} />
        <Card variant="short" href={LINKS[short.link]} eyebrow={short.eyebrow} title={short.title} text={short.text} cta={short.cta} icon="arrow" art={{ desktop: shortArt, pos: '50% 10%' }} />
      </div>
    </section>
  )
}
