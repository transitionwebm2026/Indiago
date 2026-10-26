'use client';

import Image from 'next/image';
import { AnimatePresence, m } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { img } from '@/lib/images';
import { cn, pad } from '@/lib/utils';

export interface LightboxImage {
  src: string;
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const { t } = useLanguage();
  const open = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onIndexChange((index + delta + images.length) % images.length);
    },
    [index, images.length, onIndexChange],
  );

  // Lock page scroll and manage focus while open.
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go, onClose]);

  return (
    <AnimatePresence>
      {open && index !== null && (
        <m.div
          role="dialog"
          aria-modal="true"
          aria-label={images[index]?.alt}
          dir="ltr"
          className="fixed inset-0 z-[80] flex flex-col bg-indigo-950/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center justify-between px-5 py-4 text-ivory/70 sm:px-8">
            <span className="text-[0.7rem] tracking-luxe">
              {pad(index + 1)} <span className="text-ivory/30">/</span> {pad(images.length)}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t.common.close}
              className="grid h-11 w-11 place-items-center rounded-full border border-ivory/20 text-ivory transition-colors hover:border-champagne hover:text-champagne"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="relative flex-1" onClick={onClose}>
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={index}
                className="absolute inset-x-4 inset-y-2 cursor-grab active:cursor-grabbing sm:inset-x-24"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                drag={images.length > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.35}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(1);
                  else if (info.offset.x > 80) go(-1);
                }}
                onClick={(event) => event.stopPropagation()}
              >
                <Image
                  src={img(images[index].src, 2200)}
                  alt={images[index].alt}
                  fill
                  sizes="100vw"
                  className="pointer-events-none select-none object-contain"
                  draggable={false}
                />
              </m.div>
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    go(-1);
                  }}
                  aria-label={t.common.previous}
                  className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-ivory/20 text-ivory transition-colors hover:border-champagne hover:text-champagne sm:grid"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    go(1);
                  }}
                  aria-label={t.common.next}
                  className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-ivory/20 text-ivory transition-colors hover:border-champagne hover:text-champagne sm:grid"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </>
            )}
          </div>

          {/* The inner row centres itself with auto margins, so on narrow screens it scrolls from
              the first thumbnail instead of clipping the start the way justify-center would. */}
          {images.length > 1 && (
            <div className="no-scrollbar overflow-x-auto px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="mx-auto flex w-max gap-2">
                {images.map((image, thumbIndex) => (
                  <button
                    key={`${image.src}-${thumbIndex}`}
                    type="button"
                    onClick={() => onIndexChange(thumbIndex)}
                    aria-label={`${t.common.imageOf} ${thumbIndex + 1}`}
                    aria-current={thumbIndex === index}
                    className={cn(
                      'relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border transition-all sm:h-14 sm:w-20',
                      thumbIndex === index ? 'border-champagne opacity-100' : 'border-transparent opacity-45 hover:opacity-80',
                    )}
                  >
                    <Image src={img(image.src, 200, 60)} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </m.div>
      )}
    </AnimatePresence>
  );
}
