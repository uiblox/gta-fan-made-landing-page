// Usage: node tools/css-rules.mjs <url> <regex> [text]  — prints every CSS rule (with its @media chain) whose selector matches; pass a 3rd arg to match rule text too
import { chromium } from 'playwright-core'
const [url, re, byText] = process.argv.slice(2)
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(3000)
const out = await page.evaluate(([re, withText]) => {
  const rx = new RegExp(re)
  const res = []
  const walk = (rules, ctx) => {
    for (const r of rules) {
      if (r.cssRules && !r.selectorText) walk(r.cssRules, ctx + (r.conditionText ? ` @${r.constructor.name.replace('CSS', '').replace('Rule', '')} ${r.conditionText}` : ` ${r.cssText.slice(0, 40)}`))
      else if (rx.test(r.selectorText || '') || (withText && rx.test(r.cssText))) res.push(`${ctx}\n  ${r.cssText}`)
    }
  }
  for (const s of document.styleSheets) { try { walk(s.cssRules, '') } catch { /* cross-origin */ } }
  return res
}, [re, !!byText])
console.log(out.join('\n'))
await browser.close()
