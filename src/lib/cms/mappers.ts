import { isBlogCategory, type AuthorId, type Post, type PostSummary } from '@/lib/data/posts';
import { isProjectCategory, type Project } from '@/lib/data/projects';
import type { ProcessStep, Service } from '@/lib/data/services';
import type { Localized } from '@/lib/i18n/types';
import { defaultSiteSettings, socialPlatforms, type NavLink, type SiteSettings, type SocialLink } from '@/lib/site';
import { blocksToMarkdown, markdownToBlocks } from './markdown';
import { isPlainObject } from './merge';
import type { BlogPostRow, ProcessStepRow, ProjectRow, ServiceRow, SettingsRow } from './types';

/** Rows are written by people, so every jsonb value is checked before it reaches a component. */

const text = (value: unknown) => (typeof value === 'string' ? value : '');

export function localized(value: unknown): Localized {
  return isPlainObject(value) ? { en: text(value.en), ar: text(value.ar) } : { en: '', ar: '' };
}

export function localizedList(value: unknown): Localized[] {
  return Array.isArray(value) ? value.map(localized).filter((item) => item.en || item.ar) : [];
}

const list = <T>(value: unknown, map: (item: Record<string, unknown>) => T | null): T[] =>
  Array.isArray(value) ? value.filter(isPlainObject).map(map).filter((item): item is T => item !== null) : [];

const strings = (value: unknown) => (Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item !== '') : []);

/* ----------------------------------------------------------------------------- Settings */

export function rowToSettings(row: SettingsRow): SiteSettings {
  const nav = list<NavLink>(row.nav_links, (item) =>
    typeof item.href === 'string' && item.href
      ? { id: text(item.id) || item.href, href: item.href, label: localized(item.label), visible: item.visible !== false }
      : null,
  );
  const social = list<SocialLink>(row.social_links, (item) =>
    (socialPlatforms as readonly string[]).includes(text(item.id)) && text(item.href)
      ? { id: item.id as SocialLink['id'], label: text(item.label) || text(item.id), href: text(item.href), visible: item.visible !== false }
      : null,
  );

  return {
    name: row.site_name || defaultSiteSettings.name,
    url: row.site_url || defaultSiteSettings.url,
    logo: row.logo_url,
    nav,
    showNavCta: row.show_nav_cta,
    email: row.email,
    phone: row.phone,
    uaePhone: row.phone_uae,
    whatsappNumber: row.whatsapp_number.replace(/\D/g, ''),
    address: { en: row.address_en, ar: row.address_ar },
    map: {
      query: row.map_query,
      embedUrl: row.map_embed_url,
      lat: typeof row.map_lat === 'number' ? row.map_lat : null,
      lng: typeof row.map_lng === 'number' ? row.map_lng : null,
    },
    founder: {
      name: { en: row.founder_name_en, ar: row.founder_name_ar },
      role: { en: row.founder_role_en, ar: row.founder_role_ar },
      initials: row.founder_initials,
      portrait: row.founder_portrait_url,
    },
    social,
    credit: { name: row.credit_name, href: row.credit_url, logo: row.credit_logo_url, visible: row.show_credit },
    copyrightYear: row.copyright_year,
  };
}

export function settingsToRow(settings: SiteSettings): SettingsRow {
  return {
    id: 1,
    site_name: settings.name,
    site_url: settings.url,
    logo_url: settings.logo,
    nav_links: settings.nav,
    show_nav_cta: settings.showNavCta,
    email: settings.email.trim(),
    phone: settings.phone.trim(),
    phone_uae: settings.uaePhone.trim(),
    whatsapp_number: settings.whatsappNumber.replace(/\D/g, ''),
    address_en: settings.address.en,
    address_ar: settings.address.ar,
    map_query: settings.map.query,
    map_embed_url: settings.map.embedUrl,
    map_lat: settings.map.lat,
    map_lng: settings.map.lng,
    founder_name_en: settings.founder.name.en,
    founder_name_ar: settings.founder.name.ar,
    founder_role_en: settings.founder.role.en,
    founder_role_ar: settings.founder.role.ar,
    founder_initials: settings.founder.initials,
    founder_portrait_url: settings.founder.portrait,
    social_links: settings.social,
    credit_name: settings.credit.name,
    credit_url: settings.credit.href,
    credit_logo_url: settings.credit.logo,
    show_credit: settings.credit.visible,
    copyright_year: settings.copyrightYear,
  };
}

/* ----------------------------------------------------------------------------- Projects */

export function rowToProject(row: ProjectRow): Project {
  return {
    id: row.slug,
    title: { en: row.title_en, ar: row.title_ar || row.title_en },
    category: isProjectCategory(row.category) ? row.category : 'residential',
    location: { en: row.location_en, ar: row.location_ar || row.location_en },
    scope: row.scope_en || row.scope_ar ? { en: row.scope_en, ar: row.scope_ar || row.scope_en } : undefined,
    completed: row.completed_on ?? undefined,
    highlights: localizedList(row.highlights),
    summary: { en: row.summary_en, ar: row.summary_ar || row.summary_en },
    concept: localizedList(row.story),
    materials: list(row.materials, (item) => {
      const name = localized(item.name);
      return name.en || name.ar ? { name, detail: localized(item.detail) } : null;
    }),
    services: strings(row.services),
    cover: row.cover_image_url,
    gallery: strings(row.gallery_urls),
    beforeAfter: list(row.before_after, (item) =>
      text(item.before) && text(item.after) ? { before: text(item.before), after: text(item.after), caption: localized(item.caption) } : null,
    ),
    renderReal: list(row.render_real, (item) =>
      text(item.render) && text(item.real) ? { render: text(item.render), real: text(item.real), caption: localized(item.caption) } : null,
    ),
    featured: row.is_featured,
  };
}

