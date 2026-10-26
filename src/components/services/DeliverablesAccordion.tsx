'use client';

import { AnimatePresence, m } from 'framer-motion';
import { CheckCircle2, Plus } from 'lucide-react';
import { useId, useState } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useProcessSteps } from '@/lib/cms/hooks';
import { EASE } from '@/lib/motion';
import { cn, pad } from '@/lib/utils';

export function DeliverablesAccordion() {
  const { t, l } = useLanguage();
  const deliverables = t.services.deliverables;
  const stages = useProcessSteps().filter((step) => step.deliverables.length > 0);
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section className="section-y bg-ivory">
      <div className="container-luxe grid gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeading eyebrow={deliverables.eyebrow} title={deliverables.title} body={deliverables.body} />
          </div>
        </div>

        <Reveal className="lg:col-span-8">
          <ul className="space-y-3">
            {stages.map((stage, index) => {
              const expanded = open === index;
              const panelId = `${baseId}-panel-${index}`;
              const buttonId = `${baseId}-button-${index}`;
              return (
                <li key={`${stage.title.en}-${index}`} className="card-frame rounded-3xl bg-white/70 px-4 sm:px-7">
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => setOpen(expanded ? null : index)}
                      className="group flex w-full items-center gap-3 py-5 text-start sm:gap-6 sm:py-7"
                    >
                      <span
                        className={cn(
                          'font-serif text-sm transition-colors duration-300',
                          expanded ? 'text-champagne-700' : 'text-charcoal-muted',
                        )}
                      >
                        {pad(index + 1)}
                      </span>
                      <span className="min-w-0 flex-1 break-words font-serif text-xl tracking-wide text-indigo min-[400px]:text-2xl md:text-3xl">
                        {l(stage.title)}
                      </span>
                      <span className="hidden text-[0.62rem] font-medium uppercase tracking-luxe text-charcoal-muted sm:block">
                        {stage.deliverables.length} {deliverables.itemsLabel}
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          'grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-luxe',
                          expanded
                            ? 'rotate-45 border-indigo bg-indigo text-champagne'
                            : 'border-indigo/20 text-indigo group-hover:border-indigo',
                        )}
                      >
                        <Plus className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <m.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <ul className="grid gap-3 pb-6 sm:grid-cols-2 sm:pb-8 md:ps-12">
                          {stage.deliverables.map((item, itemIndex) => (
                            <li key={`${item.en}-${itemIndex}`} className="flex items-start gap-3 rounded-2xl bg-linen px-4 py-3.5 text-sm text-indigo">
                              <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-champagne-700" strokeWidth={1.5} />
                              {l(item)}
                            </li>
                          ))}
                        </ul>
                      </m.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
