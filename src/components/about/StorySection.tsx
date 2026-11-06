'use client';

import Image from 'next/image';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useMedia } from '@/lib/cms/hooks';
import { img } from '@/lib/images';
import { pad } from '@/lib/utils';

export function StorySection() {
  const { t } = useLanguage();
  const { image } = useMedia('about.story');
  const story = t.about.story;
  const [lead, ...paragraphs] = story.paragraphs;

  return (
    <section className="section-y bg-ivory">
      <div className="container-luxe">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={story.eyebrow} title={story.title} />
            <Reveal delay={0.2} className="relative mt-12 hidden aspect-[4/5] overflow-hidden rounded-[2rem] bg-linen-dark lg:block">
              <Image src={img(image, 1000)} alt="" fill sizes="35vw" className="object-cover" />
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:pt-24">
            <Reveal>
              <p className="text-pretty font-serif text-2xl leading-relaxed tracking-wide text-indigo md:text-[1.8rem]">{lead}</p>
            </Reveal>
            {paragraphs.map((paragraph, index) => (
              <Reveal key={index} delay={0.1 + index * 0.08}>
                <p className="mt-7 text-pretty text-lg leading-relaxed text-charcoal-soft">{paragraph}</p>
              </Reveal>
            ))}

            <dl className="mt-12 grid gap-3 sm:grid-cols-2">
              {story.facts.map((fact, index) => (
                <Reveal key={fact.label} delay={0.1 + index * 0.06} className="card-frame rounded-2xl bg-white/70 p-5">
                  <dt className="flex items-center gap-2.5 text-[0.6rem] font-medium uppercase tracking-luxe text-champagne-800">
                    <span className="font-serif text-xs tracking-normal text-champagne-700">{pad(index + 1)}</span>
                    {fact.label}
                  </dt>
                  <dd className="mt-2.5 font-serif text-lg leading-snug tracking-wide text-indigo">{fact.value}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
