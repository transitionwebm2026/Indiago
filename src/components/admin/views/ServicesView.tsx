'use client';

import { ArrowDown, ArrowUp, ChevronDown, Home, Plus, Trash2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { toast } from 'sonner';
import { ServiceIcon, serviceIcons } from '@/components/services/ServiceIcon';
import {
  adminKeys,
  deleteService,
  deleteStep,
  emptyService,
  emptyStep,
  fetchAdminServices,
  fetchAdminSteps,
  friendlyError,
  renameServiceInProjects,
  saveService,
  saveServiceOrder,
  saveStep,
  saveStepOrder,
  type ServiceDraft,
  type StepDraft,
} from '@/lib/cms/admin';
import { cmsKeys } from '@/lib/cms/api';
import { isValidSlug, slugify } from '@/lib/cms/ids';
import { deepEqual } from '@/lib/cms/merge';
import type { ProcessStepRow, ServiceRow } from '@/lib/cms/types';
import { cn } from '@/lib/utils';
import { BilingualInput, BilingualList, compactList } from '../fields';
import { RequireInitialized } from '../ImportContent';
import { ImageField } from '../MediaField';
import { AdminButton, AdminLinkButton, Badge, Card, EmptyState, Field, IconButton, PageHeader, Spinner, TextInput, Toggle, moveItem, useConfirm } from '../ui';

export function ServicesView() {
  return (
    <>
      <PageHeader
        title="Services & Process"
        description="Service cards appear on the Services page, in the footer and in the project brief form. The process steps drive the workflow timeline and the deliverables list."
        actions={
          <AdminLinkButton href="/admin/content/" variant="secondary" size="sm">
            Edit headings & design packages
          </AdminLinkButton>
        }
      />
      <RequireInitialized>
        <div className="space-y-10">
          <ServiceList />
          <StepList />
        </div>
      </RequireInitialized>
    </>
  );
}

/* ----------------------------------------------------------------------------- Shared row frame */

interface ItemFrameProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  badges?: ReactNode;
  open: boolean;
  onToggle: () => void;
  index: number;
  count: number;
  saved: boolean;
  dirty: boolean;
  onMove: (to: number) => void;
  onDelete: () => void;
  children: ReactNode;
}

function ItemFrame({ title, subtitle, icon, badges, open, onToggle, index, count, saved, dirty, onMove, onDelete, children }: ItemFrameProps) {
  return (
    <div className={cn('rounded-2xl border bg-white', open ? 'border-champagne shadow-lg shadow-indigo/5' : 'border-champagne/40')}>
      <div className="flex items-center gap-2 px-3 py-3 sm:px-4">
        {saved && (
          <div className="flex flex-col">
            <IconButton icon={ArrowUp} label="Move up" disabled={index === 0} onClick={() => onMove(index - 1)} className="h-7 w-7" />
            <IconButton icon={ArrowDown} label="Move down" disabled={index === count - 1} onClick={() => onMove(index + 1)} className="h-7 w-7" />
          </div>
        )}
        <button type="button" onClick={onToggle} aria-expanded={open} className="flex min-w-0 flex-1 items-center gap-3 text-start">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo text-champagne">{icon}</span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="truncate font-medium text-indigo">{title}</span>
              {!saved && <Badge tone="warning">Not saved yet</Badge>}
              {saved && dirty && <Badge tone="warning">Unsaved</Badge>}
              {badges}
            </span>
            {subtitle && <span className="block truncate text-xs text-charcoal-muted">{subtitle}</span>}
          </span>
          <ChevronDown aria-hidden className={cn('h-5 w-5 shrink-0 text-charcoal-muted transition-transform', open && 'rotate-180')} />
        </button>
        <IconButton icon={Trash2} label="Delete" tone="danger" onClick={onDelete} />
      </div>
      {open && <div className="border-t border-indigo/5 px-4 pb-5 pt-5 sm:px-6">{children}</div>}
    </div>
  );
}

function SaveRow({ dirty, saving, onSave, onDiscard, isNew }: { dirty: boolean; saving: boolean; onSave: () => void; onDiscard: () => void; isNew: boolean }) {
  return (
    <div className="mt-6 flex justify-end gap-2 border-t border-indigo/5 pt-5">
      <AdminButton variant="secondary" onClick={onDiscard} disabled={(!dirty && !isNew) || saving}>
        {isNew ? 'Cancel' : 'Discard'}
      </AdminButton>
      <AdminButton onClick={onSave} loading={saving} disabled={!dirty && !isNew}>
        {isNew ? 'Create' : 'Save'}
      </AdminButton>
    </div>
  );
}

