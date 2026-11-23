// Usage: node tools/page-outline.mjs <url> <WxH> [depth]
// Prints the page's section structure at scroll 0: document-space top/height of each descendant of <main> (up to depth), with class and tag.
import { chromium } from 'playwright-core'
const [url, size, depth = '4'] = process.argv.slice(2)
const [w, h] = size.split('x').map(Number)
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: w, height: h } })
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(6000)
await page.evaluate(() => document.querySelector('#onetrust-accept-btn-handler, #onetrust-reject-all-handler')?.click())
const out = await page.evaluate((maxD) => {
  const lines = []
  const walk = (el, d) => {
    if (d > maxD) return
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el)
    lines.push(`${'  '.repeat(d)}${el.tagName.toLowerCase()}.${String(el.className).split(' ').slice(0, 2).join('.')} x${r.x.toFixed(0)} y${(r.y + scrollY).toFixed(0)} ${r.width.toFixed(0)}x${r.height.toFixed(0)} pos=${cs.position}${el.dataset.testid ? ' tid=' + el.dataset.testid : ''}`)
    for (const c of el.children) walk(c, d + 1)
  }
  walk(document.querySelector('main') || document.body, 0)
  return lines.join('\n')
}, +depth)
console.log(out)
await browser.close()
