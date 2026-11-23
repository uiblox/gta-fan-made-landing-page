// Usage: node tools/styles.mjs <url> <WxH> <selectors.json|inline JSON {name:selector}> <prop,prop,...> [scrollY]
// Prints the listed computed CSS properties of each named selector (raw values).
import { chromium } from 'playwright-core'
import { readFileSync, existsSync } from 'node:fs'
const [url, size, sel, props, scrollY = '0'] = process.argv.slice(2)
const selectors = JSON.parse(existsSync(sel) ? readFileSync(sel, 'utf8') : sel)
const [w, h] = size.split('x').map(Number)
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: w, height: h } })
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(5000)
await page.evaluate(() => document.querySelector('#onetrust-accept-btn-handler, #onetrust-reject-all-handler')?.click())
await page.evaluate((y) => window.scrollTo(0, y), +scrollY)
await page.waitForTimeout(1200)
const out = await page.evaluate(([selectors, props]) => {
  const o = {}
  for (const [name, s] of Object.entries(selectors)) {
    const el = document.querySelector(s)
    if (!el) { o[name] = null; continue }
    const cs = getComputedStyle(el)
    o[name] = Object.fromEntries(props.split(',').map((p) => [p, cs.getPropertyValue(p)]))
  }
  return o
}, [selectors, props])
for (const [k, v] of Object.entries(out)) console.log(k, JSON.stringify(v))
await browser.close()
