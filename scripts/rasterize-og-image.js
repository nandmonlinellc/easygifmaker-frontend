#!/usr/bin/env node
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import sharp from 'sharp';

const pub = join(process.cwd(), 'public');
const svg = join(pub, 'og-image.svg');
const png = join(pub, 'og-image.png');
const webp = join(pub, 'og-image.webp');

async function main() {
  if (!existsSync(svg)) {
    console.error('Missing public/og-image.svg');
    process.exit(1);
  }
  // Rasterize to PNG
  await sharp(svg, { density: 300 })
    .png({ quality: 90 })
    .toFile(png);
  // Rasterize to WebP (optional)
  await sharp(svg, { density: 300 })
    .webp({ quality: 90 })
    .toFile(webp);
  console.log('Rasterized og-image.svg -> og-image.png, og-image.webp');
}

await main();
