// Captures docs/screenshots from an offline build (npm run build:offline).
// Usage: node scripts/capture-screenshots.mjs <base-url> <output-dir>
// Needs the `playwright` package and Chromium, e.g. the
// mcr.microsoft.com/playwright image (see README).
import { chromium } from 'playwright'

const [baseUrl = 'http://localhost:9000', outDir = 'docs/screenshots'] =
  process.argv.slice(2)

const desktop = { width: 1440, height: 900 }
const mobile = { width: 390, height: 844 }

const shots = [
  { name: 'home-desktop', path: '/', viewport: desktop },
  {
    name: 'article-desktop',
    path: '/articles/humane-typography-in-the-digital-age/',
    viewport: desktop,
  },
  { name: 'tag-desktop', path: '/tags/typography/', viewport: desktop },
  { name: 'home-mobile', path: '/', viewport: mobile },
  {
    name: 'article-mobile',
    path: '/articles/a-brief-history-of-typography/',
    viewport: mobile,
  },
  {
    name: 'skip-link-desktop',
    path: '/categories/',
    viewport: desktop,
    prepare: (page) => page.keyboard.press('Tab'),
  },
]

const browser = await chromium.launch()
for (const { name, path, viewport, prepare } of shots) {
  const page = await browser.newPage({ viewport })
  await page.goto(`${baseUrl}${path}`, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  if (prepare) await prepare(page)
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${outDir}/${name}.png` })
  await page.close()
  console.log(`saved ${outDir}/${name}.png`)
}
await browser.close()
