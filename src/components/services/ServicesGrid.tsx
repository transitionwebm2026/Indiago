'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { isServiceId, serviceImages } from '@/lib/data/services';
import { img } from '@/lib/images';
import { pad } from '@/lib/utils';
import { ServiceIcon } from './ServiceIcon';

export function ServicesGrid() {
  const { t } = useLanguage();
  const grid = t.services.grid;

  return (
    <section className="section-y bg-ivory">
      <div className="container-luxe">
        <SectionHeading eyebrow={grid.eyebrow} title={grid.title} body={grid.body} />

        <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((service, index) => (
            <Reveal key={service.id} delay={(index % 3) * 0.1}>
              <article
                id={service.id}
                className="card-frame group flex h-full scroll-mt-28 flex-col rounded-[1.75rem] bg-white/70 p-2.5 hover:border-champagne sm:p-3"
              >
                <div className="relative isolate aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-linen-dark">
                  {isServiceId(service.id) && (
                    <Image
                      src={img(serviceImages[service.id], 1000)}
                      alt={service.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-1200 ease-luxe group-hover:scale-[1.05]"
                    />
                  )}
                  <span className="absolute start-4 top-4 grid h-14 w-14 place-items-center rounded-2xl bg-indigo text-champagne">
                    <ServiceIcon id={service.id} className="h-6 w-6" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <span className="font-serif text-sm text-champagne-700">{pad(index + 1)}</span>
                  <h3 className="mt-3 font-serif text-2xl leading-snug tracking-wide text-indigo">{service.title}</h3>
                  <p className="mt-3 leading-relaxed text-charcoal-soft">{service.summary}</p>
                  <ul className="mt-6 space-y-2.5 border-t border-indigo/10 pt-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-indigo">
                        <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-champagne-700" strokeWidth={1.5} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
