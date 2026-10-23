'use client';

import Image from 'next/image';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { img, pageImages } from '@/lib/images';
import { pad } from '@/lib/utils';

const materialImages = [
  pageImages.materials.stone,
  pageImages.materials.timber,
  pageImages.materials.metal,
  pageImages.materials.sustainable,
];

export function MaterialsSection() {
  const { t } = useLanguage();
  const materials = t.about.materials;

  return (
    <section className="section-y bg-ivory">
      <div className="container-luxe">
        <SectionHeading eyebrow={materials.eyebrow} title={materials.title} body={materials.body} />

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {materials.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.1}>
              <article className="card-frame group h-full rounded-[1.75rem] bg-white/70 p-2.5 hover:border-champagne">
                <div className="relative isolate aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-linen-dark">
                  <Image
                    src={img(materialImages[index], 800)}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-1200 ease-luxe group-hover:scale-[1.06]"
                  />
                  <span className="absolute start-4 top-4 rounded-full bg-ivory/95 px-3 py-1 font-serif text-xs text-indigo">
                    {pad(index + 1)}
                  </span>
                </div>
                <div className="px-2.5 pb-3">
                  <h3 className="mt-5 font-serif text-xl tracking-wide text-indigo">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">{item.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
