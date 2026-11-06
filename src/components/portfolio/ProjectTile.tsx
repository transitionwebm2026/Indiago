'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Link } from '@/components/ui/Link';
import type { Project } from '@/lib/data/projects';
import { img } from '@/lib/images';
import { projectHref } from '@/lib/routes';
import { cn, pad } from '@/lib/utils';

interface ProjectTileProps {
  project: Project;
  index: number;
  /** The lead tile: a larger title and the project summary. */
  large?: boolean;
  sizes: string;
  className?: string;
}

/** A full-bleed project photograph with its sector, name and link set over a soft shade at the bottom. */
export function ProjectTile({ project, index, large = false, sizes, className }: ProjectTileProps) {
  const { t, l } = useLanguage();
  const title = l(project.title);

  return (
    <article className={cn('group relative isolate overflow-hidden rounded-[1.25rem] bg-indigo text-ivory', className)}>
      <Image
        src={img(project.cover, large ? 1600 : 1200)}
        alt={title}
        fill
        sizes={sizes}
        className="-z-10 object-cover transition-transform duration-1200 ease-luxe group-hover:scale-[1.05]"
      />
      {/* Shade only along the bottom, behind the caption; the photograph above it stays untouched. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-indigo-950/80 via-indigo-950/25 via-35% to-transparent to-60%"
      />

      <span className="absolute start-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-ivory/30 bg-indigo/40 font-serif text-xs text-champagne backdrop-blur-sm sm:start-5 sm:top-5">
        {pad(index + 1)}
      </span>

      <div className={cn('absolute inset-x-0 bottom-0 p-5 [text-shadow:0_2px_16px_rgba(23,18,44,0.5)] sm:p-6', large && 'lg:p-7')}>
        <p className="text-[0.58rem] font-semibold uppercase tracking-luxe text-ivory/90">
          {t.categories[project.category]} · {l(project.location)}
        </p>
        <h3
          className={cn(
            'mt-2 text-balance font-serif leading-snug tracking-wide',
            large ? 'text-xl sm:text-2xl lg:text-[1.9rem]' : 'text-lg sm:text-xl',
          )}
        >
          <Link href={projectHref(project.id)} className="after:absolute after:inset-0">
            {title}
          </Link>
        </h3>
        <span className="mt-3 inline-flex items-center gap-2 text-[0.6rem] font-medium uppercase tracking-luxe text-ivory/85 transition-colors duration-500 group-hover:text-champagne">
          {t.common.viewProject}
          <ArrowRight
            aria-hidden
            strokeWidth={1.5}
            className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
          />
        </span>
      </div>
    </article>
  );
}
