import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  /** "onDark" — Champagne lockup on Deep Indigo (default). "onLight" — Indigo with Champagne descriptor. */
  variant?: 'onDark' | 'onLight';
}

/**
 * Responsive SVG lockup: bold "INDIGO" with the "INTERIORS" descriptor set
 * underneath and justified to exactly the same width.
 */
export function Logo({ className, variant = 'onDark' }: LogoProps) {
  const primary = variant === 'onDark' ? '#D5B690' : '#2F2557';
  const accent = variant === 'onDark' ? '#D5B690' : '#A07C4E';

  return (
    <svg
      viewBox="0 0 220 58"
      role="img"
      aria-label="Indigo Interiors"
      lang="en"
      className={cn('h-10 w-auto', className)}
    >
      <text
        x="110"
        y="28"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight={700}
        fontSize={30}
        textLength={214}
        lengthAdjust="spacing"
        fill={primary}
      >
        INDIGO
      </text>
      <line x1="3" x2="217" y1="36.5" y2="36.5" stroke={accent} strokeOpacity={0.4} strokeWidth={0.75} />
      <text
        x="110"
        y="54"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize={14.5}
        textLength={210}
        lengthAdjust="spacing"
        fill={accent}
      >
        INTERIORS
      </text>
    </svg>
  );
}
