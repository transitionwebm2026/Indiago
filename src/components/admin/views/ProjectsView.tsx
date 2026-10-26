'use client';

import Link from 'next/link';
import { ArrowDown, ArrowUp, ExternalLink, FolderKanban, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { toast } from 'sonner';
import { adminKeys, deleteProject, fetchAdminProjects, friendlyError, saveProjectOrder, updateProject } from '@/lib/cms/admin';
import { cmsKeys } from '@/lib/cms/api';
import type { ProjectRow } from '@/lib/cms/types';
import { en } from '@/lib/i18n/en';
import { projectHref } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { RequireInitialized } from '../ImportContent';
import { MediaPreview } from '../MediaField';
import { AdminLinkButton, Badge, Card, EmptyState, IconButton, PageHeader, Spinner, TextInput, Toggle, moveItem, useConfirm } from '../ui';

export function ProjectsView() {
  return (
    <>
      <PageHeader
        title="Portfolio"
        description="Projects appear on the Portfolio page in this order. Featured projects (★) are shown on the home page — up to three."
        actions={
          <AdminLinkButton href="/admin/projects/edit/" icon={Plus}>
            New project
          </AdminLinkButton>
        }
      />
      <RequireInitialized>
        <ProjectList />
      </RequireInitialized>
    </>
  );
}

function ProjectList() {
  const { mutate } = useSWRConfig();
  const { data: projects, error, mutate: mutateList } = useSWR(adminKeys.projects, fetchAdminProjects);
  const [query, setQuery] = useState('');
  const { confirm, dialog } = useConfirm();

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (projects ?? []).filter((project) => !term || `${project.title_en} ${project.title_ar} ${project.location_en}`.toLowerCase().includes(term));
  }, [projects, query]);

  const refreshPublic = () => void mutate(cmsKeys.projects);

  const patch = async (project: ProjectRow, fields: Partial<ProjectRow>, message: string) => {
    void mutateList((current) => current?.map((item) => (item.id === project.id ? { ...item, ...fields } : item)), { revalidate: false });
    try {
      await updateProject(project.id, fields);
      toast.success(message);
      refreshPublic();
    } catch (patchError) {
      toast.error('Couldn’t update the project', { description: friendlyError(patchError) });
    } finally {
      void mutateList();
    }
  };

  const move = async (index: number, to: number) => {
    if (!projects) return;
    const ordered = moveItem(projects, index, to);
    void mutateList(ordered, { revalidate: false });
    try {
      await saveProjectOrder(ordered);
      refreshPublic();
    } catch (moveError) {
      toast.error('Couldn’t change the order', { description: friendlyError(moveError) });
    } finally {
      void mutateList();
    }
  };

  const remove = async (project: ProjectRow) => {
    const ok = await confirm({
      title: `Delete “${project.title_en}”?`,
      body: 'The project page disappears from the website immediately. Its photos stay in the media library. This can’t be undone — hide it instead if you might want it back.',
      confirmLabel: 'Delete project',
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteProject(project.id);
      toast.success('Project deleted');
      void mutateList();
      refreshPublic();
    } catch (deleteError) {
      toast.error('Couldn’t delete the project', { description: friendlyError(deleteError) });
    }
  };

  if (error) return <p className="rounded-2xl bg-error/10 p-4 text-sm text-error">{friendlyError(error)}</p>;
  if (!projects) {
    return (
      <div className="grid h-48 place-items-center">
        <Spinner />
      </div>
    );
  }

  const featuredCount = projects.filter((project) => project.is_featured && project.is_published).length;
  const searching = query.trim().length > 0;

  return (
    <Card bodyClassName="p-0 sm:p-0">
      <div className="flex flex-col gap-3 border-b border-indigo/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="relative sm:w-72">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" />
          <TextInput placeholder="Search projects" value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" aria-label="Search projects" />
        </div>
        <p className="text-sm text-charcoal-soft">
          {projects.length} projects · {featuredCount} featured
        </p>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={searching ? 'No matching projects' : 'No projects yet'}
          body={searching ? 'Try another search.' : 'Add your first project to show it on the website.'}
          action={
            !searching && (
              <AdminLinkButton href="/admin/projects/edit/" icon={Plus}>
                New project
              </AdminLinkButton>
            )
          }
        />
      ) : (
        <ul className="divide-y divide-indigo/5">
          {visible.map((project) => {
            const index = projects.indexOf(project);
            return (
              <li key={project.id} className={cn('flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:px-6', !project.is_published && 'bg-linen/40')}>
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  {!searching && (
                    <div className="flex flex-col">
                      <IconButton icon={ArrowUp} label="Move up" disabled={index === 0} onClick={() => void move(index, index - 1)} className="h-7 w-7" />
                      <IconButton icon={ArrowDown} label="Move down" disabled={index === projects.length - 1} onClick={() => void move(index, index + 1)} className="h-7 w-7" />
                    </div>
                  )}
                  <Link href={`/admin/projects/edit/?id=${project.id}`} className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-linen">
                    {project.cover_image_url && <MediaPreview src={project.cover_image_url} alt="" />}
                  </Link>
                  <div className="min-w-0">
                    <Link href={`/admin/projects/edit/?id=${project.id}`} className="block truncate font-medium text-indigo hover:text-champagne-800">
                      {project.title_en || 'Untitled project'}
                    </Link>
                    <p className="mt-0.5 truncate text-xs text-charcoal-muted">
                      {en.categories[project.category as keyof typeof en.categories] ?? project.category} · {project.location_en || 'No location'}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {project.is_featured && (
                        <Badge tone="champagne">
                          <Star className="h-3 w-3 fill-current" /> Featured
                        </Badge>
                      )}
                      {!project.is_published && <Badge tone="warning">Hidden</Badge>}
                      {(project.before_after.length > 0 || project.render_real.length > 0) && <Badge>Comparisons</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:justify-end">
                  <Toggle
                    label="Featured"
                    checked={project.is_featured}
                    onChange={(is_featured) => void patch(project, { is_featured }, is_featured ? 'Added to the home page' : 'Removed from the home page')}
                  />
                  <Toggle
                    label="Visible"
                    checked={project.is_published}
                    onChange={(is_published) => void patch(project, { is_published }, is_published ? 'Project is now visible' : 'Project hidden from the website')}
                  />
                  <div className="flex">
                    <IconButton icon={ExternalLink} label="View on website" onClick={() => window.open(projectHref(project.slug), '_blank', 'noopener')} disabled={!project.is_published} />
                    <Link
                      href={`/admin/projects/edit/?id=${project.id}`}
                      aria-label="Edit project"
                      title="Edit project"
                      className="grid h-9 w-9 place-items-center rounded-lg text-charcoal-soft hover:bg-indigo/5 hover:text-indigo"
                    >
                      <Pencil aria-hidden className="h-4 w-4" strokeWidth={1.75} />
                    </Link>
                    <IconButton icon={Trash2} label="Delete project" tone="danger" onClick={() => void remove(project)} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {dialog}
    </Card>
  );
}
