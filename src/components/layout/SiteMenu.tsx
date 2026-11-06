'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState, type FocusEvent, type ReactNode } from 'react';
import { socialIcons } from '@/components/icons/SocialIcons';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
import { Link } from '@/components/ui/Link';
import { useSite } from '@/lib/cms/hooks';
import { EASE } from '@/lib/motion';
import { routes } from '@/lib/routes';
import type { NavLink } from '@/lib/site';
import { cn, pad } from '@/lib/utils';
import { LanguageToggle } from './LanguageToggle';
import { Logo } from './Logo';

const normalize = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path);

interface NavAnchorProps {
  link: NavLink;
  active: boolean;
  className: string;
  onClick?: () => void;
  children: ReactNode;
}

/** Site pages use client navigation; links added in the CMS to other sites open in a new tab. */
function NavAnchor({ link, active, className, onClick, children }: NavAnchorProps) {
  if (/^(https?:|mailto:|tel:)/.test(link.href)) {
    const newTab = link.href.startsWith('http');
    return (
      <a href={link.href} onClick={onClick} className={className} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    );
  }
  return (
    <Link href={link.href} onClick={onClick} aria-current={active ? 'page' : undefined} className={className}>
      {children}
    </Link>
  );
}

/** Three lines that fold into a cross while the menu is open; the shorter middle line stretches on hover. */
function MenuIcon({ open }: { open: boolean }) {
  const line = 'absolute h-[1.5px] rounded-full bg-current transition-[transform,opacity,width] duration-500 ease-luxe';
  return (
    <span aria-hidden className="relative block h-[14px] w-5">
      <span className={cn(line, 'inset-x-0 top-0', open && 'translate-y-[6.25px] rotate-45')} />
      <span className={cn(line, 'end-0 top-[6.25px] w-3 group-hover:w-5', open && 'w-5 opacity-0')} />
      <span className={cn(line, 'inset-x-0 bottom-0', open && '-translate-y-[6.25px] -rotate-45')} />
    </span>
  );
}

/**
 * The site's only navigation: a round button fixed to the top corner on the reading end (right in
 * English, left in Arabic). Pressing it drops a panel down beneath it with the page links, the
 * language switch, the consultation button and the studio's contact details.
 */
