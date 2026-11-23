import { CLIENTS, LINKS } from '../content'
import Card, { ArrowIcon } from './Card'
import clients from '/assets/site/clients/clients.avif'
import testimonial from '/assets/site/clients/testimonial.avif'

const ART = [
  { art: { desktop: clients, pos: '50% 0%' }, tone: { '--card-bg': '#20234c', '--btn-bg': '#ffd4a8', '--btn-fg': '#0f0c1a', '--eb': '#fbd9e0' } },
  { art: { desktop: testimonial, pos: '50% 0%' }, tone: { '--card-bg': '#20234c', '--btn-bg': '#ffd4a8', '--btn-fg': '#0f0c1a', '--eb': '#fbd9e0' } },
]

// Clients (live: Shop). The same card rail as the project cards, two across.
export default function Clients() {
  return (
    <section className="listing" aria-labelledby="clients-title">
      <div className="listing__head">
        <h2 className="listing__title listing__title--sand" id="clients-title">{CLIENTS.title}</h2>
        <a className="listing__link" href={LINKS.clients}>{CLIENTS.link}<ArrowIcon /></a>
      </div>
      <div className="rail rail--two">
        {CLIENTS.cards.map((c, i) => (
          <div className="rail__col" key={c.title}>
            <Card variant="client" href={LINKS[c.link]} eyebrow={c.eyebrow} title={c.title} cta={c.cta} icon="arrow" art={ART[i].art} tone={ART[i].tone} />
          </div>
        ))}
      </div>
    </section>
  )
}
