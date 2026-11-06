'use client';

import { ProjectTile } from '@/components/portfolio/ProjectTile';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useProjects } from '@/lib/cms/hooks';
import { getFeaturedProjects } from '@/lib/data/projects';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';

export function PortfolioPreview() {
  const { t } = useLanguage();
  const projects = useProjects();
  const featuredProjects = getFeaturedProjects(projects);
  const copy = t.home.portfolio;

  return (
    <section className="section-y bg-linen">
      <div className="container-luxe">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow={copy.eyebrow} title={copy.title} body={copy.body} />
          <Reveal className="shrink-0">
            <ButtonLink href={routes.portfolio} variant="link-dark" arrow>
              {copy.cta}
            </ButtonLink>
          </Reveal>
        </div>

        {/* An asymmetric mosaic: the lead project runs the full height on large screens, the other two stack beside it. */}
        <div className="mt-12 grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-12 lg:grid-rows-2 lg:gap-5">
          {featuredProjects.map((project, index) => {
            const lead = index === 0;
            return (
              <Reveal
                key={project.id}
                delay={index * 0.12}
                className={cn(lead ? 'md:col-span-2 lg:col-span-7 lg:row-span-2' : 'lg:col-span-5')}
              >
                <ProjectTile
                  project={project}
                  index={index}
                  large={lead}
                  sizes={lead ? '(min-width: 1024px) 58vw, 100vw' : '(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw'}
                  className={cn('h-full', lead ? 'aspect-[16/10] md:aspect-[2/1] lg:aspect-auto' : 'aspect-[16/10] lg:aspect-[2/1]')}
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
