import type { MetadataRoute } from 'next';
import { buildPosts, buildProjects } from '@/lib/cms/build-content';
import { postHref, projectHref, routes } from '@/lib/routes';
import { site } from '@/lib/site';

export const dynamic = 'force-static';

/** Every public page, with the projects and articles as the dashboard had them at build time. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [routes.home, routes.about, routes.portfolio, routes.services, routes.blog, routes.contact];

  return [
    ...staticRoutes.map((path) => ({
      url: `${site.url}${path}`,
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : 0.8,
    })),
    ...buildProjects.map((project) => ({
      url: `${site.url}${projectHref(project.id)}`,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    ...buildPosts.map((post) => ({
      url: `${site.url}${postHref(post.slug)}`,
      lastModified: post.date || undefined,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
  ];
}
