// Trailing slashes match `trailingSlash: true` so links resolve to /page/index.html on static hosting.
export const routes = {
  home: '/',
  about: '/about/',
  portfolio: '/portfolio/',
  services: '/services/',
  blog: '/blog/',
  contact: '/contact/',
  inquiry: '/contact/#inquiry',
} as const;

export const projectHref = (id: string) => `/portfolio/${id}/`;
export const postHref = (slug: string) => `/blog/${slug}/`;
export const serviceHref = (id: string) => `/services/#${id}`;

/**
 * Projects and articles published in the CMS after the last build have no page of their own.
 * The host serves this pre-built shell for them instead (see public/.htaccess), and the shell
 * reads the real slug from the address bar. Slugs are lowercase words, so "_" can't clash.
 */
export const SHELL_SLUG = '_';

/** "/portfolio/new-villa/" → "new-villa" */
export function slugFromPath(pathname: string) {
  const segment = pathname.split('/').filter(Boolean).pop() ?? '';
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export const primaryNav = [
  { key: 'home', href: routes.home },
  { key: 'about', href: routes.about },
  { key: 'portfolio', href: routes.portfolio },
  { key: 'services', href: routes.services },
  { key: 'journal', href: routes.blog },
  { key: 'contact', href: routes.contact },
] as const;

export type NavKey = (typeof primaryNav)[number]['key'];
