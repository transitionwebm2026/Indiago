'use client';

import { ExternalLink } from 'lucide-react';
import { useMemo, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { adminKeys, fetchAdminProjects, fetchContentRows, friendlyError } from '@/lib/cms/admin';
import { cmsKeys } from '@/lib/cms/api';
import { contentPages, contentSections, type ContentPage } from '@/lib/cms/sections';
import { ar } from '@/lib/i18n/ar';
import { en } from '@/lib/i18n/en';
import { routes } from '@/lib/routes';
import { ContentSectionEditor } from '../ContentSectionEditor';
import { RequireInitialized } from '../ImportContent';
import { AdminLinkButton, PageHeader, Spinner, Tabs } from '../ui';

const pagePaths: Record<ContentPage, string> = {
  home: routes.home,
  about: routes.about,
  portfolio: routes.portfolio,
  services: routes.services,
  blog: routes.blog,
  contact: routes.contact,
  shared: routes.home,
};

export function ContentView() {
  const [page, setPage] = useState<ContentPage>('home');

  return (
    <>
      <PageHeader
        title="Pages Content"
        description="Every headline, paragraph, button and hero photo on the website, in English and Arabic. Open a section, edit, then press “Save section”."
        actions={
          <AdminLinkButton href={pagePaths[page]} external variant="secondary" size="sm" icon={ExternalLink}>
            View page
          </AdminLinkButton>
        }
      />
      <RequireInitialized>
        <div className="space-y-6">
          <Tabs
            label="Website pages"
            tabs={contentPages.map((item) => ({ value: item.id, label: item.label, count: contentSections.filter((section) => section.page === item.id).length }))}
            value={page}
            onChange={setPage}
          />
          <SectionList page={page} />
        </div>
      </RequireInitialized>
    </>
  );
}

function SectionList({ page }: { page: ContentPage }) {
  const { mutate } = useSWRConfig();
  const { data: rows, error } = useSWR(adminKeys.content, fetchContentRows);
  const { data: projectRows } = useSWR(adminKeys.projects, fetchAdminProjects);
  const [openKey, setOpenKey] = useState<string | null>(null);

  // Hero slides saved before captions were written by hand named a project and showed its sector.
  const legacyCaptions = useMemo(() => {
    const names = { en: en.categories as Record<string, string>, ar: ar.categories as Record<string, string> };
    return Object.fromEntries(
      (projectRows ?? []).filter((row) => row.category in names.en).map((row) => [row.slug, { en: names.en[row.category], ar: names.ar[row.category] }]),
    );
  }, [projectRows]);
  const sections = contentSections.filter((section) => section.page === page);

  if (error) return <p className="rounded-2xl bg-error/10 p-4 text-sm text-error">{friendlyError(error)}</p>;
  if (!rows) {
    return (
      <div className="grid h-48 place-items-center">
        <Spinner />
      </div>
    );
  }

  const refresh = () => {
    void mutate(adminKeys.content);
    void mutate(cmsKeys.content);
  };

  return (
    <div className="space-y-3">
      {sections.map((section) => {
        const row = rows.find((item) => item.section === section.key);
        return (
          <ContentSectionEditor
            // Remount after each save or reset so the form starts from what's now stored.
            key={`${section.key}-${row?.updated_at ?? 'default'}`}
            section={section}
            row={row}
            legacyCaptions={legacyCaptions}
            open={openKey === section.key}
            onToggle={() => setOpenKey((current) => (current === section.key ? null : section.key))}
            onSaved={refresh}
          />
        );
      })}
    </div>
  );
}
