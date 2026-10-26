'use client';

import Image from 'next/image';
import { MoveHorizontal } from 'lucide-react';
import { useId, useState } from 'react';
import { img } from '@/lib/images';

interface CompareSliderProps {
  first: string;
  second: string;
  firstLabel: string;
  secondLabel: string;
  /** Accessible name for the range control. */
  label: string;
  alt: string;
}

/**
 * Two photographs of the same view, revealed side by side with a draggable divider.
 * The native range input carries keyboard and screen-reader support; it is always
 * left-to-right so "before" stays on the left in both languages.
 */
export function CompareSlider({ first, second, firstLabel, secondLabel, label, alt }: CompareSliderProps) {
  const [position, setPosition] = useState(50);
  const inputId = useId();

  return (
    <div dir="ltr" className="group relative isolate aspect-[4/3] overflow-hidden rounded-2xl bg-linen-dark md:rounded-3xl">
      <Image src={img(second, 1600)} alt={`${alt} — ${secondLabel}`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src={img(first, 1600)} alt={`${alt} — ${firstLabel}`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </div>

      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      {/* The invisible range input covers the frame, so dragging anywhere moves the divider. */}
      <input
        id={inputId}
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="peer absolute inset-0 z-10 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] ring-inset ring-champagne peer-focus-visible:ring-2" />

      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-indigo/85 px-3 py-1.5 text-[0.6rem] font-medium uppercase tracking-luxe text-ivory backdrop-blur-sm">
        {firstLabel}
      </span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-champagne px-3 py-1.5 text-[0.6rem] font-medium uppercase tracking-luxe text-indigo">
        {secondLabel}
      </span>

      <div aria-hidden className="pointer-events-none absolute inset-y-0 w-px bg-ivory shadow-[0_0_12px_rgba(23,18,44,0.5)]" style={{ left: `${position}%` }}>
        <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ivory bg-indigo/90 text-champagne shadow-lg transition-transform duration-300 group-hover:scale-110">
          <MoveHorizontal className="h-5 w-5" strokeWidth={1.5} />
        </span>
      </div>
    </div>
  );
}
