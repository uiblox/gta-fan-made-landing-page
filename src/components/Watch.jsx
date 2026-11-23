import { useEffect, useRef } from 'react'
import { gsap, REDUCED } from '../lib/scroll'
import { LINKS, WATCH } from '../content'
import Card, { PlayIcon } from './Card'
import scene from '/assets/site/meet-the-developer/scene.avif'
import featuredDesktop from '/assets/site/meet-the-developer/featured-desktop.avif'
import featuredMobile from '/assets/site/meet-the-developer/featured-mobile.avif'
import card1 from '/assets/site/meet-the-developer/card-1.avif'
import card2 from '/assets/site/meet-the-developer/card-2.avif'
import card3 from '/assets/site/meet-the-developer/card-3.avif'

const PROJECT_ART = [card1, card2, card3]

// Meet the Developer (live: Launch Trailer). A pinned scene fades up from dark, then the cards scroll over it.
export default function Watch() {
  const sceneEl = useRef(null)
  const bgWrap = useRef(null)
  const bg = useRef(null)
  const content = useRef(null)
  const text = useRef(null)
  const play = useRef(null)
  const cards = useRef(null)

  useEffect(() => {
    if (REDUCED) return
    const ctx = gsap.context(() => {
      const def = { paused: true, defaults: { duration: 100, ease: 'none' } }
      // Pinned from the scene's top until the cards reach the top; the art settles from 1.2 to 1 while the content shrinks to .9.
      gsap.timeline({ ...def, scrollTrigger: { scrub: true, pinSpacing: false, pin: sceneEl.current, trigger: sceneEl.current, start: 'top top', endTrigger: cards.current, end: 'top top' } })
        .fromTo(bg.current, { scale: 1.2 }, { scale: 1 }, 0)
        .fromTo(content.current, { scale: 1.05 }, { scale: 0.9 }, 0)
      // Arrival: the art fades up from dark over one viewport of scroll, then the text, then the play button.
      gsap.timeline({ ...def, scrollTrigger: { scrub: true, trigger: sceneEl.current, start: 'top top', end: '+=100%' } })
        .fromTo(bgWrap.current, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'power3.in' }, 0)
        .fromTo(bgWrap.current, { filter: 'brightness(0.2)' }, { filter: 'brightness(1)', ease: 'power1.in', duration: 61 }, 0)
        .fromTo(play.current, { opacity: 0, pointerEvents: 'none' }, { opacity: 1, pointerEvents: 'all', duration: 40, ease: 'sine.in' }, 70)
        .fromTo(text.current, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'power3.in', duration: 70 }, 30)
      // Exit: as the cards slide up over it, everything fades out.
      gsap.timeline({ ...def, scrollTrigger: { scrub: true, trigger: cards.current, start: 'top bottom', end: 'top top' } })
        .to(play.current, { opacity: 0, pointerEvents: 'none', duration: 60, ease: 'sine.out' }, 10)
        .to(bgWrap.current, { autoAlpha: 0, duration: 80 }, 0)
        .to(text.current, { opacity: 0 }, 0)
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="watch" id="meet-the-developer" aria-labelledby="watch-title">
      <div className="watch__scene" ref={sceneEl}>
        <div className="watch__bgwrap" ref={bgWrap}>
          <picture className="watch__bg" ref={bg}>
            <img src={scene} alt="" />
          </picture>
        </div>
        <div className="watch__content" ref={content}>
          <div className="watch__text" ref={text}>
            <p className="watch__eyebrow">{WATCH.eyebrow}</p>
            <h2 className="watch__title" id="watch-title">{WATCH.title}</h2>
          </div>
          <a className="watch__play" ref={play} href={LINKS.watch} aria-label={WATCH.playLabel}>
            <PlayIcon />
          </a>
        </div>
      </div>

      <div className="watch__cards" ref={cards}>
        <Card
          variant="wide"
          href={LINKS.featured}
          eyebrow={WATCH.featured.eyebrow}
          title={WATCH.featured.title}
          cta={WATCH.featured.cta}
          art={{ desktop: featuredDesktop, mobile: featuredMobile, pos: '50% 30%' }}
        />
        <div className="rail">
          {WATCH.projects.map((p, i) => (
            <div className="rail__col" key={p.title}>
              <Card variant="project" href={LINKS[p.link]} eyebrow={p.eyebrow} title={p.title} art={{ desktop: PROJECT_ART[i], pos: '50% 0%' }} centerPlay />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
