'use client';

import type { ImageLoaderProps } from 'next/image';
import variants from './image-variants.json';

const copies: Record<string, { base: string; widths: number[] }> = variants;

/**
 * A static export has no image server, so next/image builds its srcset through this loader.
 * Local photos come from the WebP copies made by `npm run images`; Unsplash resizes its own.
 * Anything else (dashboard uploads, files without copies) is served as it is.
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
