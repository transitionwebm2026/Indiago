'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { RouteStatus, useDocumentTitle, useRouteSlug } from '@/components/shared/RouteStatus';
import { useProjectList } from '@/lib/cms/hooks';
import { getNextProject, getProject } from '@/lib/data/projects';
import { routes, SHELL_SLUG } from '@/lib/routes';
import { ProjectDetail } from './ProjectDetail';

/** A project page, live from the CMS — including projects added since the last build. */
export function ProjectRoute({ slug }: { slug: string }) {
  const { t, l } = useLanguage();
  const id = useRouteSlug(slug);
  const { projects, settled } = useProjectList();
  const project = id ? getProject(id, projects) : undefined;

  useDocumentTitle(slug === SHELL_SLUG && project ? `${l(project.title)} · ${t.brand}` : null);

  if (!project) {
    return (
      <RouteStatus
        state={settled && id ? 'missing' : 'loading'}
        eyebrow={t.nav.portfolio}
        loading={t.project.loading}
        title={t.project.missingTitle}
        body={t.project.missingBody}
        backHref={routes.portfolio}
        backLabel={t.project.back}
      />
    );
  }

  return <ProjectDetail key={project.id} project={project} next={getNextProject(project.id, projects)} />;
}
