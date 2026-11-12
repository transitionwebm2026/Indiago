'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';
import { canPrefetch } from '@/lib/prefetch';

type LinkProps = ComponentProps<typeof NextLink>;

/**
 * next/link that fetches the page it leads to as soon as the link scrolls into view (in idle time),
 * so tapping it switches page at once. With Data Saver or on 2G only intent (hover, focus or touch)
 * fetches it, so a phone on a costly connection downloads just the page it opens. Each page is a
 * small static file, cached by the browser and the CDN.
 */
export function Link({ href, prefetch, onMouseEnter, onTouchStart, onFocus, ...rest }: LinkProps) {
  const router = useRouter();
  const prefetchNow = () => {
    if (typeof href === 'string' && href.startsWith('/')) router.prefetch(href.split('#')[0]);
  };

  return (
    <NextLink
      href={href}
      prefetch={prefetch ?? (canPrefetch() ? undefined : false)}
      onMouseEnter={(event) => {
        prefetchNow();
        onMouseEnter?.(event);
      }}
      onTouchStart={(event) => {
        prefetchNow();
        onTouchStart?.(event);
      }}
      onFocus={(event) => {
        prefetchNow();
        onFocus?.(event);
      }}
      {...rest}
    />
  );
}
