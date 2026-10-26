import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans_Arabic, Inter, Noto_Naskh_Arabic } from 'next/font/google';
import type { ReactNode } from 'react';
import { CmsProvider } from '@/components/providers/CmsProvider';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { img, pageImages } from '@/lib/images';
import { site } from '@/lib/site';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const naskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-naskh',
  display: 'swap',
});
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-plex-arabic',
  display: 'swap',
});

const description =
  'Indigo Interiors is an interior design, fit-out and finishing company bringing UAE standards of quality to Egypt — residential, hospitality, corporate and healthcare interiors across Abu Dhabi and Greater Cairo.';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Indigo Interiors — Interior Architecture & Turnkey Fit-out | Sheikh Zayed, Egypt',
    template: '%s · Indigo Interiors',
  },
  description,
  applicationName: site.name,
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
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: 'Indigo Interiors — Interior Architecture & Turnkey Fit-out',
    description,
    url: site.url,
    locale: 'en_US',
    alternateLocale: ['ar_EG'],
    images: [{ url: img(pageImages.homeHero, 1200), width: 1200, height: 800, alt: 'Indigo Interiors' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indigo Interiors',
    description,
    images: [img(pageImages.homeHero, 1200)],
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
  email: site.email,
  telephone: site.phone,
  image: img(pageImages.homeHero, 1200),
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
