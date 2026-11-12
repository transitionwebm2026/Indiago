'use client';

import Image from 'next/image';
import { m } from 'framer-motion';
import { useEffect, useState, type ReactNode } from 'react';
import { socialIcons } from '@/components/icons/SocialIcons';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useProjects, useSite } from '@/lib/cms/hooks';
import type { HeroSlide } from '@/lib/data/heroes';
import { getProject } from '@/lib/data/projects';
import { img, isVideo } from '@/lib/images';
import { EASE, useEntranceAnimation } from '@/lib/motion';
import { cn } from '@/lib/utils';

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
  /**
   * The hero copy, set directly on the photographs. It is given the photograph on screen and every
   * slide's caption (written in the dashboard), so the headline can change with the photograph.
   */
  children: (active: number, captions: string[]) => ReactNode;
}

/**
 * The home page's full-screen hero: an auto-advancing slider of photographs. The copy sits straight
 * on the photographs over a soft Deep Indigo shade.
 */
export function HeroShell({ slides, children }: HeroShellProps) {
  const { t, l } = useLanguage();
  const projects = useProjects();
  const [index, setIndex] = useState(0);
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

  useEffect(() => {
    if (count < 2) return;
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % count), SLIDE_INTERVAL);
    return () => window.clearTimeout(timer);
  }, [index, count]);

  // A slide saved before captions were written by hand still names its project's sector.
  const captions = slides.map((slide) => {
    const written = slide.caption ? l(slide.caption).trim() : '';
    if (written) return written;
    const project = slide.projectId ? getProject(slide.projectId, projects) : undefined;
    return project ? t.categories[project.category] : '';
  });

  return (
    // Exactly one screen tall on every device; on phones the copy sits at the bottom of the photograph.
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-indigo text-ivory">
      <div role="region" aria-roledescription="carousel" aria-label={t.hero.slider} className="absolute inset-0 -z-10">
        {slides.map((slide, slideIndex) => {
          const active = slideIndex === index;
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
                  alt={captions[slideIndex]}
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
          {children(index, captions)}
        </m.div>
      </div>
    </section>
  );
}
