import type { Localized } from '@/lib/i18n/types';

export type ProjectCategory = 'residential' | 'hospitality' | 'government' | 'healthcare';

export const projectCategories: ProjectCategory[] = ['residential', 'hospitality', 'government', 'healthcare'];

export function isProjectCategory(value: string): value is ProjectCategory {
  return (projectCategories as string[]).includes(value);
}

/** A before/after photograph pair, compared with a slider on the project page. */
export interface BeforeAfterPair {
  before: string;
  after: string;
  caption: Localized;
}

/** A 3D render shown against the photograph of the finished space. */
export interface RenderRealPair {
  render: string;
  real: string;
  caption: Localized;
}

export interface Project {
  /** URL slug: /portfolio/[id]/ */
  id: string;
  title: Localized;
  category: ProjectCategory;
  location: Localized;
  /** Short scope line, e.g. "Design & turnkey fit-out · 420 sqm". */
  scope?: Localized;
  /** ISO date (YYYY-MM-DD) the project was completed. */
  completed?: string;
  /** Signature elements of the space, shown as tags. */
  highlights: Localized[];
  summary: Localized;
  /** Long-form design story. */
  concept: Localized[];
  materials: { name: Localized; detail: Localized }[];
  /** IDs of the services delivered — see lib/data/services.ts */
  services: string[];
  /** Image ID or /public path — see lib/images.ts. The cover also fills the project's hero, so use a large landscape image. */
  cover: string;
  gallery: string[];
  beforeAfter?: BeforeAfterPair[];
  renderReal?: RenderRealPair[];
  featured?: boolean;
}

const locations = {
  abuDhabi: { en: 'Abu Dhabi, UAE', ar: 'أبوظبي، الإمارات' },
  cairo: { en: 'Cairo, Egypt', ar: 'القاهرة، مصر' },
  giza: { en: 'Giza, Egypt', ar: 'الجيزة، مصر' },
} satisfies Record<string, Localized>;

/**
 * Selected projects from the 2026 company profile, in the profile's order.
 * Each entry automatically generates a static page at /portfolio/[id]/.
 */
