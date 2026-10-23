'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { HeroShell } from '@/components/ui/HeroShell';
import { Highlight } from '@/components/ui/Highlight';
import { heroSlides } from '@/lib/data/heroes';
import { routes } from '@/lib/routes';

export function HomeHero() {
  const { t } = useLanguage();
  const hero = t.home.hero;

  return (
    <HeroShell slides={heroSlides.home} size="full">
      <Eyebrow surface="dark">{hero.eyebrow}</Eyebrow>
      {/* On large screens the headline also scales with screen height, so the hero always fits one screen. */}
      <h1 className="mt-5 text-balance font-serif text-[1.9rem] leading-[1.08] sm:mt-6 tracking-wide text-ivory sm:text-5xl lg:text-[length:min(3.75rem,7.4svh)] xl:text-[length:min(4.1rem,8.2svh)]">
        <Highlight text={hero.title} surface="dark" />
      </h1>
      {/* Phones show headline and actions only, leaving room for the photography. */}
      <p className="mt-6 hidden text-pretty text-lg leading-relaxed text-ivory/70 sm:block">{hero.body}</p>
      <div className="mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row">
        <ButtonLink href={routes.portfolio} size="lg" arrow className="max-sm:min-h-12">
          {hero.primary}
        </ButtonLink>
        <ButtonLink href={routes.inquiry} size="lg" variant="outline-light" className="max-sm:min-h-12">
          {hero.secondary}
        </ButtonLink>
      </div>
    </HeroShell>
  );
}
