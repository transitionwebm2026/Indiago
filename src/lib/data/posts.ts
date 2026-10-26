import type { Localized } from '@/lib/i18n/types';
import { site } from '@/lib/site';

export type BlogCategory = 'heritage' | 'design-trends' | 'material-selection' | 'space-planning' | 'client-guides';

export const blogCategories: BlogCategory[] = ['heritage', 'design-trends', 'material-selection', 'space-planning', 'client-guides'];

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[] };

export type AuthorId = 'founder' | 'studio';

export const authorIds: AuthorId[] = ['founder', 'studio'];

export interface Author {
  name: Localized;
  role: Localized;
  initials: string;
  portrait?: string;
}

/** The founder's byline follows the studio settings, so it changes with them in the CMS. */
export function buildAuthors(founder: Author): Record<AuthorId, Author> {
  return {
    founder,
    studio: {
      name: { en: 'Indigo Design Studio', ar: 'استوديو إنديجو للتصميم' },
      role: { en: 'Editorial team', ar: 'فريق التحرير' },
      initials: 'ID',
    },
  };
}

export const authors = buildAuthors(site.founder);

export function isBlogCategory(value: string): value is BlogCategory {
  return (blogCategories as string[]).includes(value);
}

/** What article cards and listings need — everything except the body. */
export interface PostSummary {
  slug: string;
  title: Localized;
  excerpt: Localized;
  category: BlogCategory;
  author: AuthorId;
  /** ISO date, YYYY-MM-DD */
  date: string;
  /** Minutes */
  readTime: number;
  cover: string;
  featured?: boolean;
}

export interface Post extends PostSummary {
  /** Long-form article body (English). */
  body: ArticleBlock[];
  /** Arabic translation of the body. Without one, Arabic readers see the English body with a notice. */
  bodyAr?: ArticleBlock[];
}

/**
 * The built-in blog articles without their text, which lives in post-bodies.ts so that listings
 * don't download it. Each entry generates a static page at /blog/[slug]/. Keep them ordered newest first.
 */
