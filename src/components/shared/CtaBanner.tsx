'use client';

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
  /** Shows the project-type picker that pre-fills the brief and WhatsApp message. */
  interactive?: boolean;
}

/**
 * The inquiry banner that closes the home page: one full-width Deep Indigo band that runs straight
 * into the slim credit band below it (layout/SiteCredit.tsx), which shares its colour.
 */
export function CtaBanner({ interactive = false }: CtaBannerProps) {
  const { t, locale } = useLanguage();
  const { site, whatsappLink } = useSite();
  const [type, setType] = useState<PropertyType | null>(null);
  const typeOptions = t.contact.form.options.propertyType;

  const typeName = type ? (locale === 'en' ? typeOptions[type].toLowerCase() : typeOptions[type]) : '';
  const briefHref = type ? `/contact/?type=${type}#inquiry` : routes.inquiry;
  const message = type ? t.cta.typedMessage.replace('{type}', typeName) : t.whatsapp.defaultMessage;

  return (
    <section className="relative isolate overflow-hidden bg-indigo pb-10 pt-14 text-ivory md:pb-12 md:pt-20">
      <div aria-hidden className="absolute -end-40 -top-40 -z-10 h-[30rem] w-[30rem] rounded-full border border-champagne/15" />
      <div aria-hidden className="absolute -end-20 -top-20 -z-10 h-[30rem] w-[30rem] rounded-full border border-champagne/10" />

      <div className="container-luxe">
        <Reveal>
          <div className="grid items-end gap-9 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
            <div>
              <Eyebrow surface="dark">{t.cta.eyebrow}</Eyebrow>
              <h2 className="mt-4 text-balance font-serif text-[1.8rem] leading-[1.15] tracking-wide sm:text-4xl lg:text-[2.6rem]">
                <Highlight text={t.cta.title} surface="dark" />
              </h2>
              <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-ivory/70">{t.cta.body}</p>

              {interactive && (
                <div className="mt-7">
                  <p className="text-[0.62rem] font-medium uppercase tracking-ultra text-ivory/50">{t.cta.typeLabel}</p>
                  <div role="group" aria-label={t.cta.typeLabel} className="mt-3 flex flex-wrap gap-2">
                    {(Object.keys(typeOptions) as PropertyType[]).map((option) => {
                      const active = type === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setType(active ? null : option)}
                          className={cn(
                            'relative isolate rounded-full border px-4 py-2 text-[0.66rem] font-medium uppercase tracking-luxe transition-colors duration-300',
                            active ? 'border-champagne text-indigo' : 'border-ivory/20 text-ivory/75 hover:border-ivory/50',
                          )}
                        >
                          {/* A CSS fade rather than a shared layout animation, which would make the animation
                              library measure the whole page whenever it re-renders. */}
                          <span
                            aria-hidden
                            className={cn(
                              'absolute inset-0 -z-10 rounded-full bg-champagne transition-[opacity,transform] duration-300 ease-luxe',
                              active ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
                            )}
                          />
                          {typeOptions[option]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <ButtonLink href={briefHref} arrow className="w-full sm:w-auto">
                {t.cta.primary}
              </ButtonLink>
              <ButtonLink href={whatsappLink(message)} variant="outline-light" className="w-full sm:w-auto">
                <WhatsAppIcon className="h-4 w-4" />
                {t.cta.whatsapp}
              </ButtonLink>
              {site.phone && (
                <p className="mt-1 text-sm text-ivory/60">
                  {t.cta.callLabel}{' '}
                  <a href={site.phoneHref} dir="ltr" className="inline-block text-champagne transition-colors hover:text-ivory">
                    {site.phone}
                  </a>
                </p>
              )}
            </div>
          </div>
        </Reveal>

        {/* A fine rule with the diamond motif closes the band, just above the website credit. */}
        <div aria-hidden className="mt-12 flex items-center gap-4 md:mt-14">
          <span className="h-px flex-1 bg-champagne/30" />
          <span className="h-1.5 w-1.5 rotate-45 bg-champagne/70" />
          <span className="h-px flex-1 bg-champagne/30" />
        </div>
      </div>
    </section>
  );
}
