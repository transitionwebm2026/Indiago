import type { SiteSettings } from '@/lib/site';
import { requireSupabase } from '@/lib/supabase/client';
import { settingsToRow } from './mappers';
import { INQUIRY_BUCKET } from './storage';
import type {
  BlogPostRow,
  ContentRow,
  InquiryRow,
  InquiryStatus,
  ProcessStepRow,
  ProjectRow,
  ServiceRow,
  SettingsRow,
} from './types';

/**
 * Dashboard reads and writes. Every call runs as the signed-in admin; Row Level
 * Security rejects anyone else. SWR keys start with "admin:", so none of this is
 * ever cached in the browser between visits.
 */

export const adminKeys = {
  settings: 'admin:settings',
  content: 'admin:content',
  projects: 'admin:projects',
  project: (id: string) => `admin:project:${id}`,
  services: 'admin:services',
  steps: 'admin:steps',
  posts: 'admin:posts',
  post: (id: string) => `admin:post:${id}`,
  inquiries: 'admin:inquiries',
  newInquiries: 'admin:new-inquiries',
  stats: 'admin:stats',
} as const;

/** Unsaved rows have no id yet; timestamps are managed by the database. */
export type Draft<Row extends { id: string }> = Omit<Row, 'id' | 'created_at' | 'updated_at'> & { id?: string };

type Response<T> = { data: T | null; error: (Error & { code?: string }) | null };

async function must<T>(query: PromiseLike<Response<T>>): Promise<T> {
  const { data, error } = await query;
  if (error) throw error;
  return data as T;
}

/** Turns database and network errors into sentences a non-technical editor can act on. */
export function friendlyError(error: unknown): string {
  const { code, message = '' } = (error ?? {}) as { code?: string; message?: string };
  if (code === '23505') return 'That web address (slug) is already in use. Please choose a different one.';
  if (code === '23514' || code === '22P02') return 'One of the values isn’t allowed. Please check the form and try again.';
  if (code === '42501' || /row-level security|permission denied/i.test(message)) {
    return 'Permission denied. Please sign in again with an admin account.';
  }
  if (code === 'PGRST301' || /jwt|session/i.test(message)) return 'Your session has expired. Please sign in again.';
  if (/failed to fetch|networkerror|load failed/i.test(message)) return 'Network error — please check your internet connection.';
  if (code === '42P01' || /relation .* does not exist|schema cache/i.test(message)) {
    return 'The CMS tables are missing. Run the SQL migration in Supabase first (see README).';
  }
  return message || 'Something went wrong. Please try again.';
}

/** Separates the row id from the columns to write; timestamps are left to the database. */
function splitDraft<T extends { id?: string }>(draft: T) {
  const { id, created_at: _created, updated_at: _updated, ...fields } = draft as T & { created_at?: string; updated_at?: string };
  return { id, fields };
}

/** Saves `ordered` positions as sort_order 0, 1, 2… touching only rows that moved. */
async function saveOrder(table: string, ordered: { id: string; sort_order: number }[]) {
  const supabase = requireSupabase();
  await Promise.all(
    ordered.map((row, index) =>
      row.sort_order === index ? null : must(supabase.from(table).update({ sort_order: index }).eq('id', row.id)),
    ),
  );
}

/* ----------------------------------------------------------------------------- Settings & status */

export async function fetchSettingsRow(): Promise<SettingsRow | null> {
  return must(requireSupabase().from('site_settings').select('*').eq('id', 1).maybeSingle());
}

export async function saveSettings(settings: SiteSettings) {
  await must(requireSupabase().from('site_settings').upsert(settingsToRow(settings), { onConflict: 'id' }));
}

/* ----------------------------------------------------------------------------- Page content */

export async function fetchContentRows(): Promise<ContentRow[]> {
  return must(requireSupabase().from('site_content').select('*'));
}

export async function saveContentSection(row: ContentRow) {
  await must(requireSupabase().from('site_content').upsert(row, { onConflict: 'section' }));
}

export async function deleteContentSection(section: string) {
  await must(requireSupabase().from('site_content').delete().eq('section', section));
}

/* ----------------------------------------------------------------------------- Projects */

export type ProjectDraft = Draft<ProjectRow>;

