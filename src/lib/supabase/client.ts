import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from './config';

/**
 * Browser Supabase client, shared by the public site (anonymous reads, realtime,
 * inquiry submissions) and the admin dashboard (authenticated writes).
 * The public site reaches it through loadSupabase() in ./config, so this module loads on demand.
 */
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
