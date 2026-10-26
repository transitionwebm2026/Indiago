-- =============================================================================
-- Indigo Interiors CMS: schema, Row Level Security, Storage and Realtime.
--
-- Run once in Supabase → SQL Editor (or `supabase db push`). Safe to re-run.
-- Then:
--   1. Authentication → Users → "Add user" to create the studio's login.
--   2. Run:  select public.make_admin('owner@indigoegy.com');
--   3. Sign in at /admin/ and click "Import website content".
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Admins: only users listed here can edit content or read inquiries.
-- -----------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Grants admin access by email. Runs only from the SQL editor (not exposed to the website).
create or replace function public.make_admin(admin_email text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  found_id uuid;
begin
  select id into found_id from auth.users where lower(email) = lower(admin_email);
  if found_id is null then
    raise exception 'No user with email %. Create it first in Authentication → Users.', admin_email;
  end if;
  insert into public.admins (user_id) values (found_id) on conflict do nothing;
  return admin_email || ' is now an admin.';
end;
$$;

revoke all on function public.make_admin(text) from public, anon, authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- site_settings: one row (id = 1) of global configuration.
-- The public site keeps its built-in content until this row exists, so the
-- dashboard's "Import website content" creates it last.
-- -----------------------------------------------------------------------------
create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  site_name text not null default 'Indigo Interiors',
  site_url text not null default '',
  logo_url text not null default '',
  -- [{ id, href, label: { en, ar }, visible }]
  nav_links jsonb not null default '[]'::jsonb check (jsonb_typeof(nav_links) = 'array'),
  show_nav_cta boolean not null default true,
  email text not null default '',
  phone text not null default '',
  phone_uae text not null default '',
  whatsapp_number text not null default '',
  address_en text not null default '',
  address_ar text not null default '',
  map_query text not null default '',
  map_embed_url text not null default '',
  map_lat double precision,
  map_lng double precision,
  founder_name_en text not null default '',
  founder_name_ar text not null default '',
  founder_role_en text not null default '',
  founder_role_ar text not null default '',
  founder_initials text not null default '',
  founder_portrait_url text not null default '',
  -- [{ id: 'instagram' | 'facebook' | ..., label, href, visible }]
  social_links jsonb not null default '[]'::jsonb check (jsonb_typeof(social_links) = 'array'),
  credit_name text not null default '',
  credit_url text not null default '',
  credit_logo_url text not null default '',
  show_credit boolean not null default true,
  copyright_year integer not null default extract(year from now())::integer,
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- site_content: per-section overrides of the website copy.
-- `section` is a path into the site dictionary (e.g. 'home.hero', 'about.story').
-- `en` / `ar` hold only the fields that differ from the built-in copy;
-- `media` holds language-independent images (hero slides, section photos).
-- -----------------------------------------------------------------------------
create table if not exists public.site_content (
  section text primary key check (section ~ '^[A-Za-z]+(\.[A-Za-z]+)*$'),
  en jsonb not null default '{}'::jsonb,
  ar jsonb not null default '{}'::jsonb,
  media jsonb not null default '{}'::jsonb check (jsonb_typeof(media) = 'object'),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- projects: the portfolio.
-- -----------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_en text not null check (char_length(title_en) between 1 and 200),
  title_ar text not null default '',
  category text not null check (category in ('residential', 'hospitality', 'government', 'healthcare')),
  location_en text not null default '',
  location_ar text not null default '',
  scope_en text not null default '',
  scope_ar text not null default '',
  completed_on date,
  summary_en text not null default '',
  summary_ar text not null default '',
  -- Design story paragraphs: [{ en, ar }]
  story jsonb not null default '[]'::jsonb check (jsonb_typeof(story) = 'array'),
  -- Signature elements shown as tags: [{ en, ar }]
  highlights jsonb not null default '[]'::jsonb check (jsonb_typeof(highlights) = 'array'),
  -- Material list: [{ name: { en, ar }, detail: { en, ar } }]
  materials jsonb not null default '[]'::jsonb check (jsonb_typeof(materials) = 'array'),
  -- Slugs of the services delivered
  services text[] not null default '{}',
  cover_image_url text not null default '',
  gallery_urls text[] not null default '{}',
  -- [{ before, after, caption: { en, ar } }]
  before_after jsonb not null default '[]'::jsonb check (jsonb_typeof(before_after) = 'array'),
  -- [{ render, real, caption: { en, ar } }]
  render_real jsonb not null default '[]'::jsonb check (jsonb_typeof(render_real) = 'array'),
  is_featured boolean not null default false,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_sort_idx on public.projects (sort_order, created_at desc);

-- -----------------------------------------------------------------------------
-- services: service cards (services page, home page, footer, inquiry form).
-- -----------------------------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  icon text not null default 'pen-tool',
  image_url text not null default '',
  title_en text not null check (char_length(title_en) between 1 and 200),
  title_ar text not null default '',
  summary_en text not null default '',
  summary_ar text not null default '',
  -- Bullet points on the card: [{ en, ar }]
  deliverables jsonb not null default '[]'::jsonb check (jsonb_typeof(deliverables) = 'array'),
  show_on_home boolean not null default false,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- process_steps: the execution process (workflow timeline + deliverables).
-- -----------------------------------------------------------------------------
create table if not exists public.process_steps (
  id uuid primary key default gen_random_uuid(),
  title_en text not null check (char_length(title_en) between 1 and 200),
  title_ar text not null default '',
  duration_en text not null default '',
  duration_ar text not null default '',
  summary_en text not null default '',
  summary_ar text not null default '',
  -- Checklist shown in the workflow timeline: [{ en, ar }]
  points jsonb not null default '[]'::jsonb check (jsonb_typeof(points) = 'array'),
  -- What the client receives at this stage: [{ en, ar }]
  deliverables jsonb not null default '[]'::jsonb check (jsonb_typeof(deliverables) = 'array'),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- blog_posts: articles. Content is Markdown (## heading, > quote, - list item).
-- -----------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_en text not null check (char_length(title_en) between 1 and 300),
  title_ar text not null default '',
  excerpt_en text not null default '',
  excerpt_ar text not null default '',
  content_en text not null default '',
  content_ar text not null default '',
  category text not null default 'design-trends'
    check (category in ('heritage', 'design-trends', 'material-selection', 'space-planning', 'client-guides')),
  author text not null default 'studio' check (author in ('founder', 'studio')),
  read_time integer not null default 5 check (read_time between 1 and 120),
  cover_image_url text not null default '',
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_listing_idx on public.blog_posts (status, published_at desc);

-- -----------------------------------------------------------------------------
-- project_inquiries: briefs submitted from /contact/.
-- Visitors may only insert; only admins can read or change them.
-- -----------------------------------------------------------------------------
create table if not exists public.project_inquiries (
  id uuid primary key default gen_random_uuid(),
  client_name text not null check (char_length(client_name) between 1 and 200),
  phone text not null check (char_length(phone) between 1 and 40),
  email text not null default '' check (char_length(email) <= 200),
  property_type text not null default '' check (char_length(property_type) <= 40),
  property_status text not null default '' check (char_length(property_status) <= 40),
  property_area numeric check (property_area is null or property_area > 0),
  location text not null default '' check (char_length(location) <= 300),
  services text[] not null default '{}' check (cardinality(services) <= 30),
  budget text not null default '' check (char_length(budget) <= 40),
  timeline text not null default '' check (char_length(timeline) <= 40),
  reference_links text[] not null default '{}' check (cardinality(reference_links) <= 30),
  -- [{ path, name, size, type }] in the private `inquiry-files` bucket
  reference_files jsonb not null default '[]'::jsonb
    check (jsonb_typeof(reference_files) = 'array' and jsonb_array_length(reference_files) <= 10),
  notes text not null default '' check (char_length(notes) <= 5000),
  locale text not null default 'en' check (locale in ('en', 'ar')),
  status text not null default 'New' check (status in ('New', 'Contacted', 'Archived')),
  admin_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists project_inquiries_inbox_idx on public.project_inquiries (status, created_at desc);

-- -----------------------------------------------------------------------------
-- updated_at triggers
-- -----------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['site_settings', 'site_content', 'projects', 'services', 'process_steps', 'blog_posts', 'project_inquiries'] loop
    execute format('drop trigger if exists touch_updated_at on public.%I', t);
    execute format('create trigger touch_updated_at before update on public.%I for each row execute function public.touch_updated_at()', t);
  end loop;
end;
$$;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.admins enable row level security;
alter table public.site_settings enable row level security;
alter table public.site_content enable row level security;
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.process_steps enable row level security;
alter table public.blog_posts enable row level security;
alter table public.project_inquiries enable row level security;

drop policy if exists "Admins can view the admin list" on public.admins;
create policy "Admins can view the admin list" on public.admins
  for select to authenticated using ((select public.is_admin()));

-- Public content: anyone can read, only admins can write.
do $$
declare
  t text;
begin
  foreach t in array array['site_settings', 'site_content', 'services', 'process_steps'] loop
    execute format('drop policy if exists "Public can read" on public.%I', t);
    execute format('create policy "Public can read" on public.%I for select to anon, authenticated using (true)', t);
  end loop;
  foreach t in array array['site_settings', 'site_content', 'projects', 'services', 'process_steps', 'blog_posts'] loop
    execute format('drop policy if exists "Admins can write" on public.%I', t);
    execute format(
      'create policy "Admins can write" on public.%I for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))',
      t
    );
  end loop;
end;
$$;

-- Unpublished projects and draft articles stay hidden from visitors.
drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects" on public.projects
  for select to anon, authenticated using (is_published or (select public.is_admin()));

drop policy if exists "Public can read published posts" on public.blog_posts;
create policy "Public can read published posts" on public.blog_posts
  for select to anon, authenticated using (status = 'published' or (select public.is_admin()));

-- Inquiries: write-only for visitors.
drop policy if exists "Visitors can submit inquiries" on public.project_inquiries;
create policy "Visitors can submit inquiries" on public.project_inquiries
  for insert to anon, authenticated with check (status = 'New' and admin_notes = '');

drop policy if exists "Admins can read inquiries" on public.project_inquiries;
create policy "Admins can read inquiries" on public.project_inquiries
  for select to authenticated using ((select public.is_admin()));

drop policy if exists "Admins can update inquiries" on public.project_inquiries;
create policy "Admins can update inquiries" on public.project_inquiries
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Admins can delete inquiries" on public.project_inquiries;
create policy "Admins can delete inquiries" on public.project_inquiries
  for delete to authenticated using ((select public.is_admin()));

-- Table privileges (RLS above decides which rows each role actually sees).
grant usage on schema public to anon, authenticated;
grant select on public.site_settings, public.site_content, public.projects, public.services, public.process_steps, public.blog_posts
  to anon, authenticated;
grant insert, update, delete on public.site_settings, public.site_content, public.projects, public.services, public.process_steps, public.blog_posts
  to authenticated;
grant insert on public.project_inquiries to anon, authenticated;
grant select, update, delete on public.project_inquiries to authenticated;
grant select on public.admins to authenticated;

-- -----------------------------------------------------------------------------
-- Storage
--   media          public  — every image, video and logo on the website (admin uploads)
--   inquiry-files  private — reference files attached to project briefs by visitors
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 52428800,
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml',
    'video/mp4', 'video/webm', 'video/quicktime', 'application/pdf'
  ]
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'inquiry-files', 'inquiry-files', false, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Files in the public `media` bucket are served by URL without a policy;
-- listing, uploading, replacing and deleting are admin-only.
drop policy if exists "Admins manage media" on storage.objects;
create policy "Admins manage media" on storage.objects
  for all to authenticated
  using (bucket_id = 'media' and (select public.is_admin()))
  with check (bucket_id = 'media' and (select public.is_admin()));

-- Visitors can add files under inquiries/<id>/ but never list or read them back.
drop policy if exists "Visitors upload inquiry files" on storage.objects;
create policy "Visitors upload inquiry files" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'inquiry-files' and (storage.foldername(name))[1] = 'inquiries');

drop policy if exists "Admins manage inquiry files" on storage.objects;
create policy "Admins manage inquiry files" on storage.objects
  for all to authenticated
  using (bucket_id = 'inquiry-files' and (select public.is_admin()))
  with check (bucket_id = 'inquiry-files' and (select public.is_admin()));

-- -----------------------------------------------------------------------------
-- Realtime: the website listens for changes and refreshes content instantly.
-- -----------------------------------------------------------------------------
do $$
declare
  t text;
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
  foreach t in array array['site_settings', 'site_content', 'projects', 'services', 'process_steps', 'blog_posts', 'project_inquiries'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end;
$$;
