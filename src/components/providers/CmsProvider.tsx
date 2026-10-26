'use client';

import { useEffect, type ReactNode } from 'react';
import { SWRConfig, useSWRConfig, type Cache } from 'swr';
import { cmsKeys } from '@/lib/cms/api';
import { getSupabase, isRealtimeEnabled } from '@/lib/supabase/client';

const CACHE_KEY = 'indigo-cms-cache-v1';

/**
 * SWR cache that remembers public CMS responses between visits, so returning visitors
 * see the latest content the moment the page hydrates. Only "cms:" keys are stored —
 * never admin data such as inquiries.
 */
function persistentCache(): Cache {
  const map = new Map<string, unknown>();
  if (typeof window === 'undefined') return map as Cache;

  try {
    const saved = JSON.parse(window.localStorage.getItem(CACHE_KEY) ?? '[]') as [string, unknown][];
    for (const [key, data] of saved) map.set(key, { data });
  } catch {
    // Unreadable or blocked storage: start with an empty cache.
  }

  const save = () => {
    try {
      const entries = [...map.entries()]
        .filter(([key]) => key.startsWith('cms:'))
        .map(([key, state]) => [key, (state as { data?: unknown } | undefined)?.data] as const)
        .filter(([, data]) => data !== undefined);
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(entries));
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
    const supabase = getSupabase();
    if (!supabase || !isRealtimeEnabled) return;

    let channel: ReturnType<typeof supabase.channel> | null = null;
    // Connect once the page has settled, so the socket never competes with the first paint.
    const timer = window.setTimeout(() => {
      channel = supabase.channel('cms-live');
      for (const [table, matches] of Object.entries(tableKeys)) {
        channel.on('postgres_changes', { event: '*', schema: 'public', table }, () => {
          void mutate((key) => typeof key === 'string' && matches(key));
        });
      }
      channel.subscribe();
    }, 2000);

    return () => {
      window.clearTimeout(timer);
      if (channel) void supabase.removeChannel(channel);
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
