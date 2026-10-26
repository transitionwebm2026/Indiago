import type { Metadata } from 'next';
import { SettingsView } from '@/components/admin/views/SettingsView';

export const metadata: Metadata = { title: 'Global Settings' };

export default function AdminSettingsPage() {
  return <SettingsView />;
}
