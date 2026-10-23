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

        <dl className="mt-16 grid gap-4 sm:grid-cols-3">
          {metrics.items.map((metric, index) => (
            <Reveal
              key={metric.label}
              delay={index * 0.12}
              className="flex flex-col items-center card-frame rounded-3xl bg-white/70 px-6 py-12 text-center"
            >
              <dt className="order-2 mt-4 text-[0.68rem] font-medium uppercase tracking-ultra text-charcoal-soft">
                {metric.label}
              </dt>
              <dd className="order-1 font-serif text-6xl tracking-wide text-indigo md:text-7xl" dir="ltr">
                <Counter value={metric.value} suffix={metric.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