export function SiteMenu() {
  const { t, l } = useLanguage();
  const { site } = useSite();
  const links = site.nav.filter((link) => link.visible);
  const socials = site.social.filter((social) => social.visible);
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => setOpen(false), [pathname]);

  // While the panel is open the page behind it stays still. The scrollbar's space stays reserved, so
  // neither the page nor this button jumps sideways. Escape closes it and hands focus back to the button.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = { overflow: root.style.overflow, gutter: root.style.scrollbarGutter };
    root.style.scrollbarGutter = 'stable';
    root.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = previous.overflow;
      root.style.scrollbarGutter = previous.gutter;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Tabbing past the last item in the panel closes it, so keyboard focus never hides behind the backdrop.
  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && !event.currentTarget.contains(next)) setOpen(false);
  };

  const isActive = useCallback(
    (href: string) => {
      if (!href.startsWith('/')) return false;
      const current = normalize(pathname);
      const target = normalize(href.split('#')[0]);
      return target === '/' ? current === '/' : current === target || current.startsWith(`${target}/`);
    },
    [pathname],
  );

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-champagne focus:px-5 focus:py-2 focus:text-sm focus:text-indigo"
      >
        {t.nav.skipToContent}
      </a>

      <AnimatePresence>
        {open && (
          <m.div
            key="menu-backdrop"
            aria-hidden
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-0 z-[65] bg-indigo-950/45 backdrop-blur-[3px]"
          />
        )}
      </AnimatePresence>

      <div
        onBlur={onBlur}
        className="fixed end-4 top-4 z-[70] flex flex-col items-end gap-3 sm:end-6 sm:top-6 lg:end-8 lg:top-8"
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          className={cn(
            'group grid h-12 w-12 place-items-center rounded-full border bg-indigo/90 shadow-[0_14px_34px_-14px_rgba(23,18,44,0.75)] backdrop-blur-md transition-colors duration-300 sm:h-14 sm:w-14',
            open ? 'border-champagne text-champagne' : 'border-champagne/40 text-ivory hover:border-champagne hover:text-champagne',
          )}
        >
          <MenuIcon open={open} />
        </button>

        <AnimatePresence>
          {open && (
            <m.div
              key="menu-panel"
              id={panelId}
              // The panel unrolls from the top edge; the clip is lifted once it is open so the shadow shows.
              initial={{ opacity: 0, y: -6, clipPath: 'inset(0% 0% 100% 0% round 1.75rem)' }}
              animate={{
                opacity: 1,
                y: 0,
                clipPath: 'inset(0% 0% 0% 0% round 1.75rem)',
                transitionEnd: { clipPath: 'none' },
              }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.25, ease: EASE } }}
              transition={{ duration: 0.55, ease: EASE }}
              className="relative isolate w-[min(23rem,calc(100vw-2rem))] overflow-hidden rounded-[1.75rem] border border-champagne/25 bg-indigo text-ivory shadow-[0_30px_70px_-24px_rgba(23,18,44,0.85)]"
            >
              {/* Two fine arcs in the corner, the same motif as the page headers and the closing banner. */}
              <div aria-hidden className="pointer-events-none absolute -end-28 -top-28 -z-10 h-72 w-72 rounded-full border border-champagne/15" />
              <div aria-hidden className="pointer-events-none absolute -end-14 -top-14 -z-10 h-72 w-72 rounded-full border border-champagne/10" />

              <div className="max-h-[calc(100svh-6.5rem)] overflow-y-auto overscroll-contain p-5 sm:max-h-[calc(100svh-8.5rem)] sm:p-6">
                <div className="flex items-center justify-between gap-4 border-b border-ivory/10 pb-5">
                  <Link href={routes.home} onClick={close} aria-label={`${site.name} — ${t.nav.home}`} className="shrink-0">
                    <Logo className="h-9" />
                  </Link>
                  <LanguageToggle id="menu" />
                </div>

                <nav aria-label="Primary" className="py-3">
                  <ul>
                    {links.map((link, index) => {
                      const active = isActive(link.href);
                      return (
                        <m.li
                          key={link.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.05, duration: 0.5, ease: EASE }}
                        >
                          <NavAnchor
                            link={link}
                            active={active}
                            onClick={close}
                            className="group/link -mx-2 flex items-center gap-4 rounded-2xl px-2 py-2.5 transition-colors duration-300 hover:bg-ivory/[0.06]"
                          >
                            <span className="w-6 shrink-0 text-[0.62rem] font-medium tracking-luxe text-champagne/60">{pad(index + 1)}</span>
                            <span
                              className={cn(
                                'flex-1 font-serif text-[1.45rem] leading-tight tracking-wide transition-colors duration-300',
                                active ? 'text-champagne' : 'text-ivory group-hover/link:text-champagne',
                              )}
                            >
                              {l(link.label)}
                            </span>
                            {active ? (
                              <span aria-hidden className="me-1.5 h-1.5 w-1.5 rotate-45 bg-champagne" />
                            ) : (
                              <ArrowRight
                                aria-hidden
                                strokeWidth={1.5}
                                className="h-4 w-4 text-champagne opacity-0 transition-opacity duration-300 group-hover/link:opacity-100 rtl:-scale-x-100"
                              />
                            )}
                          </NavAnchor>
                        </m.li>
                      );
                    })}
                  </ul>
                </nav>

                <m.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + links.length * 0.05, duration: 0.5, ease: EASE }}
                  className="space-y-5 border-t border-ivory/10 pt-5"
                >
                  {site.showNavCta && (
                    <ButtonLink href={routes.inquiry} onClick={close} arrow className="w-full">
                      {t.nav.cta}
                    </ButtonLink>
                  )}

                  {(site.phone || site.email) && (
                    <div className="flex flex-col gap-1.5 text-sm text-ivory/70">
                      {site.phone && (
                        <a href={site.phoneHref} dir="ltr" className="w-fit transition-colors hover:text-champagne">
                          {site.phone}
                        </a>
                      )}
                      {site.email && (
                        <a href={`mailto:${site.email}`} className="w-fit break-all transition-colors hover:text-champagne">
                          {site.email}
                        </a>
                      )}
                    </div>
                  )}

                  {socials.length > 0 && (
                    <ul aria-label={t.footer.follow} className="flex flex-wrap gap-2">
                      {socials.map((social) => {
                        const Icon = socialIcons[social.id];
                        return (
                          <li key={social.id}>
                            <a
                              href={social.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={social.label}
                              className="grid h-9 w-9 place-items-center rounded-full border border-ivory/15 text-ivory/70 transition-colors duration-300 hover:border-champagne hover:text-champagne"
                            >
                              <Icon className="h-4 w-4" />
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </m.div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
