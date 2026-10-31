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
 * Three project photographs for the home hero (the only page with one), cycled every 3 seconds.
 * The hero fills the screen, so only photographs that stay clean at full size are used (several
 * project photos are upscaled from small originals and break up when shown this large).
 */
export const heroSlides = {
  home: [
    slide('mynt-restaurant', '/images/projects/mynt-restaurant/02.jpg'),
    slide('sun-capital-residence'),
    slide('sun-capital-residence', '/images/projects/sun-capital-residence/02.jpg'),
  ],
} satisfies Record<string, HeroSlide[]>;
