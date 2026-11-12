'use client';

import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number;
  y?: number;
}

const onShow = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | null = null;

/** One observer for every Reveal on the page — there are dozens. */
function observe(element: Element, show: () => void) {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer?.unobserve(entry.target);
        onShow.get(entry.target)?.();
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  onShow.set(element, show);
  observer.observe(element);
  return () => observer?.unobserve(element);
}

/**
 * Fades and lifts content into place the first time it scrolls into view.
 * The motion is a CSS animation (`.reveal` in globals.css), so the dozens of these on a page
 * add almost nothing to the work the browser does while the page starts up.
 *
 * Content is visible as rendered: whatever is on screen when a page opens (from a link or a fresh
 * visit) shows at once, without waiting for JavaScript or an animation. Only content that starts
 * below the fold is hidden — off screen, so unseen — until it scrolls in.
 */
export function Reveal({ children, delay = 0, y = 24, className, style, ...rest }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'pending' | 'shown' | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;
    setState('pending');
    return observe(element, () => setState('shown'));
  }, []);

  return (
    <div
      ref={ref}
      className={cn('reveal', className)}
      data-reveal={state ?? undefined}
      style={{ '--reveal-delay': `${delay}s`, '--reveal-y': `${y}px`, ...style } as CSSProperties}
      {...rest}
    >
      {children}
    </div>
  );
}
