import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase settings, kept apart from the client so pages can check them without bundling supabase-js.
 * Both values are public by design — Row Level Security protects the data.
 */
export const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/+$/, '');
/** The publishable key (sb_publishable_…), or the legacy anon key on projects that still use it. */
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/** Without credentials the site runs on its built-in content, exactly as before the CMS. */
export const isSupabaseConfigured = supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

/** Set NEXT_PUBLIC_CMS_REALTIME=false to rely on refresh-on-focus instead of a live connection. */
export const isRealtimeEnabled = process.env.NEXT_PUBLIC_CMS_REALTIME !== 'false';

/**
 * The shared client for the public website. supabase-js is fetched on first use, after the page has
 * rendered, so it stays out of the JavaScript every visitor downloads up front.
 */
export function loadSupabase(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured) return Promise.resolve(null);
  return import('./client').then((module) => module.getSupabase());
}
