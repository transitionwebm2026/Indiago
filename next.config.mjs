/** @type {import('next').NextConfig} */
const nextConfig = {
  // Plain HTML/CSS/JS in out/ for Hostinger's static hosting — no Node.js server needed.
  output: 'export',
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
