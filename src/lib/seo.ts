import type { Metadata } from 'next';
import { site } from '@/lib/site';

export const siteDescription =
  'Indigo Interiors is an interior design, fit-out and finishing company bringing UAE standards of quality to Egypt — residential, hospitality, corporate and healthcare interiors across Abu Dhabi and Greater Cairo.';

/** 1200 × 630 logo card (public/og-image.jpg), used wherever a page has no photograph of its own. */
export const shareImage = {
  url: '/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'Indigo Interiors logo',
};

interface PageSeo {
  /** Goes through the root layout's "%s · Indigo Interiors" template unless absolute. */
  title: string | { absolute: string };
  description: string;
  /** Route path with its trailing slash, e.g. "/about/". Resolved against the production domain. */
  path: string;
  image?: { url: string; alt: string };
  article?: { publishedTime: string; authors: string[] };
}

/** Title, description, canonical URL, Open Graph and Twitter card for one public page. */
export function pageMetadata({ title, description, path, image, article }: PageSeo): Metadata {
  const socialTitle = typeof title === 'string' ? `${title} · ${site.name}` : title.absolute;
  const images = [image ?? shareImage];

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      siteName: site.name,
      url: path,
      title: socialTitle,
      description,
      locale: 'en_US',
      alternateLocale: ['ar_EG'],
      images,
      ...(article ? { type: 'article', ...article } : { type: 'website' }),
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: images.map(({ url, alt }) => ({ url, alt })),
    },
  };
}
