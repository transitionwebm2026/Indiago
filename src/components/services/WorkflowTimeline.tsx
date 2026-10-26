'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { plain } from '@/components/ui/Highlight';
import { useProcessSteps } from '@/lib/cms/hooks';
import { EASE } from '@/lib/motion';
import { cn, pad } from '@/lib/utils';

/**
 * Interactive step-by-step workflow (tabs). Designed for Deep Indigo sections.
 * "compact" omits the per-step checklist for the home page preview.
 */
export function WorkflowTimeline({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  const { t, l, dir } = useLanguage();
  const workflow = t.services.workflow;
  const steps = useProcessSteps();
  const [requested, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  // Steps edited in the CMS can shrink the list under the current tab.
  const active = Math.min(requested, Math.max(steps.length - 1, 0));
  const step = steps[active];

  const select = (index: number) => {
    const next = (index + steps.length) % steps.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const forward = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const backward = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    if (event.key === forward) select(active + 1);
    else if (event.key === backward) select(active - 1);
    else if (event.key === 'Home') select(0);
    else if (event.key === 'End') select(steps.length - 1);
    else return;
    event.preventDefault();
  };

  if (!step) return null;

  // Five steps fill one row on desktop; other counts wrap evenly.
  const columns = steps.length === 4 ? 'md:grid-cols-4' : steps.length === 6 ? 'md:grid-cols-6' : 'md:grid-cols-5';

  return (
    <div>
      <div
        role="tablist"
        aria-label={plain(workflow.title)}
        onKeyDown={onKeyDown}
        className={cn('grid grid-cols-2 gap-x-6 sm:grid-cols-3', columns)}
      >
        {steps.map((item, index) => {
          const selected = index === active;
          const reached = index <= active;
          return (
            <button
              key={`${item.title.en}-${index}`}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${index}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              className="group relative pb-6 pt-8 text-start"
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-ivory/15" />
              <motion.span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left rounded-full bg-champagne rtl:origin-right"
                initial={false}
                animate={{ scaleX: reached ? 1 : 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              />
              <span
                aria-hidden
                className={cn(
                  'absolute -top-[5px] start-0 h-[11px] w-[11px] rounded-full border transition-colors duration-500',
                  reached ? 'border-champagne bg-champagne' : 'border-ivory/30 bg-indigo',
                )}
              />
              <span
                className={cn(
                  'block font-serif text-4xl tracking-wide transition-colors duration-500 md:text-5xl',
                  selected ? 'text-champagne' : 'text-ivory/25 group-hover:text-ivory/50',
                )}
              >
                {pad(index + 1)}
              </span>
              <span
                className={cn(
                  'mt-4 block text-[0.7rem] font-medium uppercase leading-relaxed tracking-luxe transition-colors duration-500',
                  selected ? 'text-ivory' : 'text-ivory/55 group-hover:text-ivory/80',
                )}
              >
                {l(item.title)}
              </span>
              <span className="mt-1.5 block text-xs text-ivory/40">{l(item.duration)}</span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${active}`}
        className="mt-8 card-frame-dark rounded-[2rem] bg-indigo-900/50 p-7 md:p-10"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE }}
            className={cn('grid gap-8', variant === 'full' && 'md:grid-cols-[1.2fr_1fr] md:gap-16')}
          >
            <div>
              <p className="text-[0.64rem] font-medium uppercase tracking-ultra text-champagne">
                {workflow.stepLabel} {pad(active + 1)} · {l(step.duration)}
              </p>
              <h3 className="mt-4 font-serif text-3xl tracking-wide text-ivory md:text-4xl">{l(step.title)}</h3>
              <p className="mt-4 max-w-xl leading-relaxed text-ivory/70">{l(step.summary)}</p>
            </div>
            {variant === 'full' && (
              <ul className="space-y-3 self-center">
                {step.points.map((point, index) => (
                  <li key={`${point.en}-${index}`} className="flex items-start gap-3 border-b border-ivory/10 pb-3 text-sm text-ivory/85">
                    <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-champagne" strokeWidth={1.5} />
                    {l(point)}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
