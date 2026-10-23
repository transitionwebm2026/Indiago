import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { Surface } from './Highlight';

export function Eyebrow({
  children,
  surface = 'light',
  className,
}: {
  children: ReactNode;
  surface?: Surface;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-3 text-[0.68rem] font-medium uppercase tracking-ultra',
        surface === 'dark' ? 'text-champagne' : 'text-champagne-800',
        className,
      )}
    >
      <span aria-hidden className="h-px w-8 bg-current opacity-70" />
      {children}
    </p>
  );
}
