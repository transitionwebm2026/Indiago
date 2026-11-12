'use client';

import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState, type FocusEvent, type ReactNode } from 'react';
import { socialIcons } from '@/components/icons/SocialIcons';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
import { Link } from '@/components/ui/Link';
import { useSite, useSiteSettings } from '@/lib/cms/hooks';
import { EASE } from '@/lib/motion';
import { canPrefetch } from '@/lib/prefetch';
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

/** Three thin, equal lines that fold into a cross while the menu is open. */
function MenuIcon({ open }: { open: boolean }) {
  const line = 'absolute inset-x-0 h-[1.5px] rounded-full bg-current transition-[transform,opacity] duration-500 ease-luxe';
  return (
    <span aria-hidden className="relative block h-[13px] w-[26px]">
      <span className={cn(line, 'top-0', open && 'translate-y-[5.75px] rotate-45')} />
      <span className={cn(line, 'top-[5.75px]', open && 'opacity-0')} />
      <span className={cn(line, 'bottom-0', open && '-translate-y-[5.75px] -rotate-45')} />
    </span>
  );
}

/** "light" draws the bar in Champagne and Ivory for dark surfaces; "dark" draws it in Deep Indigo for light ones. */
type Tone = 'light' | 'dark';

/**
 * Reads the first solid background under the middle of the bar. Photographs sit on dark sections
 * (the hero is Deep Indigo underneath), so they count as dark surfaces.
 */
function surfaceTone(bar: HTMLElement): Tone {
  const under = document.elementsFromPoint(window.innerWidth / 2, bar.offsetHeight / 2).find((el) => !bar.contains(el));
  for (let el: Element | null = under ?? null; el; el = el.parentElement) {
    const [r = 0, g = 0, b = 0, a = 1] = getComputedStyle(el).backgroundColor.match(/[\d.]+/g)?.map(Number) ?? [];
    if (a < 0.5) continue;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 140 ? 'light' : 'dark';
  }
  return 'dark'; // The page itself is Ivory.
}

/**
 * The logo in its own Champagne on the bar's Deep Indigo background, and recoloured through a mask
 * elsewhere: Ivory straight on a photograph, Deep Indigo on a light surface. A logo uploaded as a
 * JPEG has no transparency to mask, so it is always shown as it is.
 */
function BarLogo({ color }: { color: 'champagne' | 'ivory' | 'indigo' }) {
  const { logo } = useSiteSettings();
  const src = logo || '/logo.png';
  const tintable = !/\.jpe?g(\?|$)/i.test(src);
  const tinted = tintable && color !== 'champagne';
  const mask = `url("${src}") center / contain no-repeat`;

  return (
    <span className="relative block">
      <Logo className={cn('h-10 transition-opacity duration-500 sm:h-11 lg:h-12', tinted && 'opacity-0')} />
      {tintable && (
        <span
          aria-hidden
          className={cn(
            'absolute inset-0 transition-[opacity,background-color] duration-500',
            color === 'indigo' ? 'bg-indigo' : 'bg-ivory',
            tinted ? 'opacity-100' : 'opacity-0',
          )}
          style={{ WebkitMask: mask, mask }}
        />
      )}
    </span>
  );
}

/**
 * The site's only navigation, a bar fixed to the top of the page: the logo at the start (centred
 * from lg up) and three thin lines at the end, straight on the page with no background at the top.
 * Its colours follow the surface underneath; once the page scrolls it takes a frosted background,
 * steps out of the way while scrolling down and comes back on the way up. The lines drop a panel
 * down with the page links, the language switch, the consultation button and the contact details.
 */
