'use client';

import Link from 'next/link';
import { Loader2, X, type LucideIcon } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/lib/utils';

/* ----------------------------------------------------------------------------- Buttons */

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-indigo text-ivory hover:bg-indigo-700 shadow-sm',
  accent: 'bg-champagne text-indigo hover:bg-champagne-400 shadow-sm',
  secondary: 'border border-indigo/15 bg-white text-indigo hover:border-indigo/40 hover:bg-ivory',
  ghost: 'text-indigo hover:bg-indigo/5',
  danger: 'border border-error/30 bg-white text-error hover:bg-error hover:text-white',
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'h-9 gap-1.5 px-3.5 text-[0.8rem]',
  md: 'h-11 gap-2 px-5 text-sm',
};

export function adminButtonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(
    'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-xl font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50',
    buttonVariants[variant],
    buttonSizes[size],
    className,
  );
}

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  loading?: boolean;
}

export function AdminButton({ variant, size, icon: Icon, loading, className, children, disabled, type = 'button', ...rest }: AdminButtonProps) {
  return (
    <button type={type} className={adminButtonClasses(variant, size, className)} disabled={disabled || loading} {...rest}>
      {loading ? (
        <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
      ) : (
        Icon && <Icon aria-hidden className="h-4 w-4" strokeWidth={1.75} />
      )}
      {children}
    </button>
  );
}

interface AdminLinkButtonProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  external?: boolean;
  className?: string;
  children: ReactNode;
}

export function AdminLinkButton({ href, variant, size, icon: Icon, external, className, children }: AdminLinkButtonProps) {
  const content = (
    <>
      {Icon && <Icon aria-hidden className="h-4 w-4" strokeWidth={1.75} />}
      {children}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={adminButtonClasses(variant, size, className)}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={adminButtonClasses(variant, size, className)}>
      {content}
    </Link>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  tone?: 'default' | 'danger';
}

export function IconButton({ icon: Icon, label, tone = 'default', className, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-30',
        tone === 'danger' ? 'text-charcoal-muted hover:bg-error/10 hover:text-error' : 'text-charcoal-soft hover:bg-indigo/5 hover:text-indigo',
        className,
      )}
      {...rest}
    >
      <Icon aria-hidden className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 aria-hidden className={cn('h-5 w-5 animate-spin text-champagne-700', className)} />;
}

/* ----------------------------------------------------------------------------- Layout */

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-serif text-3xl tracking-wide text-indigo md:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal-soft">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

