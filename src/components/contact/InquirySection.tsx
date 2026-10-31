'use client';

import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { pad } from '@/lib/utils';
import { InquiryForm } from './InquiryForm';

export function InquirySection() {
  const { t } = useLanguage();
  const intro = t.contact.intro;

  return (
    <section id="inquiry" className="section-y scroll-mt-16 bg-ivory">
      <div className="container-luxe grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow={intro.eyebrow} title={intro.title} body={intro.body} />

          <Reveal delay={0.2}>
            <ol className="mt-10 border-t border-indigo/10">
              {t.contact.form.steps.map((label, index) => (
                <li key={label} className="flex items-baseline gap-5 border-b border-indigo/10 py-4">
                  <span className="font-serif text-sm text-champagne-700">{pad(index + 1)}</span>
                  <span className="text-sm text-indigo">{label}</span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.28}>
            <ul className="mt-10 space-y-3">
              {intro.promise.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-charcoal-soft">
                  <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-champagne-700" strokeWidth={1.5} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <InquiryForm />
        </Reveal>
      </div>
    </section>
  );
}
