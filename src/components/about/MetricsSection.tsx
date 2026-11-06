'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { Counter } from '@/components/ui/Counter';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function MetricsSection() {
  const { t } = useLanguage();
  const metrics = t.about.metrics;

  return (
    <section className="section-y bg-linen">
      <div className="container-luxe">
        <SectionHeading eyebrow={metrics.eyebrow} title={metrics.title} align="center" />

        {/* Three small cards in one row on every screen, held to a narrow width on large ones. */}
        <dl className="mx-auto mt-12 grid max-w-4xl grid-cols-3 gap-2.5 sm:gap-4">
          {metrics.items.map((metric, index) => (
            <Reveal
              key={metric.label}
              delay={index * 0.12}
              className="flex min-w-0 flex-col items-center card-frame rounded-2xl bg-white/70 px-2 py-5 text-center sm:px-5 sm:py-7"
            >
              <dt className="order-2 mt-2 text-[0.55rem] font-medium uppercase leading-snug tracking-luxe text-charcoal-soft sm:mt-3 sm:text-[0.62rem] sm:tracking-ultra">
                {metric.label}
              </dt>
              <dd className="order-1 font-serif text-[1.6rem] tracking-normal text-indigo min-[420px]:text-3xl sm:text-5xl sm:tracking-wide" dir="ltr">
                <Counter value={metric.value} suffix={metric.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
