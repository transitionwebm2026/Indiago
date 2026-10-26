'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { RouteStatus, useDocumentTitle, useRouteSlug } from '@/components/shared/RouteStatus';
import { usePost, usePosts } from '@/lib/cms/hooks';
import { getRelatedPosts } from '@/lib/data/posts';
import { routes, SHELL_SLUG } from '@/lib/routes';
import { ArticleView } from './ArticleView';

/** An article page, live from the CMS — including articles published since the last build. */
export function ArticleRoute({ slug }: { slug: string }) {
  const { t, l } = useLanguage();
  const resolved = useRouteSlug(slug);
  const { post, settled } = usePost(resolved);
  const posts = usePosts();

  useDocumentTitle(slug === SHELL_SLUG && post ? `${l(post.title)} · ${t.brand}` : null);

  if (!post) {
    return (
      <RouteStatus
        state={settled && resolved ? 'missing' : 'loading'}
        eyebrow={t.nav.journal}
        loading={t.article.loading}
        title={t.article.missingTitle}
        body={t.article.missingBody}
        backHref={routes.blog}
        backLabel={t.article.back}
      />
    );
  }

  return <ArticleView key={post.slug} post={post} related={getRelatedPosts(posts, post.slug)} />;
}