interface CardProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Card({ title, description, actions, children, className, bodyClassName }: CardProps) {
  return (
    <section className={cn('rounded-2xl border border-champagne/40 bg-white shadow-[0_1px_2px_rgba(47,37,87,0.04)]', className)}>
      {(title || actions) && (
        <div className="flex flex-col gap-3 border-b border-indigo/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-w-0">
            {title && <h2 className="font-serif text-xl tracking-wide text-indigo">{title}</h2>}
            {description && <p className="mt-1 text-sm leading-relaxed text-charcoal-soft">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      {/* Without tailwind-merge, a custom body class replaces the default padding rather than fighting it. */}
      {children && <div className={bodyClassName ?? 'px-5 py-5 sm:px-6'}>{children}</div>}
    </section>
  );
}

const badgeTones = {
  neutral: 'bg-indigo/5 text-charcoal-soft',
  indigo: 'bg-indigo text-ivory',
  champagne: 'bg-champagne-200 text-champagne-800',
  success: 'bg-[#E4F1E7] text-[#2D6A3E]',
  warning: 'bg-[#FBF0D9] text-[#8A5A12]',
  danger: 'bg-error/10 text-error',
} as const;

export function Badge({ tone = 'neutral', children, className }: { tone?: keyof typeof badgeTones; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', badgeTones[tone], className)}>
      {children}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, body, action }: { icon: LucideIcon; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-linen text-champagne-700">
        <Icon aria-hidden className="h-6 w-6" strokeWidth={1.5} />
      </span>
      <p className="mt-5 font-serif text-xl tracking-wide text-indigo">{title}</p>
      {body && <p className="mt-2 max-w-md text-sm leading-relaxed text-charcoal-soft">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

interface TabsProps<T extends string> {
  tabs: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}

export function Tabs<T extends string>({ tabs, value, onChange, label }: TabsProps<T>) {
  return (
    <div role="tablist" aria-label={label} className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              'inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors',
              active ? 'bg-indigo text-ivory shadow-sm' : 'text-charcoal-soft hover:bg-white hover:text-indigo',
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn('rounded-full px-2 text-xs tabular-nums', active ? 'bg-champagne text-indigo' : 'bg-indigo/5')}>{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------------------- Form controls */

export const inputClass =
  'w-full rounded-xl border border-indigo/15 bg-white px-3.5 py-2.5 text-[0.95rem] text-charcoal transition-[border-color,box-shadow] placeholder:text-charcoal-muted/70 hover:border-indigo/30 focus:border-champagne-700 focus:outline-none focus:ring-4 focus:ring-champagne/25 disabled:bg-linen disabled:text-charcoal-muted';

interface FieldProps {
  label: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}

export function Field({ label, htmlFor, hint, error, optional, children, className }: FieldProps) {
  const LabelTag = htmlFor ? 'label' : 'p';
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <LabelTag {...(htmlFor ? { htmlFor } : {})} className="text-sm font-medium text-indigo">
          {label}
        </LabelTag>
        {optional && <span className="text-xs text-charcoal-muted">Optional</span>}
      </div>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs leading-relaxed text-charcoal-muted">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClass, className)} {...props} />;
}

export function TextArea({ className, rows = 3, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={rows} className={cn(inputClass, 'min-h-[4.5rem] resize-y leading-relaxed', className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(inputClass, 'cursor-pointer appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pe-9', className)} style={{ backgroundImage: CHEVRON }} {...props}>
      {children}
    </select>
  );
}

const CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232F2557' stroke-width='1.75'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Toggle({ checked, onChange, label, description, disabled, className }: ToggleProps) {
  const id = useId();
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <label htmlFor={id} className="min-w-0 cursor-pointer">
        <span className="block text-sm font-medium text-indigo">{label}</span>
        {description && <span className="mt-0.5 block text-xs leading-relaxed text-charcoal-muted">{description}</span>}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-50',
          checked ? 'bg-indigo' : 'bg-indigo/15',
        )}
      >
        <span
          aria-hidden
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-[left] duration-200',
            checked ? 'left-[1.375rem] bg-champagne' : 'left-0.5',
          )}
        />
      </button>
    </div>
  );
}

/* ----------------------------------------------------------------------------- Dialogs */

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const modalSizes = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' };

export function Modal({ open, onClose, title, description, children, footer, size = 'md' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-indigo-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
        className={cn('flex max-h-[92svh] w-full flex-col rounded-t-3xl bg-white shadow-2xl outline-none sm:rounded-3xl', modalSizes[size])}
      >
        <div className="flex items-start justify-between gap-4 border-b border-indigo/5 px-6 py-5">
          <div>
            <h2 id={titleId} className="font-serif text-xl tracking-wide text-indigo">
              {title}
            </h2>
            {description && <p className="mt-1 text-sm text-charcoal-soft">{description}</p>}
          </div>
          <IconButton icon={X} label="Close" onClick={onClose} />
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-indigo/5 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

interface ConfirmOptions {
  title: string;
  body?: string;
  confirmLabel?: string;
  danger?: boolean;
}

/** Promise-based confirmation: `if (await confirm({ title: 'Delete?' })) …`. Render `dialog` once in the view. */
export function useConfirm() {
  const [request, setRequest] = useState<(ConfirmOptions & { resolve: (ok: boolean) => void }) | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => new Promise<boolean>((resolve) => setRequest({ ...options, resolve })), []);

  const close = useCallback(
    (ok: boolean) => {
      request?.resolve(ok);
      setRequest(null);
    },
    [request],
  );

  const dialog = (
    <Modal
      open={request !== null}
      onClose={() => close(false)}
      title={request?.title ?? ''}
      size="sm"
      footer={
        <>
          <AdminButton variant="secondary" onClick={() => close(false)}>
            Cancel
          </AdminButton>
          <AdminButton variant={request?.danger ? 'danger' : 'primary'} onClick={() => close(true)} autoFocus>
            {request?.confirmLabel ?? 'Confirm'}
          </AdminButton>
        </>
      }
    >
      {request?.body && <p className="text-sm leading-relaxed text-charcoal-soft">{request.body}</p>}
    </Modal>
  );

  return { confirm, dialog };
}

/* ----------------------------------------------------------------------------- Saving */

/** Asks before leaving the page with unsaved changes. */
export function useUnsavedWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);
}

interface SaveBarProps {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onDiscard?: () => void;
  saveLabel?: string;
  children?: ReactNode;
}

/** Sticky footer that appears with unsaved changes, so Save is always one click away. */
export function SaveBar({ dirty, saving, onSave, onDiscard, saveLabel = 'Save changes', children }: SaveBarProps) {
  return (
    <div
      className={cn(
        'sticky bottom-4 z-30 mt-8 transition-all duration-300',
        dirty || saving ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <div className="flex flex-col gap-3 rounded-2xl bg-indigo px-5 py-3.5 text-ivory shadow-xl shadow-indigo/20 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm">
          <span aria-hidden className="h-2 w-2 rounded-full bg-champagne" />
          You have unsaved changes
        </p>
        <div className="flex flex-wrap gap-2">
          {children}
          {onDiscard && (
            <AdminButton variant="ghost" className="text-ivory hover:bg-white/10" onClick={onDiscard} disabled={saving}>
              Discard
            </AdminButton>
          )}
          <AdminButton variant="accent" onClick={onSave} loading={saving}>
            {saveLabel}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------- Helpers */

export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(
    new Date(iso),
  );
}

export function timeAgo(iso: string) {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  const format = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  for (const [unit, size] of units) {
    if (seconds >= size) return format.format(-Math.floor(seconds / size), unit);
  }
  return 'just now';
}
