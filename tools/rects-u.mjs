// Usage: node tools/rects-u.mjs <url> <selectors.json|inline JSON {name:selector}> <WxH,WxH,...> [scrollY]
// Like rects.mjs but prints sizes in --u units (see AGENTS.md: u = min(0.5vw,12.8px)/s) so values compare across widths.
// Per selector: box x,y(relative to viewport width: x in vw), WxH in u, font-size/line-height/letter-spacing/padding/radius in u.
import { chromium } from 'playwright-core'
import { readFileSync, existsSync } from 'node:fs'

const [url, sel, sizes, scrollY = '0'] = process.argv.slice(2)
const selectors = JSON.parse(existsSync(sel) ? readFileSync(sel, 'utf8') : sel)
const browser = await chromium.launch({ channel: 'chrome' })
for (const size of sizes.split(',')) {
  const [w, h] = size.split('x').map(Number)
  const s = w >= 1440 ? 4 : w >= 1024 ? 3.5 : w >= 768 ? 3 : h < w ? 2 : 1
  const u = Math.min(0.5 * w, 12.8 * 100) / 100 / s
  const uu = Math.min(w * 0.005, 12.8) / s
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(5000)
  await page.evaluate(() => document.querySelector('#onetrust-accept-btn-handler, #onetrust-reject-all-handler')?.click())
  await page.evaluate((y) => window.scrollTo(0, y), +scrollY)
  await page.waitForTimeout(1200)
  const res = await page.evaluate(([selectors, y]) => {
    const o = {}
    for (const [name, s] of Object.entries(selectors)) {
      const el = document.querySelector(s)
      if (!el) { o[name] = null; continue }
      const r = el.getBoundingClientRect(), cs = getComputedStyle(el)
      o[name] = { x: r.x, y: r.y + y, w: r.width, h: r.height, fs: cs.fontSize, lh: cs.lineHeight, ls: cs.letterSpacing, pad: cs.padding, br: cs.borderRadius, gap: cs.gap, bg: cs.backgroundColor, col: cs.color, mar: cs.margin }
    }
    return o
  }, [selectors, +scrollY])
  const f = (v) => (v === 'normal' || v === '0px' ? v : v.split(' ').map((p) => (p.endsWith('px') ? +(parseFloat(p) / uu).toFixed(2) + 'u' : p)).join(' '))
  console.log(`\n## ${size}  u=${uu.toFixed(4)}px  vw=${(w / 100).toFixed(2)}px`)
  for (const [k, v] of Object.entries(res)) {
    if (!v || (v.w === 0 && v.h === 0)) { console.log(k.padEnd(12), '-'); continue }
    console.log(k.padEnd(12), `x${(v.x / w * 100).toFixed(2)}vw y${v.y.toFixed(0)} ${(v.w / uu).toFixed(1)}u x ${(v.h / uu).toFixed(1)}u (${v.w.toFixed(0)}x${v.h.toFixed(0)}) fs ${f(v.fs)} lh ${f(v.lh)} ls ${f(v.ls)} pad ${f(v.pad)} br ${f(v.br)} gap ${f(v.gap)} mar ${f(v.mar)} ${v.col} on ${v.bg}`)
  }
  await page.close()
}
await browser.close()
