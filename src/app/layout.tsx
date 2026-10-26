import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans_Arabic, Inter, Noto_Naskh_Arabic } from 'next/font/google';
import type { ReactNode } from 'react';
import { CmsProvider } from '@/components/providers/CmsProvider';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { shareImage, siteDescription as description } from '@/lib/seo';
import { site } from '@/lib/site';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
// The Arabic faces load only once Arabic text is on screen, so English visits don't download them.
const naskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-naskh',
  display: 'swap',
  preload: false,
});
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-plex-arabic',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Indigo Interiors — Interior Architecture & Turnkey Fit-out | Sheikh Zayed, Egypt',
    template: '%s · Indigo Interiors',
  },
  description,
  applicationName: site.name,
  creator: site.name,
  publisher: site.name,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  // Google Search Console → Settings → Ownership verification → HTML tag: set the content value at build time.
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  keywords: [
    'interior design Egypt',
    'interior design Sheikh Zayed',
    'turnkey fit-out Cairo',
    'luxury interior architecture',
    'villa interior design',
    'commercial fit-out Egypt',
    'interior finishing works',
    'fit-out Abu Dhabi',
    'Indigo Interiors',
  ],
  authors: [{ name: site.name, url: site.url }],
  // Defaults for pages without their own (404, dashboard). Public pages set theirs with pageMetadata().
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: 'Indigo Interiors — Interior Architecture & Turnkey Fit-out',
    description,
    locale: 'en_US',
    alternateLocale: ['ar_EG'],
    images: [shareImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indigo Interiors — Interior Architecture & Turnkey Fit-out',
    description,
    images: [shareImage],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#2F2557',
  width: 'device-width',
  initialScale: 1,
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: site.name,
  url: site.url,
  description,
  email: site.email,
  telephone: site.phone,
  image: `${site.url}${shareImage.url}`,
  logo: `${site.url}/icon-512.png`,
  sameAs: site.social.filter((social) => social.visible).map((social) => social.href),
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Villa 40, Al Safa St.',
    addressLocality: 'Sheikh Zayed',
    addressRegion: 'Giza',
    addressCountry: 'EG',
  },
  founder: { '@type': 'Person', name: site.founder.name.en, jobTitle: site.founder.role.en },
  areaServed: ['Egypt', 'United Arab Emirates'],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${inter.variable} ${naskh.variable} ${plexArabic.variable}`}
    >
      <body>
        <CmsProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </CmsProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
