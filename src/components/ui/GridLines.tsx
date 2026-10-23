import { cn } from '@/lib/utils';

/** Faint architectural column lines used behind dark hero sections. */
export function GridLines({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0', className)}>
      <div className="container-luxe relative h-full">
        {[0, 25, 50, 75, 100].map((position) => (
          <span
            key={position}
            className={cn(
              'absolute inset-y-0 w-px bg-ivory/[0.06]',
              (position === 25 || position === 75) && 'hidden md:block',
            )}
            style={{ insetInlineStart: `${position}%` }}
          />
        ))}
      </div>
    </div>
  );
}
