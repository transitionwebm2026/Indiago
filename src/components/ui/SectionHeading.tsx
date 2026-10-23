import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Eyebrow } from './Eyebrow';
import { Highlight, type Surface } from './Highlight';
import { Reveal } from './Reveal';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  body?: string;
  surface?: Surface;
  align?: 'start' | 'center';
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  surface = 'light',
  align = 'start',
  className,
  children,
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      <Reveal>
        <Eyebrow surface={surface}>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={cn(
            'mt-6 text-balance font-serif text-[2.1rem] leading-[1.14] tracking-wide sm:text-5xl lg:text-[3.35rem]',
            surface === 'dark' ? 'text-ivory' : 'text-indigo',
          )}
        >
          <Highlight text={title} surface={surface} />
        </h2>
      </Reveal>
      {body && (
        <Reveal delay={0.16}>
          <p
            className={cn(
              'mt-6 text-pretty text-base leading-relaxed sm:text-lg',
              surface === 'dark' ? 'text-ivory/70' : 'text-charcoal-soft',
            )}
          >
            {body}
          </p>
        </Reveal>
      )}
      {children}
    </div>
  );
}
