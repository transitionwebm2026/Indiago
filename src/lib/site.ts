import type { Localized } from '@/lib/i18n/types';

/**
 * Single source of truth for studio details.
 * Update contact information, social profiles and integrations here.
 */
export const site = {
  name: 'Indigo Interiors',
  url: 'https://www.indigoegy.com',
  email: 'info@indigoegy.com',
  phone: '+20 111 977 7662',
  phoneHref: 'tel:+201119777662',
  uaePhone: '+971 50 611 7874',
  uaePhoneHref: 'tel:+971506117874',
  whatsappNumber: '201119777662',
  address: {
    en: 'Villa 40, Al Safa Street, Sheikh Zayed, Egypt',
    ar: 'فيلا 40، شارع الصفا، الشيخ زايد، مصر',
  } satisfies Localized,
  mapQuery: 'Villa 40 Al Safa St, Sheikh Zayed City, Giza, Egypt',
  founder: {
    name: { en: 'Ahmed Abo Mosallam', ar: 'أحمد أبو مسلم' } satisfies Localized,
    role: { en: 'Founder & Principal Interior Designer', ar: 'المؤسس والمصمم الداخلي الرئيسي' } satisfies Localized,
    initials: 'AA',
    // Path under /public; leave empty to show the initials instead.
    portrait: '/Engphoto.jpeg',
  },
  social: [
    { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/indigo_interiors_studio/' },
    { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/share/1ERGDLpFSW/' },
  ],
  // Website design & development credit shown at the very end of the footer.
  credit: {
    name: 'Transition',
    href: 'https://transitioneg.com/',
    logo: '/transition-mark.png',
  },
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
