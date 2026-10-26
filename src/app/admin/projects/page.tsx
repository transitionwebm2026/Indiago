import type { Metadata } from 'next';
import { ProjectsView } from '@/components/admin/views/ProjectsView';

export const metadata: Metadata = { title: 'Portfolio' };

export default function AdminProjectsPage() {
  return <ProjectsView />;
}
