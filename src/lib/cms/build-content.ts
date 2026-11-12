import { postSummaries, type PostSummary } from '@/lib/data/posts';
import { projects, type Project } from '@/lib/data/projects';
import { cmsKeys } from './api';
import { snapshotFor } from './snapshot';

/**
 * The projects and articles the site is built with: the dashboard's, as saved just before the build
 * (see ./snapshot), or the built-in ones when the build has no dashboard content. The build uses them
 * for the pre-rendered pages, their titles and share cards, and the sitemap, so a project or article
 * added or renamed in the dashboard gets its own indexable page with the next build.
 */
export const buildProjects: Project[] = snapshotFor<Project[]>(cmsKeys.projects) ?? projects;

export const buildPosts: PostSummary[] = snapshotFor<PostSummary[]>(cmsKeys.posts) ?? postSummaries;