export const projects: Project[] = [
  {
    id: 'mynt-restaurant',
    title: { en: 'Mynt Restaurant', ar: 'مطعم مينت' },
    category: 'hospitality',
    location: locations.abuDhabi,
    highlights: [
      { en: 'Lattice Screens', ar: 'سواتر مفرّغة' },
      { en: 'Private Dining', ar: 'غرفة طعام خاصة' },
      { en: 'Feature Bar', ar: 'كاونتر رئيسي' },
    ],
    summary: {
      en: 'A contemporary dining destination defined by warm wood tones, soft ambient lighting and clean modern lines.',
      ar: 'مطعم معاصر بخشب دافئ وإضاءة هادئة وخطوط بسيطة نظيفة.',
    },
    concept: [
      {
        en: 'Natural textures meet elegant finishes to create a calm, refined atmosphere. Bronze lattice screens, marble-clad private dining and a timber-faced bar add depth, while a balanced palette of greens and golds keeps the space inviting.',
        ar: 'أردنا أجواء هادئة وراقية، فجمعنا بين الخامات الطبيعية والتشطيبات الأنيقة. السواتر البرونزية المفرّغة تعطي الصالة عمقًا، وغرفة الطعام الخاصة مكسوّة بالرخام، والكاونتر بواجهة خشبية. أما الألوان فمزيج متوازن من الأخضر والذهبي يجعل المكان مريحًا ومرحّبًا.',
      },
    ],
    materials: [
      {
        name: { en: 'Bronze lattice screens', ar: 'سواتر برونزية مفرّغة' },
        detail: { en: 'Add depth across the dining floor', ar: 'تعطي صالة الطعام عمقًا' },
      },
      {
        name: { en: 'Marble cladding', ar: 'كسوة رخام' },
        detail: { en: 'Private dining room', ar: 'غرفة الطعام الخاصة' },
      },
      {
        name: { en: 'Timber facing', ar: 'واجهة خشبية' },
        detail: { en: 'Feature bar', ar: 'الكاونتر الرئيسي' },
      },
      {
        name: { en: 'Warm wood tones', ar: 'خشب بدرجات دافئة' },
        detail: { en: 'Natural textures throughout', ar: 'خامات طبيعية في كل المكان' },
      },
      {
        name: { en: 'Greens & golds', ar: 'الأخضر والذهبي' },
        detail: { en: 'A balanced, inviting palette', ar: 'ألوان متوازنة ومريحة' },
      },
    ],
    services: ['interior-design', 'fit-out', 'joinery-styling'],
    cover: '/images/projects/mynt-restaurant/01.jpg',
    gallery: [
      '/images/projects/mynt-restaurant/02.jpg',
      '/images/projects/mynt-restaurant/03.jpg',
      '/images/projects/mynt-restaurant/04.jpg',
      '/images/projects/mynt-restaurant/05.jpg',
    ],
    featured: true,
  },
  {
    id: 'arabian-majlis',
    title: { en: 'Arabian Majlis', ar: 'المجلس العربي' },
    category: 'residential',
    location: locations.abuDhabi,
    highlights: [
      { en: 'Arabic Detailing', ar: 'تفاصيل عربية' },
      { en: 'Bespoke Joinery', ar: 'نجارة تفصيل' },
      { en: 'Feature Lighting', ar: 'إضاءة مميّزة' },
    ],
    summary: {
      en: 'A luxurious majlis that honours classic Arabic detailing in a spacious, welcoming layout.',
      ar: 'مجلس فخم بتفاصيل عربية كلاسيكية، واسع ومريح لاستقبال الضيوف.',
    },
    concept: [
      {
        en: 'Soft neutral tones, carved timber screens and arched niches frame generous seating. Traditional rugs and ornate chandeliers complete a setting made for hospitality and family gatherings.',
        ar: 'ألوان محايدة هادئة، ومشربيات خشبية محفورة، وتجاويف مقوّسة حول جلسات واسعة. ومع السجاد التقليدي والثريات المزخرفة، أصبح المجلس مكانًا مثاليًا للضيافة وجمعات العائلة.',
      },
    ],
    materials: [
      {
        name: { en: 'Carved timber screens', ar: 'مشربيات خشبية محفورة' },
        detail: { en: 'Classic Arabic detailing', ar: 'تفاصيل عربية كلاسيكية' },
      },
      {
        name: { en: 'Arched niches', ar: 'تجاويف مقوّسة' },
        detail: { en: 'Framing generous seating', ar: 'تحيط بالجلسات' },
      },
      {
        name: { en: 'Ornate chandeliers', ar: 'ثريات مزخرفة' },
        detail: { en: 'Feature lighting', ar: 'إضاءة مميّزة' },
      },
      {
        name: { en: 'Traditional rugs', ar: 'سجاد تقليدي' },
        detail: { en: 'Warmth for family gatherings', ar: 'دفء لجمعات العائلة' },
      },
      {
        name: { en: 'Soft neutral tones', ar: 'ألوان محايدة هادئة' },
        detail: { en: 'A calm backdrop for hospitality', ar: 'خلفية هادئة للضيافة' },
      },
    ],
    services: ['interior-design', 'finishing', 'joinery-styling'],
    cover: '/images/projects/arabian-majlis/01.jpg',
    gallery: ['/images/projects/arabian-majlis/02.jpg', '/images/projects/arabian-majlis/03.jpg'],
  },
  {
    id: 'department-of-finance',
    title: { en: 'Department of Finance', ar: 'دائرة المالية' },
    category: 'government',
    location: locations.abuDhabi,
    highlights: [
      { en: 'Reception', ar: 'الاستقبال' },
      { en: 'Glass Partitions', ar: 'قواطيع زجاجية' },
      { en: 'Feature Screen', ar: 'ساتر فني' },
    ],
    summary: {
      en: 'A modern corporate interior that is professional, secure and welcoming.',
      ar: 'مساحة إدارية حديثة: عملية، وآمنة، ومرحّبة بالزوار.',
    },
    concept: [
      {
        en: 'Sleek glass partitions, warm timber and patterned stone flooring set the tone, with contemporary reception desks and a sculptural Arabic-geometry screen as the centrepiece. Clean lines, soft lighting and metallic accents carry through the public areas.',
        ar: 'القواطيع الزجاجية والخشب الدافئ وأرضيات الحجر المنقوشة تحدد طابع المكان، ومكاتب الاستقبال عصرية، وفي المنتصف ساتر بزخارف هندسية عربية يلفت النظر. وتستمر الخطوط البسيطة والإضاءة الناعمة واللمسات المعدنية في كل المناطق العامة.',
      },
    ],
    materials: [
      {
        name: { en: 'Glass partitions', ar: 'قواطيع زجاجية' },
        detail: { en: 'Sleek, secure public areas', ar: 'مناطق عامة أنيقة وآمنة' },
      },
      {
        name: { en: 'Warm timber', ar: 'خشب دافئ' },
        detail: { en: 'Wall cladding', ar: 'كسوة الحوائط' },
      },
      {
        name: { en: 'Patterned stone flooring', ar: 'أرضيات حجر منقوشة' },
        detail: { en: 'Reception & public areas', ar: 'الاستقبال والمناطق العامة' },
      },
      {
        name: { en: 'Arabic-geometry screen', ar: 'ساتر بزخارف هندسية عربية' },
        detail: { en: 'Sculptural centrepiece', ar: 'القطعة الأبرز في المكان' },
      },
      {
        name: { en: 'Contemporary reception desks', ar: 'مكاتب استقبال عصرية' },
        detail: { en: 'A welcoming front of house', ar: 'استقبال لائق للزوار' },
      },
      {
        name: { en: 'Metallic accents', ar: 'لمسات معدنية' },
        detail: { en: 'Carried through the public areas', ar: 'في كل المناطق العامة' },
      },
    ],
    services: ['fit-out', 'finishing', 'design-execution'],
    cover: '/images/projects/department-of-finance/01.jpg',
    gallery: ['/images/projects/department-of-finance/02.jpg', '/images/projects/department-of-finance/03.jpg'],
    featured: true,
  },
  {
    id: 'al-borg-laboratories',
    title: { en: 'Al Borg Laboratories', ar: 'معامل البرج' },
    category: 'healthcare',
    location: locations.cairo,
    highlights: [
      { en: 'Brand Integration', ar: 'الهوية البصرية' },
      { en: 'Reception', ar: 'الاستقبال' },
      { en: 'Ceilings & Lighting', ar: 'الأسقف والإضاءة' },
    ],
    summary: {
      en: 'A clean, modern reception that puts the client’s brand at the center of the patient experience.',
      ar: 'استقبال نظيف وعصري، وهوية المعامل حاضرة فيه من أول لحظة.',
    },
    concept: [
      {
        en: 'Back-lit yellow glass panels follow Al Borg’s brand identity, set against crisp white walls, timber cladding and glossy black flooring. A sleek, minimalist reception desk keeps the space efficient and easy to maintain.',
        ar: 'ألواح زجاج أصفر بإضاءة خلفية بنفس لون هوية معامل البرج، على حوائط بيضاء وكسوة خشب وأرضيات سوداء لامعة. ومكتب الاستقبال بسيط وأنيق، عملي في الاستخدام وسهل في التنظيف والصيانة.',
      },
    ],
    materials: [
      {
        name: { en: 'Back-lit yellow glass', ar: 'زجاج أصفر بإضاءة خلفية' },
        detail: { en: 'Panels in the brand’s colours', ar: 'بألوان هوية المعامل' },
      },
      {
        name: { en: 'Timber cladding', ar: 'كسوة خشب' },
        detail: { en: 'Reception feature wall', ar: 'حائط الاستقبال' },
      },
      {
        name: { en: 'Glossy black flooring', ar: 'أرضيات سوداء لامعة' },
        detail: { en: 'Reception & corridors', ar: 'الاستقبال والممرات' },
      },
      {
        name: { en: 'Minimalist reception desk', ar: 'مكتب استقبال بسيط' },
        detail: { en: 'Efficient and easy to maintain', ar: 'عملي وسهل الصيانة' },
      },
      {
        name: { en: 'Crisp white walls', ar: 'حوائط بيضاء' },
        detail: { en: 'A clean, bright backdrop', ar: 'خلفية نظيفة ومضيئة' },
      },
    ],
    services: ['fit-out', 'finishing', 'design-execution'],
    cover: '/images/projects/al-borg-laboratories/01.jpg',
    gallery: ['/images/projects/al-borg-laboratories/02.jpg', '/images/projects/al-borg-laboratories/03.jpg'],
  },
  {
    id: 'sun-capital-residence',
    title: { en: 'Sun Capital Residence', ar: 'منزل صن كابيتال' },
    category: 'residential',
    location: locations.giza,
    highlights: [
      { en: 'Marble Works', ar: 'أعمال الرخام' },
      { en: 'Feature Wall', ar: 'حائط ديكوري' },
      { en: 'Roof Terrace', ar: 'الروف' },
    ],
    summary: {
      en: 'A minimal, inviting home with crafted details from the entrance to the roof terrace.',
      ar: 'بيت بسيط ومريح، وتفاصيله مدروسة من المدخل حتى الروف.',
    },
    concept: [
      {
        en: 'Book-matched marble floors and a floating marble stair lead past a warm illuminated timber feature wall. Modular seating, built-in storage and subtle colour accents shape the living spaces, while a pergola terrace extends the home outdoors.',
        ar: 'في المدخل أرضيات رخام بعروق متقابلة وسلم رخام معلّق، يقودانك إلى حائط خشبي بإضاءة دافئة. وفي المعيشة جلسات مرنة ووحدات تخزين مدمجة ولمسات لون هادئة، وعلى الروف برجولا تمدّ البيت إلى الخارج.',
      },
    ],
    materials: [
      {
        name: { en: 'Book-matched marble', ar: 'رخام بعروق متقابلة' },
        detail: { en: 'Entrance floors', ar: 'أرضيات المدخل' },
      },
      {
        name: { en: 'Floating marble stair', ar: 'سلم رخام معلّق' },
        detail: { en: 'Entrance hall', ar: 'بهو المدخل' },
      },
      {
        name: { en: 'Illuminated timber feature wall', ar: 'حائط خشبي بإضاءة' },
        detail: { en: 'Warm, back-lit joinery', ar: 'نجارة دافئة بإضاءة خلفية' },
      },
      {
        name: { en: 'Built-in storage', ar: 'وحدات تخزين مدمجة' },
        detail: { en: 'Living spaces', ar: 'مساحات المعيشة' },
      },
      {
        name: { en: 'Pergola', ar: 'برجولا' },
        detail: { en: 'Roof terrace', ar: 'الروف' },
      },
    ],
    services: ['interior-design', 'finishing', 'joinery-styling'],
    cover: '/images/projects/sun-capital-residence/01.jpg',
    gallery: ['/images/projects/sun-capital-residence/02.jpg', '/images/projects/sun-capital-residence/03.jpg'],
    featured: true,
  },
];

/** Up to three featured projects for the home page, topped up with the first others when fewer are flagged. */
export function getFeaturedProjects(list: Project[], count = 3) {
  const featured = list.filter((project) => project.featured);
  return [...featured, ...list.filter((project) => !project.featured)].slice(0, Math.min(count, list.length));
}

export function getProject(id: string, list: Project[] = projects) {
  return list.find((project) => project.id === id);
}

export function getNextProject(id: string, list: Project[] = projects) {
  const index = list.findIndex((project) => project.id === id);
  return list[(index + 1) % list.length];
}
