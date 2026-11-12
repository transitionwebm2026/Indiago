'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { buttonClasses } from '@/components/ui/Button';
import { Link } from '@/components/ui/Link';
import { Monogram } from '@/components/ui/Monogram';
import { Reveal } from '@/components/ui/Reveal';
import { useAuthors, usePosts } from '@/lib/cms/hooks';
import { getFeaturedPost, hasByline } from '@/lib/data/posts';
import { img } from '@/lib/images';
import { postHref } from '@/lib/routes';
import { formatDate } from '@/lib/utils';
import { ReadTimeBadge } from './ArticleCard';

/** A compact, light spotlight card for the blog's lead article. */
export function FeaturedArticle() {
  const { t, l, locale } = useLanguage();
  const post = getFeaturedPost(usePosts());
  const authors = useAuthors();
  if (!post) return null;
  const author = authors[post.author];
  const date = (
    <time dateTime={post.date} className="text-xs text-charcoal-muted">
      {formatDate(post.date, locale)}
    </time>
  );

  return (
    <section className="bg-ivory pt-16 md:pt-24">
      <div className="container-luxe">
        <Reveal>
          <article className="card-frame group relative grid overflow-hidden rounded-[1.25rem] bg-white/70 p-2 hover:border-champagne lg:grid-cols-[1fr_1.1fr]">
            <div className="relative isolate aspect-[16/10] overflow-hidden rounded-[0.875rem] bg-linen-dark lg:aspect-auto lg:min-h-[16rem]">
              <Image
                src={img(post.cover, 1400)}
                alt={l(post.title)}
                fill
                // The first photo on the Blog page: fetched first instead of lazily.
                priority
                sizes="(min-width: 1024px) 50vw, calc(100vw - 2.5rem)"
                className="object-cover transition-transform duration-1200 ease-luxe group-hover:scale-[1.04]"
              />
              <span className="absolute start-3 top-3 rounded-full bg-champagne px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-luxe text-indigo">
                {t.blog.featured}
              </span>
            </div>

            <div className="flex flex-col justify-center p-4 sm:p-6 lg:px-8 lg:py-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[0.62rem] font-medium uppercase tracking-luxe text-champagne-800">
                  {t.blogCategories[post.category]}
                </span>
                <ReadTimeBadge minutes={post.readTime} className="border border-champagne/50" />
              </div>
              <h2 className="mt-3 text-balance font-serif text-xl leading-snug tracking-wide text-indigo transition-colors duration-500 group-hover:text-champagne-700 md:text-2xl">
                <Link href={postHref(post.slug)} className="after:absolute after:inset-0">
                  {l(post.title)}
                </Link>
              </h2>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-charcoal-soft">{l(post.excerpt)}</p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-indigo/10 pt-4">
                {/* Articles written by the studio carry no byline, only their date. */}
                {hasByline(post) ? (
                  <div className="flex items-center gap-3">
                    <Monogram initials={author.initials} src={author.portrait} className="h-9 w-9 text-xs" />
                    <div>
                      <p className="text-sm text-indigo">
                        {t.common.by} {l(author.name)}
                      </p>
                      <p className="mt-0.5">{date}</p>
                    </div>
                  </div>
                ) : (
                  date
                )}
                <span className={buttonClasses({ variant: 'link-dark' })}>
                  {t.blog.readArticle}
                  <ArrowRight
                    aria-hidden
                    strokeWidth={1.5}
                    className="h-4 w-4 transition-transform duration-500 ease-luxe group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                  />
                </span>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
