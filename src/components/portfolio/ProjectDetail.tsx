'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ArrowRight, Expand } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Highlight } from '@/components/ui/Highlight';
import { Link } from '@/components/ui/Link';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { useServices } from '@/lib/cms/hooks';
import type { Project } from '@/lib/data/projects';
import { img } from '@/lib/images';
import { projectHref, routes, serviceHref } from '@/lib/routes';
import { cn, pad } from '@/lib/utils';
import { CompareSlider } from './CompareSlider';

// The gallery viewer only opens on a click, so its code loads after the page.
const Lightbox = dynamic(() => import('@/components/ui/Lightbox').then((module) => module.Lightbox), { ssr: false });

export function ProjectDetail({ project, next }: { project: Project; next: Project }) {
  const { t, l, locale } = useLanguage();
  const services = useServices();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const title = l(project.title);
  const images = [project.cover, ...project.gallery].filter(Boolean).map((src, index) => ({ src, alt: `${title} — ${index + 1}` }));
  const beforeAfter = project.beforeAfter ?? [];
  const renderReal = project.renderReal ?? [];
  const delivered = project.services.flatMap((id) => services.find((service) => service.id === id) ?? []);

  const completed = project.completed
    ? new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
        new Date(`${project.completed}T00:00:00Z`),
      )
    : '';

  const facts = [
    { label: t.common.location, value: l(project.location) },
    { label: t.common.category, value: t.categories[project.category] },
    { label: t.project.scope, value: project.scope ? l(project.scope) : '' },
    { label: t.project.completed, value: completed },
    { label: t.common.highlights, value: project.highlights.map(l).join(' · ') },
  ].filter((fact) => fact.value);

  return (
    <>
      <PageHeader
        eyebrow={t.categories[project.category]}
        title={title}
        body={l(project.summary)}
        crumbs={[{ label: t.nav.portfolio, href: routes.portfolio }, { label: title }]}
      >
        <ul className="flex flex-wrap gap-2">
          {[l(project.location), ...project.highlights.map(l)].map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-champagne/60 px-3.5 py-1.5 text-[0.6rem] font-medium uppercase tracking-luxe text-champagne-800"
            >
              {tag}
            </li>
          ))}
        </ul>
      </PageHeader>

      {/* Overview facts */}
      <section aria-label={t.project.overview} className="bg-ivory pt-12 md:pt-16">
        <div className="container-luxe">
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {facts.map((fact, index) => (
              <div
                key={fact.label}
                className={cn(
                  'card-frame min-w-0 rounded-2xl bg-white/70 px-4 py-5 sm:px-5 sm:py-6',
                  index === facts.length - 1 && facts.length % 2 === 1 && 'col-span-2 md:col-span-1',
                )}
              >
                <dt className="text-[0.62rem] font-medium uppercase tracking-luxe text-charcoal-muted">{fact.label}</dt>
                <dd className="mt-2 break-words font-serif text-base tracking-wide text-indigo min-[400px]:text-lg">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Concept, materials & services */}
      <section className="section-y bg-ivory">
        <div className="container-luxe grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>{t.project.concept}</Eyebrow>
            </Reveal>
            {project.concept.map((paragraph, index) => (
              <Reveal key={index} delay={0.08 + index * 0.06}>
                <p
                  className={cn(
                    'mt-8 text-pretty leading-relaxed',
                    index === 0
                      ? 'font-serif text-2xl tracking-wide text-indigo md:text-[1.7rem]'
                      : 'text-lg text-charcoal-soft',
                  )}
                >
                  {l(paragraph)}
                </p>
              </Reveal>
            ))}

            {delivered.length > 0 && (
              <Reveal delay={0.2} className="mt-14">
                <h2 className="text-[0.66rem] font-medium uppercase tracking-ultra text-champagne-800">{t.project.services}</h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {delivered.map((service) => (
                    <li key={service.id}>
                      <Link
                        href={serviceHref(service.id)}
                        className="inline-flex items-center rounded-full border border-indigo/15 px-4 py-2.5 text-sm text-indigo transition-colors hover:border-indigo hover:bg-indigo hover:text-ivory"
                      >
                        {l(service.title)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>

          {project.materials.length > 0 && (
            <Reveal delay={0.1} className="lg:col-span-5">
              <div className="card-frame rounded-[2rem] bg-linen p-5 sm:p-8 md:p-10">
                <h2 className="font-serif text-2xl tracking-wide text-indigo">{t.project.materials}</h2>
                <ol className="mt-8 space-y-2">
                  {project.materials.map((material, index) => (
                    <li key={`${material.name.en}-${index}`} className="flex gap-4 rounded-2xl bg-ivory px-4 py-4 sm:gap-5 sm:px-5">
                      <span className="font-serif text-sm text-champagne-700">{pad(index + 1)}</span>
                      <div className="min-w-0">
                        <p className="font-medium text-indigo">{l(material.name)}</p>
                        <p className="mt-0.5 text-sm text-charcoal-soft">{l(material.detail)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Gallery */}
      <section className="section-y bg-linen">
        <div className="container-luxe">
          <div className="flex items-end justify-between gap-4 sm:gap-6">
            <Reveal className="min-w-0">
              <Eyebrow>{t.project.gallery}</Eyebrow>
              <h2 className="mt-5 break-words font-serif text-3xl tracking-wide text-indigo sm:text-4xl">{title}</h2>
            </Reveal>
            <p className="shrink-0 text-[0.64rem] font-medium uppercase tracking-luxe text-charcoal-muted">
              {pad(images.length)} {t.common.photos}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
            {images.map((image, index) => (
              <Reveal
                key={`${image.src}-${index}`}
                delay={(index % 3) * 0.08}
                className={cn(index === 0 && 'col-span-2 row-span-2')}
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`${t.common.viewGallery}: ${image.alt}`}
                  className={cn(
                    'group relative block w-full overflow-hidden rounded-2xl bg-linen-dark md:rounded-3xl',
                    index === 0 ? 'aspect-square md:aspect-auto md:h-full' : 'aspect-square',
                  )}
                >
                  <Image
                    src={img(image.src, index === 0 ? 1600 : 900)}
                    alt={image.alt}
                    fill
                    sizes={index === 0 ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 50vw'}
                    className="object-cover transition-transform duration-1200 ease-luxe group-hover:scale-[1.05]"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-indigo/0 transition-colors duration-500 group-hover:bg-indigo/35">
                    <Expand
                      aria-hidden
                      strokeWidth={1.25}
                      className="h-8 w-8 text-ivory opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
        <Lightbox images={images} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onIndexChange={setLightboxIndex} />
      </section>

      {beforeAfter.length > 0 && (
        <ComparisonSection
          eyebrow={t.project.beforeAfter}
          title={t.project.beforeAfterTitle}
          pairs={beforeAfter.map((pair) => ({ first: pair.before, second: pair.after, caption: l(pair.caption) }))}
          firstLabel={t.project.before}
          secondLabel={t.project.after}
          label={t.project.compareLabel}
          alt={title}
          className="bg-ivory"
        />
      )}

      {renderReal.length > 0 && (
        <ComparisonSection
          eyebrow={t.project.renderReal}
          title={t.project.renderRealTitle}
          pairs={renderReal.map((pair) => ({ first: pair.render, second: pair.real, caption: l(pair.caption) }))}
          firstLabel={t.project.render}
          secondLabel={t.project.real}
          label={t.project.compareLabel}
          alt={title}
          className={beforeAfter.length > 0 ? 'bg-linen' : 'bg-ivory'}
        />
      )}

      {/* Next project */}
      <section className="bg-ivory py-16 md:py-24">
        <div className="container-luxe">
          <Link href={projectHref(next.id)} className="group relative isolate block overflow-hidden rounded-[2rem] text-ivory">
            <Image
              src={img(next.cover, 2000)}
              alt=""
              fill
              sizes="100vw"
              className="-z-10 object-cover transition-transform duration-1200 ease-luxe group-hover:scale-[1.04]"
            />
            <div className="flex min-h-[20rem] items-end p-3 sm:min-h-[22rem] sm:p-6 md:min-h-[26rem]">
              <div className="flex w-full items-center justify-between gap-4 card-frame-dark rounded-3xl bg-indigo/95 p-5 backdrop-blur-xl sm:gap-6 sm:p-6 md:w-auto md:min-w-[28rem] md:p-8">
                <div className="min-w-0">
                  <p className="text-[0.64rem] font-medium uppercase tracking-ultra text-champagne">{t.project.next}</p>
                  <p className="mt-3 break-words font-serif text-2xl tracking-wide min-[400px]:text-3xl md:text-4xl">{l(next.title)}</p>
                  <p className="mt-2 text-sm text-ivory/60">
                    {t.categories[next.category]} · {l(next.location)}
                  </p>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-champagne/50 text-champagne transition-colors duration-500 group-hover:bg-champagne group-hover:text-indigo sm:h-14 sm:w-14">
                  <ArrowRight aria-hidden className="h-5 w-5 rtl:-scale-x-100" strokeWidth={1.25} />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}

interface ComparisonSectionProps {
  eyebrow: string;
  title: string;
  pairs: { first: string; second: string; caption: string }[];
  firstLabel: string;
  secondLabel: string;
  label: string;
  alt: string;
  className: string;
}

/** Before/after or render/reality pairs, each compared with a draggable divider. */
function ComparisonSection({ eyebrow, title, pairs, firstLabel, secondLabel, label, alt, className }: ComparisonSectionProps) {
  return (
    <section className={cn('section-y', className)}>
      <div className="container-luxe">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="mt-5 text-balance font-serif text-3xl tracking-wide text-indigo sm:text-4xl">
            <Highlight text={title} />
          </h2>
        </Reveal>
        <div className={cn('mt-12 grid gap-8', pairs.length > 1 && 'lg:grid-cols-2')}>
          {pairs.map((pair, index) => (
            <Reveal key={`${pair.first}-${index}`} delay={(index % 2) * 0.1}>
              <figure>
                <CompareSlider
                  first={pair.first}
                  second={pair.second}
                  firstLabel={firstLabel}
                  secondLabel={secondLabel}
                  label={`${label}: ${pair.caption || alt}`}
                  alt={pair.caption || alt}
                />
                {pair.caption && <figcaption className="mt-4 text-sm leading-relaxed text-charcoal-soft">{pair.caption}</figcaption>}
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