export const emptyProject = (): ProjectDraft => ({
  slug: '',
  title_en: '',
  title_ar: '',
  category: 'residential',
  location_en: '',
  location_ar: '',
  scope_en: '',
  scope_ar: '',
  completed_on: null,
  summary_en: '',
  summary_ar: '',
  story: [],
  highlights: [],
  materials: [],
  services: [],
  cover_image_url: '',
  gallery_urls: [],
  before_after: [],
  render_real: [],
  is_featured: false,
  is_published: true,
  sort_order: 0,
});

export async function fetchAdminProjects(): Promise<ProjectRow[]> {
  return must(requireSupabase().from('projects').select('*').order('sort_order').order('created_at', { ascending: false }));
}

export async function fetchAdminProject(id: string): Promise<ProjectRow | null> {
  return must(requireSupabase().from('projects').select('*').eq('id', id).maybeSingle());
}

export async function saveProject(draft: ProjectDraft): Promise<ProjectRow> {
  const { id, fields } = splitDraft(draft);
  const table = requireSupabase().from('projects');
  return must(id ? table.update(fields).eq('id', id).select().single() : table.insert(fields).select().single());
}

export async function updateProject(id: string, fields: Partial<ProjectDraft>) {
  await must(requireSupabase().from('projects').update(fields).eq('id', id));
}

export async function deleteProject(id: string) {
  await must(requireSupabase().from('projects').delete().eq('id', id));
}

export const saveProjectOrder = (rows: ProjectRow[]) => saveOrder('projects', rows);

/* ----------------------------------------------------------------------------- Services & process */

export type ServiceDraft = Draft<ServiceRow>;
export type StepDraft = Draft<ProcessStepRow>;

export const emptyService = (sortOrder: number): ServiceDraft => ({
  slug: '',
  icon: 'pen-tool',
  image_url: '',
  title_en: '',
  title_ar: '',
  summary_en: '',
  summary_ar: '',
  deliverables: [],
  show_on_home: false,
  is_visible: true,
  sort_order: sortOrder,
});

export const emptyStep = (sortOrder: number): StepDraft => ({
  title_en: '',
  title_ar: '',
  duration_en: '',
  duration_ar: '',
  summary_en: '',
  summary_ar: '',
  points: [],
  deliverables: [],
  sort_order: sortOrder,
});

export async function fetchAdminServices(): Promise<ServiceRow[]> {
  return must(requireSupabase().from('services').select('*').order('sort_order'));
}

export async function saveService(draft: ServiceDraft): Promise<ServiceRow> {
  const { id, fields } = splitDraft(draft);
  const table = requireSupabase().from('services');
  return must(id ? table.update(fields).eq('id', id).select().single() : table.insert(fields).select().single());
}

/** Keeps projects linked to a service whose slug was changed. */
export async function renameServiceInProjects(from: string, to: string) {
  const supabase = requireSupabase();
  const rows = await must<Pick<ProjectRow, 'id' | 'services'>[]>(supabase.from('projects').select('id,services').contains('services', [from]));
  await Promise.all(
    rows.map((row) =>
      must(
        supabase
          .from('projects')
          .update({ services: row.services.map((slug) => (slug === from ? to : slug)) })
          .eq('id', row.id),
      ),
    ),
  );
}

export async function deleteService(id: string) {
  await must(requireSupabase().from('services').delete().eq('id', id));
}

export const saveServiceOrder = (rows: ServiceRow[]) => saveOrder('services', rows);

export async function fetchAdminSteps(): Promise<ProcessStepRow[]> {
  return must(requireSupabase().from('process_steps').select('*').order('sort_order'));
}

export async function saveStep(draft: StepDraft): Promise<ProcessStepRow> {
  const { id, fields } = splitDraft(draft);
  const table = requireSupabase().from('process_steps');
  return must(id ? table.update(fields).eq('id', id).select().single() : table.insert(fields).select().single());
}

export async function deleteStep(id: string) {
  await must(requireSupabase().from('process_steps').delete().eq('id', id));
}

export const saveStepOrder = (rows: ProcessStepRow[]) => saveOrder('process_steps', rows);

/* ----------------------------------------------------------------------------- Blog */

export type PostDraft = Draft<BlogPostRow>;

