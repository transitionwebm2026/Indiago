'use client';

import { Eye, Heading2, List, Pencil, Quote } from 'lucide-react';
import { useRef, useState } from 'react';
import { ArticleBody } from '@/components/blog/ArticleBody';
import { estimateReadTime, markdownToBlocks } from '@/lib/cms/markdown';
import type { Locale } from '@/lib/i18n';
import { AdminButton } from './ui';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  lang: Locale;
  placeholder?: string;
}

/**
 * Article writing for non-technical editors: plain text with three formatting buttons,
 * and a preview that uses the website's real article typography.
 */
export function MarkdownEditor({ value, onChange, lang, placeholder }: MarkdownEditorProps) {
  const [preview, setPreview] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const rtl = lang === 'ar';

  /** Prefixes every selected line (or the current line) with `marker`. */
  const format = (marker: string) => {
    const textarea = ref.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    const start = value.lastIndexOf('\n', selectionStart - 1) + 1;
    const endIndex = value.indexOf('\n', selectionEnd);
    const end = endIndex === -1 ? value.length : endIndex;
    const lines = value
      .slice(start, end)
      .split('\n')
      .map((line) => `${marker}${line.replace(/^(#{1,6}\s+|>\s?|[-*•]\s+)/, '')}`);
    const block = lines.join('\n');
    // Keep formatted blocks separated from their neighbours by a blank line.
    const before = start > 0 && value[start - 2] !== '\n' && value[start - 1] === '\n' ? '\n' : '';
    const next = value.slice(0, start) + before + block + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      textarea.focus();
      const caret = start + before.length + block.length;
      textarea.setSelectionRange(caret, caret);
    });
  };

  const words = value.split(/\s+/).filter(Boolean).length;

  return (
    <div className="overflow-hidden rounded-2xl border border-indigo/15 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo/10 bg-linen/60 px-2 py-1.5">
        <div className="flex flex-wrap gap-1">
          <AdminButton size="sm" variant="ghost" icon={Heading2} onClick={() => format('## ')} disabled={preview}>
            Heading
          </AdminButton>
          <AdminButton size="sm" variant="ghost" icon={Quote} onClick={() => format('> ')} disabled={preview}>
            Quote
          </AdminButton>
          <AdminButton size="sm" variant="ghost" icon={List} onClick={() => format('- ')} disabled={preview}>
            List
          </AdminButton>
        </div>
        <AdminButton size="sm" variant={preview ? 'primary' : 'secondary'} icon={preview ? Pencil : Eye} onClick={() => setPreview((on) => !on)}>
          {preview ? 'Back to editing' : 'Preview'}
        </AdminButton>
      </div>

      {preview ? (
        <div className="max-h-[70svh] overflow-y-auto bg-ivory px-6 py-8 md:px-10">
          {value.trim() ? <ArticleBody blocks={markdownToBlocks(value)} lang={lang} /> : <p className="text-sm text-charcoal-muted">Nothing to preview yet.</p>}
        </div>
      ) : (
        <textarea
          ref={ref}
          dir={rtl ? 'rtl' : 'ltr'}
          lang={lang}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={18}
          aria-label={rtl ? 'Article text (Arabic)' : 'Article text (English)'}
          className="block min-h-[22rem] w-full resize-y bg-white px-5 py-4 text-[0.98rem] leading-relaxed text-charcoal placeholder:text-charcoal-muted/70 focus:outline-none focus-visible:bg-ivory/40"
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-indigo/10 px-4 py-2 text-xs text-charcoal-muted">
        <span>
          Start a line with <code className="rounded bg-linen px-1">##</code> for a heading, <code className="rounded bg-linen px-1">&gt;</code> for a quote,{' '}
          <code className="rounded bg-linen px-1">-</code> for a list. Leave a blank line between paragraphs.
        </span>
        <span className="tabular-nums">
          {words} words · ~{estimateReadTime(value)} min read
        </span>
      </div>
    </div>
  );
}
