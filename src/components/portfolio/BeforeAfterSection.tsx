'use client';

import { MoveHorizontal } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { transformation } from '@/lib/data/projects';
import { BeforeAfterSlider } from './BeforeAfterSlider';

export function BeforeAfterSection() {
  const { t } = useLanguage();
  const copy = t.portfolio.beforeAfter;

  return (
    <section className="section-y bg-linen">
      <div className="container-luxe grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow={copy.eyebrow} title={copy.title} body={copy.body} />
          <Reveal delay={0.2}>
            <dl className="mt-10 divide-y divide-indigo/10 card-frame rounded-3xl bg-ivory px-6">
              {copy.facts.map((fact) => (
                <div key={fact.label} className="flex items-center justify-between gap-6 py-4">
                  <dt className="text-[0.64rem] font-medium uppercase tracking-luxe text-charcoal-muted">{fact.label}</dt>
                  <dd className="font-serif text-lg tracking-wide text-indigo">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-8">
          <BeforeAfterSlider
            before={transformation.before}
            after={transformation.after}
            beforeLabel={`${copy.before} · ${copy.beforeCaption}`}
            afterLabel={`${copy.after} · ${copy.afterCaption}`}
            hint={copy.hint}
          />
          <p className="mt-4 flex items-center gap-2 text-[0.64rem] font-medium uppercase tracking-luxe text-charcoal-muted">
            <MoveHorizontal aria-hidden className="h-4 w-4" strokeWidth={1.5} />
            {copy.hint}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
