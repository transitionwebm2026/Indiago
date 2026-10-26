'use client';

import { MotionConfig } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { buildDictionary } from '@/lib/cms/content';
import { useContentRows, useSiteSettings } from '@/lib/cms/hooks';
import type { Dictionary, Locale, Localized } from '@/lib/i18n';

const STORAGE_KEY = 'indigo-locale';

interface LanguageContextValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  t: Dictionary;
  /** Picks the current-language value from a { en, ar } pair. */
  l: (value: Localized) => string;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Static HTML is pre-rendered in English; a saved Arabic preference is applied after hydration.
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'ar' || stored === 'en') setLocaleState(stored);
    } catch {
      // Storage can be unavailable (private mode); English remains the default.
    }
  }, []);

  // The admin dashboard is always English and left-to-right, whatever the visitor's site language.
  const isAdmin = (usePathname() ?? '').startsWith('/admin');

  useEffect(() => {
    const root = document.documentElement;
    const active = isAdmin ? 'en' : locale;
    root.lang = active;
    root.dir = active === 'ar' ? 'rtl' : 'ltr';
  }, [locale, isAdmin]);

  // Page copy edited in the CMS is layered over the built-in dictionaries.
  const rows = useContentRows();
  const { nav } = useSiteSettings();
  const t = useMemo(() => buildDictionary(locale, rows, nav), [locale, rows, nav]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage failures; the choice still applies for this visit.
    }
  }, []);

  const toggleLocale = useCallback(() => setLocale(locale === 'en' ? 'ar' : 'en'), [locale, setLocale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      dir: locale === 'ar' ? 'rtl' : 'ltr',
      t,
      // Untranslated CMS entries fall back to English rather than showing nothing.
      l: (entry: Localized) => entry[locale] || entry.en,
      setLocale,
      toggleLocale,
    }),
    [locale, t, setLocale, toggleLocale],
  );

  return (
    <LanguageContext.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return context;
}
