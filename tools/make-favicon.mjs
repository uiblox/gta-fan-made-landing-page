// Usage: node tools/make-favicon.mjs — renders our logo poster centred on a transparent square into public/
import { chromium } from 'playwright-core'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const src = pathToFileURL(resolve('src/assets/brand/logo-poster.png')).href
const browser = await chromium.launch({ channel: 'chrome' })
for (const [size, out, bg] of [[96, 'public/favicon.png', null], [180, 'public/apple-touch-icon.png', '#0c0d1b']]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } })
  const pad = bg ? size * 0.14 : size * 0.02
  await page.setContent(`<body style="margin:0;display:grid;place-items:center;width:${size}px;height:${size}px;background:${bg ?? 'transparent'}"><img src="${src}" style="width:${size - pad * 2}px">`)
  await page.waitForFunction(() => document.images[0].complete)
  await page.screenshot({ path: out, omitBackground: !bg })
}
await browser.close()
