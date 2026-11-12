/**
 * Saves the dashboard's current public content to .cms-snapshot.json before every `npm run build`
 * (the "prebuild" script). next.config.mjs bakes it into the build, so the static pages are
 * pre-rendered with the dashboard's photos and text instead of the built-in ones, and visitors no
 * longer glimpse the old content while the live copy loads.
 *
 * It also makes responsive WebP copies of the photos uploaded in the dashboard (public/_img/cms),
 * like `npm run images` does for the photos in /public: Supabase serves uploads only at their full
 * size, so without copies a phone downloads the same file as a large desktop screen.
 *
 * It never fails the build: without Supabase credentials, or when Supabase can't be reached, it
 * removes any old snapshot and the pages are pre-rendered with the built-in content as before.
 * A photo that can't be copied is simply served as uploaded.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import nextEnv from '@next/env';

const root = process.cwd();
const OUTPUT = resolve(root, '.cms-snapshot.json');
const COPIES_DIR = resolve(root, 'public/_img/cms');
// Kept between builds (Vercel restores .next/cache), so each upload is only resized once.
const CACHE_DIR = resolve(root, '.next/cache/cms-images');
// Match next.config.mjs (deviceSizes + imageSizes) and scripts/optimize-images.mjs.
const WIDTHS = [256, 384, 640, 828, 1080, 1280, 1920, 2560];

// The same .env files Next.js reads (Vercel passes its variables in the environment instead).
nextEnv.loadEnvConfig(root, false, { info: () => {}, error: console.error });

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/+$/, '');
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function skip(reason) {
  rmSync(OUTPUT, { force: true });
  rmSync(COPIES_DIR, { recursive: true, force: true });
  console.warn(`CMS snapshot skipped (${reason}); pages are pre-rendered with the built-in content.`);
}

/** The article-list columns, read from the mapper so the two never drift apart. */
function postSummaryColumns() {
  const source = readFileSync(resolve(root, 'src/lib/cms/mappers.ts'), 'utf8');
  const columns = source.match(/postSummaryColumns\s*=\s*'([^']+)'/)?.[1];
  if (!columns) throw new Error('postSummaryColumns not found in src/lib/cms/mappers.ts');
  return columns;
}

/** One PostgREST read, retried because a single dropped connection shouldn't cost the snapshot. */
async function read(path) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(`${url}/rest/v1/${path}`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      await new Promise((done) => setTimeout(done, attempt * 1000));
    }
  }
  throw lastError;
}

async function main() {
  if (!url || !key) return skip('no Supabase credentials');

  // Keep these in step with the public fetchers in src/lib/cms/api.ts.
  const queries = {
    settings: 'site_settings?select=*&id=eq.1',
    content: 'site_content?select=section,en,ar,media',
    projects: 'projects?select=*&is_published=eq.true&order=sort_order.asc,created_at.desc',
    posts: `blog_posts?select=${postSummaryColumns()}&status=eq.published&order=published_at.desc`,
    services: 'services?select=*&is_visible=eq.true&order=sort_order.asc',
    steps: 'process_steps?select=*&order=sort_order.asc',
  };

  const entries = await Promise.all(Object.entries(queries).map(async ([name, path]) => [name, await read(path)]));
  const data = Object.fromEntries(entries);
  const snapshot = { version: new Date().toISOString(), ...data, settings: data.settings[0] ?? null };
  snapshot.images = await copyPhotos(snapshot);

  writeFileSync(OUTPUT, JSON.stringify(snapshot));
  const counts = ['content', 'projects', 'posts', 'services', 'steps'].map((name) => `${snapshot[name].length} ${name}`).join(', ');
  console.log(`CMS snapshot saved: ${counts}, ${Object.keys(snapshot.images).length} photo copies.`);
}

/** Every photo uploaded to the dashboard's media bucket that the content uses. */
function uploadedPhotos(value, found = new Set()) {
  const prefix = `${url}/storage/v1/object/public/media/`;
  if (typeof value === 'string') {
    if (value.startsWith(prefix) && /\.(jpe?g|png|webp)$/i.test(value)) found.add(value);
  } else if (value && typeof value === 'object') {
    for (const item of Object.values(value)) uploadedPhotos(item, found);
  }
  return found;
}

/**
 * WebP copies of each uploaded photo at the site's image widths, listed as
 * { [photo URL]: { base, widths } } for the image loader (src/lib/image-loader.ts).
 * Upload paths are unique and never overwritten, so a copy made once stays valid.
 */
async function copyPhotos(snapshot) {
  rmSync(COPIES_DIR, { recursive: true, force: true });
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.warn('Photo copies skipped (sharp is not installed); dashboard photos are served as uploaded.');
    return {};
  }

  await mkdir(COPIES_DIR, { recursive: true });
  await mkdir(CACHE_DIR, { recursive: true });
  const photos = [...uploadedPhotos(snapshot)];
  const images = {};

  const copy = async (photo) => {
    const key = createHash('sha1').update(photo).digest('hex').slice(0, 16);
    const listFile = resolve(CACHE_DIR, `${key}.json`);
    try {
      let widths = existsSync(listFile) ? JSON.parse(await readFile(listFile, 'utf8')) : null;
      if (!widths || !widths.every((width) => existsSync(resolve(CACHE_DIR, `${key}.w${width}.webp`)))) {
        const response = await fetch(photo, { signal: AbortSignal.timeout(30000) });
        if (!response.ok) throw new Error(`${response.status}`);
        const source = Buffer.from(await response.arrayBuffer());
        const { width } = await sharp(source).metadata();
        widths = WIDTHS.filter((candidate) => candidate < width);
        if (width <= WIDTHS[WIDTHS.length - 1]) widths.push(width);
        for (const target of widths) {
          await sharp(source).rotate().resize({ width: target }).webp({ quality: 82, effort: 4 }).toFile(resolve(CACHE_DIR, `${key}.w${target}.webp`));
        }
        await writeFile(listFile, JSON.stringify(widths));
      }
      for (const width of widths) await copyFile(resolve(CACHE_DIR, `${key}.w${width}.webp`), resolve(COPIES_DIR, `${key}.w${width}.webp`));
      images[photo] = { base: `/_img/cms/${key}`, widths };
    } catch (error) {
      console.warn(`No copies for ${photo} (${error instanceof Error ? error.message : error}); it is served as uploaded.`);
    }
  };

  // A few at a time keeps memory low on the build machine.
  for (let index = 0; index < photos.length; index += 4) await Promise.all(photos.slice(index, index + 4).map(copy));
  return images;
}

main().catch((error) => skip(error instanceof Error ? error.message : String(error)));
