'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { socialIcons } from '@/components/icons/SocialIcons';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useProjects, useSite } from '@/lib/cms/hooks';
import type { HeroSlide } from '@/lib/data/heroes';
import { getProject } from '@/lib/data/projects';
import { img, isVideo } from '@/lib/images';
import { EASE } from '@/lib/motion';
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
    // On phones the rail centres in the photo strip left visible between the navbar and the overlapping card.
    // One frosted capsule keeps the label legible over any photograph.
    <nav
      aria-label={label}
      className="absolute right-4 top-[calc(50%+1rem)] z-20 flex -translate-y-1/2 flex-col items-center gap-2.5 rounded-full border border-champagne/30 bg-indigo/85 px-1 pb-1 pt-4 backdrop-blur-md sm:right-6 sm:gap-3 sm:px-1.5 sm:pb-1.5 sm:pt-5 md:top-1/2 lg:right-8"
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
  /** "full" fills the viewport (home); "page" is the shorter inner-page hero. */
  size?: 'full' | 'page';
  /** Show the current project's name in the slider controls. */
  showCaption?: boolean;
  /** Content of the rounded Deep Indigo card that sits over the photographs. */
  children: ReactNode;
}

/**
 * Hero with an auto-advancing slider of three clear, un-tinted project photographs.
 * Copy sits in a rounded card so it stays legible without dimming the images.
 */
export function HeroShell({ slides, size = 'page', showCaption = true, children }: HeroShellProps) {
  const { t, l } = useLanguage();
  const projects = useProjects();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const full = size === 'full';

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

  const controls = (className: string) => (
    <div
      className={cn(
        'flex items-center gap-3 rounded-full border border-ivory/15 bg-indigo/85 py-1.5 pe-1.5 ps-4 text-ivory backdrop-blur-md sm:gap-4 sm:ps-5',
        className,
      )}
    >
      {showCaption && current && (
        <Link href={projectHref(current.id)} className="min-w-0 flex-1 transition-colors hover:text-champagne">
          <span className="block truncate font-serif text-sm tracking-wide">{l(current.title)}</span>
          <span className="block truncate text-[0.58rem] font-medium uppercase tracking-luxe text-ivory/55">
            {l(current.location)}
          </span>
        </Link>
      )}
      {/* On the narrowest phones the dots alone show the position, leaving room for the project name. */}
      <span dir="ltr" className="shrink-0 text-[0.64rem] font-medium tabular-nums tracking-luxe text-ivory/70 max-[399px]:hidden">
        {pad(index + 1)} / {pad(count)}
      </span>
      <div dir="ltr" className="flex shrink-0 items-center gap-1.5">
        {slides.map((slide, slideIndex) => {
          const active = slideIndex === index;
          return (
            <button
              key={`${slide.image}-${slideIndex}`}
              type="button"
              onClick={() => setIndex(slideIndex)}
              aria-label={`${t.hero.goTo} ${slideIndex + 1}`}
              aria-current={active}
              className="relative h-7 w-6 min-[400px]:w-7 sm:w-9"
            >
              <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-ivory/25">
                {active && (
                  <motion.span
                    key={`${index}-${paused}`}
                    className="absolute inset-0 origin-left rounded-full bg-champagne"
                    initial={{ scaleX: paused ? 1 : 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: paused ? 0 : SLIDE_INTERVAL / 1000, ease: 'linear' }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? t.hero.play : t.hero.pause}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ivory/10 transition-colors hover:bg-champagne hover:text-indigo"
      >
        {paused ? (
          <Play aria-hidden className="h-3.5 w-3.5" strokeWidth={2} />
        ) : (
          <Pause aria-hidden className="h-3.5 w-3.5" strokeWidth={2} />
        )}
      </button>
    </div>
  );

  return (
    // The full hero is exactly one screen tall: on phones the photo takes whatever height the card leaves.
    <section
      className={cn(
        'relative isolate bg-ivory md:bg-indigo',
        full && 'flex h-[100svh] min-h-fit flex-col md:block md:h-auto md:min-h-0',
      )}
    >
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={t.hero.slider}
        className={cn(
          'relative overflow-hidden bg-indigo md:absolute md:inset-0 md:h-auto md:min-h-0',
          full ? 'min-h-[19rem] flex-1' : 'h-[52svh] min-h-[380px]',
        )}
      >
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
              ) : (
                <Image
                  src={img(slide.image, 2400)}
                  alt={project ? l(project.title) : ''}
                  fill
                  sizes="100vw"
                  priority={slideIndex === 0}
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
        {/* Stops short of the social rail on the right. */}
        {count > 1 && controls('absolute bottom-16 left-4 right-[3.75rem] sm:right-[4.5rem] md:hidden')}
        <SocialRail label={t.footer.follow} title={t.hero.follow} />
      </div>

      <div
        className={cn(
          'container-luxe relative z-10 -mt-12 pb-4 md:mt-0 md:flex md:items-end md:pb-10 md:pt-28',
          full ? 'md:min-h-[100svh]' : 'md:min-h-[86svh]',
        )}
      >
        {/* Right padding keeps the card and controls clear of the social rail. Card and controls
            only sit side by side from xl up; narrower, the controls drop below the card. */}
        <div className="flex w-full flex-col gap-5 md:gap-6 md:pr-16 lg:pr-20 xl:flex-row xl:items-end xl:justify-between xl:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.15 }}
            className={cn(
              'card-frame-dark rounded-[2rem] bg-indigo/95 p-6 text-ivory backdrop-blur-xl sm:p-10 lg:p-[clamp(2.25rem,5.5svh,3rem)]',
              full ? 'md:max-w-[46rem]' : 'md:max-w-[44rem]',
            )}
          >
            {children}
          </motion.div>
          {count > 1 && controls('hidden max-w-sm shrink-0 md:flex md:self-end xl:self-auto')}
        </div>
      </div>
    </section>
  );
}
