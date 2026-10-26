'use client';

import { ExternalLink } from 'lucide-react';
import { useMemo, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { adminKeys, fetchAdminProjects, fetchContentRows, friendlyError } from '@/lib/cms/admin';
import { cmsKeys } from '@/lib/cms/api';
import { contentPages, contentSections, type ContentPage } from '@/lib/cms/sections';
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

  const projects = useMemo(() => (projectRows ?? []).map((row) => ({ slug: row.slug, title: row.title_en })), [projectRows]);
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
            projects={projects}
            open={openKey === section.key}
            onToggle={() => setOpenKey((current) => (current === section.key ? null : section.key))}
            onSaved={refresh}
          />
        );
      })}
    </div>
  );
}
