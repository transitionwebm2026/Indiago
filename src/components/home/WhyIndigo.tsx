'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { pad } from '@/lib/utils';

export function WhyIndigo() {
  const { t } = useLanguage();
  const why = t.home.why;

  return (
    <section className="section-y relative isolate overflow-hidden bg-indigo text-ivory">
      <div className="container-luxe">
        <SectionHeading surface="dark" eyebrow={why.eyebrow} title={why.title} body={why.body} />

        <ol className="mt-16 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-14">
          {why.items.map((item, index) => (
            <li key={item.title}>
              <Reveal delay={(index % 3) * 0.1} className="flex h-full gap-5 border-t border-ivory/15 pt-7">
                <span aria-hidden className="font-serif text-3xl leading-none text-champagne">
                  {pad(index + 1)}
                </span>
                <div>
                  <h3 className="font-serif text-xl tracking-wide text-ivory">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/65">{item.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
