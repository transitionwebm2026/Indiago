import type { Config } from 'tailwindcss';

/**
 * Indigo Interiors — official brand palette.
 * The palette replaces Tailwind's defaults so only on-brand colours can be used.
 *
 *  Deep Indigo  #2F2557  rgb(47, 37, 87)    structure, heroes, dark sections, footer
 *  Champagne    #D5B690  rgb(213, 182, 144) accents, CTAs, highlighted words, logo
 *  Ivory        #F9F7F2  rgb(249, 247, 242) primary light background
 *  Linen        #F5F0E8  rgb(245, 240, 232) secondary background, card contrast
 *  Charcoal     #2E2E2E  rgb(46, 46, 46)    body copy
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      black: '#000000',
      indigo: {
        DEFAULT: '#2F2557',
        950: '#17122C',
        900: '#221B42',
        800: '#2F2557',
        700: '#3C3069',
        600: '#4B3E80',
      },
      champagne: {
        DEFAULT: '#D5B690',
        100: '#F6EFE5',
        200: '#EEE2D1',
        400: '#DEC5A6',
        600: '#C4A174',
        // Darker champagne tones keep accents legible on Ivory/Linen backgrounds:
        // 700 meets WCAG AA for large headings, 800 for small labels.
        700: '#A07C4E',
        800: '#80603A',
      },
      ivory: '#F9F7F2',
      linen: {
        DEFAULT: '#F5F0E8',
        dark: '#EAE2D5',
      },
      charcoal: {
        DEFAULT: '#2E2E2E',
        soft: '#55524C',
        muted: '#86827A',
      },
      error: '#A3463B',
    },
    fontFamily: {
      // Georgia for headlines; Arabic glyphs fall through to Noto Naskh Arabic.
      serif: ['Georgia', 'var(--font-naskh)', 'Cambria', '"Times New Roman"', 'serif'],
      // Inter for body copy; Arabic glyphs fall through to IBM Plex Sans Arabic.
      sans: ['var(--font-inter)', 'var(--font-plex-arabic)', 'Arial', 'Helvetica', 'sans-serif'],
    },
    extend: {
      letterSpacing: {
        luxe: '0.22em',
        ultra: '0.34em',
      },
      maxWidth: {
        content: '1320px',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        1200: '1200ms',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '100%': { transform: 'scale(1.7)', opacity: '0' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
