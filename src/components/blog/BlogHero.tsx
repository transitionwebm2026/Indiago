'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { PageHero } from '@/components/ui/PageHero';
import { useMedia } from '@/lib/cms/hooks';

export function BlogHero() {
  const { t } = useLanguage();
  const { slides } = useMedia('blog.hero');
  const hero = t.blog.hero;
  return (
    <PageHero
      eyebrow={hero.eyebrow}
      title={hero.title}
      body={hero.body}
      slides={slides}
      crumbs={[{ label: t.nav.journal }]}
    />
  );
}
