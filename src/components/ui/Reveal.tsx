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
 */
export function Reveal({ children, delay = 0, y = 24, className, style, ...rest }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    return observe(element, () => setShown(true));
  }, []);

  return (
    <div
      ref={ref}
      className={cn('reveal', className)}
      data-shown={shown || undefined}
      style={{ '--reveal-delay': `${delay}s`, '--reveal-y': `${y}px`, ...style } as CSSProperties}
      {...rest}
    >
      {children}
    </div>
  );
}
