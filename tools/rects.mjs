// Usage: node tools/rects.mjs <url> <selectors.json|inline JSON {name:selector}> <WxH,WxH,...> [scrollY]
// Prints bounding box + key computed styles for each named selector at each viewport.
import { chromium } from 'playwright-core'
import { readFileSync, existsSync } from 'node:fs'

const [url, sel, sizes, scrollY = '0'] = process.argv.slice(2)
const selectors = JSON.parse(existsSync(sel) ? readFileSync(sel, 'utf8') : sel)
const browser = await chromium.launch({ channel: 'chrome' })
const results = {}
for (const size of sizes.split(',')) {
  const [w, h] = size.split('x').map(Number)
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(5000)
  await page.evaluate(() => document.querySelector('#onetrust-accept-btn-handler, #onetrust-reject-all-handler')?.click())
  await page.evaluate((y) => window.scrollTo(0, y), +scrollY)
  await page.waitForTimeout(1200)
  results[size] = await page.evaluate(([selectors, y]) => {
    const o = {}
    for (const [name, s] of Object.entries(selectors)) {
      const el = document.querySelector(s)
      if (!el) { o[name] = null; continue }
      const r = el.getBoundingClientRect(), cs = getComputedStyle(el)
      o[name] = `${r.x.toFixed(1)},${(r.y + y).toFixed(1)} ${r.width.toFixed(1)}x${r.height.toFixed(1)} | ${cs.fontSize} ${cs.lineHeight} w${cs.fontWeight} ls=${cs.letterSpacing} pad=${cs.padding} br=${cs.borderRadius} | ${cs.color} on ${cs.backgroundColor}`
    }
    return o
  }, [selectors, +scrollY])
  await page.screenshot({ path: `.measure/r-${size}-${scrollY}.png` })
  await page.close()
}
for (const [size, o] of Object.entries(results)) {
  console.log(`\n## ${size}`)
  for (const [k, v] of Object.entries(o)) console.log(`${k.padEnd(10)} ${v}`)
}
await browser.close()
