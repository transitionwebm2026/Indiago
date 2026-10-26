import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProjectEditorView } from '@/components/admin/views/ProjectEditor';

export const metadata: Metadata = { title: 'Edit project' };

// A static export has no dynamic routes, so the project to edit comes from ?id= (read on the client).
export default function AdminProjectEditPage() {
  return (
    <Suspense>
      <ProjectEditorView />
    </Suspense>
  );
}
