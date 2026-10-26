'use client';

import { m } from 'framer-motion';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const options: { code: Locale; label: string; name: string }[] = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ar', label: 'AR', name: 'العربية' },
];

/** EN / AR segmented switch. `id` keeps the sliding pill unique when rendered twice. */
export function LanguageToggle({ id, className }: { id: string; className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.nav.switchLanguage}
      dir="ltr"
      className={cn('flex items-center rounded-full border border-ivory/20 p-0.5', className)}
    >
      {options.map((option) => {
        const active = locale === option.code;
        return (
          <button
            key={option.code}
            type="button"
            title={option.name}
            aria-pressed={active}
            onClick={() => setLocale(option.code)}
            className={cn(
              'relative isolate h-8 min-w-[2.6rem] rounded-full px-2.5 text-[0.66rem] font-semibold tracking-[0.14em] transition-colors duration-300',
              active ? 'text-indigo' : 'text-ivory/70 hover:text-ivory',
            )}
          >
            {active && (
              <m.span
                layoutId={`lang-pill-${id}`}
                className="absolute inset-0 -z-10 rounded-full bg-champagne"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="sr-only">{option.name}</span>
            <span aria-hidden>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
