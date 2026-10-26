'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { FilterBar, type FilterOption } from '@/components/ui/FilterBar';
import { Lightbox } from '@/components/ui/Lightbox';
import { useProjects } from '@/lib/cms/hooks';
import { projectCategories, type Project, type ProjectCategory } from '@/lib/data/projects';
import { EASE } from '@/lib/motion';
import { pad } from '@/lib/utils';
import { ProjectCard } from './ProjectCard';

type Filter = 'all' | ProjectCategory;

/** Section 2 of the portfolio page: category filter, project grid and quick-view galleries. */
export function PortfolioExplorer() {
  const { t, l } = useLanguage();
  const projects = useProjects();
  const [filter, setFilter] = useState<Filter>('all');
  const [gallery, setGallery] = useState<{ project: Project; index: number } | null>(null);

  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((project) => project.category === filter)),
    [filter, projects],
  );

  const options: FilterOption<Filter>[] = [
    { value: 'all', label: t.common.all, count: projects.length },
    ...projectCategories.map((category) => ({
      value: category,
      label: t.categories[category],
      count: projects.filter((project) => project.category === category).length,
    })),
  ];

  const galleryImages = gallery
    ? [gallery.project.cover, ...gallery.project.gallery].map((src, index) => ({
        src,
        alt: `${l(gallery.project.title)} — ${index + 1}`,
      }))
    : [];

  return (
    <section className="section-y bg-ivory">
      <div className="container-luxe">
        <div className="flex flex-col gap-6 border-b border-indigo/10 pb-8 md:flex-row md:items-center md:justify-between">
          <FilterBar id="portfolio-filter" label={t.portfolio.filterLabel} options={options} value={filter} onChange={setFilter} />
          <p className="text-[0.66rem] font-medium uppercase tracking-luxe text-charcoal-muted" aria-live="polite">
            {pad(visible.length)} {t.portfolio.countLabel}
          </p>
        </div>

        {/* Flex rather than grid so an incomplete last row sits centred. */}
        <motion.div layout className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-16">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="w-full sm:w-[calc((100%_-_2rem)/2)] lg:w-[calc((100%_-_4rem)/3)]"
              >
                <ProjectCard project={project} onOpenGallery={() => setGallery({ project, index: 0 })} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {visible.length === 0 && <p className="mt-14 text-center text-charcoal-soft">{t.portfolio.empty}</p>}
      </div>

      <Lightbox
        images={galleryImages}
        index={gallery?.index ?? null}
        onClose={() => setGallery(null)}
        onIndexChange={(index) => setGallery((current) => (current ? { ...current, index } : current))}
      />
    </section>
  );
}
