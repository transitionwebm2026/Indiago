'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Expand } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ServiceIcon } from '@/components/services/ServiceIcon';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { HeroShell } from '@/components/ui/HeroShell';
import { Highlight } from '@/components/ui/Highlight';
import { Lightbox } from '@/components/ui/Lightbox';
import { Reveal } from '@/components/ui/Reveal';
import { projectSlides } from '@/lib/data/heroes';
import type { Project } from '@/lib/data/projects';
import { img } from '@/lib/images';
import { projectHref, routes, serviceHref } from '@/lib/routes';
import { cn, pad } from '@/lib/utils';

export function ProjectDetail({ project, next }: { project: Project; next: Project }) {
  const { t, l, locale } = useLanguage();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const title = l(project.title);
  const images = [project.cover, ...project.gallery].map((src, index) => ({ src, alt: `${title} — ${index + 1}` }));
  const englishOnly = locale !== 'en';

  const facts = [
    { label: t.common.location, value: l(project.location) },
    { label: t.common.category, value: t.categories[project.category] },
    { label: t.common.area, value: `${project.area.toLocaleString('en-US')} ${t.common.sqm}` },
    { label: t.common.year, value: String(project.year) },
    { label: t.common.scope, value: l(project.scope) },
  ];

  return (
    <>
      <HeroShell slides={projectSlides(project)} showCaption={false}>
        <Link
          href={routes.portfolio}
          className="group inline-flex items-center gap-2 text-[0.64rem] font-medium uppercase tracking-luxe text-ivory/70 transition-colors hover:text-champagne"
        >
          <ArrowLeft
            aria-hidden
            strokeWidth={1.5}
            className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-x-1 rtl:-scale-x-100 rtl:group-hover:translate-x-1"
          />
          {t.project.back}
        </Link>
        <ul className="mt-8 flex flex-wrap gap-2">
          {[t.categories[project.category], l(project.location)].map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-champagne/40 px-3.5 py-1.5 text-[0.6rem] font-medium uppercase tracking-luxe text-champagne"
            >
              {tag}
            </li>
          ))}
        </ul>
        <h1 className="mt-6 text-balance font-serif text-[2.3rem] leading-[1.08] tracking-wide sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-5 text-pretty text-base leading-relaxed text-ivory/75 sm:text-lg">{l(project.summary)}</p>
      </HeroShell>

      {/* Overview facts */}
      <section aria-label={t.project.overview} className="bg-ivory pt-12 md:pt-16">
        <div className="container-luxe">
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {facts.map((fact, index) => (
              <div
                key={fact.label}
                className={cn(
                  'card-frame min-w-0 rounded-2xl bg-white/70 px-4 py-5 sm:px-5 sm:py-6',
                  index === facts.length - 1 && 'col-span-2 md:col-span-1',
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
            {englishOnly && (
              <p className="mt-6 inline-block rounded-2xl border border-champagne/50 bg-linen px-4 py-2 text-sm text-charcoal-soft">
                {t.common.englishOnly}
              </p>
            )}
            <div lang="en" dir="ltr" className={cn(englishOnly && 'text-left')}>
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
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2} className="mt-14">
              <h2 className="text-[0.66rem] font-medium uppercase tracking-ultra text-champagne-800">{t.project.services}</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {project.services.map((id) => {
                  const service = t.services.items.find((item) => item.id === id);
                  if (!service) return null;
                  return (
                    <li key={id}>
                      <Link
                        href={serviceHref(id)}
                        className="inline-flex items-center gap-2.5 rounded-full border border-indigo/15 px-4 py-2.5 text-sm text-indigo transition-colors hover:border-indigo hover:bg-indigo hover:text-ivory"
                      >
                        <ServiceIcon id={id} className="h-4 w-4" />
                        {service.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="card-frame rounded-[2rem] bg-linen p-5 sm:p-8 md:p-10 lg:sticky lg:top-32">
              <h2 className="font-serif text-2xl tracking-wide text-indigo">{t.project.materials}</h2>
              <ol lang="en" dir="ltr" className="mt-8 space-y-2 text-left">
                {project.materials.map((material, index) => (
                  <li key={material.name} className="flex gap-4 rounded-2xl bg-ivory px-4 py-4 sm:gap-5 sm:px-5">
                    <span className="font-serif text-sm text-champagne-700">{pad(index + 1)}</span>
                    <div className="min-w-0">
                      <p className="font-medium text-indigo">{material.name}</p>
                      <p className="mt-0.5 text-sm text-charcoal-soft">{material.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
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

      {/* Similar project CTA */}
      <section className="bg-ivory py-16 md:py-20">
        <div className="container-luxe">
          <div className="flex flex-col items-start justify-between gap-8 card-frame rounded-[2rem] bg-white/70 p-6 sm:p-8 md:flex-row md:items-center md:p-12">
            <div>
              <h2 className="text-balance font-serif text-3xl tracking-wide text-indigo md:text-4xl">
                <Highlight text={t.project.ctaTitle} />
              </h2>
              <p className="mt-3 max-w-xl text-charcoal-soft">{t.project.ctaBody}</p>
            </div>
            <ButtonLink href={`/contact/?type=${project.category}#inquiry`} variant="solid-dark" size="lg" arrow className="shrink-0">
              {t.project.ctaButton}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Next project */}
      <section className="bg-ivory pb-20 md:pb-28">
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
