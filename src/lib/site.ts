import { ar } from '@/lib/i18n/ar';
import { en } from '@/lib/i18n/en';
import type { Localized } from '@/lib/i18n/types';
import { primaryNav } from '@/lib/routes';

export const socialPlatforms = ['instagram', 'facebook', 'linkedin', 'x', 'youtube', 'whatsapp', 'website'] as const;

export type SocialId = (typeof socialPlatforms)[number];

export interface NavLink {
  /** Built-in pages use their nav key (home, about…); custom links get a generated ID. */
  id: string;
  href: string;
  label: Localized;
  visible: boolean;
}

export interface SocialLink {
  id: SocialId;
  label: string;
  href: string;
  visible: boolean;
}

/** Global studio configuration — the `site_settings` row in the CMS. */
export interface SiteSettings {
  name: string;
  url: string;
  /** Uploaded logo for dark surfaces; empty uses the built-in SVG lockup. */
  logo: string;
  nav: NavLink[];
  showNavCta: boolean;
  email: string;
  phone: string;
  /** Optional second line; hidden everywhere when empty. */
  uaePhone: string;
  /** Digits only, with country code — used for wa.me links. */
  whatsappNumber: string;
  address: Localized;
  map: {
    /** Address or place name the map searches for. */
    query: string;
    /** Optional custom Google Maps embed URL ("Share → Embed a map"). */
    embedUrl: string;
    lat: number | null;
    lng: number | null;
  };
  founder: {
    name: Localized;
    role: Localized;
    initials: string;
    /** Image URL or /public path; empty shows the initials instead. */
    portrait: string;
  };
  social: SocialLink[];
  /** Website design & development credit shown at the very end of the footer. */
  credit: { name: string; href: string; logo: string; visible: boolean };
  copyrightYear: number;
}

/** Settings plus the links derived from them. */
export interface ResolvedSite extends SiteSettings {
  phoneHref: string;
  uaePhoneHref: string;
  mapsDirectionsUrl: string;
  mapsEmbedUrl: string;
}

/**
 * Built-in studio details. They are what the site shows until the CMS is set up,
 * and what "Import website content" copies into it.
 */
export const defaultSiteSettings: SiteSettings = {
  name: 'Indigo Interiors',
  url: 'https://indigoegy.com',
  logo: '',
  nav: primaryNav.map((item) => ({
    id: item.key,
    href: item.href,
    label: { en: en.nav[item.key], ar: ar.nav[item.key] },
    visible: true,
  })),
  showNavCta: true,
  email: 'info@indigoegy.com',
  phone: '+20 111 977 7662',
  uaePhone: '+971 50 611 7874',
  whatsappNumber: '201119777662',
  address: {
    en: 'Villa 40, Al Safa Street, Sheikh Zayed, Egypt',
    ar: 'فيلا 40، شارع الصفا، الشيخ زايد، مصر',
  },
  map: { query: 'Villa 40 Al Safa St, Sheikh Zayed City, Giza, Egypt', embedUrl: '', lat: null, lng: null },
  founder: {
    name: { en: 'Ahmed Abo Mosallam', ar: 'أحمد أبو مسلم' },
    role: { en: 'Founder & Principal Interior Designer', ar: 'المؤسس وكبير المصممين' },
    initials: 'AA',
    portrait: '/Engphoto.jpeg',
  },
  social: [
    { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/indigo_interiors_studio/', visible: true },
    { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/share/1ERGDLpFSW/', visible: true },
  ],
  credit: { name: 'Transition', href: 'https://transitioneg.com/', logo: '/transition-mark.png', visible: true },
  copyrightYear: 2026,
};

/** "+20 111 977 7662" → "tel:+201119777662" */
export function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '');
  return digits ? `tel:${digits}` : '';
}

export function buildWhatsappLink(number: string, message?: string) {
  const base = `https://wa.me/${number.replace(/\D/g, '')}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function resolveSite(settings: SiteSettings): ResolvedSite {
  const { query, embedUrl, lat, lng } = settings.map;
  const target = lat !== null && lng !== null ? `${lat},${lng}` : query;
  return {
    ...settings,
    phoneHref: telHref(settings.phone),
    uaePhoneHref: telHref(settings.uaePhone),
    mapsDirectionsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(target)}`,
    mapsEmbedUrl: embedUrl || `https://www.google.com/maps?q=${encodeURIComponent(target)}&z=15&output=embed`,
  };
}

/** Build-time studio details (metadata, JSON-LD, sitemap). Components read the live values with useSite(). */
export const site = resolveSite(defaultSiteSettings);
