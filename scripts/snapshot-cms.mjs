/**
 * Saves the dashboard's current public content to .cms-snapshot.json before every `npm run build`
 * (the "prebuild" script). next.config.mjs bakes it into the build, so the static pages are
 * pre-rendered with the dashboard's photos and text instead of the built-in ones, and visitors no
 * longer glimpse the old content while the live copy loads.
 *
 * It never fails the build: without Supabase credentials, or when Supabase can't be reached, it
 * removes any old snapshot and the pages are pre-rendered with the built-in content as before.
 */
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import nextEnv from '@next/env';

const root = process.cwd();
const OUTPUT = resolve(root, '.cms-snapshot.json');

// The same .env files Next.js reads (Vercel passes its variables in the environment instead).
nextEnv.loadEnvConfig(root, false, { info: () => {}, error: console.error });

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/+$/, '');
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function skip(reason) {
  rmSync(OUTPUT, { force: true });
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

  writeFileSync(OUTPUT, JSON.stringify(snapshot));
  const counts = ['content', 'projects', 'posts', 'services', 'steps'].map((name) => `${snapshot[name].length} ${name}`).join(', ');
  console.log(`CMS snapshot saved: ${counts}.`);
}

main().catch((error) => skip(error instanceof Error ? error.message : String(error)));
