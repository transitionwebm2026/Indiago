'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { PageHero } from '@/components/ui/PageHero';
import { heroSlides } from '@/lib/data/heroes';

export function PortfolioHero() {
  const { t } = useLanguage();
  const hero = t.portfolio.hero;
  return (
    <PageHero
      eyebrow={hero.eyebrow}
      title={hero.title}
      body={hero.body}
      slides={heroSlides.portfolio}
      crumbs={[{ label: t.nav.portfolio }]}
    />
  );
}
