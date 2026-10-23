'use client';

import Image from 'next/image';
import { ClipboardCheck, Handshake, Layers, type LucideIcon } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { img, pageImages } from '@/lib/images';
import { cn } from '@/lib/utils';

const icons: LucideIcon[] = [ClipboardCheck, Handshake, Layers];

export function CraftSection() {
  const { t } = useLanguage();
  const craft = t.about.craft;

  return (
    <section className="section-y relative isolate overflow-hidden bg-indigo text-ivory">
      <div className="container-luxe">
        <SectionHeading surface="dark" eyebrow={craft.eyebrow} title={craft.title} body={craft.body} />

        <div className="mt-16 grid grid-cols-3 gap-3 md:gap-5">
          {pageImages.craft.map((image, index) => (
            <Reveal
              key={image}
              delay={index * 0.1}
              className={cn('relative isolate overflow-hidden rounded-2xl bg-indigo-900 md:rounded-3xl', index === 1 ? 'aspect-[3/4] md:-mt-10' : 'aspect-[3/4]')}
            >
              <Image
                src={img(image, 900)}
                alt=""
                fill
                sizes="33vw"
                className="object-cover opacity-80 grayscale-[35%] transition-transform duration-1200 ease-luxe hover:scale-105"
              />
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          {craft.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <Reveal key={item.title} delay={index * 0.12} className="card-frame-dark h-full rounded-3xl bg-indigo-700/30 p-8">
                <Icon aria-hidden className="h-7 w-7 text-champagne" strokeWidth={1.2} />
                <h3 className="mt-6 font-serif text-2xl tracking-wide">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/65">{item.body}</p>
                <ul className="mt-6 space-y-3">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm text-ivory/85">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-champagne" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
