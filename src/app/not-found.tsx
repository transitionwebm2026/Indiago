'use client';

import { SiteChrome } from '@/components/layout/SiteChrome';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { routes } from '@/lib/routes';

export default function NotFound() {
  const { t } = useLanguage();
  const copy = t.notFound;

  return (
    <SiteChrome>
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} body={copy.body} className="pb-20 md:pb-28">
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={routes.home} size="lg" arrow>
            {copy.cta}
          </ButtonLink>
          <ButtonLink href={routes.portfolio} size="lg" variant="outline-dark">
            {copy.secondary}
          </ButtonLink>
        </div>
      </PageHeader>
    </SiteChrome>
  );
}
