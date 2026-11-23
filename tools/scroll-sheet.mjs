// Usage: node tools/scroll-sheet.mjs <url> <WxH> <y1,y2,...|start:end:step> <out.png> [cols] [waitForIntro=1]
// Scrolls the page to each Y (jumps, with a settle time), screenshots the viewport and tiles the shots into one labelled sheet.
// Waits for <html data-intro="done"> on our page (pass 0 to skip, e.g. for the live site).
import { chromium } from 'playwright-core'
import { writeFileSync, readFileSync, unlinkSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const [url, size, ys, out, cols = '4', waitIntro = '1'] = process.argv.slice(2)
const [w, h] = size.split('x').map(Number)
const list = ys.includes(':') ? (([a, b, s]) => { const r = []; for (let y = +a; y <= +b; y += +s) r.push(y); return r })(ys.split(':')) : ys.split(',').map(Number)
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: w, height: h } })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
await page.goto(url, { waitUntil: 'load', timeout: 60000 })
if (waitIntro === '1') await page.waitForFunction(() => document.documentElement.dataset.intro === 'done', null, { timeout: 60000 })
else await page.waitForTimeout(6000)
await page.evaluate(() => document.querySelector('#onetrust-accept-btn-handler, #onetrust-reject-all-handler')?.click())
await page.waitForTimeout(800)
mkdirSync('.measure/shots', { recursive: true })
const files = []
for (const y of list) {
  await page.evaluate((y) => window.scrollTo(0, y), y)
  await page.waitForTimeout(1500)
  const f = `.measure/shots/${Date.now()}-${y}.png`
  await page.screenshot({ path: f })
  files.push([y, f])
}
const total = await page.evaluate(() => document.documentElement.scrollHeight)
const tw = Math.floor(1800 / +cols), th = Math.round((tw * h) / w)
const html = `<body style="margin:0;background:#000;display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:2px">${files.map(([y, f]) => `<div style="position:relative"><img src="${pathToFileURL(resolve(f)).href}" width=${tw} height=${th}><b style="position:absolute;left:6px;top:4px;color:#ff0;font:bold 14px sans-serif">${y}</b></div>`).join('')}</body>`
writeFileSync('.measure/_scroll.html', html)
const p2 = await browser.newPage({ viewport: { width: 1800, height: Math.ceil(files.length / +cols) * (th + 2) } })
await p2.goto(pathToFileURL(resolve('.measure/_scroll.html')).href)
await p2.waitForTimeout(600)
await p2.screenshot({ path: out })
console.log('scrollHeight', total, 'errors:', errors.slice(0, 5))
for (const [, f] of files) unlinkSync(f)
await browser.close()
