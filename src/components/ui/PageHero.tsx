'use client';

import type { ReactNode } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { HeroSlide } from '@/lib/data/heroes';
import { Eyebrow } from './Eyebrow';
import { HeroShell } from './HeroShell';
import { Highlight } from './Highlight';
import { Link } from './Link';

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  eyebrow: string;
  title: string;
  body?: string;
  slides: HeroSlide[];
  crumbs?: Crumb[];
  children?: ReactNode;
}

/** Inner-page hero: project photo slider with the page title in a rounded card. */
export function PageHero({ eyebrow, title, body, slides, crumbs, children }: PageHeroProps) {
  const { t } = useLanguage();
  const trail: Crumb[] = [{ label: t.common.home, href: '/' }, ...(crumbs ?? [])];

  return (
    <HeroShell slides={slides}>
      {crumbs && (
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-[0.64rem] uppercase tracking-luxe text-ivory/50">
            {trail.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-2">
                {index > 0 && <span aria-hidden className="h-px w-4 bg-ivory/30" />}
                {crumb.href && index < trail.length - 1 ? (
                  <Link href={crumb.href} className="transition-colors hover:text-champagne">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-ivory/80">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <Eyebrow surface="dark">{eyebrow}</Eyebrow>
      <h1 className="mt-6 text-balance font-serif text-[2.1rem] leading-[1.1] tracking-wide text-ivory sm:text-5xl lg:text-[3.4rem]">
        <Highlight text={title} surface="dark" />
      </h1>
      {body && <p className="mt-6 text-pretty text-base leading-relaxed text-ivory/70 sm:text-lg">{body}</p>}
      {children && <div className="mt-8">{children}</div>}
    </HeroShell>
  );
}
