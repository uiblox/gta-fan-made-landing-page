// Usage: node tools/alpha-bbox.mjs <dir> <file1> <file2> ...  — alpha bounding box + coverage of each image (decoded in Chrome)
import { chromium } from 'playwright-core'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
const [dir, ...files] = process.argv.slice(2)
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage()
for (const f of files) {
  const b64 = readFileSync(resolve(dir, f)).toString('base64')
  const r = await page.evaluate(async (b64) => {
    const img = new Image(); img.src = 'data:image/avif;base64,' + b64; await img.decode()
    const c = new OffscreenCanvas(img.width, img.height), x = c.getContext('2d'); x.drawImage(img, 0, 0)
    const d = x.getImageData(0, 0, img.width, img.height).data
    let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, n = 0
    for (let y = 0; y < img.height; y++) for (let xx = 0; xx < img.width; xx++) if (d[(y * img.width + xx) * 4 + 3] > 8) { n++; if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; if (y > y1) y1 = y }
    return `${img.width}x${img.height} bbox ${x0},${y0}..${x1},${y1} cover ${(100 * n / (img.width * img.height)).toFixed(1)}%`
  }, b64)
  console.log(f.padEnd(14), r)
}
await browser.close()
