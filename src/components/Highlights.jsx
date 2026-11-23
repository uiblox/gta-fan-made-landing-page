import { HIGHLIGHTS, LINKS } from '../content'
import Card from './Card'
import openToWork from '/assets/site/highlights/open-to-work.avif'
import afterHours from '/assets/site/highlights/after-hours.avif'
import theHeist from '/assets/site/highlights/the-heist.avif'
import offTheClock from '/assets/site/highlights/off-the-clock.avif'

// Per card: art, focal point and colours taken from the art (card colour, button, eyebrow).
const ART = [
  { art: { desktop: openToWork, pos: '70% 50%' }, tone: { '--card-bg': '#4b2f54', '--btn-bg': '#ffd4a8', '--btn-fg': '#0f0c1a', '--eb': '#fee8ea' } },
  { art: { desktop: afterHours, pos: '30% 30%' }, tone: { '--card-bg': '#1c1f4a', '--btn-bg': '#e6ffa3', '--btn-fg': '#0d0c1a', '--eb': '#d9d4ff' } },
  { art: { desktop: theHeist, pos: '60% 50%' }, tone: { '--card-bg': '#10303a', '--btn-bg': '#b8f0ea', '--btn-fg': '#07151a', '--eb': '#b8f0ea' } },
  { art: { desktop: offTheClock, pos: '40% 50%' }, tone: { '--card-bg': '#0b4a78', '--btn-bg': '#fff9cb', '--btn-fg': '#07151a', '--eb': '#d6f1ff' } },
]

// The four wide cards under Miami, USA. Text alternates sides so it sits where each piece of art leaves room.
export default function Highlights() {
  return (
    <section className="features" aria-label="Highlights">
      <div className="features__list">
        {HIGHLIGHTS.map((h, i) => (
          <Card
            key={h.title}
            variant="wide"
            className="card--feature"
            side={h.side}
            href={LINKS[h.link]}
            eyebrow={h.eyebrow}
            title={h.title}
            text={h.text}
            cta={h.cta}
            icon="arrow"
            art={ART[i].art}
            tone={ART[i].tone}
          />
        ))}
      </div>
    </section>
  )
}
