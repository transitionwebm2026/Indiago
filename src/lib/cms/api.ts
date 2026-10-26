import type { Post, PostSummary } from '@/lib/data/posts';
import type { Project } from '@/lib/data/projects';
import type { ProcessStep, Service } from '@/lib/data/services';
import type { SiteSettings } from '@/lib/site';
import { loadSupabase } from '@/lib/supabase/config';
import {
  postSummaryColumns,
  rowToPost,
  rowToPostSummary,
  rowToProject,
  rowToService,
  rowToSettings,
  rowToStep,
  type PostSummaryRow,
} from './mappers';
import type { BlogPostRow, ContentRow, ProcessStepRow, ProjectRow, ServiceRow, SettingsRow } from './types';

/**
 * Public reads for the website. Each returns null when Supabase isn't configured and
 * throws on network/database errors, so SWR keeps showing the last good content.
 */

/** SWR keys. Only keys starting with "cms:" are cached in the visitor's browser. */
export const cmsKeys = {
  settings: 'cms:settings',
  content: 'cms:content',
  projects: 'cms:projects',
  posts: 'cms:posts',
  post: (slug: string) => `cms:post:${slug}`,
  services: 'cms:services',
  steps: 'cms:steps',
} as const;

type Result<T> = { data: T | null; error: { message: string } | null };

async function run<T>(query: PromiseLike<Result<T>>): Promise<T | null> {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

/** The settings row also marks the CMS as initialised; `null` means "use the built-in site". */
export async function fetchSettings(): Promise<SiteSettings | null> {
  const supabase = await loadSupabase();
  if (!supabase) return null;
  const row = await run<SettingsRow>(supabase.from('site_settings').select('*').eq('id', 1).maybeSingle());
  return row ? rowToSettings(row) : null;
}

export async function fetchContent(): Promise<ContentRow[] | null> {
  const supabase = await loadSupabase();
  if (!supabase) return null;
  return run<ContentRow[]>(supabase.from('site_content').select('section,en,ar,media'));
}

export async function fetchProjects(): Promise<Project[] | null> {
  const supabase = await loadSupabase();
  if (!supabase) return null;
  const rows = await run<ProjectRow[]>(
    supabase.from('projects').select('*').eq('is_published', true).order('sort_order').order('created_at', { ascending: false }),
  );
  return rows?.map(rowToProject) ?? null;
}

export async function fetchPosts(): Promise<PostSummary[] | null> {
  const supabase = await loadSupabase();
  if (!supabase) return null;
  const rows = await run<PostSummaryRow[]>(
    supabase.from('blog_posts').select(postSummaryColumns).eq('status', 'published').order('published_at', { ascending: false }),
  );
  return rows?.map(rowToPostSummary) ?? null;
}

/** `false` means the article doesn't exist or isn't published (SWR reserves `undefined` for "not loaded yet"). */
export async function fetchPost(slug: string): Promise<Post | false | null> {
  const supabase = await loadSupabase();
  if (!supabase) return null;
  const row = await run<BlogPostRow>(supabase.from('blog_posts').select('*').eq('slug', slug).eq('status', 'published').maybeSingle());
  return row ? rowToPost(row) : false;
}

export async function fetchServices(): Promise<Service[] | null> {
  const supabase = await loadSupabase();
  if (!supabase) return null;
  const rows = await run<ServiceRow[]>(supabase.from('services').select('*').eq('is_visible', true).order('sort_order'));
  return rows?.map(rowToService) ?? null;
}

export async function fetchSteps(): Promise<ProcessStep[] | null> {
  const supabase = await loadSupabase();
  if (!supabase) return null;
  const rows = await run<ProcessStepRow[]>(supabase.from('process_steps').select('*').order('sort_order'));
  return rows?.map(rowToStep) ?? null;
}
