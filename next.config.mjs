/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true }, // Crucial for static site export
  trailingSlash: true,
};
export default nextConfig;
