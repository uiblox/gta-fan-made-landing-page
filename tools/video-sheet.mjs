// Usage: node tools/video-sheet.mjs <video> <startSec> <endSec> <count> <out.png> [cols]
// Seeks a screen recording in headless Chrome and writes a labelled contact sheet of evenly spaced frames.
import { chromium } from 'playwright-core'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { writeFileSync } from 'node:fs'

const [video, start, end, count, out, cols = '6', bright = '1'] = process.argv.slice(2)
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1800, height: 1000 } })
const html = resolve('.measure/_sheet.html')
writeFileSync(html, `<body style="margin:0;background:#000"><video id=v muted src="${pathToFileURL(resolve(video)).href}"></video><div id=g style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:2px"></div>`)
await page.goto(pathToFileURL(html).href)
await page.waitForFunction(() => document.getElementById('v').readyState >= 1)
const info = await page.evaluate(() => { const v = document.getElementById('v'); return [v.duration, v.videoWidth, v.videoHeight] })
console.log('duration,w,h', info.join(','))
const times = Array.from({ length: +count }, (_, i) => +start + ((+end - +start) * i) / Math.max(1, +count - 1))
await page.evaluate(async ({ times, cols, bright }) => {
  const v = document.getElementById('v'), g = document.getElementById('g')
  const w = Math.floor(1800 / cols) - 2, h = Math.round((w * v.videoHeight) / v.videoWidth)
  for (const t of times) {
    v.currentTime = t
    await new Promise((r) => (v.onseeked = r))
    const c = document.createElement('canvas'); c.width = w; c.height = h
    const x = c.getContext('2d'); x.filter = 'brightness(' + bright + ')'; x.drawImage(v, 0, 0, w, h)
    x.fillStyle = '#ff0'; x.font = 'bold 16px sans-serif'; x.fillText(t.toFixed(2) + 's', 6, 18)
    g.appendChild(c)
  }
  v.style.display = 'none'
}, { times, cols: +cols, bright })
await page.screenshot({ path: out, fullPage: true })
await browser.close()
