'use client';

import Image from 'next/image';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useMedia } from '@/lib/cms/hooks';
import { img } from '@/lib/images';
import { pad } from '@/lib/utils';

export function MaterialsSection() {
  const { t } = useLanguage();
  // One photo per card, in order; extra cards added in the CMS reuse the photos from the start.
  const { images: materialImages } = useMedia('about.materials');
  const materials = t.about.materials;

  return (
    <section className="section-y bg-ivory">
      <div className="container-luxe">
        <SectionHeading eyebrow={materials.eyebrow} title={materials.title} body={materials.body} />

        {/* Two compact cards a row on phones, four on large screens. */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {materials.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.1} className="min-w-0">
              <article className="card-frame group h-full rounded-[1.25rem] bg-white/70 p-1.5 hover:border-champagne sm:p-2">
                <div className="relative isolate aspect-[4/3] overflow-hidden rounded-[0.875rem] bg-linen-dark">
                  <Image
                    src={img(materialImages[index % materialImages.length], 700)}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-1200 ease-luxe group-hover:scale-[1.06]"
                  />
                  <span className="absolute start-2.5 top-2.5 rounded-full bg-ivory/95 px-2 py-0.5 font-serif text-[0.65rem] text-indigo">
                    {pad(index + 1)}
                  </span>
                </div>
                <div className="px-1.5 pb-2 sm:px-2">
                  <h3 className="mt-3 font-serif text-base tracking-wide text-indigo sm:text-lg">{item.title}</h3>
                  <p className="mt-1 text-[0.78rem] leading-relaxed text-charcoal-soft sm:text-[0.82rem]">{item.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
