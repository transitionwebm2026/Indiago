import type { Localized } from '@/lib/i18n/types';

/**
 * Single source of truth for studio details.
 * Update contact information, social profiles and integrations here.
 */
export const site = {
  name: 'Indigo Interiors',
  url: 'https://www.indigoegy.com',
  displayUrl: 'www.indigoegy.com',
  email: 'a.abomosallam@indigoegy.com',
  phone: '+20 111 226 6054',
  phoneHref: 'tel:+201112266054',
  whatsappNumber: '201112266054',
  address: {
    en: 'Villa 40 Al Safa St., Sheikh Zayed, Egypt',
    ar: 'فيلا 40، شارع الصفا، الشيخ زايد، مصر',
  } satisfies Localized,
  mapQuery: 'Villa 40 Al Safa St, Sheikh Zayed City, Giza, Egypt',
  founder: {
    name: { en: 'Ahmed Abomosallam', ar: 'أحمد أبومسلم' } satisfies Localized,
    role: { en: 'Founder & Managing Director', ar: 'المؤسس والعضو المنتدب' } satisfies Localized,
    initials: 'AA',
    // Drop a portrait into /public/images/team/ and set the path here, e.g. '/images/team/ahmed-abomosallam.jpg'
    portrait: '',
  },
  // Replace with the studio's real profile URLs.
  social: [
    { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/' },
    { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { id: 'pinterest', label: 'Pinterest', href: 'https://www.pinterest.com/' },
  ],
  // Optional: Web3Forms access key (see .env.example). Empty = WhatsApp / mailto fallbacks.
  web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? '',
  copyrightYear: 2026,
} as const;

export type SocialId = (typeof site.social)[number]['id'];

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const mapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}`;
export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&z=15&output=embed`;
