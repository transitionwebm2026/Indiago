import type { Metadata } from 'next';
import { ContentView } from '@/components/admin/views/ContentView';

export const metadata: Metadata = { title: 'Pages Content' };

export default function AdminContentPage() {
  return <ContentView />;
}
