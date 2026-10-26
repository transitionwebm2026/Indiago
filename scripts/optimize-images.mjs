// Writes responsive WebP copies of the photographs in /public to /public/_img and lists them in
// src/lib/image-variants.json for the image loader (src/lib/image-loader.ts).
// Run `npm run images` after adding or replacing a photo, and commit the results.
// Photos without copies still work: the loader serves them unchanged.
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const PUBLIC_DIR = 'public';
const OUTPUT_DIR = path.join(PUBLIC_DIR, '_img');
const MANIFEST = path.join('src', 'lib', 'image-variants.json');
// Match next.config.mjs (deviceSizes + imageSizes), so each srcset width has its own file.
const WIDTHS = [256, 384, 640, 828, 1080, 1280, 1920];

/** JPEGs anywhere in /public, plus every image under /public/images. The share image is only read by social sites. */
const isPhoto = (relative) =>
  relative !== 'og-image.jpg' &&
  (/\.jpe?g$/i.test(relative) || (relative.startsWith(`images${path.sep}`) && /\.(png|webp)$/i.test(relative)));

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return full === OUTPUT_DIR ? [] : listFiles(full);
      return [full];
    }),
  );
  return nested.flat();
}

await rm(OUTPUT_DIR, { recursive: true, force: true });
const manifest = {};
const photos = (await listFiles(PUBLIC_DIR)).filter((file) => isPhoto(path.relative(PUBLIC_DIR, file))).sort();

for (const file of photos) {
  const source = await readFile(file);
  const { width } = await sharp(source).metadata();
  // The content hash in the name lets the host cache every copy forever.
  const hash = createHash('sha1').update(source).digest('hex').slice(0, 8);
  const relative = path.relative(PUBLIC_DIR, file);
  const parsed = path.parse(relative);
  const base = path.join(OUTPUT_DIR, parsed.dir, `${parsed.name}.${hash}`);
  const widths = [...WIDTHS.filter((candidate) => candidate < width), width];

  await mkdir(path.dirname(base), { recursive: true });
  for (const target of widths) {
    await sharp(source).rotate().resize({ width: target }).webp({ quality: 78, effort: 5 }).toFile(`${base}.w${target}.webp`);
  }

  const url = (value) => `/${value.split(path.sep).join('/')}`;
  manifest[url(relative)] = { base: url(path.relative(PUBLIC_DIR, base)), widths };
  console.log(`${url(relative)} → ${widths.join(', ')}`);
}

await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`\n${photos.length} photos → ${path.relative('.', OUTPUT_DIR)}, manifest in ${MANIFEST}`);
