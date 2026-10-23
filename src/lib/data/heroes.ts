import { getProject, type Project } from './projects';

/** One hero slide: a photograph from one of the studio's projects. */
export interface HeroSlide {
  projectId: string;
  /** Image ID or /public path — see lib/images.ts */
  image: string;
}

const slide = (projectId: string, image?: string): HeroSlide => ({
  projectId,
  image: image ?? getProject(projectId)?.cover ?? '',
});

/** Three project photographs per page, cycled by the hero slider every 3 seconds. */
export const heroSlides = {
  home: [slide('al-safa-villa'), slide('sahel-summer-villa'), slide('maison-restaurant-lounge')],
  about: [
    slide('zayed-courtyard-residence'),
    slide('al-safa-villa', '1604014237800-1c9102c219da'),
    slide('katameya-penthouse', '1618219740975-d40978bb7378'),
  ],
  portfolio: [
    slide('meridian-corporate-hq'),
    slide('katameya-penthouse'),
    slide('sahel-summer-villa', '1600596542815-ffad4c1539a9'),
  ],
  services: [
    slide('al-safa-villa', '1600585152220-90363fe7e115'),
    slide('vertex-executive-offices'),
    slide('maison-restaurant-lounge', '1554118811-1e0d58224f24'),
  ],
  journal: [
    slide('al-safa-villa', '1617098900591-3f90928e8c54'),
    slide('zayed-courtyard-residence', '1600210491892-03d54c0aaf87'),
    slide('sahel-summer-villa', '1597211833712-5e41faa202ea'),
  ],
  contact: [
    slide('al-safa-villa', '1600607687939-ce8a6c25118c'),
    slide('katameya-penthouse', '1588854337236-6889d631faa8'),
    slide('sahel-summer-villa', '1512917774080-9991f1c4c750'),
  ],
} satisfies Record<string, HeroSlide[]>;

/** A project's own hero: its cover followed by the first two gallery images. */
export function projectSlides(project: Project): HeroSlide[] {
  return [project.cover, ...project.gallery].slice(0, 3).map((image) => ({ projectId: project.id, image }));
}
