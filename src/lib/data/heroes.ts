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

/**
 * Three project photographs per page, cycled by the hero slider every 3 seconds.
 * Heroes fill the screen, so only the large photographs (covers and the Mynt exterior) are used.
 */
export const heroSlides = {
  home: [slide('mynt-restaurant'), slide('sun-capital-residence'), slide('arabian-majlis')],
  about: [slide('arabian-majlis'), slide('department-of-finance'), slide('sun-capital-residence')],
  portfolio: [
    slide('mynt-restaurant', '/images/projects/mynt-restaurant/02.jpg'),
    slide('al-borg-laboratories'),
    slide('department-of-finance'),
  ],
  services: [slide('department-of-finance'), slide('mynt-restaurant'), slide('al-borg-laboratories')],
  journal: [slide('sun-capital-residence'), slide('arabian-majlis'), slide('mynt-restaurant')],
  contact: [
    slide('sun-capital-residence'),
    slide('mynt-restaurant', '/images/projects/mynt-restaurant/02.jpg'),
    slide('arabian-majlis'),
  ],
} satisfies Record<string, HeroSlide[]>;

/** A project's own hero: its cover only, since gallery photographs are too small to fill the screen. */
export function projectSlides(project: Project): HeroSlide[] {
  return [{ projectId: project.id, image: project.cover }];
}
