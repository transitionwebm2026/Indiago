'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ServiceIcon } from '@/components/services/ServiceIcon';
import { WorkflowTimeline } from '@/components/services/WorkflowTimeline';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { coreServiceIds } from '@/lib/data/services';
import { routes, serviceHref } from '@/lib/routes';
import { pad } from '@/lib/utils';

export function ServicesPreview() {
  const { t } = useLanguage();
  const copy = t.home.services;
  const services = coreServiceIds
    .map((id) => t.services.items.find((item) => item.id === id))
    .filter((item): item is (typeof t.services.items)[number] => Boolean(item));

  return (
    <section className="section-y relative isolate overflow-hidden bg-indigo text-ivory">
      <div className="container-luxe">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading surface="dark" eyebrow={copy.eyebrow} title={copy.title} body={copy.body} />
          <Reveal className="shrink-0">
            <ButtonLink href={routes.services} variant="outline-light" arrow>
              {copy.cta}
            </ButtonLink>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={index * 0.1} className="h-full">
              <Link
                href={serviceHref(service.id)}
                className="group flex h-full flex-col card-frame-dark rounded-3xl bg-indigo-700/30 p-8 hover:border-champagne/60 hover:bg-indigo-700/60 lg:p-9"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-900/60 text-champagne">
                    <ServiceIcon id={service.id} className="h-7 w-7" />
                  </span>
                  <span className="font-serif text-sm text-ivory/30">{pad(index + 1)}</span>
                </div>
                <h3 className="mt-12 font-serif text-2xl leading-snug tracking-wide text-ivory">{service.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ivory/60">{service.summary}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-8 text-[0.62rem] font-medium uppercase tracking-luxe text-champagne">
                  {t.common.readMore}
                  <ArrowRight
                    aria-hidden
                    strokeWidth={1.5}
                    className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-24">
          <Reveal>
            <h3 className="font-serif text-2xl tracking-wide text-ivory md:text-3xl">{copy.workflowTitle}</h3>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <WorkflowTimeline variant="compact" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
