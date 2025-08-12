#!/usr/bin/env node
/*
  Generate WebP hero images for blog posts that currently have only SVG heroes.
  - Looks in public/blog for *.svg
  - For each SVG, if a matching .webp doesn't exist, rasterize SVG -> WebP using sharp
  - Produces real, valid WebP images (no placeholders)
*/
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';
import sharp from 'sharp';

const blogDir = join(process.cwd(), 'public', 'blog');

async function convertSvgToWebp(svgPath, webpPath) {
  // Density improves raster quality for vector -> bitmap
  await sharp(svgPath, { density: 300 })
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(webpPath);
}

async function main() {
  if (!existsSync(blogDir) || !statSync(blogDir).isDirectory()) {
    console.error(`Blog directory not found: ${blogDir}`);
    process.exit(1);
  }

  const files = readdirSync(blogDir);
  const svgs = files.filter((f) => f.endsWith('.svg'));

  const created = [];
  const skipped = [];
  const errors = [];

  for (const svg of svgs) {
    const base = basename(svg, '.svg');
    const webp = `${base}.webp`;
    const svgPath = join(blogDir, svg);
    const webpPath = join(blogDir, webp);

    if (existsSync(webpPath)) {
      try {
        const s = statSync(webpPath);
        if (s.size > 0) {
          skipped.push(webp);
          continue;
        } else {
          // Zero-byte or corrupt file; regenerate
          console.warn(`Found zero-byte file, regenerating: ${webp}`);
        }
      } catch {
        // If stat fails, try regenerating
      }
    }

    try {
      await convertSvgToWebp(svgPath, webpPath);
      created.push(webp);
    } catch (e) {
      errors.push({ file: svg, message: e?.message || String(e) });
    }
  }

  console.log('WebP generation complete.');
  console.table({ created: created.length, skipped: skipped.length, errors: errors.length });
  if (created.length) console.log('Created:', created.join(', '));
  if (skipped.length) console.log('Skipped (already exists):', skipped.join(', '));
  if (errors.length) {
    console.error('Errors:');
    for (const err of errors) console.error(` - ${err.file}: ${err.message}`);
    process.exitCode = 1;
  }
}

await main();
