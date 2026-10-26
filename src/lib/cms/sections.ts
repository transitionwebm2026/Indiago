import { heroSlides, type HeroSlide } from '@/lib/data/heroes';
import { pageImages } from '@/lib/images';

/**
 * Every editable block of website copy. `key` is a path into the site dictionary
 * (lib/i18n/en.ts); the admin "Pages Content" screen builds its forms from the
 * dictionary's shape at that path, so new copy added to en.ts/ar.ts becomes
 * editable automatically.
 */

export type ContentPage = 'home' | 'about' | 'portfolio' | 'services' | 'blog' | 'contact' | 'shared';

export interface MediaFieldDef {
  key: string;
  type: 'slides' | 'image' | 'images';
  label: string;
  hint?: string;
}

export interface SectionDef {
  key: string;
  page: ContentPage;
  label: string;
  description: string;
  /** Child keys edited elsewhere (their own section, or Global Settings). */
  exclude?: string[];
  media?: MediaFieldDef[];
}

export const contentPages: { id: ContentPage; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'services', label: 'Services' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
  { id: 'shared', label: 'Shared & labels' },
];

const heroSlidesField = (page: string): MediaFieldDef => ({
  key: 'slides',
  type: 'slides',
  label: 'Hero photographs',
  hint: `The slider at the top of the ${page} page changes photo every 3 seconds. Use large landscape images (at least 2000 px wide).`,
});

export const navLinkKeys = ['home', 'about', 'portfolio', 'services', 'journal', 'contact'];

