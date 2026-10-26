'use client';

import { ArrowLeft, ArrowRight, FileText, Film, ImagePlus, Images, Link2, Plus, RefreshCw, Search, Trash2, UploadCloud, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent, type ReactNode } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { friendlyError } from '@/lib/cms/admin';
import { deleteMedia, listMedia, mediaFolders, uploadMedia, type MediaFolder, type MediaItem } from '@/lib/cms/storage';
import type { HeroSlide } from '@/lib/data/heroes';
import type { Localized } from '@/lib/i18n/types';
import { img, isVideo } from '@/lib/images';
import { cn } from '@/lib/utils';
import { BilingualInput, ListControls } from './fields';
import { AdminButton, Field, IconButton, Modal, Select, Spinner, TextInput, moveItem, useConfirm } from './ui';

/* ----------------------------------------------------------------------------- Upload plumbing */

export type MediaKind = 'image' | 'media' | 'document';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml'];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const acceptedTypes: Record<MediaKind, string[]> = {
  image: IMAGE_TYPES,
  media: [...IMAGE_TYPES, ...VIDEO_TYPES],
  document: [...IMAGE_TYPES, 'application/pdf'],
};

const kindHint: Record<MediaKind, string> = {
  image: 'JPG, PNG, WebP or SVG',
  media: 'Photo (JPG, PNG, WebP) or video (MP4, WebM)',
  document: 'Image or PDF',
};

interface Upload {
  id: string;
  name: string;
  progress: number;
}

/** Uploads files to the media library, tracking progress per file and reporting each result as a toast. */
function useUploader(folder: MediaFolder, kind: MediaKind) {
  const [uploads, setUploads] = useState<Upload[]>([]);

  const upload = useCallback(
    async (files: File[]): Promise<string[]> => {
      const accepted = files.filter((file) => {
        if (acceptedTypes[kind].includes(file.type)) return true;
        toast.error(`“${file.name}” can’t be used here`, { description: `Please choose: ${kindHint[kind]}.` });
        return false;
      });

      const results = await Promise.all(
        accepted.map(async (file) => {
          const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
          setUploads((current) => [...current, { id, name: file.name, progress: 0 }]);
          try {
            const url = await uploadMedia(file, folder, {
              onProgress: (progress) => setUploads((current) => current.map((item) => (item.id === id ? { ...item, progress } : item))),
            });
            return url;
          } catch (error) {
            toast.error(`Couldn’t upload “${file.name}”`, { description: friendlyError(error) });
            return null;
          } finally {
            setUploads((current) => current.filter((item) => item.id !== id));
          }
        }),
      );

      const urls = results.filter((url): url is string => url !== null);
      if (urls.length) toast.success(urls.length === 1 ? 'File uploaded' : `${urls.length} files uploaded`);
      return urls;
    },
    [folder, kind],
  );

  return { uploads, upload, busy: uploads.length > 0 };
}

function useDropZone(onFiles: (files: File[]) => void) {
  const [over, setOver] = useState(false);
  return {
    over,
    props: {
      onDragOver: (event: DragEvent) => {
        event.preventDefault();
        setOver(true);
      },
      onDragLeave: () => setOver(false),
      onDrop: (event: DragEvent) => {
        event.preventDefault();
        setOver(false);
        if (event.dataTransfer.files.length) onFiles([...event.dataTransfer.files]);
      },
    },
  };
}

function ProgressBar({ upload }: { upload: Upload }) {
  return (
    <div className="w-full">
      <div className="flex justify-between gap-3 text-xs text-charcoal-soft">
        <span className="truncate">{upload.name}</span>
        <span className="tabular-nums">{Math.round(upload.progress * 100)}%</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-indigo/10">
        <div className="h-full rounded-full bg-champagne-700 transition-[width] duration-200" style={{ width: `${Math.max(4, upload.progress * 100)}%` }} />
      </div>
    </div>
  );
}

/** Thumbnail for any media value: an uploaded URL, a /public path or an Unsplash ID. */
export function MediaPreview({ src, className, alt = '' }: { src: string; className?: string; alt?: string }) {
  if (isVideo(src)) {
    return <video src={src} muted playsInline preload="metadata" className={cn('h-full w-full object-cover', className)} />;
  }
  if (/\.pdf(\?.*)?$/i.test(src)) {
    return (
      <span className={cn('grid h-full w-full place-items-center bg-linen text-champagne-700', className)}>
        <FileText aria-hidden className="h-8 w-8" strokeWidth={1.25} />
      </span>
    );
  }
  return <img src={img(src, 600, 70)} alt={alt} loading="lazy" className={cn('h-full w-full object-cover', className)} />;
}

