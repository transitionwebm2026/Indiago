export type Locale = 'en' | 'ar';

/** A short string available in both site languages. */
export type Localized = Record<Locale, string>;

export const locales: Locale[] = ['en', 'ar'];