/** For "Import website content": a built-in project as a new row. */
export function projectToRow(project: Project, sortOrder: number): Omit<ProjectRow, 'id'> {
  return {
    slug: project.id,
    title_en: project.title.en,
    title_ar: project.title.ar,
    category: project.category,
    location_en: project.location.en,
    location_ar: project.location.ar,
    scope_en: project.scope?.en ?? '',
    scope_ar: project.scope?.ar ?? '',
    completed_on: project.completed ?? null,
    summary_en: project.summary.en,
    summary_ar: project.summary.ar,
    story: project.concept,
    highlights: project.highlights,
    materials: project.materials,
    services: project.services,
    cover_image_url: project.cover,
    gallery_urls: project.gallery,
    before_after: project.beforeAfter ?? [],
    render_real: project.renderReal ?? [],
    is_featured: Boolean(project.featured),
    is_published: true,
    sort_order: sortOrder,
  };
}

/* ----------------------------------------------------------------------------- Blog */

/** Columns for listings — everything except the article bodies. */
export const postSummaryColumns =
  'slug,title_en,title_ar,excerpt_en,excerpt_ar,category,author,read_time,cover_image_url,is_featured,published_at';

export type PostSummaryRow = Omit<BlogPostRow, 'id' | 'content_en' | 'content_ar' | 'status'>;

export function rowToPostSummary(row: PostSummaryRow): PostSummary {
  return {
    slug: row.slug,
    title: { en: row.title_en, ar: row.title_ar || row.title_en },
    excerpt: { en: row.excerpt_en, ar: row.excerpt_ar || row.excerpt_en },
    category: isBlogCategory(row.category) ? row.category : 'design-trends',
    author: (row.author === 'founder' ? 'founder' : 'studio') satisfies AuthorId,
    date: row.published_at,
    readTime: row.read_time,
    cover: row.cover_image_url,
    featured: row.is_featured,
  };
}

export function rowToPost(row: BlogPostRow): Post {
  const bodyAr = row.content_ar.trim() ? markdownToBlocks(row.content_ar) : undefined;
  return { ...rowToPostSummary(row), body: markdownToBlocks(row.content_en), bodyAr };
}

export function postToRow(post: Post): Omit<BlogPostRow, 'id'> {
  return {
    slug: post.slug,
    title_en: post.title.en,
    title_ar: post.title.ar,
    excerpt_en: post.excerpt.en,
    excerpt_ar: post.excerpt.ar,
    content_en: blocksToMarkdown(post.body),
    content_ar: post.bodyAr ? blocksToMarkdown(post.bodyAr) : '',
    category: post.category,
    author: post.author,
    read_time: post.readTime,
    cover_image_url: post.cover,
    is_featured: Boolean(post.featured),
    status: 'published',
    published_at: post.date,
  };
}

/* ----------------------------------------------------------------------------- Services & process */

export function rowToService(row: ServiceRow): Service {
  return {
    id: row.slug,
    icon: row.icon,
    image: row.image_url,
    title: { en: row.title_en, ar: row.title_ar || row.title_en },
    summary: { en: row.summary_en, ar: row.summary_ar || row.summary_en },
    deliverables: localizedList(row.deliverables),
    core: row.show_on_home,
  };
}

export function serviceToRow(service: Service, sortOrder: number): Omit<ServiceRow, 'id'> {
  return {
    slug: service.id,
    icon: service.icon,
    image_url: service.image,
    title_en: service.title.en,
    title_ar: service.title.ar,
    summary_en: service.summary.en,
    summary_ar: service.summary.ar,
    deliverables: service.deliverables,
    show_on_home: service.core,
    is_visible: true,
    sort_order: sortOrder,
  };
}

export function rowToStep(row: ProcessStepRow): ProcessStep {
  return {
    title: { en: row.title_en, ar: row.title_ar || row.title_en },
    duration: { en: row.duration_en, ar: row.duration_ar || row.duration_en },
    summary: { en: row.summary_en, ar: row.summary_ar || row.summary_en },
    points: localizedList(row.points),
    deliverables: localizedList(row.deliverables),
  };
}

export function stepToRow(step: ProcessStep, sortOrder: number): Omit<ProcessStepRow, 'id'> {
  return {
    title_en: step.title.en,
    title_ar: step.title.ar,
    duration_en: step.duration.en,
    duration_ar: step.duration.ar,
    summary_en: step.summary.en,
    summary_ar: step.summary.ar,
    points: step.points,
    deliverables: step.deliverables,
    sort_order: sortOrder,
  };
}
