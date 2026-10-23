import type { Locale } from '@/lib/i18n/types';

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(isoDate: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

export function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function isValidPhone(value: string) {
  const digits = value.replace(/[^\d]/g, '');
  return /^[+\d\s()-]+$/.test(value.trim()) && digits.length >= 8 && digits.length <= 15;
}
