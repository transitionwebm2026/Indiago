'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { PageHero } from '@/components/ui/PageHero';
import { heroSlides } from '@/lib/data/heroes';

export function BlogHero() {
  const { t } = useLanguage();
  const hero = t.blog.hero;
  return (
    <PageHero
      eyebrow={hero.eyebrow}
      title={hero.title}
      body={hero.body}
      slides={heroSlides.journal}
      crumbs={[{ label: t.nav.journal }]}
    />
  );
}
