// Usage: node tools/intro-handoff.mjs <url> <WxH> [dpr]
// Compares the intro's last canvas frame with the poster that replaces it (inside the art box): reports the pixel difference.
import { chromium } from 'playwright-core'
import { writeFileSync } from 'node:fs'
const [url, size, dpr = '1'] = process.argv.slice(2)
const [w, h] = size.split('x').map(Number)
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: +dpr })
await page.addInitScript(() => { window.__introHold = true })
await page.goto(url, { waitUntil: 'load' })
await page.waitForFunction(() => !!window.__intro, null, { timeout: 30000, polling: 100 })
await page.addStyleTag({ content: '.loader{display:none!important}' })
await page.evaluate(() => { window.__intro.pause(); window.__intro.time(window.__intro.duration() - 0.0005, false) })
const box = await page.evaluate(() => { const r = document.querySelector('.hero__art').getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height } })
const a = await page.screenshot({ clip: box })
await page.evaluate(() => { document.documentElement.dataset.intro = 'done' })
await page.waitForTimeout(100)
const b = await page.screenshot({ clip: box })
await page.screenshot({ path: '.measure/handoff-after.png' })
writeFileSync('.measure/handoff-canvas.png', a); writeFileSync('.measure/handoff-poster.png', b)
const diff = await page.evaluate(async ([a, b]) => {
  const load = async (s) => { const i = new Image(); i.src = 'data:image/png;base64,' + s; await i.decode(); const c = new OffscreenCanvas(i.width, i.height); const x = c.getContext('2d'); x.drawImage(i, 0, 0); return x.getImageData(0, 0, i.width, i.height).data }
  const [da, db] = await Promise.all([load(a), load(b)])
  let sum = 0, max = 0, n = 0
  for (let k = 0; k < da.length; k += 4) { const d = (Math.abs(da[k] - db[k]) + Math.abs(da[k + 1] - db[k + 1]) + Math.abs(da[k + 2] - db[k + 2])) / 3; sum += d; if (d > max) max = d; if (d > 24) n++ }
  return { mean: (sum / (da.length / 4)).toFixed(2), max: max.toFixed(0), pxOver24: n, total: da.length / 4 }
}, [a.toString('base64'), b.toString('base64')])
console.log(size, JSON.stringify(diff))
await browser.close()
