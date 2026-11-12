import { readFileSync } from 'node:fs';

// The site's one address, used for canonical URLs, the sitemap, share links and share images — on
// every build, Vercel's included (its vercel.app addresses only redirect here; see vercel.json).
// NEXT_PUBLIC_SITE_URL overrides it.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indigoegy.com';

/**
 * The dashboard content saved by scripts/snapshot-cms.mjs just before `npm run build`, so the pages are
 * pre-rendered with it (see src/lib/cms/snapshot.ts). Only production builds use it: `next dev` keeps
 * the built-in content rather than a snapshot left over from an earlier build.
 */
function cmsSnapshot(phase) {
  if (phase !== 'phase-production-build') return { snapshot: '', images: '' };
  try {
    // The photo copies' list goes to the image loader on its own, so it doesn't need the content.
    const { images = {}, ...snapshot } = JSON.parse(readFileSync(new URL('./.cms-snapshot.json', import.meta.url), 'utf8'));
    return { snapshot: JSON.stringify(snapshot), images: JSON.stringify(images) };
  } catch {
    return { snapshot: '', images: '' };
  }
}

/** @type {(phase: string) => import('next').NextConfig} */
export default function nextConfig(phase) {
  const cms = cmsSnapshot(phase);
  return {
    // Plain HTML/CSS/JS in out/ for Hostinger's static hosting — no Node.js server needed.
    output: 'export',
    // Inlined at build time, so server-rendered pages and the browser see the same values.
    env: { NEXT_PUBLIC_SITE_URL: siteUrl, CMS_SNAPSHOT: cms.snapshot, CMS_IMAGES: cms.images },
    trailingSlash: true,
    experimental: {
      // The stylesheet (~15 KB gzipped) goes into each page's HTML, so the first paint doesn't wait
      // for a separate CSS request.
      inlineCss: true,
    },
    images: {
      // No image server in a static export: the loader picks pre-built WebP copies (npm run images).
      loader: 'custom',
      loaderFile: './src/lib/image-loader.ts',
      // Keep in step with WIDTHS in scripts/optimize-images.mjs.
      // 2560 keeps the full-screen hero sharp on large and high-density displays.
      deviceSizes: [640, 828, 1080, 1280, 1920, 2560],
      imageSizes: [256, 384],
    },
  };
}
