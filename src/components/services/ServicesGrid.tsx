'use client';

import Image from 'next/image';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useServices } from '@/lib/cms/hooks';
import { img } from '@/lib/images';
import { cn, pad } from '@/lib/utils';

/** The services as alternating rows: a framed photograph on one side, the service and its deliverables on the other. */
export function ServicesGrid() {
  const { t, l } = useLanguage();
  const services = useServices();
  const grid = t.services.grid;

  return (
    <section className="section-y bg-ivory">
      <div className="container-luxe">
        <SectionHeading eyebrow={grid.eyebrow} title={grid.title} body={grid.body} size="lg" />

        <div className="mt-12 space-y-12 md:mt-14 md:space-y-16 lg:space-y-20">
          {services.map((service, index) => {
            // Every other row puts its photograph on the far side.
            const flipped = index % 2 === 1;
            return (
              <article
                key={service.id}
                id={service.id}
                className="grid scroll-mt-28 items-center gap-6 md:gap-8 lg:grid-cols-12 lg:gap-12"
              >
                <Reveal
                  className={cn(
                    'card-frame relative isolate aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-linen-dark lg:col-span-5',
                    flipped && 'lg:order-2',
                  )}
                >
                  {service.image && (
                    <Image
                      src={img(service.image, 1100)}
                      alt={l(service.title)}
                      fill
                      sizes="(min-width: 1320px) 520px, (min-width: 1024px) 42vw, 100vw"
                      className="object-cover transition-transform duration-1200 ease-luxe hover:scale-[1.04]"
                    />
                  )}
                </Reveal>

                <Reveal delay={0.1} className="lg:col-span-7">
                  <span className="font-serif text-sm text-champagne-700">{pad(index + 1)}</span>
                  <h3 className="mt-2 font-serif text-2xl leading-snug tracking-wide text-indigo sm:text-[1.75rem] lg:text-[2rem]">
                    {l(service.title)}
                  </h3>
                  <p className="mt-3 text-pretty leading-relaxed text-charcoal-soft">{l(service.summary)}</p>
                  {service.deliverables.length > 0 && (
                    <ul className="mt-5 grid gap-x-6 gap-y-2.5 border-t border-indigo/10 pt-5 sm:grid-cols-2">
                      {service.deliverables.map((item, itemIndex) => (
                        <li key={`${item.en}-${itemIndex}`} className="flex items-start gap-3 text-sm text-indigo">
                          <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-champagne" />
                          {l(item)}
                        </li>
                      ))}
                    </ul>
                  )}
                </Reveal>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
