'use client';

import Image from 'next/image';
import { ChevronsLeftRight } from 'lucide-react';
import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { img } from '@/lib/images';

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  hint: string;
}

const clamp = (value: number) => Math.min(100, Math.max(0, value));

/**
 * Drag (mouse / touch) or use the arrow keys to compare two images.
 * Always laid out left-to-right so "before" stays on the left in both languages.
 */
export function BeforeAfterSlider({ before, after, beforeLabel, afterLabel, hint }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromPointer = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100));
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromPointer(event.clientX);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === 'ArrowLeft') setPosition((value) => clamp(value - step));
    else if (event.key === 'ArrowRight') setPosition((value) => clamp(value + step));
    else if (event.key === 'Home') setPosition(0);
    else if (event.key === 'End') setPosition(100);
    else return;
    event.preventDefault();
  };

  return (
    <div
      ref={containerRef}
      dir="ltr"
      className="relative isolate aspect-[4/3] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[2rem] bg-indigo md:aspect-[16/9]"
      onPointerDown={onPointerDown}
      onPointerMove={(event) => dragging.current && updateFromPointer(event.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <Image src={img(after, 1800)} alt={afterLabel} fill sizes="(min-width: 1024px) 66vw, 100vw" className="pointer-events-none object-cover" draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image
          src={img(before, 1800)}
          alt={beforeLabel}
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="pointer-events-none object-cover grayscale-[40%]"
          draggable={false}
        />
      </div>

      <span className="pointer-events-none absolute left-5 top-5 rounded-full bg-indigo/80 px-3.5 py-1.5 text-[0.6rem] font-medium uppercase tracking-luxe text-ivory backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-5 top-5 rounded-full bg-champagne px-3.5 py-1.5 text-[0.6rem] font-medium uppercase tracking-luxe text-indigo">
        {afterLabel}
      </span>

      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${position}%` }}>
        <div className="absolute inset-y-0 w-px -translate-x-1/2 bg-champagne" />
        <div
          role="slider"
          tabIndex={0}
          aria-label={hint}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)}%`}
          onKeyDown={onKeyDown}
          className="pointer-events-auto absolute top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-champagne bg-indigo/85 text-champagne backdrop-blur-sm"
        >
          <ChevronsLeftRight aria-hidden className="h-5 w-5" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
