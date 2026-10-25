'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
import { GridLines } from '@/components/ui/GridLines';
import { EASE } from '@/lib/motion';
import { primaryNav, routes } from '@/lib/routes';
import { site } from '@/lib/site';
import { cn, pad } from '@/lib/utils';
import { LanguageToggle } from './LanguageToggle';
import { Logo } from './Logo';

const normalize = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path);

export function Navbar() {
  const { t } = useLanguage();
  const pathname = usePathname() ?? '/';
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isActive = useCallback(
    (href: string) => {
      const current = normalize(pathname);
      const target = normalize(href);
      return target === '/' ? current === '/' : current === target || current.startsWith(`${target}/`);
    },
    [pathname],
  );

  const compact = scrolled || open;

  // The menu is a sibling of <header>: the nav bar's backdrop-filter would otherwise
  // become the containing block for the fixed overlay and clip it to the bar's height.
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-champagne focus:px-5 focus:py-2 focus:text-sm focus:text-indigo"
        >
          {t.nav.skipToContent}
        </a>

        <nav
          aria-label="Primary"
          className={cn(
            'mx-auto flex max-w-content items-center justify-between gap-3 rounded-full border border-champagne/15 pe-2 ps-4 backdrop-blur-xl transition-[height,background-color] duration-500 ease-luxe sm:gap-4 sm:ps-7',
            compact ? 'h-16 bg-indigo/95' : 'h-[68px] bg-indigo/90 md:h-[76px]',
          )}
        >
          <Link href={routes.home} aria-label="Indigo Interiors — Home" className="shrink-0">
            <Logo className="h-9 min-[360px]:h-10 md:h-11" />
          </Link>

          <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
            {primaryNav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative block py-2 text-[0.68rem] font-medium uppercase tracking-luxe transition-colors duration-300',
                      active ? 'text-champagne' : 'text-ivory/75 hover:text-ivory',
                    )}
                  >
                    {t.nav[item.key]}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-0 -bottom-0.5 h-px rounded-full bg-champagne"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <LanguageToggle id="header" />
            <ButtonLink href={routes.inquiry} size="sm" className="hidden md:inline-flex lg:hidden xl:inline-flex">
              {t.nav.cta}
            </ButtonLink>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-ivory/20 text-ivory transition-colors hover:border-champagne hover:text-champagne lg:hidden"
            >
              <span
                aria-hidden
                className={cn(
                  'absolute h-px w-[18px] bg-current transition-transform duration-500 ease-luxe',
                  open ? 'rotate-45' : '-translate-y-[4px]',
                )}
              />
              <span
                aria-hidden
                className={cn(
                  'absolute h-px w-[18px] bg-current transition-transform duration-500 ease-luxe',
                  open ? '-rotate-45' : 'translate-y-[4px]',
                )}
              />
            </button>
          </div>
        </nav>
      </header>
      <AnimatePresence>{open && <MobileMenu isActive={isActive} onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

function MobileMenu({ isActive, onClose }: { isActive: (href: string) => boolean; onClose: () => void }) {
  const { t } = useLanguage();

  return (
    <motion.div
      id="mobile-menu"
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-indigo pt-24 lg:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <GridLines />
      <nav aria-label="Mobile" className="container-luxe relative flex flex-1 flex-col">
        <ul className="border-t border-ivory/10">
          {primaryNav.map((item, index) => {
            const active = isActive(item.href);
            return (
              <motion.li
                key={item.key}
                className="border-b border-ivory/10"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + index * 0.06, duration: 0.6, ease: EASE }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? 'page' : undefined}
                  className="flex items-baseline justify-between py-4 font-serif text-[1.75rem] tracking-wide text-ivory min-[400px]:py-5 min-[400px]:text-3xl sm:text-4xl"
                >
                  <span className={cn(active && 'text-champagne')}>{t.nav[item.key]}</span>
                  <span className="font-sans text-[0.62rem] tracking-luxe text-ivory/40">{pad(index + 1)}</span>
                </Link>
              </motion.li>
            );
          })}
        </ul>

        <motion.div
          className="mt-auto space-y-6 pb-10 pt-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
        >
          <p className="max-w-xs text-sm leading-relaxed text-ivory/60">{t.nav.menuTagline}</p>
          <ButtonLink href={routes.inquiry} onClick={onClose} arrow className="w-full">
            {t.nav.cta}
          </ButtonLink>
          <div className="flex flex-col gap-2 text-sm text-ivory/70">
            <a href={site.phoneHref} dir="ltr" className="w-fit transition-colors hover:text-champagne">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="w-fit break-all transition-colors hover:text-champagne">
              {site.email}
            </a>
          </div>
        </motion.div>
      </nav>
    </motion.div>
  );
}
