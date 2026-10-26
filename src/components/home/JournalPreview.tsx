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

        <div className="mt-16 grid gap-14 md:grid-cols-2 lg:gap-16">
          {posts.slice(0, 2).map((post, index) => (
            <Reveal key={post.slug} delay={index * 0.12}>
              <ArticleCard post={post} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
