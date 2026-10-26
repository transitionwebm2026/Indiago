'use client';

import { FileText, Paperclip, X } from 'lucide-react';
import { useState, type DragEvent } from 'react';
import { INQUIRY_FILE_BYTES, INQUIRY_FILE_LIMIT, INQUIRY_FILE_TYPES } from '@/lib/cms/inquiries';
import type { InquiryFile } from '@/lib/cms/types';
import { cn } from '@/lib/utils';

export interface AttachedFile {
  key: string;
  name: string;
  size: number;
  status: 'uploading' | 'done' | 'error';
  progress: number;
  stored?: InquiryFile;
}

interface ReferenceFilesProps {
  id: string;
  files: AttachedFile[];
  copy: {
    files: string;
    filesHint: string;
    filesChoose: string;
    filesDrop: string;
    filesRemove: string;
    filesTooLarge: string;
    filesUnsupported: string;
    filesFailed: string;
    filesLimit: string;
  };
  optional: string;
  onAdd: (files: File[]) => void;
  onRemove: (key: string) => void;
}

const formatSize = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

/** Drop zone for photos, drawings and PDFs; files upload as soon as they're chosen. */
export function ReferenceFiles({ id, files, copy, optional, onAdd, onRemove }: ReferenceFilesProps) {
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState('');
  const hintId = `${id}-hint`;

  const accept = (list: FileList | null) => {
    if (!list?.length) return;
    const problems: string[] = [];
    const room = INQUIRY_FILE_LIMIT - files.length;
    const accepted = [...list].filter((file) => {
      if (!INQUIRY_FILE_TYPES.includes(file.type)) problems.push(`${file.name} ${copy.filesUnsupported}`);
      else if (file.size > INQUIRY_FILE_BYTES) problems.push(`${file.name} ${copy.filesTooLarge}`);
      else return true;
      return false;
    });
    if (accepted.length > room) problems.push(copy.filesLimit);
    setNotice(problems.join(' · '));
    if (room > 0 && accepted.length) onAdd(accepted.slice(0, room));
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    accept(event.dataTransfer.files);
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-[0.66rem] font-medium uppercase tracking-luxe text-charcoal-soft">
        <span id={`${id}-label`}>{copy.files}</span>
        <span className="normal-case tracking-normal text-charcoal-muted">{optional}</span>
      </div>

      {files.length < INQUIRY_FILE_LIMIT && (
        <label
          htmlFor={id}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            'mt-2.5 flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed px-4 py-6 text-center text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-champagne',
            dragging ? 'border-champagne-700 bg-champagne-100' : 'border-champagne/60 bg-white/80 hover:border-champagne-700',
          )}
        >
          <Paperclip aria-hidden className="h-5 w-5 text-champagne-700" strokeWidth={1.5} />
          <span className="text-indigo">
            <span className="font-medium underline decoration-champagne underline-offset-4">{copy.filesChoose}</span> {copy.filesDrop}
          </span>
          <input
            id={id}
            type="file"
            multiple
            accept={INQUIRY_FILE_TYPES.join(',')}
            aria-labelledby={`${id}-label`}
            aria-describedby={hintId}
            className="sr-only"
            onChange={(event) => {
              accept(event.target.files);
              event.target.value = '';
            }}
          />
        </label>
      )}

      <p id={hintId} className="mt-2 text-xs text-charcoal-muted">
        {copy.filesHint}
      </p>
      {notice && (
        <p role="alert" className="mt-2 text-sm text-error">
          {notice}
        </p>
      )}

      {files.length > 0 && (
        <ul className="mt-4 space-y-2" aria-live="polite">
          {files.map((file) => (
            <li key={file.key} className="flex items-center gap-3 rounded-2xl border border-champagne/40 bg-white/80 px-4 py-3">
              <FileText aria-hidden className="h-4 w-4 shrink-0 text-champagne-700" strokeWidth={1.5} />
              <div className="min-w-0 flex-1">
                <p dir="ltr" className="truncate text-sm text-indigo rtl:text-right">
                  {file.name}
                </p>
                {file.status === 'error' ? (
                  <p className="text-xs text-error">{copy.filesFailed}</p>
                ) : (
                  <div className="mt-1.5 flex items-center gap-3">
                    <span className="h-1 flex-1 overflow-hidden rounded-full bg-indigo/10">
                      <span
                        className="block h-full origin-left rounded-full bg-indigo transition-transform duration-300 rtl:origin-right"
                        style={{ transform: `scaleX(${file.status === 'done' ? 1 : file.progress})` }}
                      />
                    </span>
                    <span className="shrink-0 text-xs tabular-nums text-charcoal-muted" dir="ltr">
                      {file.status === 'done' ? formatSize(file.size) : `${Math.round(file.progress * 100)}%`}
                    </span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => onRemove(file.key)}
                aria-label={`${copy.filesRemove}: ${file.name}`}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-charcoal-muted transition-colors hover:bg-linen hover:text-indigo"
              >
                <X aria-hidden className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
