import { useEffect, useState } from 'react';

/** Signature easing — a long, soft deceleration. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * For <LazyMotion>: the animation engine arrives as a separate file after the first render, so the
 * `m` components every page uses cost only a few kilobytes up front.
 */
export const loadMotionFeatures = () => import('./motion-features').then((module) => module.default);

let hydrated = false;

/**
 * False on the first page load, so the pre-rendered HTML paints at once instead of waiting for
 * JavaScript to fade it in (that wait is what search engines time as LCP); true for content that
 * mounts later, e.g. after a client-side navigation.
 */
export function useEntranceAnimation() {
  const [animate] = useState(() => hydrated);
  useEffect(() => {
    hydrated = true;
  }, []);
  return animate;
}
