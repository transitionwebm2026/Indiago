import type { Localized } from '@/lib/i18n/types';
import { getProject } from './projects';

/** One hero slide: a photograph (or video) and the caption the dashboard gives it. */
export interface HeroSlide {
  /** Image ID or /public path — see lib/images.ts */
  image: string;
  /** Short text naming the photograph, listed under the hero copy; written in the dashboard. */
  caption: Localized;
  /**
   * Slides saved before captions were written by hand named a project instead and showed its
   * sector. Kept so those slides keep that caption until the slide is edited (which clears it).
   */
  projectId: string;
}

/** A project's cover photograph with its caption. */
const slide = (projectId: string, caption: Localized): HeroSlide => ({
  image: getProject(projectId)?.cover ?? '',
  caption,
  projectId: '',
});

/**
 * The home hero (the only page with one), cycled every 3 seconds.
 * The hero fills the screen, so only photographs that stay clean at full size are used (several
 * project photos, such as Department of Finance 02 and 03, are upscaled from small originals and
 * break up when shown this large).
 */
export const heroSlides = {
  home: [
    slide('mynt-restaurant', { en: 'Hospitality', ar: 'ضيافة' }),
    slide('sun-capital-residence', { en: 'Residential', ar: 'سكني' }),
    slide('department-of-finance', { en: 'Government', ar: 'حكومي' }),
    slide('al-borg-laboratories', { en: 'Healthcare', ar: 'طبي' }),
  ],
} satisfies Record<string, HeroSlide[]>;