/* ----------------------------------------------------------------------------- Services */

function ServiceList() {
  const { mutate } = useSWRConfig();
  const { data: rows, error, mutate: mutateRows } = useSWR(adminKeys.services, fetchAdminServices);
  const [drafts, setDrafts] = useState<{ key: string; draft: ServiceDraft }[]>([]);
  const [openKey, setOpenKey] = useState<string | null>(null);

  const refresh = () => {
    void mutateRows();
    void mutate(cmsKeys.services);
    void mutate(cmsKeys.projects);
  };

  const move = async (index: number, to: number) => {
    if (!rows) return;
    const ordered = moveItem(rows, index, to);
    void mutateRows(ordered, { revalidate: false });
    try {
      await saveServiceOrder(ordered);
      void mutate(cmsKeys.services);
    } catch (moveError) {
      toast.error('Couldn’t change the order', { description: friendlyError(moveError) });
    } finally {
      void mutateRows();
    }
  };

  const add = () => {
    const key = `new-${Date.now()}`;
    const sortOrder = Math.max(-1, ...(rows ?? []).map((row) => row.sort_order)) + 1;
    setDrafts((current) => [...current, { key, draft: emptyService(sortOrder) }]);
    setOpenKey(key);
  };

  if (error) return <p className="rounded-2xl bg-error/10 p-4 text-sm text-error">{friendlyError(error)}</p>;

  return (
    <Card
      title="Services"
      description="Turn on “Home page” for the services shown in the home page’s services section."
      actions={
        <AdminButton size="sm" icon={Plus} onClick={add}>
          Add service
        </AdminButton>
      }
    >
      {!rows ? (
        <div className="grid h-32 place-items-center">
          <Spinner />
        </div>
      ) : rows.length === 0 && drafts.length === 0 ? (
        <EmptyState icon={Plus} title="No services yet" action={<AdminButton icon={Plus} onClick={add}>Add service</AdminButton>} />
      ) : (
        <div className="space-y-3">
          {rows.map((row, index) => (
            <ServiceItem
              key={`${row.id}-${row.updated_at}`}
              initial={row}
              index={index}
              count={rows.length}
              open={openKey === row.id}
              onToggle={() => setOpenKey((current) => (current === row.id ? null : row.id))}
              onMove={(to) => void move(index, to)}
              onSaved={refresh}
              onDeleted={refresh}
            />
          ))}
          {drafts.map(({ key, draft }) => (
            <ServiceItem
              key={key}
              initial={draft}
              index={0}
              count={1}
              open={openKey === key}
              onToggle={() => setOpenKey((current) => (current === key ? null : key))}
              onMove={() => undefined}
              onSaved={(saved) => {
                setDrafts((current) => current.filter((item) => item.key !== key));
                setOpenKey(saved.id);
                refresh();
              }}
              onDeleted={() => setDrafts((current) => current.filter((item) => item.key !== key))}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

interface ServiceItemProps {
  initial: ServiceDraft;
  index: number;
  count: number;
  open: boolean;
  onToggle: () => void;
  onMove: (to: number) => void;
  onSaved: (row: ServiceRow) => void;
  onDeleted: () => void;
}

function ServiceItem({ initial, index, count, open, onToggle, onMove, onSaved, onDeleted }: ServiceItemProps) {
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const { confirm, dialog } = useConfirm();
  const dirty = !deepEqual(draft, initial);
  const isNew = !initial.id;

  const set = (change: Partial<ServiceDraft>) =>
    setDraft((current) => {
      const next = { ...current, ...change };
      if (!slugTouched && change.title_en !== undefined) next.slug = slugify(change.title_en);
      return next;
    });

  const save = async () => {
    if (!draft.title_en.trim()) return void toast.error('Please enter the service title in English.');
    if (!isValidSlug(draft.slug)) return void toast.error('The page anchor can only use lowercase letters, numbers and dashes.');
    setSaving(true);
    try {
      const row = await saveService({ ...draft, deliverables: compactList(draft.deliverables) });
      if (initial.id && initial.slug !== row.slug) await renameServiceInProjects(initial.slug, row.slug);
      toast.success(isNew ? 'Service created' : 'Service saved', { description: 'The website updates for visitors straight away.' });
      onSaved(row);
    } catch (error) {
      toast.error('Couldn’t save the service', { description: friendlyError(error) });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!initial.id) return onDeleted();
    const ok = await confirm({
      title: `Delete “${initial.title_en}”?`,
      body: 'It disappears from the Services page, the footer and the brief form. Projects linked to it simply stop showing it.',
      confirmLabel: 'Delete service',
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteService(initial.id);
      toast.success('Service deleted');
      onDeleted();
    } catch (error) {
      toast.error('Couldn’t delete the service', { description: friendlyError(error) });
    }
  };

  return (
    <ItemFrame
      title={draft.title_en || 'New service'}
      subtitle={draft.summary_en}
      icon={<ServiceIcon icon={draft.icon} className="h-5 w-5" />}
      badges={
        <>
          {initial.show_on_home && (
            <Badge tone="champagne">
              <Home className="h-3 w-3" /> Home page
            </Badge>
          )}
          {!initial.is_visible && initial.id && <Badge>Hidden</Badge>}
        </>
      }
      open={open}
      onToggle={onToggle}
      index={index}
      count={count}
      saved={!isNew}
      dirty={dirty}
      onMove={onMove}
      onDelete={remove}
    >
      <div className="space-y-6">
        <BilingualInput label="Service title" required value={{ en: draft.title_en, ar: draft.title_ar }} onChange={(value) => set({ title_en: value.en, title_ar: value.ar })} />
        <BilingualInput label="Summary" multiline value={{ en: draft.summary_en, ar: draft.summary_ar }} onChange={(value) => set({ summary_en: value.en, summary_ar: value.ar })} />
        <BilingualList label="What’s included" hint="The ticked list on the service card." items={draft.deliverables} onChange={(deliverables) => set({ deliverables })} addLabel="Add item" noun="item" />

        <Field label="Icon">
          <div className="flex flex-wrap gap-2">
            {Object.entries(serviceIcons).map(([name, { icon: Icon, label }]) => (
              <button
                key={name}
                type="button"
                onClick={() => set({ icon: name })}
                aria-pressed={draft.icon === name}
                title={label}
                className={cn(
                  'grid h-11 w-11 place-items-center rounded-xl border transition-colors',
                  draft.icon === name ? 'border-indigo bg-indigo text-champagne' : 'border-indigo/10 bg-white text-indigo hover:border-indigo/40',
                )}
              >
                <Icon aria-hidden className="h-5 w-5" strokeWidth={1.4} />
                <span className="sr-only">{label}</span>
              </button>
            ))}
          </div>
        </Field>

        <ImageField label="Card photo" folder="services" value={draft.image_url} onChange={(image_url) => set({ image_url })} optional />

        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Page anchor" htmlFor={`slug-${initial.id ?? 'new'}`} hint={`Links to /services/#${draft.slug || '…'}. Projects linked to this service follow a change automatically.`}>
            <TextInput
              id={`slug-${initial.id ?? 'new'}`}
              dir="ltr"
              value={draft.slug}
              onChange={(event) => {
                setSlugTouched(true);
                set({ slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') });
              }}
              onBlur={() => set({ slug: slugify(draft.slug) })}
            />
          </Field>
          <div className="space-y-4 rounded-2xl bg-linen/60 p-4">
            <Toggle label="Show on the home page" checked={draft.show_on_home} onChange={(show_on_home) => set({ show_on_home })} />
            <Toggle label="Visible on the website" checked={draft.is_visible} onChange={(is_visible) => set({ is_visible })} />
          </div>
        </div>
      </div>
      <SaveRow dirty={dirty} saving={saving} onSave={save} onDiscard={() => (isNew ? onDeleted() : setDraft(initial))} isNew={isNew} />
      {dialog}
    </ItemFrame>
  );
}

/* ----------------------------------------------------------------------------- Process steps */

function StepList() {
  const { mutate } = useSWRConfig();
  const { data: rows, error, mutate: mutateRows } = useSWR(adminKeys.steps, fetchAdminSteps);
  const [drafts, setDrafts] = useState<{ key: string; draft: StepDraft }[]>([]);
  const [openKey, setOpenKey] = useState<string | null>(null);

  const refresh = () => {
    void mutateRows();
    void mutate(cmsKeys.steps);
  };

  const move = async (index: number, to: number) => {
    if (!rows) return;
    const ordered = moveItem(rows, index, to);
    void mutateRows(ordered, { revalidate: false });
    try {
      await saveStepOrder(ordered);
      void mutate(cmsKeys.steps);
    } catch (moveError) {
      toast.error('Couldn’t change the order', { description: friendlyError(moveError) });
    } finally {
      void mutateRows();
    }
  };

  const add = () => {
    const key = `new-${Date.now()}`;
    const sortOrder = Math.max(-1, ...(rows ?? []).map((row) => row.sort_order)) + 1;
    setDrafts((current) => [...current, { key, draft: emptyStep(sortOrder) }]);
    setOpenKey(key);
  };

  if (error) return <p className="rounded-2xl bg-error/10 p-4 text-sm text-error">{friendlyError(error)}</p>;

  return (
    <Card
      title="Execution process"
      description="Each step appears in the workflow timeline (Services page and home page) and in the deliverables accordion. Four to six steps fit best."
      actions={
        <AdminButton size="sm" icon={Plus} onClick={add}>
          Add step
        </AdminButton>
      }
    >
      {!rows ? (
        <div className="grid h-32 place-items-center">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row, index) => (
            <StepItem
              key={`${row.id}-${row.updated_at}`}
              initial={row}
              index={index}
              count={rows.length}
              open={openKey === row.id}
              onToggle={() => setOpenKey((current) => (current === row.id ? null : row.id))}
              onMove={(to) => void move(index, to)}
              onSaved={refresh}
              onDeleted={refresh}
            />
          ))}
          {drafts.map(({ key, draft }) => (
            <StepItem
              key={key}
              initial={draft}
              index={rows.length}
              count={rows.length + 1}
              open={openKey === key}
              onToggle={() => setOpenKey((current) => (current === key ? null : key))}
              onMove={() => undefined}
              onSaved={(saved) => {
                setDrafts((current) => current.filter((item) => item.key !== key));
                setOpenKey(saved.id);
                refresh();
              }}
              onDeleted={() => setDrafts((current) => current.filter((item) => item.key !== key))}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

interface StepItemProps {
  initial: StepDraft;
  index: number;
  count: number;
  open: boolean;
  onToggle: () => void;
  onMove: (to: number) => void;
  onSaved: (row: ProcessStepRow) => void;
  onDeleted: () => void;
}

function StepItem({ initial, index, count, open, onToggle, onMove, onSaved, onDeleted }: StepItemProps) {
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);
  const { confirm, dialog } = useConfirm();
  const dirty = !deepEqual(draft, initial);
  const isNew = !initial.id;
  const set = (change: Partial<StepDraft>) => setDraft((current) => ({ ...current, ...change }));

  const save = async () => {
    if (!draft.title_en.trim()) return void toast.error('Please enter the step title in English.');
    setSaving(true);
    try {
      const row = await saveStep({ ...draft, points: compactList(draft.points), deliverables: compactList(draft.deliverables) });
      toast.success(isNew ? 'Step created' : 'Step saved', { description: 'The website updates for visitors straight away.' });
      onSaved(row);
    } catch (error) {
      toast.error('Couldn’t save the step', { description: friendlyError(error) });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!initial.id) return onDeleted();
    const ok = await confirm({ title: `Delete “${initial.title_en}”?`, body: 'The step is removed from the timeline and the deliverables list.', confirmLabel: 'Delete step', danger: true });
    if (!ok) return;
    try {
      await deleteStep(initial.id);
      toast.success('Step deleted');
      onDeleted();
    } catch (error) {
      toast.error('Couldn’t delete the step', { description: friendlyError(error) });
    }
  };

  return (
    <ItemFrame
      title={draft.title_en || 'New step'}
      subtitle={draft.duration_en}
      icon={<span className="font-serif text-lg">{String(index + 1).padStart(2, '0')}</span>}
      open={open}
      onToggle={onToggle}
      index={index}
      count={count}
      saved={!isNew}
      dirty={dirty}
      onMove={onMove}
      onDelete={remove}
    >
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <BilingualInput label="Step title" required value={{ en: draft.title_en, ar: draft.title_ar }} onChange={(value) => set({ title_en: value.en, title_ar: value.ar })} />
          <BilingualInput label="Duration" value={{ en: draft.duration_en, ar: draft.duration_ar }} onChange={(value) => set({ duration_en: value.en, duration_ar: value.ar })} placeholder={{ en: '3–4 weeks', ar: '3–4 أسابيع' }} />
        </div>
        <BilingualInput label="Summary" multiline value={{ en: draft.summary_en, ar: draft.summary_ar }} onChange={(value) => set({ summary_en: value.en, summary_ar: value.ar })} />
        <BilingualList label="Checklist" hint="Shown beside the step in the timeline." items={draft.points} onChange={(points) => set({ points })} addLabel="Add point" noun="point" />
        <BilingualList label="Deliverables" hint="What the client receives at this stage — the deliverables accordion." items={draft.deliverables} onChange={(deliverables) => set({ deliverables })} addLabel="Add deliverable" noun="deliverable" />
      </div>
      <SaveRow dirty={dirty} saving={saving} onSave={save} onDiscard={() => (isNew ? onDeleted() : setDraft(initial))} isNew={isNew} />
      {dialog}
    </ItemFrame>
  );
}
