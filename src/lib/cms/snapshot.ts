import { cmsKeys } from './api';
import { rowToPostSummary, rowToProject, rowToService, rowToSettings, rowToStep, type PostSummaryRow } from './mappers';
import type { ContentRow, ProcessStepRow, ProjectRow, ServiceRow, SettingsRow } from './types';

/**
 * The dashboard content as it was when the site was built (saved by scripts/snapshot-cms.mjs and
 * inlined by next.config.mjs). The static pages are pre-rendered with it, so visitors see the
 * dashboard's photos and text from the first paint; the live copy from Supabase then replaces it
 * only where something has changed since the build.
 */
interface RawSnapshot {
  version: string;
  settings: SettingsRow | null;
  content: ContentRow[];
  projects: ProjectRow[];
  posts: PostSummaryRow[];
  services: ServiceRow[];
  steps: ProcessStepRow[];
}

function load(): { version: string; data: Record<string, unknown> } | null {
  const source = process.env.CMS_SNAPSHOT;
  if (!source) return null;
  try {
    const raw = JSON.parse(source) as RawSnapshot;
    // Like the live site, an uninitialised dashboard (no settings row) leaves the built-in content in place.
    if (!raw.settings) return null;
    return {
      version: raw.version,
      // Keyed and shaped exactly like the public fetchers' answers in ./api.
      data: {
        [cmsKeys.settings]: rowToSettings(raw.settings),
        [cmsKeys.content]: raw.content,
        [cmsKeys.projects]: raw.projects.map(rowToProject),
        [cmsKeys.posts]: raw.posts.map(rowToPostSummary),
        [cmsKeys.services]: raw.services.map(rowToService),
        [cmsKeys.steps]: raw.steps.map(rowToStep),
      },
    };
  } catch {
    return null;
  }
}

const snapshot = load();

/** The build-time answer for a public CMS key, if the build has one. */
export function snapshotFor<T>(key: string | null): T | undefined {
  return key && snapshot ? (snapshot.data[key] as T | undefined) : undefined;
}

/** Changes with every build that has a snapshot; the visitor's content cache is kept per build. */
export const snapshotVersion = snapshot?.version ?? 'built-in';
