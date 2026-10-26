'use client';

import { useEffect, useState } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Highlight } from '@/components/ui/Highlight';
import { SHELL_SLUG, slugFromPath } from '@/lib/routes';

/**
 * The slug a detail page should show: its own, or — on the shell page served for
 * content published after the build — the one in the address bar.
 */
export function useRouteSlug(slug: string) {
  const [resolved, setResolved] = useState(slug === SHELL_SLUG ? null : slug);
  useEffect(() => {
    if (slug === SHELL_SLUG) setResolved(slugFromPath(window.location.pathname));
  }, [slug]);
  return resolved;
}

/** Keeps the tab title in step with content that only exists in the CMS. */
export function useDocumentTitle(title: string | null) {
  useEffect(() => {
    if (!title) return;
    document.title = title;
    // Cached content can arrive before Next.js writes the page's static title after hydration;
    // apply ours again once it has. Clearing the timer on unmount keeps it off the next page.
    const timer = window.setTimeout(() => {
      document.title = title;
    }, 400);
    return () => window.clearTimeout(timer);
  }, [title]);
}

interface RouteStatusProps {
  state: 'loading' | 'missing';
  eyebrow: string;
  loading: string;
  title: string;
  body: string;
  backHref: string;
  backLabel: string;
}

/** Placeholder while a CMS-only page loads, or a polite dead end when it no longer exists. */
export function RouteStatus({ state, eyebrow, loading, title, body, backHref, backLabel }: RouteStatusProps) {
  return (
    <section className="relative isolate flex min-h-[80svh] items-center bg-indigo pb-16 pt-32 text-ivory">
      <div className="container-luxe">
        {state === 'loading' ? (
          <div role="status" className="flex items-center gap-4 text-ivory/70">
            <span aria-hidden className="h-8 w-8 animate-spin rounded-full border-2 border-champagne/30 border-t-champagne" />
            {loading}
          </div>
        ) : (
          <div className="max-w-2xl">
            <Eyebrow surface="dark">{eyebrow}</Eyebrow>
            <h1 className="mt-6 text-balance font-serif text-[2.1rem] leading-[1.1] tracking-wide sm:text-5xl">
              <Highlight text={title} surface="dark" />
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ivory/70">{body}</p>
            <ButtonLink href={backHref} size="lg" arrow className="mt-9">
              {backLabel}
            </ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
}
