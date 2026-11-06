'use client';

import { Navigation } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useSite } from '@/lib/cms/hooks';

/** Google Maps embed (no API key required) centred on the studio address set in Global Settings → Map. */
export function StudioMap() {
  const { t, l } = useLanguage();
  const { site } = useSite();
  const map = t.contact.map;

  return (
    <section className="section-y bg-ivory">
      <div className="container-luxe">
        <SectionHeading eyebrow={map.eyebrow} title={map.title} />

        <Reveal delay={0.1} className="relative mt-10">
          <div className="relative isolate aspect-square overflow-hidden card-frame rounded-[1.25rem] bg-linen-dark sm:aspect-[2/1] lg:aspect-[3/1]">
            <iframe
              title={map.mapTitle}
              src={site.mapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0 [filter:grayscale(0.55)_sepia(0.18)_contrast(1.05)]"
            />
            <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[1.25rem] ring-1 ring-inset ring-indigo/10" />
          </div>

          <div className="relative -mt-12 mx-3 card-frame-dark rounded-2xl bg-indigo p-5 text-ivory sm:absolute sm:bottom-4 sm:start-4 sm:mx-0 sm:mt-0 sm:w-[18rem]">
            <Logo className="h-9" />
            <p className="mt-4 text-sm leading-relaxed text-ivory/80">{l(site.address)}</p>
            {site.phone && (
              <a href={site.phoneHref} dir="ltr" className="mt-2 inline-block text-sm text-champagne transition-colors hover:text-ivory">
                {site.phone}
              </a>
            )}
            <ButtonLink href={site.mapsDirectionsUrl} size="sm" className="mt-4 w-full">
              <Navigation aria-hidden className="h-3.5 w-3.5" strokeWidth={1.75} />
              {map.directions}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
