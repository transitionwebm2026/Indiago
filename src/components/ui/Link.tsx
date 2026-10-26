'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';

type LinkProps = ComponentProps<typeof NextLink>;

/**
 * next/link that fetches the next page only when the visitor shows intent (hover, focus or touch)
 * instead of for every link that scrolls into view, so a phone downloads just the page it opened.
 * Touch fires a moment before the tap completes, which is still a head start on the navigation.
 */
export function Link({ href, onMouseEnter, onTouchStart, onFocus, ...rest }: LinkProps) {
  const router = useRouter();
  const prefetch = () => {
    if (typeof href === 'string' && href.startsWith('/')) router.prefetch(href);
  };

  return (
    <NextLink
      href={href}
      prefetch={false}
      onMouseEnter={(event) => {
        prefetch();
        onMouseEnter?.(event);
      }}
      onTouchStart={(event) => {
        prefetch();
        onTouchStart?.(event);
      }}
      onFocus={(event) => {
        prefetch();
        onFocus?.(event);
      }}
      {...rest}
    />
  );
}
