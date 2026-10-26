'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { PageHero } from '@/components/ui/PageHero';
import { useMedia } from '@/lib/cms/hooks';

export function AboutHero() {
  const { t } = useLanguage();
  const { slides } = useMedia('about.hero');
  const hero = t.about.hero;
  return (
    <PageHero
      eyebrow={hero.eyebrow}
      title={hero.title}
      body={hero.body}
      slides={slides}
      crumbs={[{ label: t.nav.about }]}
    />
  );
}
