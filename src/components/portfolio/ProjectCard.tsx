'use client';

import Image from 'next/image';
import { ArrowRight, Images } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Link } from '@/components/ui/Link';
import type { Project } from '@/lib/data/projects';
import { img } from '@/lib/images';
import { projectHref } from '@/lib/routes';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onOpenGallery?: () => void;
  className?: string;
  aspect?: string;
}

export function ProjectCard({ project, onOpenGallery, className, aspect = 'aspect-[4/5]' }: ProjectCardProps) {
  const { t, l } = useLanguage();
  const title = l(project.title);
  const tags = [t.categories[project.category], l(project.location)];

  return (
    <article className={cn('card-frame group relative rounded-[1.75rem] bg-white/70 p-2.5 hover:border-champagne sm:p-3', className)}>
      <div className={cn('relative isolate overflow-hidden rounded-[1.25rem] bg-linen-dark', aspect)}>
        <Image
          src={img(project.cover, 1200)}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-1200 ease-luxe group-hover:scale-[1.06]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-indigo/75 via-indigo/5 to-indigo/20 transition-opacity duration-700 group-hover:opacity-90"
        />

        <ul className="absolute inset-x-5 top-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-ivory/25 bg-indigo/40 px-3 py-1.5 text-[0.6rem] font-medium uppercase tracking-luxe text-ivory backdrop-blur-sm"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-4 text-ivory">
          <span className="inline-flex translate-y-2 items-center gap-2 text-[0.64rem] font-medium uppercase tracking-luxe opacity-0 transition-all duration-500 ease-luxe group-hover:translate-y-0 group-hover:opacity-100">
            {t.common.viewProject}
            <ArrowRight aria-hidden className="h-3.5 w-3.5 rtl:-scale-x-100" strokeWidth={1.5} />
          </span>
          {onOpenGallery && (
            <button
              type="button"
              onClick={onOpenGallery}
              className="relative z-10 inline-flex items-center gap-2 rounded-full border border-ivory/30 bg-indigo/40 px-3 py-2 text-[0.62rem] uppercase tracking-luxe backdrop-blur-sm transition-colors hover:border-champagne hover:text-champagne"
            >
              <Images aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
              {project.gallery.length + 1} {t.common.photos}
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 min-w-0 px-2.5 pb-3 sm:px-3">
        <h3 className="break-words font-serif text-xl leading-snug tracking-wide text-indigo transition-colors duration-500 group-hover:text-champagne-700 min-[400px]:text-2xl">
          <Link href={projectHref(project.id)} className="after:absolute after:inset-0">
            {title}
          </Link>
        </h3>
        <p className="mt-1.5 text-sm text-charcoal-soft">{project.highlights.map(l).join(' · ')}</p>
      </div>
    </article>
  );
}
