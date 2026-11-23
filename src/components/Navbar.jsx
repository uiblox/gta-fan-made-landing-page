import { LINKS, NAVBAR } from '../content'

export default function Navbar() {
  return (
    <nav className="nav" aria-label="Main" data-intro-ui>
      <a className="nav__logo" href={LINKS.home} aria-label={NAVBAR.homeLabel}>
        <span aria-hidden="true">{NAVBAR.monogram}</span>
      </a>
      <div className="nav__right">
        {/* Hidden at the top of the page; revealed as the hero scrolls away (motion pass). */}
        <a className="nav__pill" href={LINKS.hire} data-visible="false" tabIndex={-1}>
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
