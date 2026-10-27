/* ===========================================================================
   OPTIMIZE IMAGES: turns your original photos into small, fast WebP files.

   Put originals here (any of jpg, jpeg, png, webp, tif, tiff):
       images-source/<project-slug>/<image-file>.jpg
   Run:  npm run images
   You get (800, 1200, 1600 px wide, never enlarged):
       public/images/projects/<project-slug>/<image-file>-800.webp  ...
   and src/data/image-manifest.json (sizes, used for width/height on the pages).
   Photo metadata (camera info, GPS location) is removed.
   =========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'images-source');
const OUT = path.join(ROOT, 'public/images/projects');
const MANIFEST = path.join(ROOT, 'src/data/image-manifest.json');
const WIDTHS = [800, 1200, 1600];     // sizes to create
const QUALITY = 80;                   // WebP quality (lower = smaller file)
const EXT = /\.(jpe?g|png|webp|tiff?)$/i;

if (!fs.existsSync(SRC)) { console.error('No images-source/ folder. Create images-source/<project-slug>/ and add your photos.'); process.exit(1); }

let manifest = {};
try { manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8')); } catch { /* first run */ }

let count = 0;
for (const slug of fs.readdirSync(SRC)) {
  const dir = path.join(SRC, slug);
  if (!fs.statSync(dir).isDirectory()) continue;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) { console.warn(`Skipped folder "${slug}": use lowercase letters, numbers and hyphens.`); continue; }

  for (const file of fs.readdirSync(dir).filter(f => EXT.test(f))) {
    const base = file.replace(EXT, '');
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(base)) { console.warn(`Skipped "${slug}/${file}": rename it in lowercase with hyphens (e.g. business-bay-office-reception.jpg).`); continue; }

    const input = path.join(dir, file);
    const meta = await sharp(input).metadata();
    const swap = meta.orientation >= 5;                       // phone photos can be stored rotated
    const w = swap ? meta.height : meta.width, h = swap ? meta.width : meta.height;
    const sizes = WIDTHS.filter(s => s <= w);
    if (!sizes.length) sizes.push(w);                         // small original: keep its own size

    fs.mkdirSync(path.join(OUT, slug), { recursive: true });
    for (const s of sizes) {
      await sharp(input).rotate().resize({ width: s, withoutEnlargement: true })
        .webp({ quality: QUALITY }).toFile(path.join(OUT, slug, `${base}-${s}.webp`));
    }
    const largest = Math.max(...sizes);
    manifest[`${slug}/${base}`] = { width: largest, height: Math.round(largest * h / w), sizes };
    console.log(`✔ ${slug}/${base}  →  ${sizes.join(', ')} px`);
    count++;
  }
}
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Done: ${count} image(s) processed.`);