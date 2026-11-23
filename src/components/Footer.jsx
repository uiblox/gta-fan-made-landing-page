import { useEffect, useRef } from 'react'
import { gsap, REDUCED } from '../lib/scroll'
import { FOOTER, LINKS, SITE } from '../content'
import logo from '/assets/site/footer/logo.avif'

const ICONS = {
  GitHub: 'M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.55v-2.1c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.66.8.55A11.5 11.5 0 0 0 12 .5Z',
  LinkedIn: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.98h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.84-2.06 3.78-2.06 4.04 0 4.78 2.66 4.78 6.12v7.44h-4v-6.6c0-1.58-.03-3.6-2.2-3.6-2.2 0-2.53 1.72-2.53 3.5v6.7h-3.7v-11Z',
  X: 'M18.9 2H22l-7.2 8.2L23 22h-6.6l-5.2-6.8L5.2 22H2l7.7-8.8L1.5 2h6.7l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.3 3.9H5.4L17.7 20Z',
  YouTube: 'M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.8 15V9l5.2 3-5.2 3Z',
}

export default function Footer() {
  const root = useRef(null)

  // Live: the footer fades in as it arrives (opacity from 0 over its first viewport).
  useEffect(() => {
    if (REDUCED) return
    const ctx = gsap.context(() => {
      gsap.from(root.current, { opacity: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top top', scrub: true } })
    })
    return () => ctx.revert()
  }, [])

  return (
    <footer className="footer" ref={root}>
      <div className="footer__top">
        <img className="footer__logo" src={logo} alt={FOOTER.logoAlt} />
      </div>
      <a className="footer__pill" href={LINKS.buildYourOwn}>
        <strong>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 5l-3 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          {FOOTER.pill.title}
        </strong>
        <span>{FOOTER.pill.text}</span>
      </a>
      <nav className="footer__nav" aria-label="Footer">
        <ul className="footer__socials">
          {FOOTER.socials.map((s) => (
            <li key={s.label}>
              <a href={LINKS[s.link]} aria-label={s.label}>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d={ICONS[s.label]} /></svg>
              </a>
            </li>
          ))}
        </ul>
        <ul className="footer__links">
          {FOOTER.links.map((l) => (
            <li key={l.label}><a href={LINKS[l.link]}>{l.label}</a></li>
          ))}
        </ul>
      </nav>
      <div className="footer__badge">
        <span className="footer__mark" aria-hidden="true">D</span>
        <div>
          <p>{FOOTER.badge.title}</p>
          <hr />
          <p>{FOOTER.badge.text}</p>
        </div>
      </div>
      <p className="footer__legal">{FOOTER.copyright} {SITE.disclaimer}</p>
    </footer>
  )
}
