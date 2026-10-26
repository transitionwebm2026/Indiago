'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { PageHero } from '@/components/ui/PageHero';
import { useMedia } from '@/lib/cms/hooks';

export function PortfolioHero() {
  const { t } = useLanguage();
  const { slides } = useMedia('portfolio.hero');
  const hero = t.portfolio.hero;
  return (
    <PageHero
      eyebrow={hero.eyebrow}
      title={hero.title}
      body={hero.body}
      slides={slides}
      crumbs={[{ label: t.nav.portfolio }]}
    />
  );
}
