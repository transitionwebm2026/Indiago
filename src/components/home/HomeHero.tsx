'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
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
      {/* Headline and actions only, so the photography carries the hero. The shade behind the copy is
          light so the photographs stay bright; a soft glow under the headline keeps it legible on pale photos.
          On large screens the headline also scales with screen height, so the hero always fits one screen. */}
      <h1 className="text-balance font-serif text-[2rem] leading-[1.08] tracking-wide text-ivory [text-shadow:0_1px_3px_rgba(23,18,44,0.4),0_2px_30px_rgba(23,18,44,0.6)] sm:text-[2.9rem] lg:text-[length:min(3.75rem,7svh)]">
        <Highlight text={hero.title} surface="dark" />
      </h1>
      <div className="mt-7 flex flex-col gap-2.5 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-3">
        <ButtonLink href={routes.portfolio} arrow className="max-sm:min-h-12">
          {hero.primary}
        </ButtonLink>
        <ButtonLink href={routes.inquiry} variant="outline-light" className="bg-indigo-950/35 backdrop-blur-md max-sm:min-h-12">
          {hero.secondary}
        </ButtonLink>
      </div>
    </HeroShell>
  );
}
