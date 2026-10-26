'use client';

import { m } from 'framer-motion';
import { cn, pad } from '@/lib/utils';

export interface FilterOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface FilterBarProps<T extends string> {
  id: string;
  label: string;
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function FilterBar<T extends string>({ id, label, options, value, onChange, className }: FilterBarProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0', className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative isolate shrink-0 rounded-full border px-5 py-3 text-[0.68rem] font-medium uppercase tracking-luxe transition-colors duration-300',
              active ? 'border-indigo text-ivory' : 'border-indigo/15 text-indigo hover:border-indigo/45',
            )}
          >
            {active && (
              <m.span
                layoutId={`${id}-active`}
                className="absolute inset-0 -z-10 rounded-full bg-indigo"
                transition={{ type: 'spring', stiffness: 380, damping: 34 }}
              />
            )}
            <span className="flex items-center gap-2.5">
              {option.label}
              {option.count !== undefined && (
                <span className={cn('text-[0.6rem] tracking-normal', active ? 'text-champagne' : 'text-charcoal-muted')}>
                  {pad(option.count)}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
