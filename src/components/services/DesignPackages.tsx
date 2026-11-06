'use client';

import { WhatsAppIcon } from '@/components/icons/SocialIcons';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
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

/** Three design packages and the fixed supervision fee. */
export function DesignPackages() {
  const { t } = useLanguage();
  const { whatsappLink } = useSite();
  const packages = t.services.packages;

  return (
    <section id="packages" className="section-y scroll-mt-20 bg-linen">
      <div className="container-luxe">
        <SectionHeading eyebrow={packages.eyebrow} title={packages.title} body={packages.body} align="center" size="lg" />

        <div className="mx-auto mt-12 grid max-w-md gap-4 lg:max-w-none lg:grid-cols-3">
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
                    'relative flex h-full flex-col overflow-hidden rounded-[1.25rem] p-5 pt-6 sm:p-6 sm:pt-7',
                    featured ? 'bg-indigo text-ivory' : 'card-frame bg-white/80 text-indigo',
                  )}
                >
                  <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-champagne" />
                  <p
                    className={cn(
                      'w-fit rounded-full px-3 py-1 text-[0.56rem] font-medium uppercase tracking-luxe',
                      featured ? 'bg-champagne text-indigo' : 'border border-champagne/60 text-champagne-800',
                    )}
                  >
                    {featured ? packages.recommended : packages.label}
                  </p>
                  <h3 className="mt-4 font-serif text-2xl tracking-wide sm:text-[1.65rem]">{item.name}</h3>
                  <p className={cn('mt-1 font-serif text-base tracking-wide', featured ? 'text-champagne' : 'text-champagne-700')}>
                    {item.tagline}
                  </p>
                  <p className={cn('mt-4 text-[0.82rem] leading-relaxed', featured ? 'text-ivory/70' : 'text-charcoal-soft')}>
                    <span className={cn('font-medium', featured ? 'text-ivory' : 'text-indigo')}>{packages.idealFor}:</span>{' '}
                    {item.idealFor}
                  </p>

                  <p
                    className={cn(
                      'mt-5 border-t pt-4 text-[0.58rem] font-medium uppercase tracking-ultra',
                      featured ? 'border-ivory/15 text-champagne' : 'border-indigo/10 text-champagne-800',
                    )}
                  >
                    {packages.included}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {item.features.map((feature) => (
                      <li
                        key={feature}
                        className={cn('flex items-start gap-2.5 text-[0.82rem] leading-relaxed', featured ? 'text-ivory/85' : 'text-indigo')}
                      >
                        <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-champagne" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-5">
                    <dl className={cn('space-y-1.5 border-t pt-4 text-[0.82rem]', featured ? 'border-ivory/15' : 'border-indigo/10')}>
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
                      size="sm"
                      className="mt-5 w-full"
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

        <Reveal className="mx-auto mt-4 max-w-md lg:max-w-none">
          <div className="flex flex-col gap-3 rounded-[1.25rem] bg-champagne p-5 text-indigo sm:flex-row sm:items-center sm:gap-7 sm:p-6">
            <p dir="ltr" className="font-serif text-4xl leading-none tracking-wide md:text-5xl">
              {packages.supervision.value}
            </p>
            <div>
              <h3 className="font-serif text-lg tracking-wide sm:text-xl">{packages.supervision.title}</h3>
              <p className="mt-1 max-w-2xl text-[0.82rem] leading-relaxed text-indigo/80">{packages.supervision.body}</p>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
