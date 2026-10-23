'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getProject, renderPairs } from '@/lib/data/projects';
import { img } from '@/lib/images';
import { projectHref } from '@/lib/routes';

const blueprint = {
  backgroundImage:
    'linear-gradient(rgba(213,182,144,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(213,182,144,0.22) 1px, transparent 1px)',
  backgroundSize: '28px 28px',
};

/** Split-frame cards: the 3D render on the left, the executed space on the right. */
export function RenderVsReality() {
  const { t, l } = useLanguage();
  const copy = t.portfolio.render;

  return (
    <section className="section-y relative isolate overflow-hidden bg-indigo text-ivory">
      <div className="container-luxe">
        <SectionHeading surface="dark" eyebrow={copy.eyebrow} title={copy.title} body={copy.body} />

        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
          {renderPairs.map((pair, index) => {
            const project = getProject(pair.projectId);
            const caption = `${project ? l(project.title) : ''} — ${l(pair.space)}`;
            return (
              <Reveal key={pair.projectId} delay={index * 0.12}>
                <figure className="group">
                  <div dir="ltr" className="relative isolate aspect-[4/5] overflow-hidden rounded-3xl bg-indigo-900">
                    <Image
                      src={img(pair.photo, 1000)}
                      alt={`${copy.realityLabel}: ${caption}`}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-1200 ease-luxe group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0" style={{ clipPath: 'inset(0 50% 0 0)' }}>
                      <Image
                        src={img(pair.render, 1000)}
                        alt={`${copy.renderLabel}: ${caption}`}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover brightness-110 contrast-[1.08] grayscale transition-transform duration-1200 ease-luxe group-hover:scale-[1.04]"
                      />
                      <div aria-hidden className="absolute inset-0 bg-indigo/30 mix-blend-multiply" />
                      <div aria-hidden className="absolute inset-0" style={blueprint} />
                    </div>

                    <div aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-champagne" />
                    <span className="absolute left-4 top-4 rounded-full border border-champagne/50 bg-indigo/70 px-3 py-1 text-[0.58rem] font-medium uppercase tracking-luxe text-champagne backdrop-blur-sm">
                      {copy.renderLabel}
                    </span>
                    <span className="absolute right-4 top-4 rounded-full bg-champagne px-3 py-1 text-[0.58rem] font-medium uppercase tracking-luxe text-indigo">
                      {copy.realityLabel}
                    </span>
                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-champagne/40 bg-indigo/85 px-5 py-2 font-serif text-sm tracking-wide text-champagne backdrop-blur-sm">
                      100% · {copy.accuracy}
                    </span>
                  </div>
                  <figcaption className="mt-5">
                    {project ? (
                      <Link href={projectHref(project.id)} className="font-serif text-xl tracking-wide transition-colors hover:text-champagne">
                        {l(project.title)}
                      </Link>
                    ) : null}
                    <p className="mt-1 text-[0.64rem] font-medium uppercase tracking-luxe text-ivory/50">{l(pair.space)}</p>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
