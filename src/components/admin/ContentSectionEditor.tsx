'use client';

import { Check, ChevronDown, Minus, Plus, RotateCcw, Type } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { deleteContentSection, friendlyError, saveContentSection } from '@/lib/cms/admin';
import { blankLike, deepEqual, deepMerge, diff, getPath, isPlainObject, type PlainObject } from '@/lib/cms/merge';
import { defaultMedia, type MediaFieldDef, type SectionDef } from '@/lib/cms/sections';
import type { ContentRow } from '@/lib/cms/types';
import type { HeroSlide } from '@/lib/data/heroes';
import { ar } from '@/lib/i18n/ar';
import { en } from '@/lib/i18n/en';
import type { Localized } from '@/lib/i18n/types';
import { cn } from '@/lib/utils';
import { BilingualInput, BilingualList, ListControls } from './fields';
import { GalleryField, ImageField, SlidesField } from './MediaField';
import { AdminButton, Badge, Field, Select, TextInput, Toggle, moveItem, useConfirm } from './ui';

type Path = (string | number)[];

interface SectionValue {
  en: unknown;
  ar: unknown;
  media: PlainObject;
}

/* ----------------------------------------------------------------------------- Labels */

const FIELD_LABELS: Record<string, string> = {
  eyebrow: 'Small label above the heading',
  title: 'Title',
  body: 'Text',
  cta: 'Button text',
  primary: 'Main button',
  secondary: 'Second button',
  items: 'Items',
  paragraphs: 'Paragraphs',
  points: 'Bullet points',
  features: 'What’s included',
  highlights: 'Highlights',
  facts: 'Key facts',
  values: 'Values',
  label: 'Label',
  value: 'Value',
  suffix: 'After the number (e.g. + or %)',
  bio: 'Biography paragraphs',
  tagline: 'Tagline',
  stepLabel: 'Word before the step number',
  itemsLabel: 'Word after the item count',
  options: 'Answer options',
  errors: 'Error messages',
  fields: 'Field labels',
  steps: 'Step names',
  stepIntros: 'Step questions',
  message: 'WhatsApp message',
  rows: 'Comparison rows',
};

const humanize = (key: string) => {
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  const placeholder = key.endsWith('Ph');
  const words = (placeholder ? key.slice(0, -2) : key)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .toLowerCase();
  const label = words.charAt(0).toUpperCase() + words.slice(1);
  return placeholder ? `${label} (example text inside the box)` : label;
};

function hintFor(sample: string): ReactNode {
  const hints: string[] = [];
  if (/\*[^*]+\*/.test(sample)) hints.push('Wrap words in *asterisks* to show them as Champagne highlights.');
  if (/\{[a-z]+\}/i.test(sample)) hints.push('Keep the words in {curly brackets} — they are filled in automatically.');
  return hints.length ? hints.join(' ') : undefined;
}

/** A short label for a list item, taken from its first text field. */
function itemPreview(item: unknown): string {
  if (typeof item === 'string') return item;
  if (isPlainObject(item)) {
    for (const key of ['title', 'name', 'label', 'value']) if (typeof item[key] === 'string' && item[key]) return item[key] as string;
    const first = Object.values(item).find((value) => typeof value === 'string' && value);
    if (typeof first === 'string') return first;
  }
  return '';
}

/* ----------------------------------------------------------------------------- Immutable path helpers */

function getIn(source: unknown, path: Path): unknown {
  return path.reduce<unknown>((node, key) => {
    if (Array.isArray(node) && typeof key === 'number') return node[key];
    if (isPlainObject(node) && typeof key === 'string') return node[key];
    return undefined;
  }, source);
}

function setIn(source: unknown, path: Path, value: unknown): unknown {
  if (path.length === 0) return value;
  const [key, ...rest] = path;
  if (typeof key === 'number') {
    const list = Array.isArray(source) ? [...source] : [];
    list[key] = setIn(list[key], rest, value);
    return list;
  }
  const node = isPlainObject(source) ? source : {};
  return { ...node, [key]: setIn(node[key], rest, value) };
}

/** English and Arabic arrays always keep the same length, so items stay paired. */
function alignArrays(enValue: unknown, arValue: unknown, template: unknown): unknown {
  if (Array.isArray(enValue)) {
    const arList = Array.isArray(arValue) ? arValue : [];
    return enValue.map((item, index) => alignArrays(item, arList[index] ?? blankLike(item), Array.isArray(template) ? template[0] : template));
  }
  if (isPlainObject(enValue)) {
    const arNode = isPlainObject(arValue) ? arValue : {};
    return Object.fromEntries(Object.keys(enValue).map((key) => [key, alignArrays(enValue[key], arNode[key], undefined)]));
  }
  return arValue === undefined || typeof arValue !== typeof enValue ? enValue : arValue;
}