export const contentSections: SectionDef[] = [
  // Home
  {
    key: 'home.hero',
    page: 'home',
    label: 'Hero',
    description: 'The full-screen opening of the home page.',
    media: [heroSlidesField('home')],
  },
  {
    key: 'home.about',
    page: 'home',
    label: 'Philosophy & founder introduction',
    description: 'The section introducing the studio, with two overlapping photos.',
    media: [
      { key: 'primaryImage', type: 'image', label: 'Large photo', hint: 'Portrait format (4:5) works best.' },
      { key: 'secondaryImage', type: 'image', label: 'Small photo', hint: 'Square format works best.' },
    ],
  },
  { key: 'home.why', page: 'home', label: 'Why Indigo', description: 'The numbered list of reasons to work with the studio.' },
  { key: 'home.portfolio', page: 'home', label: 'Selected projects', description: 'Heading above the featured projects. Choose which projects appear in Portfolio → Featured.' },
  { key: 'home.services', page: 'home', label: 'Services & workflow', description: 'Heading above the core services and the process timeline.' },
  { key: 'home.journal', page: 'home', label: 'Blog preview', description: 'Heading above the two latest articles.' },

  // About
  { key: 'about.hero', page: 'about', label: 'Hero', description: 'The top of the About page.', media: [heroSlidesField('About')] },
  {
    key: 'about.story',
    page: 'about',
    label: 'Company overview',
    description: 'The studio story and key facts.',
    media: [{ key: 'image', type: 'image', label: 'Story photo', hint: 'Shown beside the story on large screens. Portrait format (4:5).' }],
  },
  {
    key: 'about.founder',
    page: 'about',
    label: 'Founder biography',
    description: 'The leadership section. The founder’s name, title and portrait are edited in Global Settings → Founder.',
  },
  { key: 'about.vision', page: 'about', label: 'Vision, mission & values', description: 'The studio’s vision, mission and value cards.' },
  {
    key: 'about.craft',
    page: 'about',
    label: 'Craftsmanship & quality control',
    description: 'The quality framework, with a row of three photos.',
    media: [{ key: 'images', type: 'images', label: 'Photo row', hint: 'Three portrait photos (3:4) work best.' }],
  },
  {
    key: 'about.materials',
    page: 'about',
    label: 'Materials & sustainability',
    description: 'The material cards.',
    media: [{ key: 'images', type: 'images', label: 'Card photos', hint: 'One photo per card, in the same order as the cards below.' }],
  },
  { key: 'about.metrics', page: 'about', label: 'Client trust numbers', description: 'The animated counters (years, projects…).' },

  // Portfolio
  { key: 'portfolio.hero', page: 'portfolio', label: 'Hero', description: 'The top of the Portfolio page.', media: [heroSlidesField('Portfolio')] },
  { key: 'portfolio', page: 'portfolio', label: 'Project grid labels', description: 'Filter and counter labels above the project grid.', exclude: ['hero'] },
  { key: 'project', page: 'portfolio', label: 'Project page labels', description: 'Headings and buttons used on every individual project page.' },

  // Services
  { key: 'services.hero', page: 'services', label: 'Hero', description: 'The top of the Services page.', media: [heroSlidesField('Services')] },
  { key: 'services.grid', page: 'services', label: 'Services heading', description: 'Heading above the service cards. The cards are edited in Services & Process.' },
  { key: 'services.workflow', page: 'services', label: 'Process heading', description: 'Heading above the process timeline. The steps are edited in Services & Process.' },
  { key: 'services.deliverables', page: 'services', label: 'Deliverables heading', description: 'Heading beside the deliverables accordion.' },
  { key: 'services.packages', page: 'services', label: 'Design packages', description: 'The three packages, the supervision fee and the comparison table.' },

  // Blog
  { key: 'blog.hero', page: 'blog', label: 'Hero', description: 'The top of the Blog page and every article.', media: [heroSlidesField('Blog')] },
  { key: 'blog', page: 'blog', label: 'Article list labels', description: 'Labels around the featured article and article grid.', exclude: ['hero', 'newsletter'] },
  { key: 'blog.newsletter', page: 'blog', label: 'Newsletter sign-up', description: 'The email sign-up band.' },
  { key: 'article', page: 'blog', label: 'Article page labels', description: 'Labels used on every article page.' },

  // Contact
  { key: 'contact.hero', page: 'contact', label: 'Hero', description: 'The top of the Contact page.', media: [heroSlidesField('Contact')] },
  { key: 'contact.intro', page: 'contact', label: 'Project brief introduction', description: 'Text beside the four-step brief form.' },
  { key: 'contact.form', page: 'contact', label: 'Project brief form', description: 'Every label, option, message and error in the four-step form.' },
  { key: 'contact.info', page: 'contact', label: 'Studio information', description: 'Card labels. The address, phones and email are edited in Global Settings → Contact.' },
  { key: 'contact.map', page: 'contact', label: 'Map section', description: 'Heading and button text. The map location is edited in Global Settings → Map.' },

  // Shared
  { key: 'cta', page: 'shared', label: 'Closing call-to-action banner', description: 'The Deep Indigo banner that closes most pages.' },
  { key: 'whatsapp', page: 'shared', label: 'WhatsApp chat widget', description: 'The chat bubble in the bottom corner of every page.' },
  {
    key: 'nav',
    page: 'shared',
    label: 'Header & menu',
    description: 'Header button, menu tagline and accessibility labels. Link names are edited in Global Settings → Navigation.',
    exclude: navLinkKeys,
  },
  { key: 'footer', page: 'shared', label: 'Footer text', description: 'Footer headings, tagline and credit text.' },
  { key: 'brand', page: 'shared', label: 'Brand name', description: 'The studio name as written in each language.' },
  { key: 'categories', page: 'shared', label: 'Project sectors', description: 'Names of the portfolio categories.' },
  { key: 'blogCategories', page: 'shared', label: 'Blog categories', description: 'Names of the blog categories.' },
  { key: 'common', page: 'shared', label: 'Common labels', description: 'Small labels reused across the site.' },
  { key: 'hero', page: 'shared', label: 'Photo slider controls', description: 'Slider accessibility labels and the vertical “Follow us” text.' },
  { key: 'notFound', page: 'shared', label: 'Page not found (404)', description: 'Shown when a visitor opens a link that does not exist.' },
];

export const sectionsByKey = new Map(contentSections.map((section) => [section.key, section]));

/** Built-in photographs for each section with media. */
export const defaultMedia = {
  'home.hero': { slides: heroSlides.home },
  'home.about': { primaryImage: pageImages.homeAboutPrimary as string, secondaryImage: pageImages.homeAboutSecondary as string },
  'about.hero': { slides: heroSlides.about },
  'about.story': { image: pageImages.aboutStory as string },
  'about.craft': { images: [...pageImages.craft] as string[] },
  'about.materials': {
    images: [pageImages.materials.stone, pageImages.materials.timber, pageImages.materials.metal, pageImages.materials.sustainable] as string[],
  },
  'portfolio.hero': { slides: heroSlides.portfolio },
  'services.hero': { slides: heroSlides.services },
  'blog.hero': { slides: heroSlides.journal },
  'contact.hero': { slides: heroSlides.contact },
} satisfies Record<string, Record<string, string | string[] | HeroSlide[]>>;

export type MediaMap = typeof defaultMedia;
export type MediaSection = keyof MediaMap;
