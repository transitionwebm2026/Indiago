'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner } from './ui';

/** Rendered only once signed in (the shell handles sign-in), so it simply moves on to the overview. */
export function LoginRedirect() {
  const router = useRouter();
  useEffect(() => router.replace('/admin/'), [router]);
  return (
    <div className="grid h-64 place-items-center">
      <Spinner />
    </div>
  );
}
