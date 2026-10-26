import type { MetadataRoute } from 'next';
import { postSummaries as posts } from '@/lib/data/posts';
import { projects } from '@/lib/data/projects';
import { postHref, projectHref, routes } from '@/lib/routes';
import { site } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [routes.home, routes.about, routes.portfolio, routes.services, routes.blog, routes.contact];

  return [
    ...staticRoutes.map((path) => ({
      url: `${site.url}${path}`,
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : 0.8,
    })),
    ...projects.map((project) => ({
      url: `${site.url}${projectHref(project.id)}`,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    ...posts.map((post) => ({
      url: `${site.url}${postHref(post.slug)}`,
      lastModified: post.date,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
  ];
}
