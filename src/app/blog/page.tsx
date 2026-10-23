import type { Metadata } from 'next';
import { BlogHero } from '@/components/blog/BlogHero';
import { FeaturedArticle } from '@/components/blog/FeaturedArticle';
import { JournalExplorer } from '@/components/blog/JournalExplorer';
import { NewsletterSignup } from '@/components/blog/NewsletterSignup';
import { CtaBanner } from '@/components/shared/CtaBanner';

export const metadata: Metadata = {
  title: 'Blogs',
  description:
    'The Indigo Interiors blog: design trends, natural stone and timber selection, space planning and practical client guides for interior projects in Egypt.',
  alternates: { canonical: '/blog/' },
};

export default function BlogPage() {
  return (
    <>
      <BlogHero />
      <FeaturedArticle />
      <JournalExplorer />
      <NewsletterSignup />
      <CtaBanner />
    </>
  );
}
