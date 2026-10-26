'use client';

import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import type { Localized } from '@/lib/i18n/types';
import { cn } from '@/lib/utils';
import { AdminButton, Field, IconButton, TextArea, TextInput, moveItem } from './ui';

const LANGS = [
  { key: 'en', label: 'English', dir: 'ltr' },
  { key: 'ar', label: 'العربية', dir: 'rtl' },
] as const;

interface BilingualInputProps {
  label: ReactNode;
  value: Localized;
  onChange: (value: Localized) => void;
  hint?: ReactNode;
  multiline?: boolean;
  rows?: number;
  placeholder?: Partial<Localized>;
  required?: boolean;
  error?: string;
  optional?: boolean;
}

/** The same text in English and Arabic, side by side (stacked on phones). */
export function BilingualInput({ label, value, onChange, hint, multiline, rows = 3, placeholder, required, error, optional }: BilingualInputProps) {
  const id = useId();
  return (
    <Field label={label} hint={hint} error={error} optional={optional}>
      <div className="grid gap-2 md:grid-cols-2">
        {LANGS.map((lang) => {
          const props = {
            id: `${id}-${lang.key}`,
            dir: lang.dir,
            lang: lang.key,
            value: value[lang.key],
            placeholder: placeholder?.[lang.key],
            required: required && lang.key === 'en',
            'aria-label': `${typeof label === 'string' ? label : ''} (${lang.label})`,
            'aria-invalid': error && lang.key === 'en' && !value.en ? true : undefined,
            onChange: (event: { target: { value: string } }) => onChange({ ...value, [lang.key]: event.target.value }),
          };
          return (
            <div key={lang.key} className="relative">
              <span
                className={cn(
                  'pointer-events-none absolute top-2 z-10 rounded-md bg-linen px-1.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wider text-charcoal-muted',
                  lang.dir === 'rtl' ? 'left-2' : 'right-2',
                )}
              >
                {lang.key}
              </span>
              {multiline ? (
                <TextArea rows={rows} {...props} className={lang.dir === 'rtl' ? 'pl-12' : 'pr-12'} />
              ) : (
                <TextInput {...props} className={lang.dir === 'rtl' ? 'pl-12' : 'pr-12'} />
              )}
            </div>
          );
        })}
      </div>
    </Field>
  );
}

interface ListControlsProps {
  index: number;
  count: number;
  onMove: (to: number) => void;
  /** Omit for rows that can be reordered but not deleted. */
  onRemove?: () => void;
  noun: string;
}

/** Move up / move down / remove for one row of a repeatable list. */
export function ListControls({ index, count, onMove, onRemove, noun }: ListControlsProps) {
  return (
    <div className="flex shrink-0 items-center">
      <IconButton icon={ArrowUp} label={`Move ${noun} up`} onClick={() => onMove(index - 1)} disabled={index === 0} />
      <IconButton icon={ArrowDown} label={`Move ${noun} down`} onClick={() => onMove(index + 1)} disabled={index === count - 1} />
      {onRemove && <IconButton icon={Trash2} label={`Remove ${noun}`} tone="danger" onClick={onRemove} />}
    </div>
  );
}

interface BilingualListProps {
  label: ReactNode;
  hint?: ReactNode;
  items: Localized[];
  onChange: (items: Localized[]) => void;
  addLabel?: string;
  noun?: string;
  multiline?: boolean;
}

/** A reorderable list of bilingual lines — bullet points, highlights, paragraphs. */
export function BilingualList({ label, hint, items, onChange, addLabel = 'Add item', noun = 'item', multiline }: BilingualListProps) {
  const update = (index: number, value: Localized) => onChange(items.map((item, i) => (i === index ? value : item)));

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2 rounded-xl bg-linen/60 p-2">
            <span className="mt-2.5 w-6 shrink-0 text-center font-serif text-sm text-champagne-700">{index + 1}</span>
            <div className="grid min-w-0 flex-1 gap-2 md:grid-cols-2">
              {LANGS.map((lang) =>
                multiline ? (
                  <TextArea
                    key={lang.key}
                    dir={lang.dir}
                    lang={lang.key}
                    rows={3}
                    aria-label={`${noun} ${index + 1} (${lang.label})`}
                    placeholder={lang.label}
                    value={item[lang.key]}
                    onChange={(event) => update(index, { ...item, [lang.key]: event.target.value })}
                  />
                ) : (
                  <TextInput
                    key={lang.key}
                    dir={lang.dir}
                    lang={lang.key}
                    aria-label={`${noun} ${index + 1} (${lang.label})`}
                    placeholder={lang.label}
                    value={item[lang.key]}
                    onChange={(event) => update(index, { ...item, [lang.key]: event.target.value })}
                  />
                ),
              )}
            </div>
            <ListControls
              index={index}
              count={items.length}
              noun={noun}
              onMove={(to) => onChange(moveItem(items, index, to))}
              onRemove={() => onChange(items.filter((_, i) => i !== index))}
            />
          </div>
        ))}
        <AdminButton variant="secondary" size="sm" icon={Plus} onClick={() => onChange([...items, { en: '', ar: '' }])}>
          {addLabel}
        </AdminButton>
      </div>
    </Field>
  );
}

/** Drops empty rows from bilingual lists before saving. */
export const compactList = (items: Localized[]) =>
  items.map((item) => ({ en: item.en.trim(), ar: item.ar.trim() })).filter((item) => item.en || item.ar);
