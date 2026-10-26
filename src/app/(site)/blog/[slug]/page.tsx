import type { Metadata } from 'next';
import { ArticleRoute } from '@/components/blog/ArticleRoute';
import { authors, getPost, posts } from '@/lib/data/posts';
import { img } from '@/lib/images';
import { postHref, SHELL_SLUG } from '@/lib/routes';
import { site } from '@/lib/site';

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
  return {
    title: post.title.en,
    description: post.excerpt.en,
    alternates: { canonical: postHref(post.slug) },
    authors: [{ name: authors[post.author].name.en }],
    openGraph: {
      type: 'article',
      siteName: site.name,
      url: postHref(post.slug),
      title: post.title.en,
      description: post.excerpt.en,
      publishedTime: post.date,
      images: [{ url: img(post.cover, 1200), alt: post.title.en }],
    },
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  return <ArticleRoute slug={slug} />;
}
