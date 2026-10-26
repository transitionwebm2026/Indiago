'use client';

import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Link } from '@/components/ui/Link';
import type { PostSummary } from '@/lib/data/posts';
import { img } from '@/lib/images';
import { postHref } from '@/lib/routes';
import { cn, formatDate } from '@/lib/utils';

export function ReadTimeBadge({ minutes, className }: { minutes: number; className?: string }) {
  const { t } = useLanguage();
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-ivory px-3 py-1.5 text-[0.6rem] font-medium uppercase tracking-luxe text-indigo',
        className,
      )}
    >
      <Clock aria-hidden className="h-3 w-3" strokeWidth={1.75} />
      {minutes} {t.common.minRead}
    </span>
  );
}

export function ArticleCard({ post, className }: { post: PostSummary; className?: string }) {
  const { t, l, locale } = useLanguage();

  return (
    <article
      className={cn(
        'card-frame group relative flex h-full flex-col rounded-[1.75rem] bg-white/70 p-2.5 hover:border-champagne sm:p-3',
        className,
      )}
    >
      <div className="relative isolate aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-linen-dark">
        <Image
          src={img(post.cover, 1200)}
          alt={l(post.title)}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-1200 ease-luxe group-hover:scale-[1.05]"
        />
        <ReadTimeBadge minutes={post.readTime} className="absolute start-5 top-5" />
      </div>

      <div className="flex flex-1 flex-col px-2.5 pb-3 sm:px-3">
        <div className="mt-6 flex flex-wrap items-center gap-3 text-[0.62rem] font-medium uppercase tracking-luxe">
          <span className="text-champagne-800">{t.blogCategories[post.category]}</span>
          <span aria-hidden className="h-px w-6 bg-indigo/20" />
          <time dateTime={post.date} className="text-charcoal-muted">
            {formatDate(post.date, locale)}
          </time>
        </div>

        <h3 className="mt-4 text-balance font-serif text-2xl leading-snug tracking-wide text-indigo transition-colors duration-500 group-hover:text-champagne-700">
          <Link href={postHref(post.slug)} className="after:absolute after:inset-0">
            {l(post.title)}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-charcoal-soft">{l(post.excerpt)}</p>

        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[0.64rem] font-medium uppercase tracking-luxe text-indigo">
          {t.common.readMore}
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
