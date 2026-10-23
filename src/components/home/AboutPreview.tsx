'use client';

import Image from 'next/image';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
import { Monogram } from '@/components/ui/Monogram';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { img, pageImages } from '@/lib/images';
import { routes } from '@/lib/routes';
import { site } from '@/lib/site';

export function AboutPreview() {
  const { t, l } = useLanguage();
  const copy = t.home.about;

  return (
    <section id="studio" className="section-y overflow-hidden bg-ivory">
      <div className="container-luxe grid items-center gap-20 lg:grid-cols-2 lg:gap-24">
        <Reveal className="relative pb-[12%]">
          <div aria-hidden className="absolute -start-3 -top-3 h-28 w-28 rounded-ss-[2.25rem] border-s border-t border-champagne sm:-start-5 sm:-top-5" />
          <div className="relative isolate aspect-[4/5] w-[80%] overflow-hidden rounded-[2rem] bg-linen-dark">
            <Image
              src={img(pageImages.homeAboutPrimary, 1200)}
              alt=""
              fill
              sizes="(min-width: 1024px) 40vw, 80vw"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 end-0 aspect-square w-[48%] overflow-hidden rounded-[2rem] border-[10px] border-ivory bg-linen-dark">
            <Image
              src={img(pageImages.homeAboutSecondary, 800)}
              alt=""
              fill
              sizes="(min-width: 1024px) 24vw, 48vw"
              className="object-cover"
            />
          </div>
          <p className="absolute bottom-[6%] start-4 max-w-[13rem] rounded-2xl bg-indigo px-5 py-4 font-serif text-sm leading-snug tracking-wide text-champagne">
            {copy.badge}
          </p>
        </Reveal>

        <div>
          <SectionHeading eyebrow={copy.eyebrow} title={copy.title} body={copy.body} />
          <Reveal delay={0.2}>
            <p className="mt-5 leading-relaxed text-charcoal-soft">{copy.founderIntro}</p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-10 flex items-center gap-5 border-y border-indigo/10 py-6">
              <Monogram initials={site.founder.initials} />
              <div>
                <p className="font-serif text-xl tracking-wide text-indigo">{l(site.founder.name)}</p>
                <p className="mt-1 text-[0.64rem] font-medium uppercase tracking-luxe text-charcoal-muted">
                  {l(site.founder.role)}
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.3} className="mt-10">
            <ButtonLink href={routes.about} variant="outline-dark" arrow>
              {copy.cta}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
