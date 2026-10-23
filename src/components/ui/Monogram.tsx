import { cn } from '@/lib/utils';

/** Circular initials mark used for the founder and article authors. */
export function Monogram({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      aria-hidden
      lang="en"
      className={cn(
        'grid h-14 w-14 shrink-0 place-items-center rounded-full border border-champagne/60 bg-indigo font-serif text-base tracking-[0.12em] text-champagne',
        className,
      )}
    >
      {initials}
    </span>
  );
}
