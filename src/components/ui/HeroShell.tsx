'use client';

import Image from 'next/image';
import { m } from 'framer-motion';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { socialIcons } from '@/components/icons/SocialIcons';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Link } from '@/components/ui/Link';
import { useProjects, useSite } from '@/lib/cms/hooks';
import type { HeroSlide } from '@/lib/data/heroes';
import { getProject } from '@/lib/data/projects';
import { img, isVideo } from '@/lib/images';
import { EASE, useEntranceAnimation } from '@/lib/motion';
import { projectHref } from '@/lib/routes';
import { cn, pad } from '@/lib/utils';

/** Time each project photograph stays on screen. */
export const SLIDE_INTERVAL = 3000;

/** The studio's social profiles under a "Follow us" label, pinned to the hero's right edge in both languages. */
function SocialRail({ label, title }: { label: string; title: string }) {
  const { site } = useSite();
  const profiles = site.social.filter((social) => social.visible);
  if (profiles.length === 0) return null;

  return (
    // On phones the rail sits below the menu button (lined up under it in English), clear of the copy at the bottom of the photo.
    // One frosted capsule keeps the label legible over any photograph.
    <nav
      aria-label={label}
      className="absolute right-4 top-28 z-20 flex flex-col items-center gap-2.5 rounded-full border border-champagne/30 bg-indigo/85 px-1 pb-1 pt-4 backdrop-blur-md sm:right-6 sm:gap-3 sm:px-1.5 sm:pb-1.5 sm:pt-5 md:top-1/2 md:-translate-y-1/2 lg:right-8"
    >
      {/* Arabic is turned the other way so it, too, reads downwards towards the icons. */}
      <span className="text-[0.62rem] font-medium uppercase tracking-luxe text-champagne [writing-mode:vertical-rl] rtl:rotate-180">
        {title}
      </span>
      <span aria-hidden className="h-px w-4 bg-champagne/40" />
      <ul className="flex flex-col gap-1 sm:gap-1.5">
        {profiles.map((social) => {
          const Icon = socialIcons[social.id];
          return (
            <li key={social.id}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="grid h-9 w-9 place-items-center rounded-full bg-ivory/10 text-ivory transition-colors duration-300 hover:bg-champagne hover:text-indigo sm:h-11 sm:w-11"
              >
                <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

interface HeroShellProps {
  slides: HeroSlide[];
  /** The hero copy, set directly on the photographs. */
  children: ReactNode;
}

/**
 * The home page's full-screen hero: an auto-advancing slider with one project photograph per sector
 * the studio serves. The copy sits straight on the photographs over a soft Deep Indigo shade, and a
 * row of sector tabs along the bottom names each slide's sector and shows its progress.
 */
export function HeroShell({ slides, children }: HeroShellProps) {
  const { t, l } = useLanguage();
  const projects = useProjects();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Later photographs load only after the page has, so they never compete with the first one.
  const [loadRest, setLoadRest] = useState(false);
  const animate = useEntranceAnimation();
  const count = slides.length;

  useEffect(() => {
    const load = () => setLoadRest(true);
    if (document.readyState === 'complete') {
      load();
      return;
    }
    window.addEventListener('load', load, { once: true });
    return () => window.removeEventListener('load', load);
  }, []);

  // Slides edited in the CMS can shrink the list under the current position.
  useEffect(() => {
    if (index >= count && count > 0) setIndex(0);
  }, [index, count]);

  // Restarting the timer on every index change also resets it after a manual jump.
  useEffect(() => {
    if (paused || count < 2) return;
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % count), SLIDE_INTERVAL);
    return () => window.clearTimeout(timer);
  }, [index, paused, count]);

  const current = getProject(slides[index]?.projectId ?? '', projects);

  return (
    // Exactly one screen tall on every device; the copy and the sector tabs share the bottom of the photograph.
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-indigo text-ivory">
      <div role="region" aria-roledescription="carousel" aria-label={t.hero.slider} className="absolute inset-0 -z-10">
        {slides.map((slide, slideIndex) => {
          const active = slideIndex === index;
          const project = getProject(slide.projectId, projects);
          return (
            <div
              key={`${slide.image}-${slideIndex}`}
              aria-hidden={!active}
              className="absolute inset-0 transition-opacity duration-1200 ease-in-out"
              style={{ opacity: active ? 1 : 0 }}
            >
              {isVideo(slide.image) ? (
                <video
                  src={slide.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload={slideIndex === 0 ? 'auto' : 'metadata'}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (slideIndex === 0 || loadRest) && (
                <Image
                  src={img(slide.image, 2400)}
                  alt={project ? `${t.categories[project.category]} — ${l(project.title)}` : ''}
                  fill
                  sizes="100vw"
                  priority={slideIndex === 0}
                  fetchPriority={slideIndex === 0 ? 'high' : 'low'}
                  loading={slideIndex === 0 ? undefined : 'eager'}
                  className={cn(
                    'object-cover transition-transform ease-out motion-reduce:transition-none',
                    active ? 'motion-safe:scale-[1.06]' : 'scale-100',
                  )}
                  style={{ transitionDuration: active ? '4500ms' : '1200ms' }}
                />
              )}
            </div>
          );
        })}
        {/* A light shade only behind the copy (the bottom on phones, the reading side from md up) that
            fades out well before the far side, so the rest of the photograph shows at full brightness. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-indigo-950/75 via-indigo-950/25 via-40% to-transparent to-70% md:bg-gradient-to-r md:from-indigo-950/60 md:via-indigo-950/20 md:via-35% md:to-transparent md:to-60% rtl:md:bg-gradient-to-l"
        />
      </div>

      <SocialRail label={t.footer.follow} title={t.hero.follow} />

      {/* Right padding keeps the copy clear of the social rail (on the right in both languages). */}
      <div className="container-luxe relative flex flex-1 flex-col justify-end pb-8 pt-32 md:justify-center md:pb-12 md:pt-36">
        <m.div
          initial={animate ? { opacity: 0, y: 32 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
          className="max-w-2xl pr-14 sm:pr-16 md:pr-0 rtl:md:pr-20 lg:max-w-3xl rtl:lg:pr-24"
        >
          {children}
        </m.div>
      </div>

      {count > 1 && (
        <div className="container-luxe relative pb-6 md:pb-8">
          {/* Right padding keeps the tabs clear of the social rail and, on phones, of the fixed call/WhatsApp buttons. */}
          <div className="flex items-end gap-4 pr-16 sm:gap-6 lg:pr-20">
            <div role="group" aria-label={t.hero.sectors} className="grid flex-1 grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4 sm:gap-x-6">
              {slides.map((slide, slideIndex) => {
                const active = slideIndex === index;
                const project = getProject(slide.projectId, projects);
                const sector = project ? t.categories[project.category] : pad(slideIndex + 1);
                return (
                  <button
                    key={`${slide.image}-${slideIndex}`}
                    type="button"
                    onClick={() => setIndex(slideIndex)}
                    aria-label={`${t.hero.goTo} ${slideIndex + 1}: ${sector}`}
                    aria-current={active}
                    className="group relative min-w-0 pb-1 pt-4 text-start"
                  >
                    <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] overflow-hidden rounded-full bg-ivory/25">
                      {active && (
                        <m.span
                          key={`${index}-${paused}`}
                          className="absolute inset-0 origin-left rounded-full bg-champagne rtl:origin-right"
                          initial={{ scaleX: paused ? 1 : 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: paused ? 0 : SLIDE_INTERVAL / 1000, ease: 'linear' }}
                        />
                      )}
                    </span>
                    <span
                      className={cn(
                        'block truncate text-[0.64rem] font-medium uppercase tracking-luxe transition-colors duration-300 [text-shadow:0_1px_10px_rgba(23,18,44,0.6)]',
                        active ? 'text-champagne' : 'text-ivory/80 group-hover:text-ivory',
                      )}
                    >
                      {sector}
                    </span>
                  </button>
                );
              })}
            </div>

            {current && (
              <Link
                href={projectHref(current.id)}
                className="hidden shrink-0 items-center gap-2 pb-1 text-[0.62rem] font-medium uppercase tracking-luxe text-ivory/80 transition-colors hover:text-champagne lg:inline-flex"
              >
                {t.common.viewProject}
                <ArrowRight aria-hidden className="h-3.5 w-3.5 rtl:-scale-x-100" strokeWidth={1.5} />
              </Link>
            )}
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? t.hero.play : t.hero.pause}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ivory/25 text-ivory transition-colors hover:border-champagne hover:bg-champagne hover:text-indigo"
            >
              {paused ? (
                <Play aria-hidden className="h-3.5 w-3.5" strokeWidth={2} />
              ) : (
                <Pause aria-hidden className="h-3.5 w-3.5" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
