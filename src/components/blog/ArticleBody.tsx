import type { ArticleBlock } from '@/lib/data/posts';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/** Typeset renderer for structured article content, in the language the blocks are written in. */
export function ArticleBody({ blocks, lang = 'en' }: { blocks: ArticleBlock[]; lang?: Locale }) {
  let paragraphCount = 0;
  const arabic = lang === 'ar';

  return (
    <div lang={lang} dir={arabic ? 'rtl' : 'ltr'} className="text-start">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'p': {
            const isLead = paragraphCount++ === 0;
            return (
              <p
                key={index}
                className={cn(
                  'text-pretty',
                  isLead
                    ? 'font-serif text-[1.3rem] leading-relaxed tracking-wide text-indigo sm:text-[1.45rem] md:text-[1.6rem]'
                    : 'mt-6 text-[1.075rem] leading-[1.85] text-charcoal',
                )}
              >
                {block.text}
              </p>
            );
          }
          case 'h2':
            return (
              <h2 key={index} className="mt-14 font-serif text-[1.75rem] leading-snug tracking-wide text-indigo md:text-3xl">
                {block.text}
              </h2>
            );
          case 'quote':
            return (
              <blockquote
                key={index}
                className={cn(
                  'my-10 rounded-3xl border border-champagne/40 bg-linen p-6 font-serif text-xl leading-relaxed text-indigo sm:my-12 sm:p-8 sm:text-2xl md:text-[1.7rem]',
                  !arabic && 'italic',
                )}
              >
                {arabic ? `«${block.text}»` : `“${block.text}”`}
              </blockquote>
            );
          case 'list':
            return (
              <ul key={index} className="mt-6 space-y-3 rounded-3xl bg-linen/70 p-5 sm:p-6">
                {block.items.map((item) => (
                  <li key={item} className="flex items-start gap-4 text-[1.05rem] leading-relaxed text-charcoal">
                    <span aria-hidden className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-champagne-700" />
                    {item}
                  </li>
                ))}
              </ul>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
