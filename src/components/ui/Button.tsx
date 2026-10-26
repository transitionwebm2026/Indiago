import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from '@/components/ui/Link';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline-light' | 'outline-dark' | 'solid-dark' | 'link-light' | 'link-dark';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-champagne text-indigo hover:bg-champagne-400',
  'outline-light': 'border border-ivory/30 text-ivory hover:border-champagne hover:text-champagne',
  'outline-dark': 'border border-indigo/25 text-indigo hover:border-indigo hover:bg-indigo hover:text-ivory',
  'solid-dark': 'bg-indigo text-ivory hover:bg-indigo-700',
  'link-light': 'text-champagne hover:text-ivory',
  'link-dark': 'text-indigo hover:text-champagne-800',
};

// Heights are minimums so a long label can wrap onto a second line on narrow phones.
const sizes: Record<Size, string> = {
  sm: 'min-h-10 px-5 py-2 text-[0.66rem]',
  md: 'min-h-12 px-6 py-3 text-[0.7rem] sm:px-7',
  lg: 'min-h-14 px-7 py-3.5 text-[0.72rem] sm:px-9',
};

interface StyleProps {
  variant?: Variant;
  size?: Size;
  /** Adds an animated arrow; "external" uses a diagonal arrow. */
  arrow?: boolean | 'external';
  className?: string;
}

export function buttonClasses({ variant = 'primary', size = 'md', className }: StyleProps) {
  const isLink = variant === 'link-light' || variant === 'link-dark';
  return cn(
    'group/btn inline-flex max-w-full items-center justify-center gap-3 rounded-full text-center font-sans font-medium uppercase leading-snug tracking-[0.14em] transition-colors duration-500 ease-luxe disabled:pointer-events-none disabled:opacity-50 sm:whitespace-nowrap sm:tracking-[0.18em]',
    isLink ? 'h-auto px-0 py-1 text-[0.7rem]' : sizes[size],
    variants[variant],
    className,
  );
}

function ButtonArrow({ type }: { type: true | 'external' }) {
  const Icon = type === 'external' ? ArrowUpRight : ArrowRight;
  return (
    <Icon
      aria-hidden
      strokeWidth={1.5}
      className={cn(
        'h-4 w-4 shrink-0 transition-transform duration-500 ease-luxe',
        type === 'external'
          ? 'group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5'
          : 'group-hover/btn:translate-x-1 rtl:-scale-x-100 rtl:group-hover/btn:-translate-x-1',
      )}
    />
  );
}

interface ButtonLinkProps extends StyleProps, Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className'> {
  href: string;
  children: ReactNode;
}

export function ButtonLink({ href, variant, size, arrow, className, children, ...rest }: ButtonLinkProps) {
  const classes = buttonClasses({ variant, size, className });
  const content = (
    <>
      <span className="inline-flex items-center gap-3">{children}</span>
      {arrow && <ButtonArrow type={arrow} />}
    </>
  );

  if (/^(https?:|mailto:|tel:)/.test(href)) {
    const newTab = href.startsWith('http');
    return (
      <a href={href} className={classes} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}

interface ButtonProps extends StyleProps, Omit<ComponentPropsWithoutRef<'button'>, 'className'> {
  children: ReactNode;
}

export function Button({ variant, size, arrow, className, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...rest}>
      <span className="inline-flex items-center gap-3">{children}</span>
      {arrow && <ButtonArrow type={arrow} />}
    </button>
  );
}
