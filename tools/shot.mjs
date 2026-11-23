// Usage: node tools/shot.mjs <url> <WxH> <y> <out.png> [waitForIntro=1]
// Single viewport screenshot at scroll Y (settled).
import { chromium } from 'playwright-core'
const [url, size, y, out, wi = '1'] = process.argv.slice(2)
const [w, h] = size.split('x').map(Number)
const b = await chromium.launch({ channel: 'chrome' })
const p = await b.newPage({ viewport: { width: w, height: h } })
await p.goto(url, { waitUntil: 'load', timeout: 60000 })
if (wi === '1') await p.waitForFunction(() => document.documentElement.dataset.intro === 'done', null, { timeout: 60000 })
else await p.waitForTimeout(6000)
await p.evaluate(() => document.querySelector('#onetrust-accept-btn-handler, #onetrust-reject-all-handler')?.click())
await p.evaluate((y) => window.scrollTo(0, y), +y)
await p.waitForTimeout(1800)
await p.screenshot({ path: out })
await b.close()
