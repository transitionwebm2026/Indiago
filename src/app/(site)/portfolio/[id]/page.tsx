import type { Metadata } from 'next';
import { ProjectRoute } from '@/components/portfolio/ProjectRoute';
import { buildProjects } from '@/lib/cms/build-content';
import { getProject } from '@/lib/data/projects';
import { img } from '@/lib/images';
import { projectHref, SHELL_SLUG } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

type Params = Promise<{ id: string }>;

export const dynamicParams = false;

/** One page per project (the dashboard's at build time), plus the shell that serves projects added in the CMS later. */
export function generateStaticParams() {
  return [...buildProjects.map((project) => ({ id: project.id })), { id: SHELL_SLUG }];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id, buildProjects);
  if (!project) return { title: 'Project', robots: { index: false } };
  return pageMetadata({
    title: `${project.title.en} — ${project.location.en}`,
    description: project.summary.en,
    path: projectHref(project.id),
    image: project.cover ? { url: img(project.cover, 1200), alt: project.title.en } : undefined,
  });
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { id } = await params;
  return <ProjectRoute slug={id} />;
}
