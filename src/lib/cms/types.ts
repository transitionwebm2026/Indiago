import type { Localized } from '@/lib/i18n/types';
import type { NavLink, SocialLink } from '@/lib/site';

/** Database row shapes — mirror supabase/migrations/*_indigo_cms.sql. */

export interface SettingsRow {
  id: number;
  site_name: string;
  site_url: string;
  logo_url: string;
  nav_links: NavLink[];
  show_nav_cta: boolean;
  email: string;
  phone: string;
  phone_uae: string;
  whatsapp_number: string;
  address_en: string;
  address_ar: string;
  map_query: string;
  map_embed_url: string;
  map_lat: number | null;
  map_lng: number | null;
  founder_name_en: string;
  founder_name_ar: string;
  founder_role_en: string;
  founder_role_ar: string;
  founder_initials: string;
  founder_portrait_url: string;
  social_links: SocialLink[];
  credit_name: string;
  credit_url: string;
  credit_logo_url: string;
  show_credit: boolean;
  copyright_year: number;
  updated_at?: string;
}

export interface ContentRow {
  /** Dot path into the site dictionary, e.g. "home.hero". */
  section: string;
  en: unknown;
  ar: unknown;
  media: Record<string, unknown>;
  updated_at?: string;
}

export interface ProjectRow {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  category: string;
  location_en: string;
  location_ar: string;
  scope_en: string;
  scope_ar: string;
  completed_on: string | null;
  summary_en: string;
  summary_ar: string;
  story: Localized[];
  highlights: Localized[];
  materials: { name: Localized; detail: Localized }[];
  services: string[];
  cover_image_url: string;
  gallery_urls: string[];
  before_after: { before: string; after: string; caption: Localized }[];
  render_real: { render: string; real: string; caption: Localized }[];
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceRow {
  id: string;
  slug: string;
  icon: string;
  image_url: string;
  title_en: string;
  title_ar: string;
  summary_en: string;
  summary_ar: string;
  deliverables: Localized[];
  show_on_home: boolean;
  is_visible: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProcessStepRow {
  id: string;
  title_en: string;
  title_ar: string;
  duration_en: string;
  duration_ar: string;
  summary_en: string;
  summary_ar: string;
  points: Localized[];
  deliverables: Localized[];
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export type PostStatus = 'draft' | 'published';

export interface BlogPostRow {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  /** Markdown — see lib/cms/markdown.ts */
  content_en: string;
  content_ar: string;
  category: string;
  author: string;
  read_time: number;
  cover_image_url: string;
  is_featured: boolean;
  status: PostStatus;
  published_at: string;
  created_at?: string;
  updated_at?: string;
}

export const inquiryStatuses = ['New', 'Contacted', 'Archived'] as const;

export type InquiryStatus = (typeof inquiryStatuses)[number];

export interface InquiryFile {
  /** Object path in the private `inquiry-files` bucket. */
  path: string;
  name: string;
  size: number;
  type: string;
}

export interface InquiryRow {
  id: string;
  client_name: string;
  phone: string;
  email: string;
  property_type: string;
  property_status: string;
  property_area: number | null;
  location: string;
  services: string[];
  budget: string;
  timeline: string;
  reference_links: string[];
  reference_files: InquiryFile[];
  notes: string;
  locale: string;
  status: InquiryStatus;
  admin_notes: string;
  created_at: string;
  updated_at?: string;
}
