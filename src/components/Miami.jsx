import { useEffect, useRef } from 'react'
import { gsap, REDUCED, isMobile } from '../lib/scroll'
import { MIAMI } from '../content'
import { PORTRAIT_PHONE, videoSources } from '../lib/media'
import { attachScrubVideo } from '../lib/scrub-video'

const SRC = videoSources('city')

// Miami, USA. (live: Vice City, USA.). The city video is pinned and scrubbed over 350svh of scroll; the bio scrolls up over it
// in gradient-filled text whose colours move from dusk to day to night. The video fades out under a growing mask as the text arrives.
export default function Miami() {
  const root = useRef(null)
  const stage = useRef(null)
  const scene = useRef(null)
  const video = useRef(null)
  const text = useRef(null)

  useEffect(() => {
    if (REDUCED) return
    const mobile = isMobile()
    const portrait = window.matchMedia(PORTRAIT_PHONE).matches
    const scrub = attachScrubVideo(video.current, portrait ? SRC.portrait : SRC.landscape)
    const ctx = gsap.context(() => {
      const def = { paused: true, defaults: { duration: 100, ease: 'none' } }
      // Pin the stage until the text reaches the top; slow push-in.
      gsap.fromTo(scene.current, { scale: 1 }, { scale: 1.1, scrollTrigger: { scrub: true, pinSpacing: false, pin: stage.current, trigger: stage.current, start: 'top top', endTrigger: text.current, end: 'top top' } })
      // Whole range drives the video (149 frames over ~3000px: about 20px a frame).
      gsap.timeline({ ...def, scrollTrigger: {
        scrub: true, trigger: root.current, start: 'top top', endTrigger: text.current, end: 'top top', invalidateOnRefresh: true,
        onUpdate: ({ progress }) => scrub.set(progress),
      } })
      gsap.timeline({ ...def, scrollTrigger: { scrub: true, trigger: root.current, start: 'top top', end: mobile ? '+=100%' : '+=150%' } })
        .fromTo(stage.current, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'power3.in' }, 0)
      // Exit: a radial mask opens and the stage fades while the text comes up.
      gsap.timeline({ ...def, defaults: { ...def.defaults, immediateRender: false }, scrollTrigger: { scrub: true, trigger: text.current, start: mobile ? 'top-=150% bottom' : 'top-=90% bottom', end: 'top top' } })
        .fromTo(stage.current, {
          maskImage: `radial-gradient(${mobile ? '250%' : '150%'} 150% at 50% 50%, rgba(0, 0, 0, 1) 100%, rgba(0, 0, 0, 0.5) 150%)`,
        }, {
          maskImage: `radial-gradient(${mobile ? '200%' : '100%'} 100% at 50% ${mobile ? '-40%' : '-50%'}, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0.25) 90%)`,
          ease: 'power1.out',
        }, 0)
        .to(stage.current, { autoAlpha: 0, duration: 50 }, 50)
      // Text colour: dusk -> peach and pink -> blue and violet, and brighter.
      gsap.timeline({ ...def, scrollTrigger: { scrub: true, trigger: text.current, start: 'top bottom', end: 'bottom top' } })
        .fromTo(text.current, { backgroundImage: 'linear-gradient(0deg, #99743d -10%, #ad4556 90%)', filter: 'brightness(0.8)' }, { backgroundImage: 'linear-gradient(0deg, #FEC497 10%, #E9639B 100%)', filter: 'brightness(1)', duration: 50 }, 0)
        .fromTo(text.current, { backgroundImage: 'linear-gradient(0deg, #FEC497 10%, #E9639B 100%)' }, { backgroundImage: 'linear-gradient(0deg, #99C7FE 30%, #D263E9 110%)', duration: 50 }, 50)
    })
    return () => { ctx.revert(); scrub.destroy() }
  }, [])

  return (
    <section className="miami" id="miami" ref={root} aria-labelledby="miami-title">
      <div className="miami__stage" ref={stage} aria-hidden="true">
        <div className="miami__scene" ref={scene}>
          <picture>
            <source media={PORTRAIT_PHONE} srcSet={SRC.posterPortrait} />
            <img className="miami__poster" src={SRC.posterLandscape} alt="" />
          </picture>
          <video className="miami__video" ref={video} muted playsInline preload="auto" tabIndex={-1} />
        </div>
      </div>
      <div className="miami__text" ref={text}>
        <h2 className="miami__title" id="miami-title">{MIAMI.title}</h2>
        <p className="miami__bio">{MIAMI.bio}</p>
      </div>
    </section>
  )
}
