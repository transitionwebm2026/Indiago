'use client';

import { m } from 'framer-motion';
import { useState } from 'react';
import { WhatsAppIcon } from '@/components/icons/SocialIcons';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Highlight } from '@/components/ui/Highlight';
import { Reveal } from '@/components/ui/Reveal';
import { useSite } from '@/lib/cms/hooks';
import type { PropertyType } from '@/lib/inquiry';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';

interface CtaBannerProps {
  background?: 'linen' | 'ivory';
  /** Shows the project-type picker that pre-fills the brief and WhatsApp message. */
  interactive?: boolean;
}

/** Deep Indigo inquiry banner that closes the home page. */
export function CtaBanner({ background = 'linen', interactive = false }: CtaBannerProps) {
  const { t, locale } = useLanguage();
  const { site, whatsappLink } = useSite();
  const [type, setType] = useState<PropertyType | null>(null);
  const typeOptions = t.contact.form.options.propertyType;

  const typeName = type ? (locale === 'en' ? typeOptions[type].toLowerCase() : typeOptions[type]) : '';
  const briefHref = type ? `/contact/?type=${type}#inquiry` : routes.inquiry;
  const message = type ? t.cta.typedMessage.replace('{type}', typeName) : t.whatsapp.defaultMessage;

  return (
    <section className={cn('section-y', background === 'linen' ? 'bg-linen' : 'bg-ivory')}>
      <div className="container-luxe">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-indigo px-6 py-12 text-ivory sm:px-12 sm:py-14 md:rounded-[2.5rem] md:px-16 md:py-20">
            <div aria-hidden className="absolute -end-40 -top-40 -z-10 h-[26rem] w-[26rem] rounded-full border border-champagne/15" />
            <div aria-hidden className="absolute -end-20 -top-20 -z-10 h-[26rem] w-[26rem] rounded-full border border-champagne/10" />
            <div aria-hidden className="pointer-events-none absolute inset-3 -z-10 rounded-[1.5rem] border border-champagne/25 md:inset-4 md:rounded-[2rem]" />

            <div className="grid items-end gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
              <div>
                <Eyebrow surface="dark">{t.cta.eyebrow}</Eyebrow>
                <h2 className="mt-6 text-balance font-serif text-[2.1rem] leading-[1.12] tracking-wide sm:text-5xl lg:text-[3.4rem]">
                  <Highlight text={t.cta.title} surface="dark" />
                </h2>
                <p className="mt-6 max-w-xl leading-relaxed text-ivory/70">{t.cta.body}</p>

                {interactive && (
                  <div className="mt-10">
                    <p className="text-[0.62rem] font-medium uppercase tracking-ultra text-ivory/50">{t.cta.typeLabel}</p>
                    <div role="group" aria-label={t.cta.typeLabel} className="mt-4 flex flex-wrap gap-2">
                      {(Object.keys(typeOptions) as PropertyType[]).map((option) => {
                        const active = type === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setType(active ? null : option)}
                            className={cn(
                              'relative isolate rounded-full border px-4 py-2.5 text-[0.66rem] font-medium uppercase tracking-luxe transition-colors duration-300',
                              active ? 'border-champagne text-indigo' : 'border-ivory/20 text-ivory/75 hover:border-ivory/50',
                            )}
                          >
                            {active && (
                              <m.span
                                layoutId="cta-type"
                                className="absolute inset-0 -z-10 rounded-full bg-champagne"
                                transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                              />
                            )}
                            {typeOptions[option]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 lg:items-end">
                <ButtonLink href={briefHref} size="lg" arrow className="w-full sm:w-auto">
                  {t.cta.primary}
                </ButtonLink>
                <ButtonLink href={whatsappLink(message)} variant="outline-light" size="lg" className="w-full sm:w-auto">
                  <WhatsAppIcon className="h-4 w-4" />
                  {t.cta.whatsapp}
                </ButtonLink>
                {site.phone && (
                  <p className="mt-2 text-sm text-ivory/60">
                    {t.cta.callLabel}{' '}
                    <a href={site.phoneHref} dir="ltr" className="inline-block text-champagne transition-colors hover:text-ivory">
                      {site.phone}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
