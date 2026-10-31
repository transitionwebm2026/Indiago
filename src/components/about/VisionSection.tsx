'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Highlight } from '@/components/ui/Highlight';
import { Reveal } from '@/components/ui/Reveal';
import { pad } from '@/lib/utils';

export function VisionSection() {
  const { t } = useLanguage();
  const vision = t.about.vision;
  const statements = [
    { label: vision.visionLabel, text: vision.vision },
    { label: vision.missionLabel, text: vision.mission },
  ];

  return (
    <section className="section-y bg-ivory">
      <div className="container-luxe">
        <Reveal>
          <Eyebrow>{vision.eyebrow}</Eyebrow>
        </Reveal>

        {/* One Deep Indigo plaque, framed like the closing banner: each statement on its own row,
            its numbered label on one side and the statement itself on the other. */}
        <Reveal
          delay={0.08}
          className="relative isolate mt-10 overflow-hidden rounded-[2rem] bg-indigo px-6 text-ivory sm:px-10 md:rounded-[2.5rem] md:px-16"
        >
          <div aria-hidden className="absolute -end-40 -top-40 -z-10 h-[26rem] w-[26rem] rounded-full border border-champagne/15" />
          <div aria-hidden className="absolute -end-20 -top-20 -z-10 h-[26rem] w-[26rem] rounded-full border border-champagne/10" />
          <div aria-hidden className="pointer-events-none absolute inset-3 -z-10 rounded-[1.5rem] border border-champagne/25 md:inset-4 md:rounded-[2rem]" />

          <div className="divide-y divide-champagne/20">
            {statements.map((statement, index) => (
              <div key={statement.label} className="grid gap-6 py-12 md:grid-cols-12 md:gap-10 md:py-16">
                <div className="md:col-span-4">
                  <span className="font-serif text-sm text-champagne/70">{pad(index + 1)}</span>
                  <h2 className="mt-3 font-serif text-3xl tracking-wide text-champagne md:text-4xl">{statement.label}</h2>
                  <span aria-hidden className="mt-6 block h-px w-12 bg-champagne/60" />
                </div>
                <p className="text-pretty font-serif text-xl leading-relaxed tracking-wide text-ivory/90 sm:text-2xl md:col-span-8 lg:text-[1.75rem] lg:leading-[1.6]">
                  {statement.text}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

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
