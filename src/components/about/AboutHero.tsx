'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { PageHero } from '@/components/ui/PageHero';
import { heroSlides } from '@/lib/data/heroes';

export function AboutHero() {
  const { t } = useLanguage();
  const hero = t.about.hero;
  return (
    <PageHero
      eyebrow={hero.eyebrow}
      title={hero.title}
      body={hero.body}
      slides={heroSlides.about}
      crumbs={[{ label: t.nav.about }]}
    />
  );
}
