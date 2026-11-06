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

        {/* Only the titles sit in Deep Indigo, as compact labels; the statements read on the light page below them. */}
        <div className="mt-8 grid gap-3 md:grid-cols-2 md:gap-4">
          {statements.map((statement, index) => (
            <Reveal key={statement.label} delay={0.08 + index * 0.1} className="card-frame h-full rounded-[1.25rem] bg-white/70 p-5 sm:p-6">
              <h2 className="inline-flex items-center gap-2.5 rounded-full bg-indigo px-4 py-1.5 font-serif text-base tracking-wide text-champagne">
                <span className="text-xs text-champagne/70">{pad(index + 1)}</span>
                {statement.label}
              </h2>
              <p className="mt-4 text-pretty font-serif text-lg leading-relaxed tracking-wide text-indigo sm:text-xl">
                {statement.text}
              </p>
            </Reveal>
          ))}
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
