import type { Metadata } from 'next';
import { Suspense } from 'react';
import { InquiriesView } from '@/components/admin/views/InquiriesView';

export const metadata: Metadata = { title: 'Project Inquiries' };

export default function AdminInquiriesPage() {
  return (
    <Suspense>
      <InquiriesView />
    </Suspense>
  );
}