export function SiteMenu() {
  const { t, l } = useLanguage();
  const { site } = useSite();
  const links = site.nav.filter((link) => link.visible);
  const socials = site.social.filter((social) => social.visible);
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const panelId = useId();
  // Before the first measurement: the home page opens on its dark hero, every other page on Ivory.
  const [tone, setTone] = useState<Tone>(pathname === '/' ? 'light' : 'dark');
  const [scrolled, setScrolled] = useState(false);
  const [tucked, setTucked] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => setOpen(false), [pathname]);

  // The menu's pages sit in a closed panel, out of view, so their links can't fetch them as they
  // appear. Fetch them once the current page has loaded, in idle time, so any choice in the menu
  // (and the consultation button) opens at once.
  const router = useRouter();
  const pages = [...links.map((link) => link.href), routes.inquiry]
    .filter((href) => href.startsWith('/'))
    .map((href) => href.split('#')[0])
    .join(' ');
  useEffect(() => {
    if (!canPrefetch()) return;
    let timer = 0;
    const run = () => {
      for (const href of new Set(pages.split(' '))) router.prefetch(href);
    };
    const schedule = () => {
      timer = window.setTimeout(() => {
        if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(run, { timeout: 3000 });
        else run();
      }, 1500);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('load', schedule);
    };
  }, [pages, router]);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - lastY) > 6) {
        setTucked(y > lastY && y > 120);
        lastY = y;
      }
      if (barRef.current) setTone(surfaceTone(barRef.current));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    // Sections fading in after a route change can change the surface without a scroll.
    const settle = window.setTimeout(update, 600);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [pathname]);

  // With the panel open the bar is always the Deep Indigo one, above the dimmed page.
  const light = open || tone === 'light';
  const solid = open || scrolled;

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
  const onBlur = (event: FocusEvent<HTMLElement>) => {
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

      <header
        ref={barRef}
        onBlur={onBlur}
        className={cn(
          'fixed inset-x-0 top-0 z-[70] transition-[transform,background-color,box-shadow] duration-500 ease-luxe focus-within:translate-y-0',
          tucked && !open && '-translate-y-full',
          // At the top of the page the bar is only its logo and lines, so clicks pass through the space between them.
          solid ? 'backdrop-blur-md' : 'pointer-events-none',
          solid && (light ? 'bg-indigo/90 shadow-[0_14px_34px_-18px_rgba(23,18,44,0.7)]' : 'bg-ivory/90 shadow-[0_10px_30px_-20px_rgba(23,18,44,0.45)]'),
        )}
      >
        <div className="relative flex h-20 items-center justify-between px-6 sm:h-24 sm:px-8 lg:px-12">
          <Link
            href={routes.home}
            onClick={close}
            aria-label={`${site.name} — ${t.nav.home}`}
            className={cn(
              'pointer-events-auto shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2',
              light && !solid && 'drop-shadow-[0_1px_10px_rgba(23,18,44,0.45)]',
            )}
          >
            <BarLogo color={!light ? 'indigo' : solid ? 'champagne' : 'ivory'} />
          </Link>

          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            className={cn(
              'pointer-events-auto -me-2.5 ms-auto grid h-11 w-11 place-items-center transition-colors duration-300',
              open
                ? 'text-champagne'
                : light
                  ? 'text-ivory drop-shadow-[0_1px_8px_rgba(23,18,44,0.5)] hover:text-champagne'
                  : 'text-indigo hover:text-champagne-700',
            )}
          >
            <MenuIcon open={open} />
          </button>
        </div>

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
              className="absolute end-4 top-full isolate mt-2 w-[min(23rem,calc(100vw-2rem))] overflow-hidden rounded-[1.75rem] border border-champagne/25 bg-indigo text-ivory shadow-[0_30px_70px_-24px_rgba(23,18,44,0.85)] sm:end-6 lg:end-8"
            >
              {/* Two fine arcs in the corner, the same motif as the page headers and the closing banner. */}
              <div aria-hidden className="pointer-events-none absolute -end-28 -top-28 -z-10 h-72 w-72 rounded-full border border-champagne/15" />
              <div aria-hidden className="pointer-events-none absolute -end-14 -top-14 -z-10 h-72 w-72 rounded-full border border-champagne/10" />

              <div className="max-h-[calc(100svh-6.5rem)] overflow-y-auto overscroll-contain p-5 sm:max-h-[calc(100svh-8.5rem)] sm:p-6">
                {/* The logo already sits in the bar right above, so the panel opens on the language switch. */}
                <div className="flex items-center justify-end border-b border-ivory/10 pb-5">
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
      </header>
    </>
  );
}