const displayName = (src: string) => {
  const last = decodeURIComponent(src.split('?')[0].split('/').pop() ?? src);
  return last.replace(/^[a-z0-9]+-[a-f0-9]{8}-/, '');
};

/* ----------------------------------------------------------------------------- Single image */

interface ImageFieldProps {
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  folder: MediaFolder;
  hint?: ReactNode;
  kind?: MediaKind;
  aspect?: string;
  optional?: boolean;
  /** Smaller layout for use inside lists. */
  compact?: boolean;
}

export function ImageField({ label, value, onChange, folder, hint, kind = 'image', aspect = 'aspect-[16/10]', optional, compact }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [link, setLink] = useState('');
  const { uploads, upload, busy } = useUploader(folder, kind);

  const onFiles = async (files: File[]) => {
    const [url] = await upload(files.slice(0, 1));
    if (url) onChange(url);
  };
  const drop = useDropZone(onFiles);

  const picker = (
    <input
      ref={inputRef}
      type="file"
      accept={acceptedTypes[kind].join(',')}
      className="sr-only"
      tabIndex={-1}
      onChange={(event) => {
        if (event.target.files?.length) void onFiles([...event.target.files]);
        event.target.value = '';
      }}
    />
  );

  return (
    <Field label={label} hint={hint ?? `${kindHint[kind]}. Large photos are optimised automatically.`} optional={optional}>
      {picker}
      <div
        {...drop.props}
        className={cn(
          'relative overflow-hidden rounded-2xl border transition-colors',
          drop.over ? 'border-champagne-700 bg-champagne-100' : value ? 'border-indigo/10 bg-white' : 'border-dashed border-indigo/25 bg-linen/50',
        )}
      >
        {value ? (
          <div className={cn('flex gap-4 p-3', compact ? 'items-center' : 'flex-col sm:flex-row sm:items-center')}>
            <div className={cn('relative shrink-0 overflow-hidden rounded-xl bg-linen', compact ? 'h-20 w-28' : cn('w-full sm:w-56', aspect))}>
              <MediaPreview src={value} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-indigo" title={value}>
                {displayName(value)}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <AdminButton size="sm" variant="secondary" icon={RefreshCw} onClick={() => inputRef.current?.click()} disabled={busy}>
                  Replace
                </AdminButton>
                <AdminButton size="sm" variant="ghost" icon={Images} onClick={() => setLibraryOpen(true)}>
                  Library
                </AdminButton>
                <AdminButton size="sm" variant="ghost" icon={X} onClick={() => onChange('')} className="text-error hover:bg-error/10">
                  Remove
                </AdminButton>
              </div>
            </div>
          </div>
        ) : (
          <div className={cn('flex flex-col items-center gap-3 px-4 text-center', compact ? 'py-4' : 'py-8')}>
            <UploadCloud aria-hidden className="h-7 w-7 text-champagne-700" strokeWidth={1.5} />
            <p className="text-sm text-charcoal-soft">
              Drag &amp; drop a file here, or
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <AdminButton size="sm" icon={ImagePlus} onClick={() => inputRef.current?.click()} disabled={busy}>
                Upload from computer
              </AdminButton>
              <AdminButton size="sm" variant="secondary" icon={Images} onClick={() => setLibraryOpen(true)}>
                Choose from library
              </AdminButton>
            </div>
            <button type="button" onClick={() => setLinkOpen((open) => !open)} className="inline-flex items-center gap-1.5 text-xs text-charcoal-muted underline-offset-2 hover:text-indigo hover:underline">
              <Link2 aria-hidden className="h-3.5 w-3.5" /> or use a link
            </button>
            {linkOpen && (
              <form
                className="flex w-full max-w-md gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (link.trim()) onChange(link.trim());
                  setLink('');
                  setLinkOpen(false);
                }}
              >
                <TextInput type="text" inputMode="url" placeholder="https://…" value={link} onChange={(event) => setLink(event.target.value)} className="py-2 text-sm" />
                <AdminButton type="submit" size="sm" variant="secondary">
                  Use
                </AdminButton>
              </form>
            )}
          </div>
        )}

        {busy && (
          <div className="absolute inset-0 flex items-center bg-white/90 px-6 backdrop-blur-sm">
            <div className="w-full space-y-3">
              {uploads.map((item) => (
                <ProgressBar key={item.id} upload={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      <MediaLibraryDialog
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        kind={kind}
        folder={folder}
        onSelect={(urls) => urls[0] && onChange(urls[0])}
      />
    </Field>
  );
}

/* ----------------------------------------------------------------------------- Gallery */

interface GalleryFieldProps {
  label: ReactNode;
  value: string[];
  onChange: (value: string[]) => void;
  folder: MediaFolder;
  hint?: ReactNode;
  kind?: MediaKind;
}

export function GalleryField({ label, value, onChange, folder, hint, kind = 'image' }: GalleryFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const { uploads, upload, busy } = useUploader(folder, kind);
  // Uploads finish in any order; appending through a ref keeps every result.
  const valueRef = useRef(value);
  valueRef.current = value;

  const onFiles = async (files: File[]) => {
    const urls = await upload(files);
    if (urls.length) onChange([...valueRef.current, ...urls]);
  };
  const drop = useDropZone(onFiles);

  return (
    <Field label={label} hint={hint ?? `${kindHint[kind]}. Select several files at once, or drop them onto the grid.`}>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={acceptedTypes[kind].join(',')}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          if (event.target.files?.length) void onFiles([...event.target.files]);
          event.target.value = '';
        }}
      />
      <div
        {...drop.props}
        className={cn('rounded-2xl border p-3 transition-colors', drop.over ? 'border-champagne-700 bg-champagne-100' : 'border-indigo/10 bg-linen/40')}
      >
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {value.map((src, index) => (
            <li key={`${src}-${index}`} className="group relative overflow-hidden rounded-xl border border-indigo/10 bg-white">
              <div className="aspect-[4/3]">
                <MediaPreview src={src} alt={`Photo ${index + 1}`} />
              </div>
              <span className="absolute start-2 top-2 rounded-md bg-indigo/85 px-1.5 py-0.5 text-[0.65rem] font-semibold text-ivory">{index + 1}</span>
              <div className="flex items-center justify-between gap-1 border-t border-indigo/5 px-1 py-1">
                <IconButton icon={ArrowLeft} label={`Move photo ${index + 1} earlier`} disabled={index === 0} onClick={() => onChange(moveItem(value, index, index - 1))} />
                <IconButton icon={Trash2} label={`Remove photo ${index + 1}`} tone="danger" onClick={() => onChange(value.filter((_, i) => i !== index))} />
                <IconButton
                  icon={ArrowRight}
                  label={`Move photo ${index + 1} later`}
                  disabled={index === value.length - 1}
                  onClick={() => onChange(moveItem(value, index, index + 1))}
                />
              </div>
            </li>
          ))}
          {uploads.map((item) => (
            <li key={item.id} className="flex aspect-[4/3] items-center rounded-xl border border-dashed border-champagne bg-white px-3">
              <ProgressBar upload={item} />
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-indigo/25 bg-white text-sm text-charcoal-soft transition-colors hover:border-champagne-700 hover:text-indigo disabled:opacity-50"
            >
              <Plus aria-hidden className="h-5 w-5 text-champagne-700" />
              Add photos
            </button>
          </li>
        </ul>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-charcoal-muted">
            {value.length} {value.length === 1 ? 'photo' : 'photos'} · use the arrows to change the order
          </p>
          <AdminButton size="sm" variant="ghost" icon={Images} onClick={() => setLibraryOpen(true)}>
            Add from library
          </AdminButton>
        </div>
      </div>
      <MediaLibraryDialog
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        kind={kind}
        folder={folder}
        multiple
        onSelect={(urls) => onChange([...valueRef.current, ...urls])}
      />
    </Field>
  );
}

/* ----------------------------------------------------------------------------- Library */

interface MediaLibraryDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (urls: string[]) => void;
  kind: MediaKind;
  folder: MediaFolder;
  multiple?: boolean;
}

const folderLabels: Record<MediaFolder, string> = {
  site: 'Website',
  projects: 'Projects',
  blog: 'Blog',
  services: 'Services',
  team: 'Team',
};

/** Everything already uploaded, so a photo can be reused anywhere without uploading it again. */
export function MediaLibraryDialog({ open, onClose, onSelect, kind, folder, multiple }: MediaLibraryDialogProps) {
  const { data, error, isLoading, mutate } = useSWR(open ? 'admin:media' : null, listMedia);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | MediaFolder>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const { confirm, dialog } = useConfirm();
  const { upload, uploads, busy } = useUploader(folder, kind);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setSelected([]);
  }, [open]);

  const items = useMemo(() => {
    const allowed = acceptedTypes[kind];
    return (data ?? []).filter(
      (item) =>
        (!item.type || allowed.includes(item.type)) &&
        (filter === 'all' || item.folder === filter) &&
        item.name.toLowerCase().includes(query.trim().toLowerCase()),
    );
  }, [data, kind, filter, query]);

  const choose = (item: MediaItem) => {
    if (!multiple) {
      onSelect([item.url]);
      onClose();
      return;
    }
    setSelected((current) => (current.includes(item.url) ? current.filter((url) => url !== item.url) : [...current, item.url]));
  };

  const remove = async (item: MediaItem) => {
    const ok = await confirm({
      title: 'Delete this file?',
      body: 'It is removed from the library permanently. Any page still using it will show an empty frame until you choose another image.',
      confirmLabel: 'Delete file',
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteMedia([item.path]);
      toast.success('File deleted');
      void mutate();
    } catch (deleteError) {
      toast.error('Couldn’t delete the file', { description: friendlyError(deleteError) });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Media library"
      description="Pick a file you uploaded before, or upload a new one."
      size="xl"
      footer={
        multiple ? (
          <>
            <AdminButton variant="secondary" onClick={onClose}>
              Cancel
            </AdminButton>
            <AdminButton
              disabled={selected.length === 0}
              onClick={() => {
                onSelect(selected);
                onClose();
              }}
            >
              Add {selected.length || ''} selected
            </AdminButton>
          </>
        ) : undefined
      }
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={acceptedTypes[kind].join(',')}
        className="sr-only"
        tabIndex={-1}
        onChange={async (event) => {
          const files = event.target.files ? [...event.target.files] : [];
          event.target.value = '';
          if (files.length && (await upload(files)).length) void mutate();
        }}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" />
          <TextInput placeholder="Search by file name" value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" aria-label="Search files" />
        </div>
        <Select value={filter} onChange={(event) => setFilter(event.target.value as 'all' | MediaFolder)} className="sm:w-44" aria-label="Folder">
          <option value="all">All folders</option>
          {mediaFolders.map((name) => (
            <option key={name} value={name}>
              {folderLabels[name]}
            </option>
          ))}
        </Select>
        <AdminButton icon={UploadCloud} onClick={() => inputRef.current?.click()} loading={busy}>
          Upload
        </AdminButton>
      </div>

      {uploads.length > 0 && (
        <div className="mt-4 space-y-2 rounded-xl bg-linen p-3">
          {uploads.map((item) => (
            <ProgressBar key={item.id} upload={item} />
          ))}
        </div>
      )}

      <div className="mt-5 min-h-[16rem]">
        {isLoading ? (
          <div className="grid h-48 place-items-center">
            <Spinner />
          </div>
        ) : error ? (
          <p className="rounded-xl bg-error/10 p-4 text-sm text-error">{friendlyError(error)}</p>
        ) : items.length === 0 ? (
          <p className="grid h-48 place-items-center text-sm text-charcoal-muted">No files yet — upload one to get started.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {items.map((item) => {
              const isSelected = selected.includes(item.url);
              return (
                <li key={item.path} className="group relative">
                  <button
                    type="button"
                    onClick={() => choose(item)}
                    aria-pressed={multiple ? isSelected : undefined}
                    className={cn(
                      'block w-full overflow-hidden rounded-xl border-2 bg-linen text-start transition-colors',
                      isSelected ? 'border-champagne-700' : 'border-transparent hover:border-champagne',
                    )}
                  >
                    <span className="relative block aspect-square">
                      <MediaPreview src={item.url} alt={item.name} />
                      {isVideo(item.url) && (
                        <Film aria-hidden className="absolute bottom-2 left-2 h-4 w-4 text-white drop-shadow" />
                      )}
                    </span>
                    <span className="block truncate px-2 py-1.5 text-xs text-charcoal-soft">{item.name}</span>
                  </button>
                  <IconButton
                    icon={Trash2}
                    label={`Delete ${item.name}`}
                    tone="danger"
                    onClick={() => void remove(item)}
                    className="absolute right-1.5 top-1.5 bg-white/90 opacity-0 shadow-sm focus:opacity-100 group-hover:opacity-100"
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {dialog}
    </Modal>
  );
}

/* ----------------------------------------------------------------------------- Hero slides */

interface SlidesFieldProps {
  label: ReactNode;
  hint?: ReactNode;
  value: HeroSlide[];
  onChange: (value: HeroSlide[]) => void;
  projects: { slug: string; title: string }[];
}

/** Hero photographs (or videos), each optionally captioned with the project it shows. */
export function SlidesField({ label, hint, value, onChange, projects }: SlidesFieldProps) {
  const update = (index: number, slide: HeroSlide) => onChange(value.map((item, i) => (i === index ? slide : item)));

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-3">
        {value.map((slide, index) => (
          <div key={index} className="rounded-2xl border border-indigo/10 bg-linen/40 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-indigo">Slide {index + 1}</span>
              <ListControls
                index={index}
                count={value.length}
                noun="slide"
                onMove={(to) => onChange(moveItem(value, index, to))}
                onRemove={() => onChange(value.filter((_, i) => i !== index))}
              />
            </div>
            <div className="grid gap-3 lg:grid-cols-[1fr_16rem]">
              <ImageField label="Photo or video" kind="media" folder="site" compact value={slide.image} onChange={(image) => update(index, { ...slide, image })} />
              <Field label="Caption links to project" hint="Shows the project name on the slider." optional>
                <Select value={slide.projectId} onChange={(event) => update(index, { ...slide, projectId: event.target.value })}>
                  <option value="">No caption</option>
                  {projects.map((project) => (
                    <option key={project.slug} value={project.slug}>
                      {project.title}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </div>
        ))}
        <AdminButton variant="secondary" size="sm" icon={Plus} onClick={() => onChange([...value, { projectId: '', image: '' }])}>
          Add slide
        </AdminButton>
      </div>
    </Field>
  );
}

/* ----------------------------------------------------------------------------- Comparison pairs */

interface PairsFieldProps<T> {
  label: ReactNode;
  hint?: ReactNode;
  value: T[];
  onChange: (value: T[]) => void;
  firstKey: keyof T & string;
  secondKey: keyof T & string;
  firstLabel: string;
  secondLabel: string;
  noun: string;
  create: () => T;
}

/** Before/after or render/reality photo pairs, compared with a slider on the project page. */
export function PairsField<T extends { caption: Localized }>({
  label,
  hint,
  value,
  onChange,
  firstKey,
  secondKey,
  firstLabel,
  secondLabel,
  noun,
  create,
}: PairsFieldProps<T>) {
  const update = (index: number, change: Partial<T>) => onChange(value.map((item, i) => (i === index ? { ...item, ...change } : item)));

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-3">
        {value.map((pair, index) => (
          <div key={index} className="rounded-2xl border border-indigo/10 bg-linen/40 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium capitalize text-indigo">
                {noun} {index + 1}
              </span>
              <ListControls
                index={index}
                count={value.length}
                noun={noun}
                onMove={(to) => onChange(moveItem(value, index, to))}
                onRemove={() => onChange(value.filter((_, i) => i !== index))}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <ImageField
                label={firstLabel}
                folder="projects"
                compact
                value={String(pair[firstKey] ?? '')}
                onChange={(src) => update(index, { [firstKey]: src } as Partial<T>)}
              />
              <ImageField
                label={secondLabel}
                folder="projects"
                compact
                value={String(pair[secondKey] ?? '')}
                onChange={(src) => update(index, { [secondKey]: src } as Partial<T>)}
              />
            </div>
            <div className="mt-3">
              <BilingualInput label="Caption" optional value={pair.caption} onChange={(caption) => update(index, { caption } as Partial<T>)} />
            </div>
          </div>
        ))}
        <AdminButton variant="secondary" size="sm" icon={Plus} onClick={() => onChange([...value, create()])}>
          Add {noun}
        </AdminButton>
      </div>
    </Field>
  );
}
