'use client';

import Image from 'next/image';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Highlight } from '@/components/ui/Highlight';
import { Monogram } from '@/components/ui/Monogram';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { useAuthors } from '@/lib/cms/hooks';
import { hasByline, type Post, type PostSummary } from '@/lib/data/posts';
import { img } from '@/lib/images';
import { postHref, routes } from '@/lib/routes';
import { formatDate } from '@/lib/utils';
import { ArticleBody } from './ArticleBody';
import { ArticleCard } from './ArticleCard';
import { NewsletterSignup } from './NewsletterSignup';
import { ShareBar } from './ShareBar';

export function ArticleView({ post, related }: { post: Post; related: PostSummary[] }) {
  const { t, l, locale } = useLanguage();
  const author = useAuthors()[post.author];
  const byline = hasByline(post);
  const title = l(post.title);
  const arabicBody = locale === 'ar' && post.bodyAr?.length ? post.bodyAr : undefined;
  const published = (
    <>
      <time dateTime={post.date}>{formatDate(post.date, locale)}</time> · {post.readTime} {t.common.minRead}
    </>
  );

  return (
    <>
      <PageHeader
        eyebrow={t.blogCategories[post.category]}
        title={title}
        body={l(post.excerpt)}
        crumbs={[{ label: t.nav.journal, href: routes.blog }, { label: title }]}
      >
        {/* Articles written by the studio carry no byline, only their date and reading time. */}
        {byline ? (
          <div className="flex items-center gap-4">
            <Monogram initials={author.initials} src={author.portrait} className="h-12 w-12 text-sm" />
            <div>
              <p className="text-sm text-indigo">
                {t.common.by} {l(author.name)}
              </p>
              <p className="mt-0.5 text-xs text-charcoal-muted">
                {l(author.role)} · {published}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-charcoal-muted">{published}</p>
        )}
      </PageHeader>

      <div className="bg-ivory">
        <div className="container-luxe pt-12 md:pt-20">
          {/* The cover is the largest thing on screen when an article opens (its LCP), so it loads first
              and paints with the HTML instead of waiting for JavaScript to fade it in. */}
          {post.cover && (
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-linen-dark md:aspect-[16/8]">
              <Image
                src={img(post.cover, 2000)}
                alt={title}
                fill
                priority
                sizes="(min-width: 1320px) 1240px, calc(100vw - 2.5rem)"
                className="object-cover"
              />
            </div>
          )}
        </div>

        <div className="container-luxe grid gap-10 py-16 md:py-24 lg:grid-cols-12 lg:gap-12">
          <aside className="lg:col-span-2">
            <ShareBar path={postHref(post.slug)} title={title} />
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

            <footer className="mt-12 flex flex-col gap-4 card-frame rounded-2xl bg-linen p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              {byline ? (
                <div className="flex min-w-0 items-center gap-4">
                  <Monogram initials={author.initials} src={author.portrait} />
                  <div>
                    <p className="text-[0.62rem] font-medium uppercase tracking-luxe text-charcoal-muted">{t.article.writtenBy}</p>
                    <p className="mt-1 font-serif text-xl tracking-wide text-indigo">{l(author.name)}</p>
                    <p className="text-sm text-charcoal-soft">{l(author.role)}</p>
                  </div>
                </div>
              ) : (
                // At this size the usual light-surface Champagne (700) is short of AA contrast on Linen; 800 meets it.
                <p className="text-balance font-serif text-xl leading-snug tracking-wide text-indigo [&_em]:text-champagne-800">
                  <Highlight text={t.cta.title} />
                </p>
              )}
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
            <div className="mt-10 grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-5">
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
