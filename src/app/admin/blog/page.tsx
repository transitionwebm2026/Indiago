import type { Metadata } from 'next';
import { BlogView } from '@/components/admin/views/BlogView';

export const metadata: Metadata = { title: 'Blog' };

export default function AdminBlogPage() {
  return <BlogView />;
}
