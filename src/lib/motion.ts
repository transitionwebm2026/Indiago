/** Signature easing — a long, soft deceleration. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * For <LazyMotion>: the animation engine arrives as a separate file after the first render, so the
 * `m` components every page uses cost only a few kilobytes up front.
 */
export const loadMotionFeatures = () => import('./motion-features').then((module) => module.default);
