// Usage: node tools/probe.mjs <url> [width] — dumps background colours, fonts and icon links
import { chromium } from 'playwright-core'

const [url, width = '1440'] = process.argv.slice(2)
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: +width, height: 900 } })
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(4000)
const out = await page.evaluate(() => {
  const cs = (el) => el && getComputedStyle(el)
  const fonts = new Set()
  for (const el of document.querySelectorAll('body, body *')) fonts.add(cs(el).fontFamily)
  return {
    title: document.title,
    html: cs(document.documentElement).backgroundColor,
    body: cs(document.body).backgroundColor,
    theme: document.querySelector('meta[name=theme-color]')?.content,
    icons: [...document.querySelectorAll('link[rel*=icon]')].map((l) => [l.rel, l.sizes.value, l.type]),
    fonts: [...fonts].slice(0, 12),
  }
})
console.log(JSON.stringify(out, null, 2))
await page.screenshot({ path: '.measure/probe.png' })
await browser.close()
