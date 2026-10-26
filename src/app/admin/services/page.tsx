import type { Metadata } from 'next';
import { ServicesView } from '@/components/admin/views/ServicesView';

export const metadata: Metadata = { title: 'Services & Process' };

export default function AdminServicesPage() {
  return <ServicesView />;
}
