import { getProject } from './projects';

/** One hero slide: a photograph from one of the studio's projects. */
export interface HeroSlide {
  projectId: string;
  /** Image ID or /public path — see lib/images.ts */
  image: string;
}

/** A project's photograph: its cover unless another of its images is named. */
const slide = (projectId: string, image?: string): HeroSlide => ({
  projectId,
  image: image ?? getProject(projectId)?.cover ?? '',
});

/**
 * The home hero (the only page with one), cycled every 3 seconds: one project per sector the studio
 * serves, and the hero names the sector of each slide (from its project's category).
 * The hero fills the screen, so only photographs that stay clean at full size are used (several
 * project photos, such as Department of Finance 02 and 03, are upscaled from small originals and
 * break up when shown this large).
 */
export const heroSlides = {
  home: [
    slide('mynt-restaurant'),
    slide('sun-capital-residence'),
    slide('department-of-finance'),
    slide('al-borg-laboratories'),
  ],
} satisfies Record<string, HeroSlide[]>;