/* ----------------------------------------------------------------------------- Node editor */

interface NodeProps {
  path: Path;
  template: unknown;
  value: SectionValue;
  set: (path: Path, change: { en?: unknown; ar?: unknown }) => void;
  label: string;
  exclude?: string[];
  depth: number;
}

function NodeEditor({ path, template, value, set, label, exclude, depth }: NodeProps) {
  const enValue = getIn(value.en, path);
  const arValue = getIn(value.ar, path);

  if (typeof template === 'string') {
    const sample = typeof enValue === 'string' ? enValue : template;
    const long = template.length > 70 || sample.length > 70;
    return (
      <BilingualInput
        label={label}
        hint={hintFor(template)}
        multiline={long}
        rows={Math.min(8, Math.max(3, Math.ceil(template.length / 90)))}
        value={{ en: String(enValue ?? ''), ar: String(arValue ?? '') }}
        onChange={(next) => set(path, { en: next.en, ar: next.ar })}
      />
    );
  }

  if (typeof template === 'number') {
    return (
      <Field label={label}>
        <TextInput
          type="number"
          inputMode="decimal"
          value={Number(enValue ?? 0)}
          onChange={(event) => set(path, { en: Number(event.target.value), ar: Number(event.target.value) })}
          className="max-w-[12rem]"
        />
      </Field>
    );
  }

  if (typeof template === 'boolean') {
    return <Toggle label={label} checked={Boolean(enValue)} onChange={(checked) => set(path, { en: checked, ar: checked })} />;
  }

  if (Array.isArray(template)) {
    const enList = Array.isArray(enValue) ? enValue : [];
    const arList = Array.isArray(arValue) ? arValue : [];
    const itemTemplate = template[0] ?? enList[0];

    if (template.some((cell) => typeof cell === 'boolean')) {
      return <MixedCells label={label} enList={enList} arList={arList} onChange={(nextEn, nextAr) => set(path, { en: nextEn, ar: nextAr })} />;
    }

    if (typeof itemTemplate === 'string' || itemTemplate === undefined) {
      const items: Localized[] = enList.map((item, index) => ({ en: String(item ?? ''), ar: String(arList[index] ?? '') }));
      return (
        <BilingualList
          label={label}
          items={items}
          multiline={template.some((item) => typeof item === 'string' && item.length > 90)}
          noun={label.toLowerCase().replace(/s$/, '')}
          onChange={(next) => set(path, { en: next.map((item) => item.en), ar: next.map((item) => item.ar) })}
        />
      );
    }

    return (
      <RepeatableGroup
        label={label}
        path={path}
        template={itemTemplate}
        enList={enList}
        arList={arList}
        value={value}
        set={set}
      />
    );
  }

  if (isPlainObject(template)) {
    const keys = Object.keys(template).filter((key) => !exclude?.includes(key));
    const fields = keys.map((key) => (
      <NodeEditor key={key} path={[...path, key]} template={template[key]} value={value} set={set} label={humanize(key)} depth={depth + 1} />
    ));
    if (depth === 0) return <div className="space-y-6">{fields}</div>;
    return (
      <fieldset className="space-y-5 rounded-2xl border border-indigo/10 bg-linen/30 p-4">
        <legend className="px-1 text-sm font-semibold text-indigo">{label}</legend>
        {fields}
      </fieldset>
    );
  }

  return null;
}

interface RepeatableGroupProps {
  label: string;
  path: Path;
  template: unknown;
  enList: unknown[];
  arList: unknown[];
  value: SectionValue;
  set: NodeProps['set'];
}

