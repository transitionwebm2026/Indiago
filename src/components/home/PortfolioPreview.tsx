'use client';

import { ProjectCard } from '@/components/portfolio/ProjectCard';
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

        <div className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.12} className={cn(index === 1 && 'md:mt-20')}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
