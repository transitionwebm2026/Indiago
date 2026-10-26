import type { ArticleBlock } from '@/lib/data/posts';

/**
 * Articles are written in a small, forgiving Markdown subset that maps onto the
 * site's article typography:
 *
 *   ## Heading
 *   > A pull quote
 *   - A list item
 *   Any other line is paragraph text; a blank line starts a new paragraph.
 */

export function blocksToMarkdown(blocks: ArticleBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case 'h2':
          return `## ${block.text}`;
        case 'quote':
          return `> ${block.text}`;
        case 'list':
          return block.items.map((item) => `- ${item}`).join('\n');
        default:
          return block.text;
      }
    })
    .join('\n\n');
}

type LineKind = 'heading' | 'quote' | 'item' | 'text' | 'blank';

function classify(line: string): { kind: LineKind; text: string } {
  const trimmed = line.trim();
  if (!trimmed) return { kind: 'blank', text: '' };
  const heading = /^#{1,6}\s+(.*)$/.exec(trimmed);
  if (heading) return { kind: 'heading', text: heading[1].trim() };
  const quote = /^>\s?(.*)$/.exec(trimmed);
  if (quote) return { kind: 'quote', text: quote[1].trim() };
  const item = /^(?:[-*•]|\d+[.)])\s+(.*)$/.exec(trimmed);
  if (item) return { kind: 'item', text: item[1].trim() };
  return { kind: 'text', text: trimmed };
}

export function markdownToBlocks(markdown: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  let current: ArticleBlock | null = null;

  const flush = () => {
    if (current && (current.type === 'list' ? current.items.length : current.text)) blocks.push(current);
    current = null;
  };

  for (const line of markdown.replace(/\r\n?/g, '\n').split('\n')) {
    const { kind, text } = classify(line);
    if (kind === 'blank') {
      flush();
    } else if (kind === 'heading') {
      flush();
      blocks.push({ type: 'h2', text });
    } else if (kind === 'item') {
      if (current?.type !== 'list') {
        flush();
        current = { type: 'list', items: [] };
      }
      current.items.push(text);
    } else {
      const type = kind === 'quote' ? 'quote' : 'p';
      if (current && current.type !== 'list' && current.type === type) {
        current.text = `${current.text} ${text}`;
      } else {
        flush();
        current = { type, text };
      }
    }
  }
  flush();
  return blocks;
}

/** Minutes to read at ~200 words a minute, never less than one. */
export function estimateReadTime(markdown: string) {
  const words = markdown.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
  return Math.max(1, Math.round(words / 200));
}