/** A list of structured items (cards, steps, packages…) that can be added, removed and reordered. */
function RepeatableGroup({ label, path, template, enList, arList, value, set }: RepeatableGroupProps) {
  const [open, setOpen] = useState<number | null>(null);
  const noun = label.toLowerCase().replace(/s$/, '') || 'item';

  const replace = (nextEn: unknown[], nextAr: unknown[]) => set(path, { en: nextEn, ar: nextAr });

  return (
    <Field label={label}>
      <div className="space-y-2">
        {enList.map((item, index) => {
          const expanded = open === index;
          return (
            <div key={index} className="rounded-2xl border border-indigo/10 bg-white">
              <div className="flex items-center gap-2 px-3 py-2">
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : index)}
                  aria-expanded={expanded}
                  className="flex min-w-0 flex-1 items-center gap-3 text-start"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-linen font-serif text-sm text-champagne-700">{index + 1}</span>
                  <span className="truncate text-sm font-medium text-indigo">{itemPreview(item) || `New ${noun}`}</span>
                  <ChevronDown aria-hidden className={cn('ms-auto h-4 w-4 shrink-0 text-charcoal-muted transition-transform', expanded && 'rotate-180')} />
                </button>
                <ListControls
                  index={index}
                  count={enList.length}
                  noun={noun}
                  onMove={(to) => {
                    replace(moveItem(enList, index, to), moveItem(arList, index, to));
                    setOpen(to);
                  }}
                  onRemove={() => {
                    replace(
                      enList.filter((_, i) => i !== index),
                      arList.filter((_, i) => i !== index),
                    );
                    setOpen(null);
                  }}
                />
              </div>
              {expanded && (
                <div className="border-t border-indigo/5 px-4 py-4">
                  <NodeEditor path={[...path, index]} template={template} value={value} set={set} label="" depth={0} />
                </div>
              )}
            </div>
          );
        })}
        <AdminButton
          variant="secondary"
          size="sm"
          icon={Plus}
          onClick={() => {
            replace([...enList, blankLike(template)], [...arList, blankLike(template)]);
            setOpen(enList.length);
          }}
        >
          Add {noun}
        </AdminButton>
      </div>
    </Field>
  );
}

/** Comparison-table cells: included, not included, or a short text in both languages. */
function MixedCells({ label, enList, arList, onChange }: { label: string; enList: unknown[]; arList: unknown[]; onChange: (en: unknown[], ar: unknown[]) => void }) {
  const setCell = (index: number, nextEn: unknown, nextAr: unknown) =>
    onChange(
      enList.map((cell, i) => (i === index ? nextEn : cell)),
      enList.map((cell, i) => (i === index ? nextAr : arList[i] ?? cell)),
    );

  return (
    <Field label={label} hint="One cell per package, in order.">
      <div className="grid gap-2 md:grid-cols-3">
        {enList.map((cell, index) => {
          const mode = cell === true ? 'yes' : cell === false ? 'no' : 'text';
          return (
            <div key={index} className="space-y-2 rounded-xl bg-linen/60 p-2.5">
              <p className="text-xs font-medium text-charcoal-soft">Package {index + 1}</p>
              <Select
                value={mode}
                aria-label={`Package ${index + 1}`}
                onChange={(event) => {
                  const next = event.target.value;
                  if (next === 'yes') setCell(index, true, true);
                  else if (next === 'no') setCell(index, false, false);
                  else setCell(index, '', '');
                }}
              >
                <option value="yes">✓ Included</option>
                <option value="no">— Not included</option>
                <option value="text">Custom text</option>
              </Select>
              {mode === 'text' && (
                <div className="grid gap-1.5">
                  <TextInput aria-label="English" placeholder="English" value={String(cell)} onChange={(event) => setCell(index, event.target.value, arList[index] ?? '')} />
                  <TextInput
                    aria-label="Arabic"
                    placeholder="العربية"
                    dir="rtl"
                    lang="ar"
                    value={typeof arList[index] === 'string' ? String(arList[index]) : ''}
                    onChange={(event) => setCell(index, cell, event.target.value)}
                  />
                </div>
              )}
              <p className="flex items-center gap-1 text-[0.7rem] text-charcoal-muted">
                {mode === 'yes' ? <Check className="h-3 w-3" /> : mode === 'no' ? <Minus className="h-3 w-3" /> : <Type className="h-3 w-3" />}
                {mode === 'yes' ? 'Shows a tick' : mode === 'no' ? 'Shows a dash' : 'Shows the text'}
              </p>
            </div>
          );
        })}
      </div>
    </Field>
  );
}

/* ----------------------------------------------------------------------------- Media */

function MediaEditor({ fields, media, onChange, projects }: { fields: MediaFieldDef[]; media: PlainObject; onChange: (media: PlainObject) => void; projects: { slug: string; title: string }[] }) {
  return (
    <div className="space-y-6">
      {fields.map((field) => {
        const current = media[field.key];
        const update = (next: unknown) => onChange({ ...media, [field.key]: next });
        if (field.type === 'slides') {
          return <SlidesField key={field.key} label={field.label} hint={field.hint} value={(current as HeroSlide[]) ?? []} onChange={update} projects={projects} />;
        }
        if (field.type === 'images') {
          return <GalleryField key={field.key} label={field.label} hint={field.hint} folder="site" value={(current as string[]) ?? []} onChange={update} />;
        }
        return <ImageField key={field.key} label={field.label} hint={field.hint} folder="site" value={String(current ?? '')} onChange={update} />;
      })}
    </div>
  );
}

