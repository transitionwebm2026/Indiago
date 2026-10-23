'use client';

import { Navigation } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { mapsDirectionsUrl, mapsEmbedUrl, site } from '@/lib/site';

/** Google Maps embed (no API key required) centred on Villa 40, Al Safa St., Sheikh Zayed. */
export function StudioMap() {
  const { t, l } = useLanguage();
  const map = t.contact.map;

  return (
    <section className="section-y bg-ivory">
      <div className="container-luxe">
        <SectionHeading eyebrow={map.eyebrow} title={map.title} />

        <Reveal delay={0.1} className="relative mt-14">
          <div className="relative isolate aspect-[4/5] overflow-hidden card-frame rounded-[2rem] bg-linen-dark sm:aspect-[16/10] lg:aspect-[21/9]">
            <iframe
              title={map.mapTitle}
              src={mapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0 [filter:grayscale(0.55)_sepia(0.18)_contrast(1.05)]"
            />
            <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-indigo/10" />
          </div>

          <div className="relative -mt-16 mx-4 card-frame-dark rounded-3xl bg-indigo p-7 text-ivory sm:absolute sm:bottom-6 sm:start-6 sm:mx-0 sm:mt-0 sm:w-[22rem]">
            <Logo className="h-9" />
            <p className="mt-6 leading-relaxed text-ivory/80">{l(site.address)}</p>
            <a href={site.phoneHref} dir="ltr" className="mt-2 inline-block text-sm text-champagne transition-colors hover:text-ivory">
              {site.phone}
            </a>
            <ButtonLink href={mapsDirectionsUrl} size="sm" className="mt-6 w-full">
              <Navigation aria-hidden className="h-3.5 w-3.5" strokeWidth={1.75} />
              {map.directions}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
