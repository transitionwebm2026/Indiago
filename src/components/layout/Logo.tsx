'use client';

import { useSiteSettings } from '@/lib/cms/hooks';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

/**
 * The "INDIGO / INTERIORS" lockup in Champagne on a transparent background, for Deep Indigo surfaces.
 * public/logo.png is cut from public/images/Indigo logo.jpeg. A logo uploaded in Global Settings replaces it.
 */
export function Logo({ className }: LogoProps) {
  const { logo, name } = useSiteSettings();

  // A plain <img> keeps any aspect ratio, sized by height.
  return logo ? (
    <img src={logo} alt={name} className={cn('h-10 w-auto object-contain', className)} />
  ) : (
    <img src="/logo.png" alt={name} width={480} height={195} className={cn('h-10 w-auto', className)} />
  );
}
