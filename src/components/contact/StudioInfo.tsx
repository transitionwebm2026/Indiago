'use client';

import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Link } from '@/components/ui/Link';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useSite } from '@/lib/cms/hooks';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';

interface InfoCard {
  label: string;
  value: string;
  detail?: string;
  href: string;
  external?: boolean;
  ltr?: boolean;
}

export function StudioInfo() {
  const { t, l } = useLanguage();
  const { site } = useSite();
  const info = t.contact.info;

  // Details cleared in Global Settings drop out of the grid.
  const cards: InfoCard[] = [
    { label: info.address, value: l(site.address), href: site.mapsDirectionsUrl, external: true },
    { label: info.phone, value: site.phone, href: site.phoneHref, ltr: true },
    { label: info.phoneUae, value: site.uaePhone, href: site.uaePhoneHref, ltr: true },
    { label: info.email, value: site.email, href: `mailto:${site.email}` },
    {
      label: info.management,
      value: l(site.founder.name),
      detail: l(site.founder.role),
      href: routes.about,
    },
  ].filter((card) => card.value);

  return (
    <section className="section-y bg-linen">
      <div className="container-luxe">
        <SectionHeading eyebrow={info.eyebrow} title={info.title} />

        {/* Flex rather than grid so an incomplete last row sits centred. */}
        <ul className="mt-14 flex flex-wrap justify-center gap-4">
          {cards.map((card, index) => {
            const content = (
              <>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[0.62rem] font-medium uppercase tracking-luxe text-charcoal-muted">{card.label}</p>
                  <ArrowUpRight
                    aria-hidden
                    strokeWidth={1.5}
                    className="h-4 w-4 shrink-0 text-charcoal-muted transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo rtl:-scale-x-100"
                  />
                </div>
                <p
                  dir={card.ltr ? 'ltr' : undefined}
                  className={cn(
                    'mt-8 font-serif text-lg leading-snug tracking-wide text-indigo',
                    card.ltr && 'rtl:text-right',
                    card.href.startsWith('mailto:') && 'break-all',
                  )}
                >
                  {card.value}
                </p>
                {card.detail && <p className="mt-1 text-sm text-charcoal-soft">{card.detail}</p>}
              </>
            );
            const className =
              'card-frame group flex h-full flex-col rounded-3xl bg-ivory p-6 hover:border-champagne';

            return (
              <li key={card.label} className="w-full sm:w-[calc((100%_-_1rem)/2)] lg:w-[calc((100%_-_2rem)/3)]">
                <Reveal delay={index * 0.08} className="h-full">
                  {card.href.startsWith('/') ? (
                    <Link href={card.href} className={className}>
                      {content}
                    </Link>
                  ) : (
                    <a
                      href={card.href}
                      className={className}
                      {...(card.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {content}
                    </a>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
