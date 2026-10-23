'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { plain } from '@/components/ui/Highlight';
import { EASE } from '@/lib/motion';
import { cn, pad } from '@/lib/utils';

/**
 * Interactive 4-step workflow (tabs). Designed for Deep Indigo sections.
 * "compact" omits the per-step checklist for the home page preview.
 */
export function WorkflowTimeline({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  const { t, dir } = useLanguage();
  const workflow = t.services.workflow;
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const step = workflow.steps[active];

  const select = (index: number) => {
    const next = (index + workflow.steps.length) % workflow.steps.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const forward = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const backward = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    if (event.key === forward) select(active + 1);
    else if (event.key === backward) select(active - 1);
    else if (event.key === 'Home') select(0);
    else if (event.key === 'End') select(workflow.steps.length - 1);
    else return;
    event.preventDefault();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label={plain(workflow.title)}
        onKeyDown={onKeyDown}
        className="grid grid-cols-2 gap-x-6 md:grid-cols-4"
      >
        {workflow.steps.map((item, index) => {
          const selected = index === active;
          const reached = index <= active;
          return (
            <button
              key={item.title}
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
                {item.title}
              </span>
              <span className="mt-1.5 block text-xs text-ivory/40">{item.duration}</span>
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
                {workflow.stepLabel} {pad(active + 1)} · {step.duration}
              </p>
              <h3 className="mt-4 font-serif text-3xl tracking-wide text-ivory md:text-4xl">{step.title}</h3>
              <p className="mt-4 max-w-xl leading-relaxed text-ivory/70">{step.summary}</p>
            </div>
            {variant === 'full' && (
              <ul className="space-y-3 self-center">
                {step.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 border-b border-ivory/10 pb-3 text-sm text-ivory/85">
                    <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-champagne" strokeWidth={1.5} />
                    {point}
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
