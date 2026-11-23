// Usage: node tools/css-vars.mjs <url> <prefixRegex> <WxH,WxH,...>
// Resolves every custom property matching the regex to px (via a probe element) at each viewport.
import { chromium } from 'playwright-core'
const [url, re, sizes] = process.argv.slice(2)
const browser = await chromium.launch({ channel: 'chrome' })
const rows = {}
const names = new Set()
for (const size of sizes.split(',')) {
  const [w, h] = size.split('x').map(Number)
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(2500)
  const r = await page.evaluate((re) => {
    const rx = new RegExp(re), found = new Set(), o = {}
    for (const el of [document.documentElement, document.body, ...document.querySelectorAll('nav, ._191jtbm0')]) {
      for (const n of getComputedStyle(el)) if (n.startsWith('--') && rx.test(n)) found.add(n)
    }
    const probe = document.body.appendChild(document.createElement('div'))
    probe.style.cssText = 'position:absolute;visibility:hidden;height:0'
    for (const n of found) { probe.style.width = `var(${n})`; const px = probe.getBoundingClientRect().width; o[n] = Math.round(px * 100) / 100 }
    return o
  }, re)
  rows[size] = r
  Object.keys(r).forEach((k) => names.add(k))
  await page.close()
}
const sz = sizes.split(',')
console.log('var'.padEnd(18) + sz.map((s) => s.padStart(10)).join(''))
for (const n of [...names].sort()) console.log(n.padEnd(18) + sz.map((s) => String(rows[s][n] ?? '-').padStart(10)).join(''))
await browser.close()
