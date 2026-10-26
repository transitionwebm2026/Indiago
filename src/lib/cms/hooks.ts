'use client';

import { useMemo, useSyncExternalStore } from 'react';
import useSWR from 'swr';
import { buildAuthors, posts as builtInPosts, toSummary, type Post, type PostSummary } from '@/lib/data/posts';
import { projects as builtInProjects, type Project } from '@/lib/data/projects';
import { processSteps as builtInSteps, services as builtInServices, type ProcessStep, type Service } from '@/lib/data/services';
import { buildWhatsappLink, defaultSiteSettings, resolveSite, type SiteSettings } from '@/lib/site';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { cmsKeys, fetchContent, fetchPost, fetchPosts, fetchProjects, fetchServices, fetchSettings, fetchSteps } from './api';
import { buildMedia } from './content';
import type { MediaMap, MediaSection } from './sections';
import type { ContentRow } from './types';

/**
 * Client hooks that hydrate the static pages with live CMS content.
 *
 * Every page is pre-rendered with the built-in content, and the first client render
 * matches it exactly. Straight after hydration these hooks switch to the content
 * cached from the visitor's last visit, then to fresh data from Supabase — and
 * Realtime (see CmsProvider) refreshes it whenever the studio saves a change.
 */

const builtInSummaries: PostSummary[] = builtInPosts.map(toSummary);

const noopSubscribe = () => () => {};

/** False while React hydrates the static HTML, true from then on (and for client navigations). */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

function useCmsData<T>(key: string | null, fetcher: () => Promise<T | null>) {
  const hydrated = useHydrated();
  const active = hydrated && isSupabaseConfigured && key !== null;
  const { data, error } = useSWR<T | null>(active ? key : null, fetcher);
  return {
    data: active ? data : undefined,
    /** No answer yet: not hydrated, or the first request is still in flight. */
    pending: isSupabaseConfigured && (!hydrated || (data === undefined && !error)),
  };
}

/**
 * The CMS replaces the built-in site only once it has been initialised (the settings
 * row exists), so a freshly created, still-empty database never blanks the website.
 */
function useCmsStatus() {
  const { data, pending } = useCmsData(cmsKeys.settings, fetchSettings);
  return { settings: data ?? null, live: Boolean(data), pending };
}

/** Live data once the CMS is initialised, the built-in data otherwise. */
function useLive<T>(key: string, fetcher: () => Promise<T | null>, builtIn: T) {
  const status = useCmsStatus();
  const { data, pending } = useCmsData(key, fetcher);
  return {
    value: status.live && data != null ? data : builtIn,
    settled: !status.pending && (!status.live || !pending),
  };
}

export function useSiteSettings(): SiteSettings {
  return useCmsStatus().settings ?? defaultSiteSettings;
}

/** Studio details plus derived links — the live counterpart of `site` in lib/site.ts. */
export function useSite() {
  const settings = useSiteSettings();
  return useMemo(() => {
    const site = resolveSite(settings);
    return { site, whatsappLink: (message?: string) => buildWhatsappLink(site.whatsappNumber, message) };
  }, [settings]);
}

export function useContentRows(): ContentRow[] | undefined {
  const status = useCmsStatus();
  const { data } = useCmsData(cmsKeys.content, fetchContent);
  return status.live && data ? data : undefined;
}

export function useMedia(): MediaMap;
export function useMedia<K extends MediaSection>(section: K): MediaMap[K];
export function useMedia(section?: MediaSection) {
  const rows = useContentRows();
  const media = useMemo(() => buildMedia(rows), [rows]);
  return section ? media[section] : media;
}

export function useProjectList() {
  const { value, settled } = useLive(cmsKeys.projects, fetchProjects, builtInProjects);
  return { projects: value, settled };
}

export function useProjects(): Project[] {
  return useProjectList().projects;
}

export function usePostList() {
  const { value, settled } = useLive(cmsKeys.posts, fetchPosts, builtInSummaries);
  return { posts: value, settled };
}

export function usePosts(): PostSummary[] {
  return usePostList().posts;
}

/** One full article. While the live copy loads, a built-in article with the same slug stands in. */
export function usePost(slug: string | null) {
  const status = useCmsStatus();
  const { data, pending } = useCmsData(slug ? cmsKeys.post(slug) : null, () => (slug ? fetchPost(slug) : Promise.resolve(null)));
  const builtIn = slug ? builtInPosts.find((post) => post.slug === slug) : undefined;

  let post: Post | undefined = builtIn;
  if (status.live && data !== undefined && data !== null) post = data === false ? undefined : data;

  return { post, settled: !status.pending && (!status.live || !pending) };
}

export function useServices(): Service[] {
  return useLive(cmsKeys.services, fetchServices, builtInServices).value;
}

export function useProcessSteps(): ProcessStep[] {
  return useLive(cmsKeys.steps, fetchSteps, builtInSteps).value;
}

/** Article bylines; the founder's follows Global Settings → Founder. */
export function useAuthors() {
  const { founder } = useSiteSettings();
  return useMemo(() => buildAuthors({ ...founder, portrait: founder.portrait || undefined }), [founder]);
}
