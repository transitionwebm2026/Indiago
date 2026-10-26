'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { toast } from 'sonner';
import { ServiceIcon } from '@/components/services/ServiceIcon';
import {
  adminKeys,
  deleteProject,
  emptyProject,
  fetchAdminProject,
  fetchAdminProjects,
  fetchAdminServices,
  friendlyError,
  saveProject,
  type ProjectDraft,
} from '@/lib/cms/admin';
import { cmsKeys } from '@/lib/cms/api';
import { isValidSlug, slugify } from '@/lib/cms/ids';
import { deepEqual } from '@/lib/cms/merge';
import { projectCategories } from '@/lib/data/projects';
import { en } from '@/lib/i18n/en';
import { projectHref } from '@/lib/routes';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';
import { BilingualInput, BilingualList, ListControls, compactList } from '../fields';
import { RequireInitialized } from '../ImportContent';
import { GalleryField, ImageField, PairsField } from '../MediaField';
import { AdminButton, AdminLinkButton, Card, Field, PageHeader, SaveBar, Select, Spinner, TextInput, Toggle, moveItem, useConfirm, useUnsavedWarning } from '../ui';

export function ProjectEditorView() {
  const id = useSearchParams().get('id');
  return (
    <RequireInitialized>
      <ProjectEditorLoader key={id ?? 'new'} id={id} />
    </RequireInitialized>
  );
}

function ProjectEditorLoader({ id }: { id: string | null }) {
  const { data, error } = useSWR(id ? adminKeys.project(id) : null, () => fetchAdminProject(id!));

  if (!id) return <ProjectEditor initial={emptyProject()} />;
  if (error) return <p className="rounded-2xl bg-error/10 p-4 text-sm text-error">{friendlyError(error)}</p>;
  if (data === undefined) {
    return (
      <div className="grid h-64 place-items-center">
        <Spinner />
      </div>
    );
  }
  if (data === null) {
    return (
      <Card>
        <p className="text-sm text-charcoal-soft">This project no longer exists.</p>
        <AdminLinkButton href="/admin/projects/" variant="secondary" className="mt-4">
          Back to the portfolio
        </AdminLinkButton>
      </Card>
    );
  }
  return <ProjectEditor initial={data} />;
}

