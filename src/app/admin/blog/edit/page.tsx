import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PostEditorView } from '@/components/admin/views/PostEditor';

export const metadata: Metadata = { title: 'Edit article' };

// A static export has no dynamic routes, so the article to edit comes from ?id= (read on the client).
export default function AdminPostEditPage() {
  return (
    <Suspense>
      <PostEditorView />
    </Suspense>
  );
}
