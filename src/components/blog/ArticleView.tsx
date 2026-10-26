'use client';

import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { HeroShell } from '@/components/ui/HeroShell';
import { Link } from '@/components/ui/Link';
import { Monogram } from '@/components/ui/Monogram';
import { Reveal } from '@/components/ui/Reveal';
import { useAuthors, useMedia } from '@/lib/cms/hooks';
import type { Post, PostSummary } from '@/lib/data/posts';
import { img } from '@/lib/images';
import { postHref, routes } from '@/lib/routes';
import { formatDate } from '@/lib/utils';
import { ArticleBody } from './ArticleBody';
import { ArticleCard, ReadTimeBadge } from './ArticleCard';
import { NewsletterSignup } from './NewsletterSignup';
import { ShareBar } from './ShareBar';

export function ArticleView({ post, related }: { post: Post; related: PostSummary[] }) {
  const { t, l, locale } = useLanguage();
  const { slides } = useMedia('blog.hero');
  const author = useAuthors()[post.author];
  const title = l(post.title);
  const arabicBody = locale === 'ar' && post.bodyAr?.length ? post.bodyAr : undefined;

  return (
    <>
      <HeroShell slides={slides}>
        <Link
          href={routes.blog}
          className="group inline-flex items-center gap-2 text-[0.64rem] font-medium uppercase tracking-luxe text-ivory/70 transition-colors hover:text-champagne"
        >
          <ArrowLeft
            aria-hidden
            strokeWidth={1.5}
            className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-x-1 rtl:-scale-x-100 rtl:group-hover:translate-x-1"
          />
          {t.article.back}
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Eyebrow surface="dark">{t.blogCategories[post.category]}</Eyebrow>
          <ReadTimeBadge minutes={post.readTime} />
        </div>
        <h1 className="mt-6 text-balance font-serif text-[2.1rem] leading-[1.12] tracking-wide sm:text-5xl lg:text-[3.2rem]">
          {title}
        </h1>
        <p className="mt-5 text-pretty text-base leading-relaxed text-ivory/70 sm:text-lg">{l(post.excerpt)}</p>
        <div className="mt-8 flex items-center gap-4 border-t border-ivory/10 pt-6">
          <Monogram initials={author.initials} src={author.portrait} className="h-12 w-12 text-sm" />
          <div>
            <p className="text-sm text-ivory">
              {t.common.by} {l(author.name)}
            </p>
            <p className="mt-0.5 text-xs text-ivory/60">
              {l(author.role)} · <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
            </p>
          </div>
        </div>
      </HeroShell>

      <div className="bg-ivory">
        <div className="container-luxe pt-12 md:pt-20">
          {post.cover && (
            <Reveal className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-linen-dark md:aspect-[16/8]">
              <Image src={img(post.cover, 2000)} alt={title} fill sizes="(min-width: 1320px) 1240px, 100vw" className="object-cover" />
            </Reveal>
          )}
        </div>

        <div className="container-luxe grid gap-10 py-16 md:py-24 lg:grid-cols-12 lg:gap-12">
          <aside className="lg:col-span-2">
            <ShareBar path={postHref(post.slug)} title={title} className="lg:sticky lg:top-32" />
          </aside>

          <article className="lg:col-span-8">
            {arabicBody ? (
              <ArticleBody blocks={arabicBody} lang="ar" />
            ) : (
              <>
                {locale !== 'en' && (
                  <p className="mb-10 rounded-2xl border border-champagne/50 bg-linen px-5 py-3 text-sm text-charcoal-soft">
                    {t.common.englishOnly}
                  </p>
                )}
                <ArticleBody blocks={post.body} />
              </>
            )}

            <footer className="mt-16 flex flex-col gap-6 card-frame rounded-3xl bg-linen p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="flex min-w-0 items-center gap-4">
                <Monogram initials={author.initials} src={author.portrait} />
                <div>
                  <p className="text-[0.62rem] font-medium uppercase tracking-luxe text-charcoal-muted">{t.article.writtenBy}</p>
                  <p className="mt-1 font-serif text-xl tracking-wide text-indigo">{l(author.name)}</p>
                  <p className="text-sm text-charcoal-soft">{l(author.role)}</p>
                </div>
              </div>
              <ButtonLink href={routes.inquiry} variant="outline-dark" arrow className="w-full shrink-0 sm:w-auto">
                {t.nav.cta}
              </ButtonLink>
            </footer>
          </article>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section-y bg-linen">
          <div className="container-luxe">
            <Reveal>
              <Eyebrow>{t.article.related}</Eyebrow>
            </Reveal>
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.slug} delay={index * 0.1}>
                  <ArticleCard post={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <NewsletterSignup />
    </>
  );
}
