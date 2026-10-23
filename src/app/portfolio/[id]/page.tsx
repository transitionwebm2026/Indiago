import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectDetail } from '@/components/portfolio/ProjectDetail';
import { getNextProject, getProject, projects } from '@/lib/data/projects';
import { img } from '@/lib/images';
import { projectHref } from '@/lib/routes';

type Params = Promise<{ id: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id);
  if (!project) return {};
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
  const project = getProject(id);
  if (!project) notFound();

  return <ProjectDetail project={project} next={getNextProject(id)} />;
}
