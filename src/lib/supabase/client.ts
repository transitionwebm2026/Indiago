import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Browser Supabase client, shared by the public site (anonymous reads, realtime,
 * inquiry submissions) and the admin dashboard (authenticated writes).
 * Both values are public by design — Row Level Security protects the data.
 */
export const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/+$/, '');
/** The publishable key (sb_publishable_…), or the legacy anon key on projects that still use it. */
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/** Without credentials the site runs on its built-in content, exactly as before the CMS. */
export const isSupabaseConfigured = supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

/** Set NEXT_PUBLIC_CMS_REALTIME=false to rely on refresh-on-focus instead of a live connection. */
export const isRealtimeEnabled = process.env.NEXT_PUBLIC_CMS_REALTIME !== 'false';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  client ??= createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'indigo-admin-auth' },
    realtime: { params: { eventsPerSecond: 5 } },
  });
  return client;
}

/** For code paths that only run once configuration has been checked (e.g. the admin dashboard). */
export function requireSupabase(): SupabaseClient {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
  return supabase;
}
