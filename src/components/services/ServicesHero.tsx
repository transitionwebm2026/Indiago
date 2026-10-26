'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { PageHero } from '@/components/ui/PageHero';
import { useMedia, useServices } from '@/lib/cms/hooks';
import { serviceHref } from '@/lib/routes';

export function ServicesHero() {
  const { t, l } = useLanguage();
  const { slides } = useMedia('services.hero');
  const services = useServices();
  const hero = t.services.hero;

  return (
    <PageHero
      eyebrow={hero.eyebrow}
      title={hero.title}
      body={hero.body}
      slides={slides}
      crumbs={[{ label: t.nav.services }]}
    >
      <ul className="flex flex-wrap gap-2">
        {services.map((service) => (
          <li key={service.id}>
            <a
              href={serviceHref(service.id)}
              className="inline-block rounded-full border border-ivory/20 px-4 py-2 text-[0.62rem] font-medium uppercase tracking-luxe text-ivory/75 transition-colors hover:border-champagne hover:text-champagne"
            >
              {l(service.title)}
            </a>
          </li>
        ))}
      </ul>
    </PageHero>
  );
}
