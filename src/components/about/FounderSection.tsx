'use client';

import Image from 'next/image';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { useSiteSettings } from '@/lib/cms/hooks';
import { routes } from '@/lib/routes';

export function FounderSection() {
  const { t, l } = useLanguage();
  const site = useSiteSettings();
  const founder = t.about.founder;
  const name = l(site.founder.name);

  return (
    <section className="section-y bg-linen">
      <div className="container-luxe grid items-center gap-16 lg:grid-cols-12 lg:gap-20">
        <Reveal className="relative lg:col-span-5">
          <div aria-hidden className="absolute -bottom-4 -end-4 top-4 start-4 rounded-[2rem] border border-champagne/60 sm:-bottom-6 sm:-end-6 sm:top-6 sm:start-6" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-indigo">
            {site.founder.portrait ? (
              <Image src={site.founder.portrait} alt={`${name} — ${l(site.founder.role)}`} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover object-top" />
            ) : (
              // Placeholder until a portrait is supplied (see site.founder.portrait).
              <div className="flex h-full flex-col items-center justify-center gap-6 text-center" role="img" aria-label={founder.portraitNote}>
                <span className="font-serif text-[7rem] leading-none tracking-[0.08em] text-champagne" lang="en">
                  {site.founder.initials}
                </span>
                <span aria-hidden className="h-px w-16 bg-champagne/50" />
                <span className="text-[0.64rem] uppercase tracking-ultra text-ivory/60">{l(site.founder.role)}</span>
              </div>
            )}
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>{founder.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-serif text-4xl tracking-wide text-indigo sm:text-5xl lg:text-6xl">{name}</h2>
            <p className="mt-4 text-[0.7rem] font-medium uppercase tracking-ultra text-champagne-800">{l(site.founder.role)}</p>
            <p className="mt-6 font-serif text-xl tracking-wide ltr:italic text-indigo/80 md:text-2xl">{founder.tagline}</p>
          </Reveal>
          {founder.bio.filter(Boolean).map((paragraph, index) => (
            <Reveal key={index} delay={0.14 + index * 0.04}>
              <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-charcoal-soft">{paragraph}</p>
            </Reveal>
          ))}
          <Reveal delay={0.26}>
            <ul className="mt-10 grid gap-3 sm:grid-cols-3">
              {founder.highlights.filter(Boolean).map((highlight, index) => (
                <li key={`${highlight}-${index}`} className="flex items-start gap-3 card-frame rounded-2xl bg-ivory p-4 text-sm leading-relaxed text-indigo">
                  <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rotate-45 bg-champagne" />
                  {highlight}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.32} className="mt-10">
            <ButtonLink href={routes.inquiry} variant="solid-dark" arrow>
              {founder.cta}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
