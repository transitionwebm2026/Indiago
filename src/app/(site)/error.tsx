'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Highlight } from '@/components/ui/Highlight';
import { routes } from '@/lib/routes';

/** Shown between the navbar and footer when a page fails while rendering in the browser. */
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useLanguage();
  const copy = t.error;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="bg-indigo text-ivory">
      <div className="container-luxe flex min-h-[80svh] flex-col justify-center pb-20 pt-36">
        <Eyebrow surface="dark">{copy.eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-3xl text-balance font-serif text-[2.3rem] leading-[1.08] tracking-wide sm:text-5xl lg:text-6xl">
          <Highlight text={copy.title} surface="dark" />
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ivory/70">{copy.body}</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" arrow onClick={reset}>
            {copy.retry}
          </Button>
          <ButtonLink href={routes.home} size="lg" variant="outline-light">
            {copy.home}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
