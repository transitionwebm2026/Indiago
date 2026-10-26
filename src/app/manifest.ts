import type { MetadataRoute } from 'next';
import { siteDescription } from '@/lib/seo';
import { site } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: 'Indigo',
    description: siteDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#F9F7F2',
    theme_color: '#2F2557',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
