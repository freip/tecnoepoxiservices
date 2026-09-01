/**
 * Derives web-ready brand assets from the original files in public/assets/brand.
 *
 * This only trims empty padding and resizes — the mark itself is never recoloured
 * or redrawn, so the visual identity stays exactly as supplied.
 *
 * Run with: npm run brand:prepare
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = path.join(process.cwd(), 'public', 'assets', 'brand');
const OUT = path.join(process.cwd(), 'public', 'assets', 'brand', 'derived');

await mkdir(OUT, { recursive: true });

// 1. Primary emblem: trim the transparent margin so it can be laid out tightly.
await sharp(path.join(SRC, 'logo_sem_fundo.png'))
  .trim({ threshold: 1 })
  .png({ compressionLevel: 9 })
  .toFile(path.join(OUT, 'emblem.png'));

// 2. Watermark: trim the black surround. Rendered with mix-blend-mode: screen,
//    so the remaining black falls away and only the glowing mark shows through.
await sharp(path.join(SRC, 'marca_d_agua_logo.png'))
  .trim({ threshold: 12 })
  .resize({ width: 1200, withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toFile(path.join(OUT, 'watermark.png'));

// 3. Favicon from the simplified square mark.
await sharp(path.join(SRC, 'logo.png'))
  .resize(180, 180, { fit: 'cover' })
  .png({ compressionLevel: 9 })
  .toFile(path.join(process.cwd(), 'public', 'icon.png'));

const report = await Promise.all(
  ['derived/emblem.png', 'derived/watermark.png'].map(async (f) => {
    const m = await sharp(path.join(SRC, f)).metadata();
    return `${f} -> ${m.width}x${m.height}`;
  })
);
console.log(report.join('\n'));
console.log('icon.png -> 180x180');
