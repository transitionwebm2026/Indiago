import type { Metadata } from 'next';
import { LoginRedirect } from '@/components/admin/LoginRedirect';

export const metadata: Metadata = { title: 'Sign in' };

/** The shell shows the sign-in form to signed-out visitors on every /admin URL; signed-in admins go to the overview. */
export default function AdminLoginPage() {
  return <LoginRedirect />;
}
