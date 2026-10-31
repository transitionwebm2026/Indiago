'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { HeroShell } from '@/components/ui/HeroShell';
import { Highlight } from '@/components/ui/Highlight';
import { useMedia } from '@/lib/cms/hooks';
import { routes } from '@/lib/routes';

export function HomeHero() {
  const { t } = useLanguage();
  const { slides } = useMedia('home.hero');
  const hero = t.home.hero;

  return (
    <HeroShell slides={slides}>
      <Eyebrow surface="dark">{hero.eyebrow}</Eyebrow>
      {/* On large screens the headline also scales with screen height, so the hero always fits one screen. */}
      <h1 className="mt-4 text-balance font-serif text-[1.65rem] leading-[1.1] tracking-wide text-ivory sm:text-[2.2rem] lg:text-[length:min(2.6rem,5.4svh)]">
        <Highlight text={hero.title} surface="dark" />
      </h1>
      {/* Phones show headline and actions only, leaving room for the photography. */}
      <p className="mt-4 hidden text-pretty text-[0.95rem] leading-relaxed text-ivory/80 sm:block">{hero.body}</p>
      <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:flex-wrap">
        <ButtonLink href={routes.portfolio} size="sm" arrow className="max-sm:min-h-12">
          {hero.primary}
        </ButtonLink>
        <ButtonLink href={routes.inquiry} size="sm" variant="outline-light" className="max-sm:min-h-12">
          {hero.secondary}
        </ButtonLink>
      </div>
    </HeroShell>
  );
}
