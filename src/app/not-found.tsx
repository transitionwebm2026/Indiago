'use client';

import { SiteChrome } from '@/components/layout/SiteChrome';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { HeroShell } from '@/components/ui/HeroShell';
import { Highlight } from '@/components/ui/Highlight';
import { useMedia } from '@/lib/cms/hooks';
import { routes } from '@/lib/routes';

export default function NotFound() {
  const { t } = useLanguage();
  const { slides } = useMedia('home.hero');
  const copy = t.notFound;

  return (
    <SiteChrome>
      <HeroShell slides={slides} size="full">
        <Eyebrow surface="dark">{copy.eyebrow}</Eyebrow>
        <h1 className="mt-6 text-balance font-serif text-[2.3rem] leading-[1.08] tracking-wide sm:text-5xl lg:text-6xl">
          <Highlight text={copy.title} surface="dark" />
        </h1>
        <p className="mt-6 text-lg text-ivory/70">{copy.body}</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={routes.home} size="lg" arrow>
            {copy.cta}
          </ButtonLink>
          <ButtonLink href={routes.portfolio} size="lg" variant="outline-light">
            {copy.secondary}
          </ButtonLink>
        </div>
      </HeroShell>
    </SiteChrome>
  );
}
