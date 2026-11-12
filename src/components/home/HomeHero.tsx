'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
import { HeroShell } from '@/components/ui/HeroShell';
import { Highlight } from '@/components/ui/Highlight';
import { useMedia } from '@/lib/cms/hooks';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';

export function HomeHero() {
  const { t } = useLanguage();
  const { slides } = useMedia('home.hero');
  const hero = t.home.hero;

  return (
    <HeroShell slides={slides}>
      {(active, captions) => {
        // Each photograph brings its own caption (written in the dashboard) as the headline, and the
        // last one closes on the hero title. A photograph without a caption shows the title too.
        const titles = captions.length
          ? captions.map((caption, slideIndex) => (slideIndex === captions.length - 1 || !caption ? hero.title : caption))
          : [hero.title];

        return (
          <>
            {/* Headline and actions only, so the photography carries the hero. The shade behind the copy is
                light so the photographs stay bright; a soft glow under the headline keeps it legible on pale photos.
                On large screens the headline also scales with screen height, so the hero always fits one screen.
                Its width is set in em so it breaks into the same short lines, one under another, at every size.
                Every headline shares one grid cell, so the hero keeps the height of the longest and the buttons
                never move as the headlines change; each one sits at the bottom of that space, above the buttons. */}
            <h1 className="grid max-w-[10em] text-balance font-serif text-[2rem] leading-[1.08] tracking-wide text-ivory [text-shadow:0_1px_3px_rgba(23,18,44,0.4),0_2px_30px_rgba(23,18,44,0.6)] sm:text-[2.9rem] lg:text-[length:min(3.75rem,7svh)]">
              {titles.map((title, slideIndex) => {
                const current = slideIndex === active;
                return (
                  <span
                    key={slideIndex}
                    aria-hidden={!current}
                    // The old headline fades out first, then the new one rises in with its photograph.
                    className={cn(
                      'self-end transition-[opacity,transform] ease-out [grid-area:1/1]',
                      current ? 'opacity-100 delay-300 duration-700' : 'opacity-0 duration-300 motion-safe:translate-y-3',
                    )}
                  >
                    <Highlight text={title} surface="dark" />
                  </span>
                );
              })}
            </h1>
            <div className="mt-7 flex flex-col gap-2.5 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-3">
              <ButtonLink href={routes.portfolio} arrow className="max-sm:min-h-12">
                {hero.primary}
              </ButtonLink>
              <ButtonLink href={routes.inquiry} variant="outline-light" className="bg-indigo-950/35 backdrop-blur-md max-sm:min-h-12">
                {hero.secondary}
              </ButtonLink>
            </div>
          </>
        );
      }}
    </HeroShell>
  );
}
