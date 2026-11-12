'use client';

import type { ImageLoaderProps } from 'next/image';
import variants from './image-variants.json';

type Copies = Record<string, { base: string; widths: number[] }>;

/** Copies of the dashboard's photos made at build time by scripts/snapshot-cms.mjs (inlined by next.config.mjs). */
function dashboardCopies(): Copies {
  try {
    return JSON.parse(process.env.CMS_IMAGES || '{}') as Copies;
  } catch {
    return {};
  }
}

const copies: Copies = { ...variants, ...dashboardCopies() };

/**
 * A static export has no image server, so next/image builds its srcset through this loader.
 * Local photos come from the WebP copies made by `npm run images`, and photos uploaded in the
 * dashboard from the copies made at build time; Unsplash resizes its own. Anything else (uploads
 * made since the last build, files without copies) is served as it is.
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  const copy = copies[src];
  if (copy) {
    const size = copy.widths.find((candidate) => candidate >= width) ?? copy.widths[copy.widths.length - 1];
    return `${copy.base}.w${size}.webp`;
  }
  if (src.startsWith('https://images.unsplash.com/')) {
    const url = new URL(src);
    url.searchParams.set('w', String(width));
    url.searchParams.set('q', String(quality ?? 75));
    return url.toString();
  }
  return src;
}
