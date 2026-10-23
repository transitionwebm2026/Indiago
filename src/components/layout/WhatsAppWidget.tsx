'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Phone, X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { WhatsAppIcon } from '@/components/icons/SocialIcons';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { buttonClasses } from '@/components/ui/Button';
import { EASE } from '@/lib/motion';
import { site, whatsappLink } from '@/lib/site';

/**
 * Fixed bottom-right launchers: a direct call button stacked above the
 * consultation chat that routes straight to wa.me/201112266054.
 */
export function WhatsAppWidget() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  // The call button's first entrance waits for the page to settle; later show/hide toggles are instant.
  const [callIntroDone, setCallIntroDone] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-4 sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label={t.whatsapp.label}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="w-[min(22rem,calc(100vw-2.5rem))] origin-bottom-right card-frame overflow-hidden rounded-3xl bg-ivory"
          >
            <div className="flex items-center gap-3 bg-indigo px-5 py-4 text-ivory">
              <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-champagne/40 font-serif text-sm tracking-wider text-champagne">
                ID
                <span aria-hidden className="absolute bottom-0 end-0 h-2.5 w-2.5 rounded-full border-2 border-indigo bg-champagne" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-base tracking-wide">{t.brand}</p>
                <p className="text-[0.68rem] text-ivory/60">{t.whatsapp.status}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.whatsapp.close}
                className="grid h-9 w-9 place-items-center text-ivory/70 transition-colors hover:text-champagne"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="space-y-4 bg-linen px-5 py-5">
              <p className="max-w-[88%] rounded-2xl rounded-ss-md bg-white px-4 py-3 text-sm leading-relaxed text-charcoal">
                {t.whatsapp.greeting}
              </p>
              <p className="text-[0.62rem] font-medium uppercase tracking-luxe text-charcoal-soft">{t.whatsapp.quickLabel}</p>
              <ul className="space-y-2">
                {t.whatsapp.options.map((option) => (
                  <li key={option.label}>
                    <a
                      href={whatsappLink(option.message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 card-frame rounded-2xl bg-ivory px-4 py-3 text-sm text-indigo hover:border-champagne hover:bg-white"
                    >
                      {option.label}
                      <ArrowUpRight
                        aria-hidden
                        strokeWidth={1.5}
                        className="h-4 w-4 shrink-0 text-champagne-700 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-indigo/10 bg-ivory p-4">
              <a
                href={whatsappLink(t.whatsapp.defaultMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({ variant: 'solid-dark', className: 'w-full' })}
              >
                <WhatsAppIcon className="h-4 w-4" />
                {t.whatsapp.custom}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!open && (
          <motion.a
            key="call"
            href={site.phoneHref}
            aria-label={t.whatsapp.call}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ delay: callIntroDone ? 0 : 1.15, duration: callIntroDone ? 0.3 : 0.6, ease: EASE }}
            onAnimationComplete={() => setCallIntroDone(true)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="grid h-14 w-14 place-items-center rounded-full border border-champagne/50 bg-indigo text-champagne"
          >
            <Phone className="h-5 w-5" strokeWidth={1.5} />
          </motion.a>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? t.whatsapp.close : t.whatsapp.label}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.6, ease: EASE }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="relative grid h-14 w-14 place-items-center rounded-full bg-champagne text-indigo"
      >
        {!open && <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full bg-champagne" />}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.25 }}
            className="relative"
          >
            {open ? <X className="h-6 w-6" strokeWidth={1.5} /> : <WhatsAppIcon className="h-6 w-6" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