export const postSummaries: PostSummary[] = [
  {
    slug: 'arabian-heritage-modern-majlis',
    title: {
      en: 'Designing with Arabian Heritage: The Modern Majlis',
      ar: 'التصميم المستوحى من التراث العربي: المجلس بروح معاصرة',
    },
    excerpt: {
      en: 'Wind towers, carved doors, Sadu weaving and the generous majlis — how the architecture of the Arabian Gulf translates into calm, contemporary interiors.',
      ar: 'البراجيل والأبواب المنحوتة ونسيج السدو والمجلس الرحب: كيف تتحوّل عمارة الخليج العربي إلى مساحات داخلية معاصرة وهادئة.',
    },
    category: 'heritage',
    author: 'studio',
    date: '2026-10-24',
    readTime: 6,
    cover: '1789503801961-3096de961552',
    featured: true,
  },
  {
    slug: 'islamic-cairo-mashrabiya-geometry-light',
    title: {
      en: 'Islamic Cairo at Home: Mashrabiya, Geometry and Light',
      ar: 'القاهرة الإسلامية في بيتك: المشربية والزخارف الهندسية والضوء',
    },
    excerpt: {
      en: 'The historic houses of Cairo were masterclasses in privacy, ventilation and craft. What their courtyards, mashrabiya and marble floors can teach a modern interior.',
      ar: 'كانت بيوت القاهرة التاريخية دروسًا في الخصوصية والتهوية والحِرفة. ماذا تعلّمنا أفنيتها ومشربياتها وأرضياتها الرخامية في تصميم المساحات الحديثة؟',
    },
    category: 'heritage',
    author: 'studio',
    date: '2026-10-24',
    readTime: 6,
    cover: '1647108694462-7cb5b9efdec6',
  },
  {
    slug: 'pharaonic-heritage-modern-interiors',
    title: {
      en: 'Pharaonic Heritage, Modern Interiors: Designing with Ancient Egypt',
      ar: 'التراث الفرعوني في التصميم الحديث: مساحات مستوحاة من مصر القديمة',
    },
    excerpt: {
      en: 'Lotus columns, limestone, gold and lapis blue — how to bring the timeless order of ancient Egyptian design into a contemporary home without turning it into a theme.',
      ar: 'أعمدة اللوتس والحجر الجيري والذهب والأزرق اللازوردي: كيف تُدخل نظام التصميم المصري القديم إلى منزل معاصر دون أن يتحوّل إلى ديكور مسرحي.',
    },
    category: 'heritage',
    author: 'studio',
    date: '2026-10-24',
    readTime: 6,
    cover: '1761143487063-c74ad86b5eee',
  },
  {
    slug: 'coptic-heritage-linen-inlaid-wood',
    title: {
      en: 'Coptic Heritage: Linen, Inlaid Wood and Quiet Sacred Light',
      ar: 'التراث القبطي: الكتان والخشب المطعّم والضوء الهادئ',
    },
    excerpt: {
      en: 'Old Cairo’s churches and the treasures of the Coptic Museum hold one of Egypt’s most refined craft traditions — woven linen, inlaid screens and calm, softly lit rooms.',
      ar: 'تحتفظ كنائس مصر القديمة وكنوز المتحف القبطي بواحد من أرقى التقاليد الحِرفية في مصر: الكتان المنسوج، والحواجز الخشبية المطعّمة، والغرف الهادئة ذات الضوء الناعم.',
    },
    category: 'heritage',
    author: 'studio',
    date: '2026-10-24',
    readTime: 5,
    cover: '1678747365854-a0a68fd24725',
  },
  {
    slug: 'khedivial-cairo-belle-epoque-interiors',
    title: {
      en: 'Khedivial Cairo: Belle Époque Elegance for Modern Homes',
      ar: 'القاهرة الخديوية: أناقة الزمن الجميل في البيوت المعاصرة',
    },
    excerpt: {
      en: 'High ceilings, plaster cornices, herringbone parquet and wrought-iron balconies — how downtown Cairo’s grand apartments inspire timeless classic interiors.',
      ar: 'أسقف عالية، وكرانيش جبسية، وباركيه بنقشة عظم السمكة، وبلكونات من الحديد المشغول: كيف تُلهم شقق وسط القاهرة العريقة تصاميم كلاسيكية لا يحدّها زمن.',
    },
    category: 'heritage',
    author: 'studio',
    date: '2026-10-24',
    readTime: 5,
    cover: '1724921812241-6554e4703ef0',
  },
  {
    slug: 'nubian-heritage-colour-domes-handcraft',
    title: {
      en: 'Nubian Heritage: Colour, Domes and Handcraft',
      ar: 'التراث النوبي: الألوان والقباب والحِرف اليدوية',
    },
    excerpt: {
      en: 'The villages of Nubia near Aswan are among Egypt’s most joyful architecture. What their domes, painted walls and woven crafts can bring to a modern home.',
      ar: 'تُعدّ القرى النوبية قرب أسوان من أكثر العمارة المصرية بهجة. ماذا يمكن أن تضيفه قبابها وحوائطها الملوّنة وحِرفها المنسوجة إلى منزل عصري؟',
    },
    category: 'heritage',
    author: 'studio',
    date: '2026-10-24',
    readTime: 5,
    cover: '1657569802830-53d59cbc708f',
  },
  {
    slug: 'moroccan-andalusian-heritage-zellige-tadelakt',
    title: {
      en: 'Moroccan and Andalusian Heritage: Zellige, Tadelakt and the Riad',
      ar: 'التراث المغربي والأندلسي: الزليج والتادلاكت وبيت الرياض',
    },
    excerpt: {
      en: 'From Granada’s Alhambra to the riads of Marrakesh, a design heritage built on courtyards, water and extraordinary craft — and how to use it with restraint.',
      ar: 'من قصر الحمراء في غرناطة إلى رياضات مراكش، تراث تصميم يقوم على الأفنية والماء والحِرفة الاستثنائية، وكيف تستخدمه باعتدال.',
    },
    category: 'heritage',
    author: 'studio',
    date: '2026-10-24',
    readTime: 6,
    cover: '1750859464437-b66433efd869',
  },
  {
    slug: 'damascene-house-levantine-heritage',
    title: {
      en: 'The Damascene House: Levantine Heritage in Contemporary Design',
      ar: 'البيت الدمشقي: التراث الشامي في التصميم المعاصر',
    },
    excerpt: {
      en: 'Courtyards with fountains, striped stone, painted wood and mother-of-pearl inlay — the Levantine house as a lesson in layered, liveable luxury.',
      ar: 'أفنية بنوافير، وحجر مخطّط، وخشب ملوّن، وتطعيم بالصدف: البيت الشامي درس في الفخامة المتعددة الطبقات والصالحة للعيش.',
    },
    category: 'heritage',
    author: 'studio',
    date: '2026-10-24',
    readTime: 6,
    cover: '1781973358123-3450d3093bd4',
  },
  {
    slug: 'quiet-luxury-interior-trends-2026',
    title: {
      en: 'Quiet Luxury: The Interior Trends Shaping 2026',
      ar: 'الفخامة الهادئة: اتجاهات التصميم الداخلي في 2026',
    },
    excerpt: {
      en: 'Why the most sought-after interiors this year whisper rather than shout — and how to bring that calm, tactile restraint into your own home.',
      ar: 'لماذا تهمس أكثر التصاميم الداخلية رواجًا هذا العام بدلًا من أن تصرخ، وكيف تُدخل هذا الهدوء الملموس إلى منزلك.',
    },
    category: 'design-trends',
    author: 'founder',
    date: '2026-09-14',
    readTime: 7,
    cover: '1606744888344-493238951221',
  },
  {
    slug: 'choosing-natural-stone',
    title: {
      en: 'Marble, Travertine or Onyx? A Guide to Choosing Natural Stone',
      ar: 'رخام أم ترافرتين أم أونيكس؟ دليلك لاختيار الحجر الطبيعي',
    },
    excerpt: {
      en: 'Each natural stone behaves differently underfoot, under water and under light. Here is how we match stone to the room it will live in.',
      ar: 'يختلف سلوك كل حجر طبيعي تحت الأقدام وتحت الماء وتحت الضوء. إليك كيف نختار الحجر المناسب للمساحة التي سيعيش فيها.',
    },
    category: 'material-selection',
    author: 'studio',
    date: '2026-08-28',
    readTime: 6,
    cover: '1566305977571-5666677c6e98',
  },
  {
    slug: 'space-planning-daily-rituals',
    title: {
      en: 'Planning Around Daily Rituals: Space Planning That Lasts',
      ar: 'التخطيط حول روتينك اليومي: تخطيط مساحات يدوم',
    },
    excerpt: {
      en: 'Good space planning starts with a diary, not a floor plan. How mapping daily routines leads to layouts that still work years later.',
      ar: 'يبدأ التخطيط الجيد للمساحات من يومياتك لا من المخطط. كيف يقود فهم الروتين اليومي إلى توزيع يظل عمليًا لسنوات.',
    },
    category: 'space-planning',
    author: 'studio',
    date: '2026-08-10',
    readTime: 5,
    cover: '1503174971373-b1f69850bded',
  },
  {
    slug: 'shell-and-core-to-handover',
    title: {
      en: 'From Shell & Core to Handover: What to Expect',
      ar: 'من الوحدة الخام إلى التسليم: ماذا تتوقع؟',
    },
    excerpt: {
      en: 'A clear, stage-by-stage guide to a turnkey interior project — what happens, what you approve and what you receive along the way.',
      ar: 'دليل واضح مرحلة بمرحلة لمشروع تصميم داخلي متكامل: ماذا يحدث، وما الذي تعتمده، وما الذي تستلمه في كل خطوة.',
    },
    category: 'client-guides',
    author: 'founder',
    date: '2026-07-22',
    readTime: 8,
    cover: '1503387762-592deb58ef4e',
  },
  {
    slug: 'layered-lighting',
    title: {
      en: 'Layered Lighting: Designing Rooms That Change With the Day',
      ar: 'الإضاءة متعددة الطبقات: غرف تتغيّر مع ساعات اليوم',
    },
    excerpt: {
      en: 'Ambient, task and accent lighting working together — the simplest way to make a well-designed room feel extraordinary.',
      ar: 'الإضاءة العامة والوظيفية والتجميلية حين تعمل معًا: أبسط طريقة لتجعل الغرفة المصمّمة جيدًا استثنائية.',
    },
    category: 'space-planning',
    author: 'studio',
    date: '2026-07-05',
    readTime: 6,
    cover: '1617098900591-3f90928e8c54',
  },
  {
    slug: 'natural-timber-egypt-climate',
    title: {
      en: 'Specifying Natural Timber for Egypt’s Climate',
      ar: 'اختيار الأخشاب الطبيعية لمناخ مصر',
    },
    excerpt: {
      en: 'Heat, dust and dry air test every wooden surface. How we choose, treat and detail timber so it stays beautiful for years.',
      ar: 'الحرارة والغبار والهواء الجاف تختبر كل سطح خشبي. كيف نختار الخشب ونعالجه ونفصّله ليبقى جميلًا لسنوات.',
    },
    category: 'material-selection',
    author: 'studio',
    date: '2026-06-18',
    readTime: 5,
    cover: '1600047508788-786f3865b4b9',
  },
  {
    slug: 'how-to-brief-your-interior-designer',
    title: {
      en: 'How to Brief Your Interior Designer',
      ar: 'كيف تكتب ملخص مشروعك لمصمّمك الداخلي',
    },
    excerpt: {
      en: 'The questions to answer before your first meeting — and why a clear brief saves time, budget and revisions.',
      ar: 'الأسئلة التي يجب أن تجيب عنها قبل اجتماعك الأول، ولماذا يوفّر الملخص الواضح الوقت والميزانية والتعديلات.',
    },
    category: 'client-guides',
    author: 'studio',
    date: '2026-06-01',
    readTime: 4,
    cover: '1615875605825-5eb9bb5d52ac',
  },
];

export function getFeaturedPost<T extends PostSummary>(list: T[]): T | undefined {
  return list.find((post) => post.featured) ?? list[0];
}

export function getRelatedPosts<T extends PostSummary>(list: T[], slug: string, limit = 3) {
  const current = list.find((post) => post.slug === slug);
  const others = list.filter((post) => post.slug !== slug);
  if (!current) return others.slice(0, limit);
  const sameCategory = others.filter((post) => post.category === current.category);
  const rest = others.filter((post) => post.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