function ProjectEditor({ initial }: { initial: ProjectDraft }) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { data: services } = useSWR(adminKeys.services, fetchAdminServices);
  const { data: projects } = useSWR(adminKeys.projects, fetchAdminProjects);
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const { confirm, dialog } = useConfirm();
  const isNew = !draft.id;
  const dirty = !deepEqual(draft, saved);
  useUnsavedWarning(dirty);

  const set = (change: Partial<ProjectDraft>) => setDraft((current) => ({ ...current, ...change }));

  // New projects take their web address from the English title until it's edited by hand.
  useEffect(() => {
    if (!slugTouched) setDraft((current) => ({ ...current, slug: slugify(current.title_en) }));
  }, [draft.title_en, slugTouched]);

  const validate = () => {
    const found: Record<string, string> = {};
    if (!draft.title_en.trim()) found.title = 'Please enter the project title in English.';
    if (!isValidSlug(draft.slug)) found.slug = 'Use lowercase letters, numbers and dashes only, e.g. sun-capital-residence.';
    if (draft.is_published && !draft.cover_image_url) found.cover = 'Add a cover photo before making the project visible.';
    setErrors(found);
    if (Object.keys(found).length) {
      toast.error('Please check the form', { description: Object.values(found)[0] });
      return false;
    }
    return true;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    const incomplete = [...draft.before_after.filter((pair) => !pair.before || !pair.after), ...draft.render_real.filter((pair) => !pair.render || !pair.real)];
    const clean: ProjectDraft = {
      ...draft,
      title_en: draft.title_en.trim(),
      title_ar: draft.title_ar.trim(),
      story: compactList(draft.story),
      highlights: compactList(draft.highlights),
      materials: draft.materials.filter((item) => item.name.en.trim() || item.name.ar.trim()),
      before_after: draft.before_after.filter((pair) => pair.before && pair.after),
      render_real: draft.render_real.filter((pair) => pair.render && pair.real),
      // New projects go to the top of the portfolio.
      sort_order: isNew ? Math.min(0, ...(projects ?? []).map((project) => project.sort_order)) - 1 : draft.sort_order,
    };
    try {
      const row = await saveProject(clean);
      setSaved(row);
      setDraft(row);
      setSlugTouched(true);
      toast.success(isNew ? 'Project created' : 'Project saved', {
        description: row.is_published ? 'It’s live on the website now.' : 'It’s hidden from the website until you switch on “Visible”.',
      });
      if (incomplete.length) toast.warning(`${incomplete.length} comparison pair(s) without both photos were left out.`);
      void mutate(adminKeys.projects);
      void mutate(adminKeys.project(row.id), row, { revalidate: false });
      void mutate(cmsKeys.projects);
      if (isNew) router.replace(`/admin/projects/edit/?id=${row.id}`);
    } catch (error) {
      toast.error('Couldn’t save the project', { description: friendlyError(error) });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!draft.id) return;
    const ok = await confirm({
      title: `Delete “${draft.title_en}”?`,
      body: 'The project disappears from the website immediately. This can’t be undone.',
      confirmLabel: 'Delete project',
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteProject(draft.id);
      setSaved(draft);
      toast.success('Project deleted');
      void mutate(adminKeys.projects);
      void mutate(cmsKeys.projects);
      router.push('/admin/projects/');
    } catch (error) {
      toast.error('Couldn’t delete the project', { description: friendlyError(error) });
    }
  };

  const serviceOptions = useMemo(() => services ?? [], [services]);

  return (
    <>
      <Link href="/admin/projects/" className="mb-4 inline-flex items-center gap-1.5 text-sm text-charcoal-soft hover:text-indigo">
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>
      <PageHeader
        title={isNew ? 'New project' : saved.title_en || 'Edit project'}
        description={isNew ? 'Fill in the details, add photos, then save. Everything can be changed later.' : undefined}
        actions={
          !isNew && (
            <>
              {saved.is_published && (
                <AdminLinkButton href={projectHref(saved.slug)} external variant="secondary" size="sm" icon={ExternalLink}>
                  View on website
                </AdminLinkButton>
              )}
              <AdminButton variant="danger" size="sm" icon={Trash2} onClick={remove}>
                Delete
              </AdminButton>
            </>
          )
        }
      />

      <div className="space-y-6">
        <Card title="Basics">
          <div className="space-y-6">
            <BilingualInput label="Project title" required value={{ en: draft.title_en, ar: draft.title_ar }} onChange={(value) => set({ title_en: value.en, title_ar: value.ar })} error={errors.title} />
            <Field
              label="Web address"
              htmlFor="slug"
              error={errors.slug}
              hint={
                <>
                  {site.url.replace(/^https?:\/\//, '')}/portfolio/<strong className="text-indigo">{draft.slug || '…'}</strong>/
                  {!isNew && ' — changing it breaks links people may already have shared.'}
                </>
              }
            >
              <TextInput
                id="slug"
                dir="ltr"
                value={draft.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  set({ slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') });
                }}
                onBlur={() => set({ slug: slugify(draft.slug) })}
              />
            </Field>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Sector" htmlFor="category">
                <Select id="category" value={draft.category} onChange={(event) => set({ category: event.target.value })}>
                  {projectCategories.map((category) => (
                    <option key={category} value={category}>
                      {en.categories[category]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Completion date" htmlFor="completed" optional hint="Shown as month and year.">
                <TextInput id="completed" type="date" value={draft.completed_on ?? ''} onChange={(event) => set({ completed_on: event.target.value || null })} />
              </Field>
            </div>
            <BilingualInput label="Location" value={{ en: draft.location_en, ar: draft.location_ar }} onChange={(value) => set({ location_en: value.en, location_ar: value.ar })} placeholder={{ en: 'Abu Dhabi, UAE', ar: 'أبوظبي، الإمارات' }} />
            <BilingualInput
              label="Scope"
              optional
              hint="A short line such as “Design & turnkey fit-out · 420 sqm”."
              value={{ en: draft.scope_en, ar: draft.scope_ar }}
              onChange={(value) => set({ scope_en: value.en, scope_ar: value.ar })}
            />
            <div className="grid gap-4 rounded-2xl bg-linen/60 p-4 md:grid-cols-2">
              <Toggle label="Visible on the website" description="Switch off to hide the project without deleting it." checked={draft.is_published} onChange={(is_published) => set({ is_published })} />
              <Toggle label="Featured on the home page" description="The first three featured projects appear on the home page." checked={draft.is_featured} onChange={(is_featured) => set({ is_featured })} />
            </div>
          </div>
        </Card>

        <Card title="Story" description="The summary appears under the title; the design story is the long text on the project page.">
          <div className="space-y-6">
            <BilingualInput label="Summary" multiline rows={3} value={{ en: draft.summary_en, ar: draft.summary_ar }} onChange={(value) => set({ summary_en: value.en, summary_ar: value.ar })} />
            <BilingualList label="Design story" hint="One box per paragraph. The first paragraph is shown larger." items={draft.story} onChange={(story) => set({ story })} multiline addLabel="Add paragraph" noun="paragraph" />
            <BilingualList label="Highlights" hint="Short tags such as “Bespoke Joinery”." items={draft.highlights} onChange={(highlights) => set({ highlights })} addLabel="Add highlight" noun="highlight" />
          </div>
        </Card>

        <Card title="Materials & details" description="The numbered list beside the design story.">
          <div className="space-y-3">
            {draft.materials.map((material, index) => (
              <div key={index} className="rounded-2xl border border-indigo/10 bg-linen/40 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-indigo">Material {index + 1}</span>
                  <ListControls
                    index={index}
                    count={draft.materials.length}
                    noun="material"
                    onMove={(to) => set({ materials: moveItem(draft.materials, index, to) })}
                    onRemove={() => set({ materials: draft.materials.filter((_, i) => i !== index) })}
                  />
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <BilingualInput
                    label="Material"
                    value={material.name}
                    onChange={(name) => set({ materials: draft.materials.map((item, i) => (i === index ? { ...item, name } : item)) })}
                  />
                  <BilingualInput
                    label="Where / why"
                    value={material.detail}
                    onChange={(detail) => set({ materials: draft.materials.map((item, i) => (i === index ? { ...item, detail } : item)) })}
                  />
                </div>
              </div>
            ))}
            <AdminButton
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={() => set({ materials: [...draft.materials, { name: { en: '', ar: '' }, detail: { en: '', ar: '' } }] })}
            >
              Add material
            </AdminButton>
          </div>
        </Card>

        <Card title="Services delivered" description="Linked chips on the project page.">
          {serviceOptions.length === 0 ? (
            <p className="text-sm text-charcoal-muted">No services yet — add them in Services & Process.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {serviceOptions.map((service) => {
                const checked = draft.services.includes(service.slug);
                return (
                  <button
                    key={service.id}
                    type="button"
                    aria-pressed={checked}
                    onClick={() => set({ services: checked ? draft.services.filter((slug) => slug !== service.slug) : [...draft.services, service.slug] })}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors',
                      checked ? 'border-indigo bg-indigo text-ivory' : 'border-indigo/15 bg-white text-indigo hover:border-indigo/40',
                    )}
                  >
                    <ServiceIcon icon={service.icon} className="h-4 w-4" />
                    {service.title_en}
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        <Card title="Photos" description="Upload straight from your computer. Large photos are resized automatically for a fast website.">
          <div className="space-y-8">
            <div>
              <ImageField
                label="Cover photo"
                folder="projects"
                value={draft.cover_image_url}
                onChange={(cover_image_url) => set({ cover_image_url })}
                hint="Fills the top of the project page and its card — use a large landscape photo (at least 2000 px wide)."
              />
              {errors.cover && <p className="mt-1.5 text-xs font-medium text-error">{errors.cover}</p>}
            </div>
            <GalleryField label="Gallery" folder="projects" value={draft.gallery_urls} onChange={(gallery_urls) => set({ gallery_urls })} />
          </div>
        </Card>

        <Card title="Comparisons" description="Optional. Each pair is shown with a slider visitors can drag across.">
          <div className="space-y-8">
            <PairsField
              label="Before & after"
              value={draft.before_after}
              onChange={(before_after) => set({ before_after })}
              firstKey="before"
              secondKey="after"
              firstLabel="Before"
              secondLabel="After"
              noun="pair"
              create={() => ({ before: '', after: '', caption: { en: '', ar: '' } })}
            />
            <PairsField
              label="3D render vs real photo"
              value={draft.render_real}
              onChange={(render_real) => set({ render_real })}
              firstKey="render"
              secondKey="real"
              firstLabel="3D render"
              secondLabel="Real photo"
              noun="pair"
              create={() => ({ render: '', real: '', caption: { en: '', ar: '' } })}
            />
          </div>
        </Card>
      </div>

      <SaveBar dirty={dirty || isNew} saving={saving} onSave={save} onDiscard={isNew ? undefined : () => setDraft(saved)} saveLabel={isNew ? 'Create project' : 'Save project'} />
      {dialog}
    </>
  );
}
