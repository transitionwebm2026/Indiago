'use client';

import { Check } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

const labelClass = 'flex items-baseline justify-between gap-4 text-[0.66rem] font-medium uppercase tracking-luxe text-charcoal-soft';

function FieldLabel({ htmlFor, children, optional }: { htmlFor?: string; children: ReactNode; optional?: string }) {
  const content = (
    <>
      <span>{children}</span>
      {optional && <span className="normal-case tracking-normal text-charcoal-muted">{optional}</span>}
    </>
  );
  return htmlFor ? (
    <label htmlFor={htmlFor} className={labelClass}>
      {content}
    </label>
  ) : (
    <span className={labelClass}>{content}</span>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-sm text-error">
      {message}
    </p>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  optional?: string;
  hint?: string;
  type?: 'text' | 'email' | 'tel' | 'number';
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
  /** Force left-to-right input (phone numbers, emails) while aligning with the page direction. */
  ltr?: boolean;
  multiline?: boolean;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  optional,
  hint,
  type = 'text',
  inputMode,
  autoComplete,
  ltr,
  multiline,
}: TextFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error && errorId, hint && hintId].filter(Boolean).join(' ') || undefined;
  const shared = {
    id,
    value,
    placeholder,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    dir: ltr ? ('ltr' as const) : undefined,
    className: cn('field-input', ltr && 'rtl:text-right', multiline && 'min-h-[7rem] resize-y'),
  };

  return (
    <div>
      <FieldLabel htmlFor={id} optional={optional}>
        {label}
      </FieldLabel>
      {multiline ? (
        <textarea {...shared} rows={4} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input
          {...shared}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          min={type === 'number' ? 1 : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {hint && (
        <p id={hintId} className="mt-2 text-xs text-charcoal-muted">
          {hint}
        </p>
      )}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

interface ChoiceGroupProps<T extends string> {
  id: string;
  label: string;
  options: { value: T; label: string }[];
  error?: string;
  hint?: string;
  /** Single choice (radio) */
  value?: T | '';
  onSelect?: (value: T) => void;
  /** Multiple choice (checkbox) */
  values?: T[];
  onToggle?: (value: T) => void;
}

export function ChoiceGroup<T extends string>({
  id,
  label,
  options,
  error,
  hint,
  value,
  onSelect,
  values,
  onToggle,
}: ChoiceGroupProps<T>) {
  const multiple = Array.isArray(values);
  const errorId = `${id}-error`;

  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="w-full">
        <FieldLabel optional={hint}>{label}</FieldLabel>
      </legend>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((option, index) => {
          const checked = multiple ? values.includes(option.value) : value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                'cursor-pointer select-none rounded-full border px-5 py-3 text-sm transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-champagne',
                checked ? 'border-indigo bg-indigo text-ivory' : 'border-champagne/50 bg-white/80 text-indigo hover:border-champagne-600',
                error && !checked && 'border-error/50',
              )}
            >
              <input
                id={index === 0 ? id : undefined}
                type={multiple ? 'checkbox' : 'radio'}
                name={id}
                value={option.value}
                checked={checked}
                aria-invalid={error ? true : undefined}
                onChange={() => (multiple ? onToggle?.(option.value) : onSelect?.(option.value))}
                className="sr-only"
              />
              <span className="flex items-center gap-2">
                {checked && <Check aria-hidden className="h-3.5 w-3.5 text-champagne" strokeWidth={2} />}
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}