/* ----------------------------------------------------------------------------- Section card */

interface ContentSectionEditorProps {
  section: SectionDef;
  row: ContentRow | undefined;
  projects: { slug: string; title: string }[];
  open: boolean;
  onToggle: () => void;
  onSaved: () => void;
}

const withoutExcluded = (value: unknown, exclude: string[] | undefined) =>
  exclude?.length && isPlainObject(value) ? Object.fromEntries(Object.entries(value).filter(([key]) => !exclude.includes(key))) : value;

export function ContentSectionEditor({ section, row, projects, open, onToggle, onSaved }: ContentSectionEditorProps) {
  const defaults = useMemo<SectionValue>(
    () => ({
      en: withoutExcluded(getPath(en, section.key), section.exclude),
      ar: withoutExcluded(getPath(ar, section.key), section.exclude),
      media: (defaultMedia as Record<string, PlainObject>)[section.key] ?? {},
    }),
    [section],
  );

  const initial = useMemo<SectionValue>(() => {
    const enValue = deepMerge(defaults.en, row?.en);
    return {
      en: enValue,
      ar: alignArrays(enValue, deepMerge(defaults.ar, row?.ar), defaults.ar),
      media: deepMerge(defaults.media, row?.media),
    };
  }, [defaults, row]);

  const [value, setValue] = useState<SectionValue>(initial);
  const [saving, setSaving] = useState(false);
  const { confirm, dialog } = useConfirm();
  const dirty = !deepEqual(value, initial);

  const set = (path: Path, change: { en?: unknown; ar?: unknown }) =>
    setValue((current) => ({
      ...current,
      en: 'en' in change ? setIn(current.en, path, change.en) : current.en,
      ar: 'ar' in change ? setIn(current.ar, path, change.ar) : current.ar,
    }));

  const save = async () => {
    setSaving(true);
    try {
      const changes = {
        en: diff(defaults.en, value.en),
        ar: diff(defaults.ar, value.ar),
        media: diff(defaults.media, value.media),
      };
      if (changes.en === undefined && changes.ar === undefined && changes.media === undefined) {
        if (row) await deleteContentSection(section.key);
      } else {
        await saveContentSection({
          section: section.key,
          en: changes.en ?? {},
          ar: changes.ar ?? {},
          media: (changes.media as PlainObject | undefined) ?? {},
        });
      }
      toast.success(`“${section.label}” saved`, { description: 'The website updates for visitors straight away.' });
      onSaved();
    } catch (error) {
      toast.error('Couldn’t save', { description: friendlyError(error) });
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    const ok = await confirm({
      title: `Reset “${section.label}”?`,
      body: 'All text and images in this section go back to the original website content. This can’t be undone.',
      confirmLabel: 'Reset section',
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteContentSection(section.key);
      toast.success(`“${section.label}” reset to the original content`);
      onSaved();
    } catch (error) {
      toast.error('Couldn’t reset', { description: friendlyError(error) });
    }
  };

  return (
    <section className={cn('rounded-2xl border bg-white transition-shadow', open ? 'border-champagne shadow-lg shadow-indigo/5' : 'border-champagne/40')}>
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-start gap-4 px-5 py-4 text-start sm:px-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-lg tracking-wide text-indigo">{section.label}</h3>
            {row && <Badge tone="champagne">Customised</Badge>}
            {dirty && <Badge tone="warning">Unsaved</Badge>}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-charcoal-soft">{section.description}</p>
        </div>
        <ChevronDown aria-hidden className={cn('mt-1 h-5 w-5 shrink-0 text-charcoal-muted transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="border-t border-indigo/5 px-5 pb-5 pt-5 sm:px-6">
          {section.media && (
            <div className="mb-8">
              <MediaEditor fields={section.media} media={value.media} onChange={(media) => setValue((current) => ({ ...current, media }))} projects={projects} />
            </div>
          )}
          <NodeEditor path={[]} template={defaults.en} value={value} set={set} label={section.label} depth={0} />

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-indigo/5 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <AdminButton variant="ghost" size="sm" icon={RotateCcw} onClick={reset} disabled={!row || saving}>
              Reset to original
            </AdminButton>
            <div className="flex gap-2">
              <AdminButton variant="secondary" onClick={() => setValue(initial)} disabled={!dirty || saving}>
                Discard
              </AdminButton>
              <AdminButton onClick={save} loading={saving} disabled={!dirty}>
                Save section
              </AdminButton>
            </div>
          </div>
        </div>
      )}
      {dialog}
    </section>
  );
}
