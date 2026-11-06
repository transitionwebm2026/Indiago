'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
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
        'inline-flex items-center rounded-full bg-ivory px-2.5 py-1 text-[0.56rem] font-medium uppercase tracking-luxe text-indigo',
        className,
      )}
    >
      {minutes} {t.common.minRead}
    </span>
  );
}

/** A compact article card, in the same frame as the project cards. */
export function ArticleCard({ post, className }: { post: PostSummary; className?: string }) {
  const { t, l, locale } = useLanguage();

  return (
    <article
      className={cn(
        'card-frame group relative flex h-full flex-col rounded-[1.25rem] bg-white/70 p-2 hover:border-champagne',
        className,
      )}
    >
      <div className="relative isolate aspect-[16/10] overflow-hidden rounded-[0.875rem] bg-linen-dark">
        <Image
          src={img(post.cover, 1000)}
          alt={l(post.title)}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-1200 ease-luxe group-hover:scale-[1.05]"
        />
        <ReadTimeBadge minutes={post.readTime} className="absolute start-3 top-3" />
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2">
        <div className="mt-4 flex flex-wrap items-center gap-2.5 text-[0.58rem] font-medium uppercase tracking-luxe">
          <span className="text-champagne-800">{t.blogCategories[post.category]}</span>
          <span aria-hidden className="h-px w-5 bg-indigo/20" />
          <time dateTime={post.date} className="text-charcoal-muted">
            {formatDate(post.date, locale)}
          </time>
        </div>

        <h3 className="mt-2.5 text-balance font-serif text-lg leading-snug tracking-wide text-indigo transition-colors duration-500 group-hover:text-champagne-700 sm:text-xl">
          <Link href={postHref(post.slug)} className="after:absolute after:inset-0">
            {l(post.title)}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-charcoal-soft">{l(post.excerpt)}</p>

        <span className="mt-auto inline-flex items-center gap-2 pt-4 text-[0.6rem] font-medium uppercase tracking-luxe text-indigo">
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
