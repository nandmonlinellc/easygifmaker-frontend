#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT = path.resolve(__dirname, '..')
const APP = path.join(ROOT, 'src', 'App.jsx')
const PUBLIC = path.join(ROOT, 'public')
const OUT = path.join(PUBLIC, 'sitemap.xml')
const SITE = process.env.SITE_ORIGIN || 'https://easygifmaker.com'

function extractRoutes(fileText) {
  const routes = new Set(['/'])
  const re = /<Route\s+path=\"([^\"]+)\"/g
  let m
  while ((m = re.exec(fileText))) {
    let p = m[1]
    if (p === undefined) continue
    // Remove path params/optional segments if any
    p = p.replace(/\*+$/, '')
    if (!p.startsWith('/')) p = '/' + p
    routes.add(p)
  }
  return Array.from(routes)
}

function isoDate() {
  return new Date().toISOString().slice(0, 10)
}

function buildSitemap(urls) {
  const lastmod = isoDate()
  const items = urls
    .filter(Boolean)
    .map(u => {
      const loc = `${SITE}${u.replace(/\/$/, '')}`
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`
}

try {
  const text = fs.readFileSync(APP, 'utf8')
  const routes = extractRoutes(text)
  const xml = buildSitemap(routes)
  if (!fs.existsSync(PUBLIC)) fs.mkdirSync(PUBLIC, { recursive: true })
  fs.writeFileSync(OUT, xml, 'utf8')
  console.log(`Sitemap written: ${OUT} (${routes.length} urls)`) // eslint-disable-line no-console
} catch (e) {
  console.error('Failed to generate sitemap:', e) // eslint-disable-line no-console
  process.exit(1)
}
