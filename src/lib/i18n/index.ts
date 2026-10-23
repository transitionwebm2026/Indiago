import { ar } from './ar';
import { en, type Dictionary } from './en';
import type { Locale } from './types';

export const dictionaries: Record<Locale, Dictionary> = { en, ar };

export type { Dictionary };
export type { Locale, Localized } from './types';
