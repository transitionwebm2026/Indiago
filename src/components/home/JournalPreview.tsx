'use client';

import { ArticleCard } from '@/components/blog/ArticleCard';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { usePosts } from '@/lib/cms/hooks';
import { routes } from '@/lib/routes';

export function JournalPreview() {
  const { t } = useLanguage();
  const posts = usePosts();
  const copy = t.home.journal;

  return (
    <section className="section-y bg-ivory">
      <div className="container-luxe">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow={copy.eyebrow} title={copy.title} body={copy.body} />
          <Reveal className="shrink-0">
            <ButtonLink href={routes.blog} variant="outline-dark" arrow>
              {copy.cta}
            </ButtonLink>
          </Reveal>
        </div>

        {/* Three compact cards on large screens; the third drops out on two-column tablets so the row stays even. */}
        <div className="mt-12 grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-5">
          {posts.slice(0, 3).map((post, index) => (
            <Reveal key={post.slug} delay={index * 0.12} className={index === 2 ? 'sm:max-lg:hidden' : undefined}>
              <ArticleCard post={post} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
