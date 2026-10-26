import { dictionaries, type Dictionary, type Locale } from '@/lib/i18n';
import type { NavLink } from '@/lib/site';
import { deepMerge, getPath, isPlainObject, setPath } from './merge';
import { defaultMedia, sectionsByKey, type MediaMap } from './sections';
import type { ContentRow } from './types';

const depth = (key: string) => key.split('.').length;

/**
 * The site dictionary for `locale` with CMS overrides applied. Parent sections are
 * applied before their children so a child's own row always wins.
 */
export function buildDictionary(locale: Locale, rows: ContentRow[] | undefined, nav: NavLink[] | undefined): Dictionary {
  let dictionary = dictionaries[locale];

  if (rows?.length) {
    const ordered = rows.filter((row) => sectionsByKey.has(row.section)).sort((a, b) => depth(a.section) - depth(b.section));
    for (const row of ordered) {
      const override = row[locale];
      if (override === undefined || override === null) continue;
      dictionary = setPath(dictionary, row.section, deepMerge(getPath(dictionary, row.section), override));
    }
  }

  // Built-in page links take their names from Global Settings → Navigation, breadcrumbs included.
  if (nav?.length) {
    let labels: Record<string, string> = dictionary.nav;
    for (const link of nav) {
      const label = link.label[locale];
      if (label && link.id in labels) labels = { ...labels, [link.id]: label };
    }
    dictionary = { ...dictionary, nav: labels as Dictionary['nav'] };
  }

  return dictionary;
}

export function buildMedia(rows: ContentRow[] | undefined): MediaMap {
  if (!rows?.length) return defaultMedia;
  let media = defaultMedia;
  for (const row of rows) {
    if (!(row.section in defaultMedia) || !isPlainObject(row.media)) continue;
    const section = row.section as keyof MediaMap;
    const merged: Record<string, unknown> = deepMerge<Record<string, unknown>>(defaultMedia[section], row.media);
    // An emptied photo list or slot falls back to the built-in photographs rather than leaving a blank frame.
    for (const [key, fallback] of Object.entries(defaultMedia[section])) {
      const value = merged[key];
      if (!value || (Array.isArray(value) && value.length === 0)) merged[key] = fallback;
    }
    media = { ...media, [section]: merged };
  }
  return media;
}
