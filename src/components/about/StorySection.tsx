'use client';

import Image from 'next/image';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { img, pageImages } from '@/lib/images';
import { pad } from '@/lib/utils';

export function StorySection() {
  const { t } = useLanguage();
  const story = t.about.story;
  const [lead, ...paragraphs] = story.paragraphs;

  return (
    <section className="section-y bg-ivory">
      <div className="container-luxe">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHeading eyebrow={story.eyebrow} title={story.title} />
              <Reveal delay={0.2} className="relative mt-12 hidden aspect-[4/5] overflow-hidden rounded-[2rem] bg-linen-dark lg:block">
                <Image src={img(pageImages.aboutStory, 1000)} alt="" fill sizes="35vw" className="object-cover" />
              </Reveal>
            </div>
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

            <div className="mt-16 grid gap-4 sm:grid-cols-3">
              {story.pillars.map((pillar, index) => (
                <div key={pillar.title} className="card-frame rounded-3xl bg-white/70 p-7">
                  <span className="font-serif text-sm text-champagne-700">{pad(index + 1)}</span>
                  <h3 className="mt-6 font-serif text-xl tracking-wide text-indigo">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal-soft">{pillar.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
