import type { Metadata } from 'next';
import { ArticleRoute } from '@/components/blog/ArticleRoute';
import { getPost, posts } from '@/lib/data/post-bodies';
import { authors } from '@/lib/data/posts';
import { img } from '@/lib/images';
import { postHref, SHELL_SLUG } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

/** One page per built-in article, plus the shell that serves articles published in the CMS later. */
export function generateStaticParams() {
  return [...posts.map((post) => ({ slug: post.slug })), { slug: SHELL_SLUG }];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Article', robots: { index: false } };
  const author = authors[post.author].name.en;
  return {
    ...pageMetadata({
      title: post.title.en,
      description: post.excerpt.en,
      path: postHref(post.slug),
      image: { url: img(post.cover, 1200), alt: post.title.en },
      article: { publishedTime: post.date, authors: [author] },
    }),
    authors: [{ name: author }],
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  return <ArticleRoute slug={slug} builtIn={getPost(slug)} />;
}
