// Usage: node tools/measure.mjs <url> <width> [height] [scrollY] [maxDepth]
// Dumps visible element boxes + key computed styles in the first screens, as an indented outline.
import { chromium } from 'playwright-core'

const [url, width = '1440', height = '900', scrollY = '0', maxDepth = '7'] = process.argv.slice(2)
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: +width, height: +height } })
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(5000)
await page.evaluate(() => document.querySelector('#onetrust-accept-btn-handler, #onetrust-reject-all-handler')?.click())
await page.evaluate((y) => window.scrollTo(0, y), +scrollY)
await page.waitForTimeout(1500)
const rows = await page.evaluate((maxDepth) => {
  const out = []
  const walk = (el, d) => {
    if (d > maxDepth) return
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || (r.width === 0 && r.height === 0)) return
    const txt = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ').slice(0, 40)
    out.push(
      `${'  '.repeat(d)}${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''} ` +
        `[${Math.round(r.x)},${Math.round(r.y + scrollY)} ${Math.round(r.width)}x${Math.round(r.height)}] ` +
        `pos=${cs.position} z=${cs.zIndex} bg=${cs.backgroundColor} op=${cs.opacity}` +
        (txt ? ` font=${cs.fontSize}/${cs.lineHeight} ${cs.fontWeight} ${cs.fontFamily.split(',')[0]} ls=${cs.letterSpacing} col=${cs.color} tt=${cs.textTransform} "${txt}"` : ''),
    )
    for (const c of el.children) walk(c, d + 1)
  }
  walk(document.body, 0)
  return out
}, +maxDepth)
console.log(rows.join('\n'))
await page.screenshot({ path: `.measure/m-${width}-${scrollY}.png` })
await browser.close()
