import type { Metadata } from 'next';
import { ProjectRoute } from '@/components/portfolio/ProjectRoute';
import { getProject, projects } from '@/lib/data/projects';
import { img } from '@/lib/images';
import { projectHref, SHELL_SLUG } from '@/lib/routes';

type Params = Promise<{ id: string }>;

export const dynamicParams = false;

/** One page per built-in project, plus the shell that serves projects added in the CMS later. */
export function generateStaticParams() {
  return [...projects.map((project) => ({ id: project.id })), { id: SHELL_SLUG }];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id);
  if (!project) return { title: 'Project', robots: { index: false } };
  return {
    title: `${project.title.en} — ${project.location.en}`,
    description: project.summary.en,
    alternates: { canonical: projectHref(project.id) },
    openGraph: {
      title: `${project.title.en} · Indigo Interiors`,
      description: project.summary.en,
      images: [{ url: img(project.cover, 1200), alt: project.title.en }],
    },
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { id } = await params;
  return <ProjectRoute slug={id} />;
}
