'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Highlight } from '@/components/ui/Highlight';
import { Reveal } from '@/components/ui/Reveal';
import { pad } from '@/lib/utils';

export function VisionSection() {
  const { t } = useLanguage();
  const vision = t.about.vision;

  return (
    <section className="section-y bg-ivory">
      <div className="container-luxe">
        <Reveal>
          <Eyebrow>{vision.eyebrow}</Eyebrow>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
          <Reveal delay={0.08} className="rounded-[2rem] bg-indigo p-7 text-ivory sm:p-10 md:p-12">
            <h2 className="text-[0.66rem] font-medium uppercase tracking-ultra text-champagne">{vision.visionLabel}</h2>
            <p className="mt-6 text-pretty font-serif text-2xl leading-relaxed tracking-wide md:text-[1.7rem]">{vision.vision}</p>
          </Reveal>
          <Reveal delay={0.16} className="card-frame rounded-[2rem] bg-white/70 p-7 sm:p-10 md:p-12">
            <h2 className="text-[0.66rem] font-medium uppercase tracking-ultra text-champagne-800">{vision.missionLabel}</h2>
            <p className="mt-6 text-pretty font-serif text-2xl leading-relaxed tracking-wide text-indigo md:text-[1.7rem]">
              {vision.mission}
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-20 md:mt-24">
          <h2 className="text-balance font-serif text-3xl tracking-wide text-indigo sm:text-4xl lg:text-[2.6rem]">
            <Highlight text={vision.valuesTitle} />
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {vision.values.map((value, index) => (
            <Reveal key={value.title} delay={(index % 2) * 0.1} className="border-t border-champagne pt-6">
              <span className="font-serif text-sm text-champagne-700">{pad(index + 1)}</span>
              <h3 className="mt-3 font-serif text-2xl tracking-wide text-indigo">{value.title}</h3>
              <p className="mt-3 max-w-md leading-relaxed text-charcoal-soft">{value.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
