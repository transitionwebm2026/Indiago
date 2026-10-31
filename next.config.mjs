// The address the site is served from, used for canonical URLs, the sitemap and share images.
// Vercel builds take the project's production domain (its custom domain once one is added, otherwise
// the vercel.app address); other builds use indigoegy.com. NEXT_PUBLIC_SITE_URL overrides both.
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || (productionHost ? `https://${productionHost}` : 'https://indigoegy.com');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Plain HTML/CSS/JS in out/ for Hostinger's static hosting — no Node.js server needed.
  output: 'export',
  // Inlined at build time, so server-rendered pages and the browser see the same address.
  env: { NEXT_PUBLIC_SITE_URL: siteUrl },
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
export default nextConfig;
