// Usage: node tools/intro-sheet.mjs <url> <WxH> <startSec> <endSec> <count> <out.png> [cols] [brightness]
// Steps the page's window.__intro GSAP timeline and writes a labelled contact sheet (same look as tools/video-sheet.mjs).
import { chromium } from 'playwright-core'

const [url, size, start, end, count, out, cols = '6', bright = '1'] = process.argv.slice(2)
const [w, h] = size.split('x').map(Number)
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: w, height: h } })
await page.addInitScript(() => { window.__introHold = true })
await page.goto(url, { waitUntil: 'load' })
await page.waitForFunction(() => !!window.__intro, null, { timeout: 30000, polling: 100 })
await page.addStyleTag({ content: '.loader{display:none!important}' })
// NB: never return the timeline from evaluate(): serialising it hangs the page.
await page.evaluate(() => { window.__intro.pause() })
const shots = []
for (let i = 0; i < +count; i++) {
  const t = +start + ((+end - +start) * i) / Math.max(1, +count - 1)
  await page.evaluate((t) => { window.__intro.time(t, false) }, t)
  await page.waitForTimeout(60)
  shots.push([t, (await page.screenshot()).toString('base64')])
}
const cw = Math.floor(1800 / +cols) - 2
const sheet = await browser.newPage({ viewport: { width: 1800, height: 900 } })
await sheet.setContent('<body style="margin:0;background:#000"><div id=g style="display:grid;gap:2px"></div>')
await sheet.evaluate(async ({ shots, cw, bright, cols }) => {
  const g = document.getElementById('g')
  g.style.gridTemplateColumns = `repeat(${cols}, 1fr)`
  for (const [t, b64] of shots) {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode()
    const c = document.createElement('canvas'); c.width = cw; c.height = Math.round((cw * img.height) / img.width)
    const x = c.getContext('2d'); x.filter = `brightness(${bright})`; x.drawImage(img, 0, 0, c.width, c.height)
    x.filter = 'none'; x.fillStyle = '#ff0'; x.font = 'bold 16px sans-serif'; x.fillText('t=' + t.toFixed(2), 6, 18)
    g.appendChild(c)
  }
}, { shots, cw, bright, cols: +cols })
await sheet.screenshot({ path: out, fullPage: true })
await browser.close()
