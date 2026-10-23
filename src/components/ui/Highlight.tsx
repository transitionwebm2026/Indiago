import { Fragment } from 'react';
import { cn } from '@/lib/utils';

export type Surface = 'light' | 'dark';

/**
 * Renders copy where *wrapped words* become Champagne highlights.
 * On light surfaces a deeper champagne keeps the accent legible.
 */
export function Highlight({ text, surface = 'light' }: { text: string; surface?: Surface }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);

  return (
    <>
      {parts.map((part, index) =>
        part.length > 2 && part.startsWith('*') && part.endsWith('*') ? (
          <em
            key={index}
            className={cn('not-italic ltr:italic', surface === 'dark' ? 'text-champagne' : 'text-champagne-700')}
          >
            {part.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** Strips highlight markers for plain-text contexts such as alt text or metadata. */
export function plain(text: string) {
  return text.replace(/\*/g, '');
}
