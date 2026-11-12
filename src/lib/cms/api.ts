import type { Post, PostSummary } from '@/lib/data/posts';
import type { Project } from '@/lib/data/projects';
import type { ProcessStep, Service } from '@/lib/data/services';
import type { SiteSettings } from '@/lib/site';
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from '@/lib/supabase/config';
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
 *
 * They are plain requests to Supabase's REST API rather than supabase-js calls, so visitors don't
 * download and run the ~50 KB (gzipped) client just to read the content; it loads only for the
 * live-update connection, well after the page has settled (see CmsProvider).
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

/**
 * Rows from one table, via a PostgREST query string (e.g. "projects?select=*&is_published=eq.true").
 * Resolves to null when Supabase isn't configured; Row Level Security decides what the public key may read.
 */
async function rows<T>(query: string): Promise<T[] | null> {
  if (!isSupabaseConfigured) return null;
  const response = await fetch(`${supabaseUrl}/rest/v1/${query}`, {
    headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}`, Accept: 'application/json' },
  });
  if (!response.ok) {
    let message = `Supabase request failed (${response.status})`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // Not JSON — keep the status message.
    }
    throw new Error(message);
  }
  return (await response.json()) as T[];
}

/** The settings row also marks the CMS as initialised; `null` means "use the built-in site". */
export async function fetchSettings(): Promise<SiteSettings | null> {
  const row = (await rows<SettingsRow>('site_settings?select=*&id=eq.1'))?.[0];
  return row ? rowToSettings(row) : null;
}

export function fetchContent(): Promise<ContentRow[] | null> {
  return rows<ContentRow>('site_content?select=section,en,ar,media');
}

export async function fetchProjects(): Promise<Project[] | null> {
  const data = await rows<ProjectRow>('projects?select=*&is_published=eq.true&order=sort_order.asc,created_at.desc');
  return data?.map(rowToProject) ?? null;
}

export async function fetchPosts(): Promise<PostSummary[] | null> {
  const data = await rows<PostSummaryRow>(`blog_posts?select=${postSummaryColumns}&status=eq.published&order=published_at.desc`);
  return data?.map(rowToPostSummary) ?? null;
}

/** `false` means the article doesn't exist or isn't published (SWR reserves `undefined` for "not loaded yet"). */
export async function fetchPost(slug: string): Promise<Post | false | null> {
  const data = await rows<BlogPostRow>(`blog_posts?select=*&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`);
  if (!data) return null;
  return data[0] ? rowToPost(data[0]) : false;
}

export async function fetchServices(): Promise<Service[] | null> {
  const data = await rows<ServiceRow>('services?select=*&is_visible=eq.true&order=sort_order.asc');
  return data?.map(rowToService) ?? null;
}

export async function fetchSteps(): Promise<ProcessStep[] | null> {
  const data = await rows<ProcessStepRow>('process_steps?select=*&order=sort_order.asc');
  return data?.map(rowToStep) ?? null;
}
