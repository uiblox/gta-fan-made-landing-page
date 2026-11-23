import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, REDUCED } from '../lib/scroll'
import { LINKS, NAVBAR } from '../content'

export default function Navbar() {
  const pill = useRef(null)

  // The "Hire Me" pill appears once the hero has scrolled 40% of a viewport past its frame (live: 0.3s, power2.inOut, reverses on the way back).
  useEffect(() => {
    const frame = document.querySelector('.hero__frame')
    if (!frame) return
    const ctx = gsap.context(() => {
      if (REDUCED) {
        // Reduced motion: no fade, the pill simply shows once the hero is out of view.
        ScrollTrigger.create({
          trigger: frame, start: 'top top-=40%', end: 'max',
          onEnter: () => gsap.set(pill.current, { autoAlpha: 1 }),
          onLeaveBack: () => gsap.set(pill.current, { autoAlpha: 0 }),
        })
        return
      }
      gsap.fromTo(pill.current, { autoAlpha: 0 }, {
        autoAlpha: 1, duration: 0.3, ease: 'power2.inOut',
        scrollTrigger: { trigger: frame, start: 'top top-=40%', toggleActions: 'play none none reverse' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <nav className="nav" aria-label="Main" data-intro-ui>
      <a className="nav__logo" href={LINKS.home} aria-label={NAVBAR.homeLabel}>
        <span aria-hidden="true">{NAVBAR.monogram}</span>
      </a>
      <div className="nav__right">
        <a className="nav__pill" ref={pill} href={LINKS.hire}>
          {NAVBAR.cta}
        </a>
        <button className="nav__menu" type="button" aria-label={NAVBAR.menuLabel} aria-expanded="false">
          <span />
          <span />
        </button>
      </div>
    </nav>
  )
}
