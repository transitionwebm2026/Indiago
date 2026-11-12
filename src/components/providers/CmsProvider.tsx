'use client';

import { useEffect, type ReactNode } from 'react';
import { SWRConfig, useSWRConfig, type Cache } from 'swr';
import { cmsKeys } from '@/lib/cms/api';
import { snapshotVersion } from '@/lib/cms/snapshot';
import { isRealtimeEnabled, isSupabaseConfigured, loadSupabase } from '@/lib/supabase/config';

const CACHE_KEY = 'indigo-cms-cache-v2';

interface SavedCache {
  version: string;
  entries: [string, unknown][];
}

/**
 * SWR cache that remembers public CMS responses between visits, so returning visitors
 * see the latest content the moment the page hydrates. Only "cms:" keys are stored —
 * never admin data such as inquiries.
 *
 * The cache is kept per build: a copy saved before the current build can be older than the
 * content the pages were pre-rendered with, and would briefly bring back the old content.
 */
function persistentCache(): Cache {
  const map = new Map<string, unknown>();
  if (typeof window === 'undefined') return map as Cache;

  try {
    window.localStorage.removeItem('indigo-cms-cache-v1');
    const saved = JSON.parse(window.localStorage.getItem(CACHE_KEY) ?? 'null') as SavedCache | null;
    if (saved?.version === snapshotVersion && Array.isArray(saved.entries)) {
      for (const [key, data] of saved.entries) map.set(key, { data });
    }
  } catch {
    // Unreadable or blocked storage: start with an empty cache.
  }

  const save = () => {
    try {
      const entries = [...map.entries()]
        .filter(([key]) => key.startsWith('cms:'))
        .map(([key, state]) => [key, (state as { data?: unknown } | undefined)?.data] as [string, unknown])
        .filter(([, data]) => data !== undefined);
      const saved: SavedCache = { version: snapshotVersion, entries };
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(saved));
    } catch {
      // Quota exceeded or private mode — the cache is a convenience only.
    }
  };
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && save());

  return map as Cache;
}

const tableKeys: Record<string, (key: string) => boolean> = {
  site_settings: (key) => key === cmsKeys.settings,
  site_content: (key) => key === cmsKeys.content,
  projects: (key) => key === cmsKeys.projects,
  services: (key) => key === cmsKeys.services,
  process_steps: (key) => key === cmsKeys.steps,
  blog_posts: (key) => key === cmsKeys.posts || key.startsWith('cms:post:'),
};

/** Refreshes the affected content the moment the studio saves a change in the dashboard. */
function RealtimeSync() {
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (!isSupabaseConfigured || !isRealtimeEnabled) return;

    let cancelled = false;
    let disconnect: (() => void) | null = null;
    // Connect once the page has settled, so the socket never competes with the first paint.
    const timer = window.setTimeout(async () => {
      const supabase = await loadSupabase();
      if (!supabase || cancelled) return;
      const channel = supabase.channel('cms-live');
      for (const [table, matches] of Object.entries(tableKeys)) {
        channel.on('postgres_changes', { event: '*', schema: 'public', table }, () => {
          void mutate((key) => typeof key === 'string' && matches(key));
        });
      }
      channel.subscribe();
      disconnect = () => void supabase.removeChannel(channel);
    }, 2000);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      disconnect?.();
    };
  }, [mutate]);

  return null;
}

export function CmsProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        provider: persistentCache,
        revalidateOnFocus: true,
        revalidateIfStale: true,
        dedupingInterval: 5000,
        focusThrottleInterval: 15000,
        errorRetryCount: 3,
        keepPreviousData: true,
      }}
    >
      <RealtimeSync />
      {children}
    </SWRConfig>
  );
}
