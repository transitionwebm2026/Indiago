'use client';

import Image from 'next/image';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Highlight } from '@/components/ui/Highlight';
import { Reveal } from '@/components/ui/Reveal';
import { useMedia } from '@/lib/cms/hooks';
import { img } from '@/lib/images';
import { pad } from '@/lib/utils';

export function CraftSection() {
  const { t } = useLanguage();
  const { images } = useMedia('about.craft');
  const craft = t.about.craft;

  return (
    <section className="section-y relative isolate overflow-hidden bg-indigo text-ivory">
      <div className="container-luxe">
        {/* "Craftsmanship & Quality Control" is the section's headline, the largest on the page after its title;
            the supervision promise follows it as a subtitle. */}
        <div className="max-w-4xl">
          <Reveal>
            <span aria-hidden className="block h-px w-16 bg-champagne" />
            <h2 className="mt-7 text-balance font-serif text-[2.5rem] leading-[1.06] tracking-wide text-ivory sm:text-6xl lg:text-[4.5rem]">
              {craft.eyebrow}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 text-balance font-serif text-2xl leading-snug tracking-wide text-ivory/90 sm:text-3xl lg:text-[2.1rem]">
              <Highlight text={craft.title} surface="dark" />
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-ivory/70 sm:text-lg">{craft.body}</p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-2.5 md:gap-4">
          {images.slice(0, 3).map((image, index) => (
            <Reveal
              key={`${image}-${index}`}
              delay={index * 0.1}
              className="relative isolate aspect-[4/5] overflow-hidden rounded-xl bg-indigo-900 md:aspect-[4/3] md:rounded-[1.25rem]"
            >
              <Image
                src={img(image, 900)}
                alt=""
                fill
                sizes="33vw"
                className="object-cover transition-transform duration-1200 ease-luxe hover:scale-105"
              />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-3 md:gap-4">
          {craft.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.12} className="card-frame-dark h-full rounded-2xl bg-indigo-700/30 p-5 lg:p-6">
              <span className="font-serif text-xs text-champagne">{pad(index + 1)}</span>
              <h3 className="mt-2 font-serif text-lg tracking-wide md:text-xl">{item.title}</h3>
              <p className="mt-2 text-[0.82rem] leading-relaxed text-ivory/65">{item.body}</p>
              <ul className="mt-4 space-y-2">
                {item.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-[0.82rem] text-ivory/85">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-champagne" />
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
