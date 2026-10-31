import type { Metadata } from 'next';
import { FeaturedArticle } from '@/components/blog/FeaturedArticle';
import { JournalExplorer } from '@/components/blog/JournalExplorer';
import { NewsletterSignup } from '@/components/blog/NewsletterSignup';
import { PageIntro } from '@/components/ui/PageHeader';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Blogs',
  description:
    'The Indigo Interiors blog: design trends, natural stone and timber selection, space planning and practical client guides for interior projects in Egypt.',
  path: routes.blog,
});

export default function BlogPage() {
  return (
    <>
      <PageIntro page="blog" />
      <FeaturedArticle />
      <JournalExplorer />
      <NewsletterSignup />
    </>
  );
}
