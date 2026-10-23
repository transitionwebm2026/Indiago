'use client';

import Link from 'next/link';
import { ArrowUpRight, Globe, Mail, MapPin, Phone, UserRound, type LucideIcon } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { routes } from '@/lib/routes';
import { mapsDirectionsUrl, site } from '@/lib/site';
import { cn } from '@/lib/utils';

interface InfoCard {
  icon: LucideIcon;
  label: string;
  value: string;
  detail?: string;
  href: string;
  external?: boolean;
  ltr?: boolean;
}

export function StudioInfo() {
  const { t, l } = useLanguage();
  const info = t.contact.info;

  const cards: InfoCard[] = [
    { icon: MapPin, label: info.address, value: l(site.address), href: mapsDirectionsUrl, external: true },
    { icon: Phone, label: info.phone, value: site.phone, href: site.phoneHref, ltr: true },
    { icon: Mail, label: info.email, value: site.email, href: `mailto:${site.email}` },
    { icon: Globe, label: info.website, value: site.displayUrl, href: site.url, external: true },
    {
      icon: UserRound,
      label: info.management,
      value: l(site.founder.name),
      detail: l(site.founder.role),
      href: routes.about,
    },
  ];

  return (
    <section className="section-y bg-linen">
      <div className="container-luxe">
        <SectionHeading eyebrow={info.eyebrow} title={info.title} />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {cards.map((card, index) => {
            const Icon = card.icon;
            const content = (
              <>
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-champagne/50 text-champagne-700 transition-colors duration-500 group-hover:border-champagne group-hover:bg-indigo group-hover:text-champagne">
                    <Icon aria-hidden className="h-5 w-5" strokeWidth={1.25} />
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    strokeWidth={1.5}
                    className="h-4 w-4 text-charcoal-muted transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo rtl:-scale-x-100"
                  />
                </div>
                <p className="mt-10 text-[0.62rem] font-medium uppercase tracking-luxe text-charcoal-muted">{card.label}</p>
                <p
                  dir={card.ltr ? 'ltr' : undefined}
                  className={cn(
                    'mt-2 font-serif text-lg leading-snug tracking-wide text-indigo',
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
              <li key={card.label} className="h-full">
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
