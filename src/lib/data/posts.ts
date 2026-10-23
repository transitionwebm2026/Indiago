import type { Localized } from '@/lib/i18n/types';

export type BlogCategory = 'design-trends' | 'material-selection' | 'space-planning' | 'client-guides';

export const blogCategories: BlogCategory[] = ['design-trends', 'material-selection', 'space-planning', 'client-guides'];

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[] };

export type AuthorId = 'founder' | 'studio';

export const authors: Record<AuthorId, { name: Localized; role: Localized; initials: string }> = {
  founder: {
    name: { en: 'Ahmed Abomosallam', ar: 'أحمد أبومسلم' },
    role: { en: 'Founder & Managing Director', ar: 'المؤسس والعضو المنتدب' },
    initials: 'AA',
  },
  studio: {
    name: { en: 'Indigo Design Studio', ar: 'استوديو إنديجو للتصميم' },
    role: { en: 'Editorial team', ar: 'فريق التحرير' },
    initials: 'ID',
  },
};

export interface Post {
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
  /** Long-form article body (English). */
  body: ArticleBlock[];
  featured?: boolean;
}

/**
 * Blog articles — each entry generates a static page at /blog/[slug]/.
 * Keep them ordered newest first.
 */
export const posts: Post[] = [
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
    featured: true,
    body: [
      {
        type: 'p',
        text: 'Luxury in interiors has quietly changed its accent. The statement pieces and high-gloss surfaces that defined the last decade are giving way to something calmer: rooms that feel expensive because of how they are made, not how loudly they announce it.',
      },
      { type: 'h2', text: 'Texture over ornament' },
      {
        type: 'p',
        text: 'The richest rooms of 2026 rely on touch. Honed travertine, limewashed walls, bouclé and linen upholstery, and timber with a visible grain create depth without visual noise. When surfaces are this tactile, decoration becomes almost unnecessary.',
      },
      { type: 'h2', text: 'A warmer, deeper neutral palette' },
      {
        type: 'p',
        text: 'Stark white is retreating. In its place are layered neutrals — ivory, linen, sand and mushroom — anchored by one deep tone such as ink blue, aubergine or tobacco. The contrast gives a room structure while keeping it restful.',
      },
      {
        type: 'quote',
        text: 'A room should feel considered from every seat in it — not only from the doorway where it is photographed.',
      },
      { type: 'h2', text: 'Fewer, better pieces' },
      {
        type: 'p',
        text: 'Quiet luxury favours investment furniture with craft behind it: a solid-timber dining table, a sculptural lounge chair, a hand-finished console. We encourage clients to commission and source slowly, allowing a home to gather character over time.',
      },
      {
        type: 'list',
        items: [
          'Choose natural materials that patinate gracefully',
          'Limit the palette to three or four tones per room',
          'Invest in lighting that can be layered and dimmed',
          'Hide storage so surfaces stay calm',
        ],
      },
      { type: 'h2', text: 'Light as the final material' },
      {
        type: 'p',
        text: 'Finally, light does the heavy lifting. Concealed linear lighting, warm 2700K sources and well-placed lamps let the same room shift from bright and practical by day to intimate by night — the essence of a space that is truly lived in.',
      },
    ],
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
    body: [
      {
        type: 'p',
        text: 'Natural stone is one of the most enduring investments you can make in an interior — and one of the easiest to get wrong. Beauty is only half of the decision; the other half is how the stone performs in the specific room, light and routine it will face.',
      },
      { type: 'h2', text: 'Marble: timeless, but honest about wear' },
      {
        type: 'p',
        text: 'Marble’s veining is unmatched for feature walls, vanities and statement floors. It is, however, a calcareous stone: acids such as lemon juice or harsh cleaners will etch a polished surface. In kitchens we often recommend a honed finish, which disguises wear and develops a soft patina.',
      },
      { type: 'h2', text: 'Travertine: warmth and texture' },
      {
        type: 'p',
        text: 'Travertine’s natural pores and warm tones suit relaxed, Mediterranean-inspired interiors. Filled and honed, it makes a beautiful, practical floor; left unfilled, it is ideal for textured feature walls and exterior cladding.',
      },
      { type: 'h2', text: 'Onyx: drama with light' },
      {
        type: 'p',
        text: 'Onyx is translucent, which makes it spectacular when backlit — on a bar front, a reception desk or a powder-room wall. It is softer and more fragile than marble, so we reserve it for low-traffic, high-impact surfaces.',
      },
      { type: 'h2', text: 'Our selection checklist' },
      {
        type: 'list',
        items: [
          'Visit the stone yard and select slabs in person',
          'Book-match slabs where veining continues across joints',
          'Confirm thickness, finish and edge details in the drawings',
          'Seal correctly and hand over a simple care guide',
        ],
      },
      {
        type: 'p',
        text: 'Selected and detailed this way, natural stone does more than decorate a room — it becomes the material memory of the home.',
      },
    ],
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
    body: [
      {
        type: 'p',
        text: 'Most layouts fail quietly. A door swings into the only clear wall, the dining table sits too far from the kitchen, or storage ends up where nobody needs it. These are not styling problems — they are planning problems, and they are solved before any finish is chosen.',
      },
      { type: 'h2', text: 'Start with a day in the life' },
      {
        type: 'p',
        text: 'At the beginning of every residential project we map a typical weekday and weekend: who wakes first, where school bags land, how guests are received, where everyone gathers at night. Those patterns become the skeleton of the plan.',
      },
      { type: 'h2', text: 'Zones, not just rooms' },
      {
        type: 'p',
        text: 'Open-plan living works best when it is subtly zoned. Rugs, ceiling changes, lighting circuits and joinery can define areas for cooking, dining and lounging without walls — keeping light and conversation flowing.',
      },
      {
        type: 'list',
        items: [
          'Keep primary circulation routes 90–120 cm wide',
          'Place storage at the point of use, not where it is easiest to build',
          'Plan sockets and lighting around furniture, not walls',
          'Leave flexible space for the way a family will change',
        ],
      },
      { type: 'h2', text: 'Design for the next ten years' },
      {
        type: 'p',
        text: 'A nursery becomes a study; a study becomes a teenager’s room. We design with adaptable joinery and neutral infrastructure so the home can evolve without major works.',
      },
    ],
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
    body: [
      {
        type: 'p',
        text: 'For many clients, a shell-and-core unit is both exciting and daunting: a blank canvas, but also hundreds of decisions. Understanding the sequence of a turnkey project removes most of the uncertainty.',
      },
      { type: 'h2', text: '1. Discovery and survey' },
      {
        type: 'p',
        text: 'We begin with a detailed brief and a measured survey of the unit, recording levels, openings and existing services. This is when budget and timeline are aligned — before design begins, not after.',
      },
      { type: 'h2', text: '2. Concept and approvals' },
      {
        type: 'p',
        text: 'Space plans, mood boards and 3D renders establish the direction. You review and approve the concept before we invest time in technical drawings, which keeps revisions efficient.',
      },
      { type: 'h2', text: '3. Technical design' },
      {
        type: 'p',
        text: 'The approved concept becomes a full set of working drawings: ceilings, lighting, power, MEP coordination, joinery and a complete finishes schedule. This set is what allows contractors to build accurately.',
      },
      { type: 'h2', text: '4. Execution on site' },
      {
        type: 'list',
        items: [
          'First fix: partitions, MEP routes and ceiling frames',
          'Inspections before walls and ceilings are closed',
          'Second fix: finishes, joinery and fixtures',
          'Furniture, lighting and soft furnishings installed',
        ],
      },
      { type: 'h2', text: '5. Snagging and handover' },
      {
        type: 'p',
        text: 'Before handover we walk every room with a detailed snag list and close each item. You receive as-built documentation, warranties and a care guide — and a space that is ready to live in.',
      },
      {
        type: 'quote',
        text: 'The best handover is the one where nothing surprises you — because you understood every step that led to it.',
      },
    ],
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
    body: [
      {
        type: 'p',
        text: 'Lighting is often the last thing clients think about and the first thing they notice. A room with a single overhead source will always feel flat, no matter how beautiful its finishes.',
      },
      { type: 'h2', text: 'Three layers, one composition' },
      {
        type: 'list',
        items: [
          'Ambient: concealed coves and soft downlights for overall illumination',
          'Task: focused light for cooking, reading, grooming and work',
          'Accent: wall washers, picture lights and lit niches that add depth',
        ],
      },
      { type: 'h2', text: 'Colour temperature matters' },
      {
        type: 'p',
        text: 'For homes we specify warm-white sources, typically 2700K–3000K, with a high colour-rendering index so stone, timber and skin tones look natural. Workplaces may use slightly cooler light for focus, balanced carefully against comfort.',
      },
      { type: 'h2', text: 'Control is everything' },
      {
        type: 'p',
        text: 'Separate circuits and dimming turn one room into many. A living room can be bright for family afternoons, soft for evening conversation and dramatic when guests arrive — all at the touch of a keypad.',
      },
    ],
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
    body: [
      {
        type: 'p',
        text: 'Timber brings a warmth no other material can match, but in Egypt’s climate it must be specified with care. Large swings between air-conditioned interiors and hot, dry exteriors cause wood to move — and poorly specified timber will crack, cup or gap.',
      },
      { type: 'h2', text: 'Solid or engineered?' },
      {
        type: 'p',
        text: 'For floors and large panels we usually recommend engineered timber: a real hardwood surface over a stable multi-layer core. It looks and feels like solid wood but moves far less. Solid timber is reserved for furniture, handrails and details where its depth can be appreciated.',
      },
      { type: 'h2', text: 'Drying and acclimatisation' },
      {
        type: 'p',
        text: 'We specify kiln-dried timber and let it acclimatise on site before installation. Moisture readings are checked and recorded — a small step that prevents most future problems.',
      },
      {
        type: 'list',
        items: [
          'Choose stable species such as oak, walnut and teak',
          'Allow expansion gaps hidden behind skirting and trims',
          'Use UV-resistant finishes near large windows',
          'Keep indoor humidity as consistent as possible',
        ],
      },
      { type: 'h2', text: 'Finishing for longevity' },
      {
        type: 'p',
        text: 'Hard-wax oils give a natural, repairable finish for floors and joinery, while lacquers suit high-touch surfaces in commercial spaces. Either way, the finish is part of the specification — never an afterthought.',
      },
    ],
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
    body: [
      {
        type: 'p',
        text: 'A clear brief is the most valuable thing you can bring to a first meeting. It shortens the concept phase, focuses the budget and helps your designer understand not only what you want, but why.',
      },
      { type: 'h2', text: 'What to prepare' },
      {
        type: 'list',
        items: [
          'Property drawings, photos and current status (shell & core or renovation)',
          'Who will use the space and how — daily routines, guests, staff',
          'Must-haves and deal-breakers',
          'A realistic budget range and target completion date',
          'Images of spaces you love — and a few you dislike',
        ],
      },
      { type: 'h2', text: 'Share the feeling, not just the look' },
      {
        type: 'p',
        text: 'Inspiration images are useful, but the feeling behind them matters more. Is it calm, generous, cosy, bold? Describing how you want to feel in a space helps us interpret references rather than copy them.',
      },
      { type: 'h2', text: 'Be open about budget' },
      {
        type: 'p',
        text: 'Sharing a budget range is not a commitment to spend it — it is a tool that lets your designer prioritise where investment creates the most value. Our multi-step project inquiry is a good place to start.',
      },
    ],
  },
];

export const featuredPost = posts.find((post) => post.featured) ?? posts[0];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3) {
  const current = getPost(slug);
  if (!current) return posts.slice(0, limit);
  const others = posts.filter((post) => post.slug !== slug);
  const sameCategory = others.filter((post) => post.category === current.category);
  const rest = others.filter((post) => post.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}
