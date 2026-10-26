'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { buttonClasses } from '@/components/ui/Button';
import { Monogram } from '@/components/ui/Monogram';
import { Reveal } from '@/components/ui/Reveal';
import { useAuthors, usePosts } from '@/lib/cms/hooks';
import { getFeaturedPost } from '@/lib/data/posts';
import { img } from '@/lib/images';
import { postHref } from '@/lib/routes';
import { formatDate } from '@/lib/utils';
import { ReadTimeBadge } from './ArticleCard';

/** Spotlight card for the blog's lead article. */
export function FeaturedArticle() {
  const { t, l, locale } = useLanguage();
  const post = getFeaturedPost(usePosts());
  const authors = useAuthors();
  if (!post) return null;
  const author = authors[post.author];

  return (
    <section className="bg-ivory pt-16 md:pt-24">
      <div className="container-luxe">
        <Reveal>
          <article className="card-frame group relative grid overflow-hidden rounded-[2rem] bg-indigo p-2.5 text-ivory hover:border-champagne sm:p-3 lg:grid-cols-2">
            <div className="relative isolate aspect-[16/11] overflow-hidden rounded-[1.5rem] lg:aspect-auto lg:min-h-[30rem]">
              <Image
                src={img(post.cover, 1600)}
                alt={l(post.title)}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-1200 ease-luxe group-hover:scale-[1.04]"
              />
              <span className="absolute start-5 top-5 rounded-full bg-champagne px-4 py-1.5 text-[0.6rem] font-semibold uppercase tracking-luxe text-indigo">
                {t.blog.featured}
              </span>
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[0.62rem] font-medium uppercase tracking-luxe text-champagne">
                  {t.blogCategories[post.category]}
                </span>
                <ReadTimeBadge minutes={post.readTime} />
              </div>
              <h2 className="mt-6 text-balance font-serif text-3xl leading-snug tracking-wide md:text-4xl">
                <Link href={postHref(post.slug)} className="after:absolute after:inset-0">
                  {l(post.title)}
                </Link>
              </h2>
              <p className="mt-5 leading-relaxed text-ivory/70">{l(post.excerpt)}</p>

              <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-ivory/10 pt-7">
                <div className="flex items-center gap-4">
                  <Monogram initials={author.initials} src={author.portrait} className="h-12 w-12 text-sm" />
                  <div>
                    <p className="text-sm">
                      {t.common.by} {l(author.name)}
                    </p>
                    <p className="mt-0.5 text-xs text-ivory/50">
                      {l(author.role)} · <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
                    </p>
                  </div>
                </div>
                <span className={buttonClasses({ variant: 'link-light' })}>
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