export const emptyPost = (): PostDraft => ({
  slug: '',
  title_en: '',
  title_ar: '',
  excerpt_en: '',
  excerpt_ar: '',
  content_en: '',
  content_ar: '',
  category: 'design-trends',
  author: 'studio',
  read_time: 5,
  cover_image_url: '',
  is_featured: false,
  status: 'draft',
  published_at: new Date().toISOString().slice(0, 10),
});

export type AdminPostSummary = Pick<
  BlogPostRow,
  'id' | 'slug' | 'title_en' | 'title_ar' | 'category' | 'author' | 'cover_image_url' | 'is_featured' | 'status' | 'published_at' | 'updated_at'
>;

export async function fetchAdminPosts(): Promise<AdminPostSummary[]> {
  return must(
    requireSupabase()
      .from('blog_posts')
      .select('id,slug,title_en,title_ar,category,author,cover_image_url,is_featured,status,published_at,updated_at')
      .order('published_at', { ascending: false }),
  );
}

export async function fetchAdminPost(id: string): Promise<BlogPostRow | null> {
  return must(requireSupabase().from('blog_posts').select('*').eq('id', id).maybeSingle());
}

export async function savePost(draft: PostDraft): Promise<BlogPostRow> {
  const { id, fields } = splitDraft(draft);
  const table = requireSupabase().from('blog_posts');
  return must(id ? table.update(fields).eq('id', id).select().single() : table.insert(fields).select().single());
}

export async function updatePost(id: string, fields: Partial<PostDraft>) {
  await must(requireSupabase().from('blog_posts').update(fields).eq('id', id));
}

export async function deletePost(id: string) {
  await must(requireSupabase().from('blog_posts').delete().eq('id', id));
}

/* ----------------------------------------------------------------------------- Inquiries */

export async function fetchInquiries(): Promise<InquiryRow[]> {
  return must(requireSupabase().from('project_inquiries').select('*').order('created_at', { ascending: false }).limit(1000));
}

export async function countNewInquiries(): Promise<number> {
  const { count, error } = await requireSupabase()
    .from('project_inquiries')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'New');
  if (error) throw error;
  return count ?? 0;
}

export async function updateInquiry(id: string, fields: { status?: InquiryStatus; admin_notes?: string }) {
  await must(requireSupabase().from('project_inquiries').update(fields).eq('id', id));
}

export async function deleteInquiry(inquiry: InquiryRow) {
  const supabase = requireSupabase();
  const paths = inquiry.reference_files.map((file) => file.path).filter(Boolean);
  if (paths.length) await supabase.storage.from(INQUIRY_BUCKET).remove(paths);
  await must(supabase.from('project_inquiries').delete().eq('id', inquiry.id));
}

/** A one-hour private link to a visitor's reference file. */
export async function inquiryFileUrl(path: string): Promise<string> {
  const { data, error } = await requireSupabase().storage.from(INQUIRY_BUCKET).createSignedUrl(path, 3600);
  if (error) throw error;
  return data.signedUrl;
}

/* ----------------------------------------------------------------------------- Overview */

export interface DashboardStats {
  newInquiries: number;
  totalInquiries: number;
  publishedProjects: number;
  totalProjects: number;
  publishedPosts: number;
  draftPosts: number;
  services: number;
  recent: InquiryRow[];
}

export async function fetchStats(): Promise<DashboardStats> {
  const supabase = requireSupabase();
  const count = async (table: string, filter?: [string, string | boolean]) => {
    let query = supabase.from(table).select('id', { count: 'exact', head: true });
    if (filter) query = query.eq(filter[0], filter[1]);
    const { count: total, error } = await query;
    if (error) throw error;
    return total ?? 0;
  };
  const [newInquiries, totalInquiries, publishedProjects, totalProjects, publishedPosts, draftPosts, services, recent] = await Promise.all([
    count('project_inquiries', ['status', 'New']),
    count('project_inquiries'),
    count('projects', ['is_published', true]),
    count('projects'),
    count('blog_posts', ['status', 'published']),
    count('blog_posts', ['status', 'draft']),
    count('services'),
    must<InquiryRow[]>(supabase.from('project_inquiries').select('*').order('created_at', { ascending: false }).limit(5)),
  ]);
  return { newInquiries, totalInquiries, publishedProjects, totalProjects, publishedPosts, draftPosts, services, recent };
}
