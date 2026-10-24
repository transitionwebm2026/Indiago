import Image from 'next/image';
import { cn } from '@/lib/utils';

/** Circular mark used for the founder and article authors: a portrait when one is supplied, otherwise initials. */
export function Monogram({ initials, src, className }: { initials: string; src?: string; className?: string }) {
  return (
    <span
      aria-hidden
      lang="en"
      className={cn(
        'relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border border-champagne/60 bg-indigo font-serif text-base tracking-[0.12em] text-champagne',
        className,
      )}
    >
      {src ? <Image src={src} alt="" fill sizes="56px" className="object-cover object-[50%_20%]" /> : initials}
    </span>
  );
}
