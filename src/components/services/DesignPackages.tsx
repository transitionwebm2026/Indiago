'use client';

import { Check, Minus } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/SocialIcons';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Highlight } from '@/components/ui/Highlight';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useSite } from '@/lib/cms/hooks';
import type { Dictionary } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/** Indigo Signature, highlighted as the recommended package. */
const RECOMMENDED = 1;

type Packages = Dictionary['services']['packages'];

/** A WhatsApp message listing the package's contents and asking for its price (WhatsApp renders *text* as bold). */
function pricingMessage(packages: Packages, item: Packages['items'][number]) {
  const { message } = packages;
  return [
    message.greeting,
    '',
    message.intro.replace('{name}', item.name).replace('{tagline}', item.tagline),
    '',
    `*${packages.included}:*`,
    ...item.features.map((feature) => `• ${feature}`),
    '',
    `*${packages.boq}:* ${item.boq}`,
    `*${packages.revisions}:* ${item.revisions}`,
    '',
    message.question,
  ].join('\n');
}

/** Three design packages, the fixed supervision fee and a feature-by-feature comparison. */
export function DesignPackages() {
  const { t } = useLanguage();
  const { whatsappLink } = useSite();
  const packages = t.services.packages;
  const compare = packages.compare;

  return (
    <section id="packages" className="section-y scroll-mt-20 bg-linen">
      <div className="container-luxe">
        <SectionHeading eyebrow={packages.eyebrow} title={packages.title} body={packages.body} align="center" />

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {packages.items.map((item, index) => {
            const featured = index === RECOMMENDED;
            const terms = [
              { label: packages.boq, value: item.boq },
              { label: packages.revisions, value: item.revisions },
            ];
            return (
              <Reveal key={item.name} delay={index * 0.1} className="h-full">
                <article
                  className={cn(
                    'relative flex h-full flex-col overflow-hidden rounded-[2rem] p-7 pt-9 sm:p-9 sm:pt-11',
                    featured ? 'bg-indigo text-ivory' : 'card-frame bg-white/80 text-indigo',
                  )}
                >
                  <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-champagne" />
                  <p
                    className={cn(
                      'w-fit rounded-full px-3.5 py-1.5 text-[0.6rem] font-medium uppercase tracking-luxe',
                      featured ? 'bg-champagne text-indigo' : 'border border-champagne/60 text-champagne-800',
                    )}
                  >
                    {featured ? packages.recommended : packages.label}
                  </p>
                  <h3 className="mt-6 font-serif text-3xl tracking-wide">{item.name}</h3>
                  <p className={cn('mt-2 font-serif text-lg tracking-wide', featured ? 'text-champagne' : 'text-champagne-700')}>
                    {item.tagline}
                  </p>
                  <p className={cn('mt-6 text-sm leading-relaxed', featured ? 'text-ivory/70' : 'text-charcoal-soft')}>
                    <span className={cn('font-medium', featured ? 'text-ivory' : 'text-indigo')}>{packages.idealFor}:</span>{' '}
                    {item.idealFor}
                  </p>

                  <p
                    className={cn(
                      'mt-8 border-t pt-6 text-[0.62rem] font-medium uppercase tracking-ultra',
                      featured ? 'border-ivory/15 text-champagne' : 'border-indigo/10 text-champagne-800',
                    )}
                  >
                    {packages.included}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {item.features.map((feature) => (
                      <li
                        key={feature}
                        className={cn('flex items-start gap-3 text-sm leading-relaxed', featured ? 'text-ivory/85' : 'text-indigo')}
                      >
                        <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-champagne" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <dl className={cn('space-y-2 border-t pt-6 text-sm', featured ? 'border-ivory/15' : 'border-indigo/10')}>
                      {terms.map((term) => (
                        <div key={term.label} className="flex flex-wrap gap-x-2">
                          <dt className={cn('font-medium', featured ? 'text-champagne' : 'text-champagne-800')}>{term.label}:</dt>
                          <dd className={featured ? 'text-ivory/85' : 'text-indigo'}>{term.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <ButtonLink
                      href={whatsappLink(pricingMessage(packages, item))}
                      variant={featured ? 'primary' : 'solid-dark'}
                      aria-label={`${packages.whatsapp} — ${item.name}`}
                      className="mt-7 w-full"
                    >
                      <WhatsAppIcon className="h-4 w-4 shrink-0" />
                      {packages.whatsapp}
                    </ButtonLink>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-5">
          <div className="flex flex-col gap-4 rounded-[2rem] bg-champagne p-7 text-indigo sm:flex-row sm:items-center sm:gap-10 sm:p-9">
            <p dir="ltr" className="font-serif text-6xl leading-none tracking-wide md:text-7xl">
              {packages.supervision.value}
            </p>
            <div>
              <h3 className="font-serif text-2xl tracking-wide">{packages.supervision.title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-indigo/80">{packages.supervision.body}</p>
            </div>
          </div>
        </Reveal>

        <div className="mt-24 text-center">
          <Reveal>
            <Eyebrow>{compare.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h3 className="mt-5 font-serif text-3xl tracking-wide text-indigo sm:text-4xl">
              <Highlight text={compare.title} />
            </h3>
          </Reveal>
        </div>
        <Reveal delay={0.12} className="mt-10 overflow-x-auto rounded-[2rem] card-frame bg-white/80">
          <table className="w-full min-w-[40rem] border-collapse text-sm">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-5 text-start text-[0.62rem] font-medium uppercase tracking-ultra text-champagne-800"
                >
                  {compare.feature}
                </th>
                {packages.items.map((item, index) => (
                  <th
                    key={item.name}
                    scope="col"
                    className={cn(
                      'px-4 py-5 text-center font-serif text-base font-normal tracking-wide',
                      index === RECOMMENDED ? 'bg-indigo text-champagne' : 'text-indigo',
                    )}
                  >
                    {item.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compare.rows.map((row) => {
                const cells: (string | boolean)[] = row.values;
                return (
                  <tr key={row.label} className="border-t border-indigo/10">
                    <th scope="row" className="px-6 py-4 text-start font-normal text-charcoal-soft">
                      {row.label}
                    </th>
                    {cells.map((cell, index) => {
                      const featured = index === RECOMMENDED;
                      return (
                        <td key={index} className={cn('px-4 py-4 text-center', featured ? 'bg-indigo text-ivory' : 'text-indigo')}>
                          {cell === true ? (
                            <>
                              <Check
                                aria-hidden
                                strokeWidth={2}
                                className={cn('mx-auto h-4 w-4', featured ? 'text-champagne' : 'text-champagne-700')}
                              />
                              <span className="sr-only">{compare.included}</span>
                            </>
                          ) : cell === false ? (
                            <>
                              <Minus
                                aria-hidden
                                strokeWidth={1.5}
                                className={cn('mx-auto h-4 w-4', featured ? 'text-ivory/30' : 'text-charcoal-muted/60')}
                              />
                              <span className="sr-only">{compare.notIncluded}</span>
                            </>
                          ) : (
                            <span className="font-medium">{cell}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}
