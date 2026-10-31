'use client';

import { m } from 'framer-motion';
import type { ReactNode } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { EASE, useEntranceAnimation } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Eyebrow } from './Eyebrow';
import { Highlight } from './Highlight';
import { Link } from './Link';

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  body?: string;
  crumbs?: Crumb[];
  className?: string;
  children?: ReactNode;
}

/**
 * The title that opens every inner page (only the home page has a photo hero): breadcrumb,
 * eyebrow and a large serif headline with its introduction, closed by a fine Champagne rule.
 */
export function PageHeader({ eyebrow, title, body, crumbs, className, children }: PageHeaderProps) {
  const { t } = useLanguage();
  const animate = useEntranceAnimation();
  const trail: Crumb[] = [{ label: t.common.home, href: '/' }, ...(crumbs ?? [])];

  return (
    <section className={cn('relative isolate overflow-hidden bg-ivory', className)}>
      {/* Two fine arcs in the corner echo the rings on the home page's closing banner. */}
      <div aria-hidden className="absolute -end-48 -top-56 -z-10 h-[34rem] w-[34rem] rounded-full border border-champagne/40" />
      <div aria-hidden className="absolute -end-24 -top-32 -z-10 h-[34rem] w-[34rem] rounded-full border border-champagne/25" />

      <m.div
        initial={animate ? { opacity: 0, y: 24 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="container-luxe pt-32 sm:pt-36 md:pt-44"
      >
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-[0.64rem] uppercase tracking-luxe text-charcoal-muted">
            {trail.map((crumb, index) => (
              <li key={crumb.label} className="flex min-w-0 items-center gap-2">
                {index > 0 && <span aria-hidden className="h-px w-4 bg-champagne" />}
                {crumb.href && index < trail.length - 1 ? (
                  <Link href={crumb.href} className="transition-colors hover:text-indigo">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="block max-w-[15rem] truncate text-indigo sm:max-w-sm">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10 grid gap-7 md:mt-14 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-8">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-6 text-balance font-serif text-[2.35rem] leading-[1.08] tracking-wide text-indigo sm:text-[3.4rem] lg:text-[4rem]">
              <Highlight text={title} />
            </h1>
          </div>
          {body && (
            <p className="text-pretty text-base leading-relaxed text-charcoal-soft sm:text-lg lg:col-span-4 lg:pb-2">{body}</p>
          )}
        </div>
        {children && <div className="mt-10">{children}</div>}

        <div aria-hidden className="mt-14 flex items-center gap-4 md:mt-20">
          <span className="h-px flex-1 bg-champagne/60" />
          <span className="h-1.5 w-1.5 rotate-45 bg-champagne" />
          <span className="h-px flex-1 bg-champagne/60" />
        </div>
      </m.div>
    </section>
  );
}

/** Breadcrumb label for each page that opens with its own `hero` copy. */
const navLabel = { about: 'about', portfolio: 'portfolio', services: 'services', blog: 'journal', contact: 'contact' } as const;

/** The header of a main inner page, written in that page's `hero` copy (editable in the CMS). */
export function PageIntro({ page }: { page: keyof typeof navLabel }) {
  const { t } = useLanguage();
  const copy = t[page].hero;
  return <PageHeader eyebrow={copy.eyebrow} title={copy.title} body={copy.body} crumbs={[{ label: t.nav[navLabel[page]] }]} />;
}
