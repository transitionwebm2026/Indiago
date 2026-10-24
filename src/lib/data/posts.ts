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

export const authors: Record<AuthorId, { name: Localized; role: Localized; initials: string; portrait?: string }> = {
  founder: {
    name: site.founder.name,
    role: site.founder.role,
    initials: site.founder.initials,
    portrait: site.founder.portrait,
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
  /** Arabic translation of the body. Without one, Arabic readers see the English body with a notice. */
  bodyAr?: ArticleBlock[];
  featured?: boolean;
}

/**
 * Blog articles — each entry generates a static page at /blog/[slug]/.
 * Keep them ordered newest first.
 */
export const posts: Post[] = [
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
    body: [
      {
        type: 'p',
        text: 'Long before air conditioning, the homes of the Arabian Gulf were designed around heat, light and hospitality. Thick walls, shaded courtyards and rooms arranged for receiving guests created a way of living that still feels relevant today — and a design language that translates beautifully into contemporary interiors.',
      },
      { type: 'h2', text: 'A culture built around hospitality' },
      {
        type: 'p',
        text: 'At the heart of the traditional Gulf home is the majlis: a reception room where guests are welcomed, coffee is poured and conversation can last for hours. Seating runs along the walls so that everyone faces one another, the centre of the room stays open, and the host can see every guest. It is a plan shaped by etiquette as much as by architecture.',
      },
      { type: 'h2', text: 'The elements worth carrying forward' },
      {
        type: 'list',
        items: [
          'The barjeel, or wind tower, which caught the breeze and drew it down into the rooms below',
          'Carved timber doors and window shutters, often finished with brass studs and geometric panels',
          'Carved gypsum panels and screens that filter light and add texture to plain walls',
          'Sadu weaving, the Bedouin textile tradition of bold geometric bands in red, black and natural wool',
          'Coral stone, gypsum plaster and ceilings of mangrove poles and palm-rib matting that kept interiors cool',
        ],
      },
      { type: 'h2', text: 'Translating heritage, not copying it' },
      {
        type: 'p',
        text: 'A heritage-inspired interior does not need to look like a museum. We start with the plan — a generous majlis with built-in seating, an open centre and a dignified entrance sequence — then let one or two traditional elements carry the story. A carved timber door, a ceiling of exposed beams or a single screen of carved gypsum says more than a room full of reproductions.',
      },
      {
        type: 'quote',
        text: 'Heritage is strongest when it is felt in the proportions and the hospitality of a room, not only seen in its ornament.',
      },
      { type: 'h2', text: 'Materials and palette' },
      {
        type: 'p',
        text: 'The Gulf palette comes from the land: sand, clay, lime plaster, sun-bleached timber and the deep reds of woven textiles. We pair these with contemporary materials — honed limestone, oak and brushed brass — so the space feels rooted without feeling dated.',
      },
      {
        type: 'list',
        items: [
          'Lime or textured plaster walls in warm sand tones',
          'Low, built-in seating with firm cushions and bolsters',
          'Patterned rugs and Sadu-inspired textiles as the main source of colour',
          'Brass or bronze lighting pierced with geometric patterns',
          'Arched niches for incense burners, coffee pots and books',
        ],
      },
      { type: 'h2', text: 'Light, air and privacy' },
      {
        type: 'p',
        text: 'Traditional houses controlled the sun with small, shaded openings, screens and courtyards. In a modern home the same ideas become deep window reveals, sheer curtains and timber screens that give privacy without darkening the room — principles we used in our Arabian Majlis project in Abu Dhabi, where arched niches, carved timber screens and ornate chandeliers frame a space made for family gatherings.',
      },
    ],
    bodyAr: [
      {
        type: 'p',
        text: 'قبل ظهور التكييف بزمن طويل، صُمّمت بيوت الخليج العربي حول الحرارة والضوء وكرم الضيافة. فالجدران السميكة والأفنية الظليلة والغرف المخصّصة لاستقبال الضيوف صنعت أسلوب حياة ما زال قريبًا منّا اليوم، ولغة تصميمية تنتقل بجمال إلى المساحات الداخلية المعاصرة.',
      },
      { type: 'h2', text: 'ثقافة قائمة على الضيافة' },
      {
        type: 'p',
        text: 'في قلب البيت الخليجي التقليدي يقع المجلس: غرفة الاستقبال التي يُرحَّب فيها بالضيوف وتُصبّ القهوة ويمتد الحديث لساعات. تمتد الجلسات على طول الجدران ليواجه الجميع بعضهم بعضًا، ويبقى وسط الغرفة مفتوحًا، ويرى المضيف كل ضيوفه. إنه تخطيط تصوغه آداب الضيافة بقدر ما تصوغه العمارة.',
      },
      { type: 'h2', text: 'عناصر تستحق أن نحملها معنا' },
      {
        type: 'list',
        items: [
          'البارجيل، أو برج الرياح، الذي كان يلتقط النسيم ويدفعه إلى الغرف أسفله',
          'الأبواب والنوافذ الخشبية المنحوتة، وكثيرًا ما تزيّنها مسامير نحاسية وحشوات هندسية',
          'ألواح وشاشات الجص المنقوش التي تُرشّح الضوء وتمنح الجدران البسيطة ملمسًا',
          'نسيج السدو، حِرفة البادية بخطوطها الهندسية الجريئة بالأحمر والأسود ولون الصوف الطبيعي',
          'الحجر المرجاني والجص، والأسقف المصنوعة من جذوع الدنشل وحصير سعف النخيل التي حافظت على برودة الداخل',
        ],
      },
      { type: 'h2', text: 'نستلهم التراث ولا ننسخه' },
      {
        type: 'p',
        text: 'لا يحتاج التصميم المستوحى من التراث إلى أن يبدو كمتحف. نبدأ من المخطط: مجلس رحب بجلسات مدمجة، ووسط مفتوح، ومدخل يليق بالضيوف، ثم نترك عنصرًا أو عنصرين تقليديين يرويان الحكاية. فباب خشبي منحوت، أو سقف بعوارض خشبية ظاهرة، أو شاشة واحدة من الجص المنقوش، تقول أكثر مما تقوله غرفة مليئة بالنسخ المقلّدة.',
      },
      {
        type: 'quote',
        text: 'يكون التراث في أقوى حالاته حين نشعر به في نِسب المكان وكرم ضيافته، لا حين نراه في زخارفه فقط.',
      },
      { type: 'h2', text: 'الخامات والألوان' },
      {
        type: 'p',
        text: 'تأتي ألوان الخليج من الأرض: الرمل والطين والجص الجيري والخشب الذي لوّحته الشمس، والأحمر العميق في المنسوجات. ونمزجها بخامات معاصرة كالحجر الجيري المطفي وخشب البلوط والنحاس المصقول، لتبدو المساحة متجذّرة دون أن تبدو قديمة.',
      },
      {
        type: 'list',
        items: [
          'حوائط بالجص الجيري أو ببلياسة محبّبة بدرجات الرمل الدافئة',
          'جلسات منخفضة مدمجة بوسائد ومساند متماسكة',
          'سجاد منقوش ومنسوجات مستوحاة من السدو لتكون مصدر اللون الرئيسي',
          'إضاءة من النحاس أو البرونز مخرّمة بزخارف هندسية',
          'كوّات مقوّسة للمباخر ودلال القهوة والكتب',
        ],
      },
      { type: 'h2', text: 'الضوء والهواء والخصوصية' },
      {
        type: 'p',
        text: 'كانت البيوت التقليدية تتحكّم في الشمس بفتحات صغيرة مظلّلة وشاشات وأفنية. وفي المنزل الحديث تتحوّل الأفكار نفسها إلى نوافذ بأعماق واسعة، وستائر شفافة، وشاشات خشبية تمنح الخصوصية دون أن تُعتم المكان. وهي مبادئ اعتمدناها في مشروع المجلس العربي في أبوظبي، حيث تحيط الكوّات المقوّسة والشاشات الخشبية المنحوتة والثريات المزخرفة بمساحة صُمّمت للّقاءات العائلية.',
      },
    ],
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
    body: [
      {
        type: 'p',
        text: 'Walk through the historic houses of Cairo — Bayt al-Suhaymi near al-Muizz Street, or the Gayer-Anderson Museum beside the Mosque of Ibn Tulun — and you will find interiors that solved the same problems we design for today: privacy, comfort in the heat, beautiful light and rooms for receiving guests.',
      },
      { type: 'h2', text: 'A house that turns inward' },
      {
        type: 'p',
        text: 'Cairene houses presented quiet walls to the street and opened onto an inner courtyard planted with trees. The main reception hall, the qa‘a, was often double-height, with a lower central area called the durqa‘a — sometimes with a small fountain — flanked by raised sitting areas. Wind catchers, or malqaf, on the roof drew cool northern breezes down into the hall.',
      },
      { type: 'h2', text: 'The mashrabiya: privacy, air and light' },
      {
        type: 'p',
        text: 'The mashrabiya is a projecting screen of turned wooden spindles assembled into geometric patterns. It let residents look out without being seen, allowed air to move through the house and broke harsh sunlight into soft, patterned shade. Its name is often linked to the Arabic root for drinking, because water jars were placed in the screens to cool in the breeze.',
      },
      { type: 'h2', text: 'Elements that still work today' },
      {
        type: 'list',
        items: [
          'Mashrabiya screens as room dividers, wardrobe doors or window screens',
          'Geometric star patterns in inlaid wood, brass or tile',
          'Coloured-glass windows set in carved plaster, known as qamariyya',
          'Polychrome marble floors with geometric inlay',
          'Painted and carved timber ceilings over the main living space',
        ],
      },
      { type: 'h2', text: 'Bringing it into a modern interior' },
      {
        type: 'p',
        text: 'The key is restraint and scale. A full-height mashrabiya panel can define an entrance or screen a dining area while keeping light flowing between spaces. Geometric patterns work best as one strong layer — a screen, a floor or a ceiling — set against calm, plain walls. CNC-cut timber and metal now make these patterns more affordable, but hand-turned joinery still has a warmth no machine can fully reproduce.',
      },
      {
        type: 'quote',
        text: 'The mashrabiya was never just decoration. It was climate control, privacy and art in a single piece of joinery.',
      },
      { type: 'h2', text: 'Materials and palette' },
      {
        type: 'list',
        items: [
          'Dark-stained hardwoods such as walnut or mahogany for screens and doors',
          'Warm white or limestone-coloured plaster walls',
          'Marble in white, black and red for floors and inlays',
          'Pierced brass lanterns that scatter patterned light across the walls',
          'Coloured glass in small doses — turquoise, amber and deep green',
        ],
      },
      {
        type: 'p',
        text: 'In our Department of Finance project in Abu Dhabi, a sculptural Arabic-geometry screen became the centrepiece of the public areas — proof that this centuries-old language sits comfortably beside glass, metal and contemporary lighting.',
      },
    ],
    bodyAr: [
      {
        type: 'p',
        text: 'تجوّل في بيوت القاهرة التاريخية، مثل بيت السحيمي قرب شارع المعز، أو متحف جاير أندرسون بجوار جامع ابن طولون، وستجد مساحات داخلية حلّت المشكلات نفسها التي نصمّم لها اليوم: الخصوصية، والراحة في الحر، والضوء الجميل، وغرف لاستقبال الضيوف.',
      },
      { type: 'h2', text: 'بيت يتّجه إلى الداخل' },
      {
        type: 'p',
        text: 'كانت البيوت القاهرية تُظهر للشارع جدرانًا هادئة، وتنفتح على فناء داخلي مزروع بالأشجار. وكانت قاعة الاستقبال الرئيسية، أو القاعة، غالبًا بارتفاع مزدوج، يتوسّطها جزء منخفض يُسمّى الدُّرقاعة، وقد تتوسّطه فسقية صغيرة، وتحيط به مناطق جلوس مرتفعة. أما الملاقف فوق الأسطح فكانت تسحب النسيم الشمالي البارد إلى داخل القاعة.',
      },
      { type: 'h2', text: 'المشربية: خصوصية وهواء وضوء' },
      {
        type: 'p',
        text: 'المشربية شاشة بارزة من قطع الخشب المخروط، تُجمَّع في أنماط هندسية. كانت تتيح لأهل البيت رؤية الخارج دون أن يُروا، وتسمح بمرور الهواء، وتكسر حدّة الشمس إلى ظلال ناعمة منقوشة. ويُربط اسمها كثيرًا بالشُّرب، إذ كانت قُلل الماء توضع فيها لتبرد مع النسيم.',
      },
      { type: 'h2', text: 'عناصر ما زالت صالحة اليوم' },
      {
        type: 'list',
        items: [
          'شاشات المشربية كفواصل بين المساحات أو أبواب للدواليب أو ستائر للنوافذ',
          'أنماط النجوم الهندسية في الخشب المطعّم أو النحاس أو البلاط',
          'نوافذ الزجاج الملوّن المثبّت في الجص المفرّغ، المعروفة بالقمريات',
          'أرضيات الرخام الملوّن بتطعيمات هندسية',
          'أسقف خشبية منقوشة وملوّنة فوق مساحة المعيشة الرئيسية',
        ],
      },
      { type: 'h2', text: 'كيف ننقلها إلى مساحة حديثة' },
      {
        type: 'p',
        text: 'السرّ في الاعتدال والمقياس. فلوح مشربية بارتفاع كامل يمكنه أن يحدّد مدخلًا أو يحجب منطقة الطعام مع الحفاظ على انسياب الضوء بين المساحات. وتعمل الأنماط الهندسية بأفضل صورة حين تكون طبقة واحدة قوية، شاشة أو أرضية أو سقفًا، على خلفية من جدران هادئة وبسيطة. وقد جعلت ماكينات القطع الحديثة للخشب والمعادن هذه الأنماط أقل تكلفة، لكن الخرط اليدوي ما زال يحمل دفئًا لا تستطيع الآلة محاكاته بالكامل.',
      },
      {
        type: 'quote',
        text: 'لم تكن المشربية زينة فقط؛ كانت تحكّمًا في المناخ وخصوصية وفنًا في قطعة نجارة واحدة.',
      },
      { type: 'h2', text: 'الخامات والألوان' },
      {
        type: 'list',
        items: [
          'أخشاب صلبة داكنة كالجوز أو الماهوجني للشاشات والأبواب',
          'حوائط بالجص بلون أبيض دافئ أو بلون الحجر الجيري',
          'رخام أبيض وأسود وأحمر للأرضيات والتطعيمات',
          'فوانيس نحاسية مخرّمة تنثر الضوء المنقوش على الحوائط',
          'زجاج ملوّن بجرعات صغيرة: الفيروزي والكهرماني والأخضر الداكن',
        ],
      },
      {
        type: 'p',
        text: 'وفي مشروع دائرة المالية في أبوظبي، أصبحت شاشة نحتية بزخارف هندسية عربية محور المناطق العامة؛ دليلًا على أن هذه اللغة العريقة تجلس بارتياح إلى جانب الزجاج والمعدن والإضاءة المعاصرة.',
      },
    ],
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
    body: [
      {
        type: 'p',
        text: 'Few design traditions are as recognisable as ancient Egypt’s. Its temples and tombs were built on strict geometry, monumental scale and a small set of symbols repeated with discipline. That sense of order — more than any single motif — is what makes Pharaonic heritage so powerful in a modern interior.',
      },
      { type: 'h2', text: 'A language of order and symmetry' },
      {
        type: 'p',
        text: 'Ancient Egyptian architecture was organised along clear axes, with spaces arranged in sequence from bright courtyards to darker, more intimate halls. Proportion and symmetry gave buildings their calm authority. In a home, the same principle can shape an entrance hall, a long corridor or a formal dining room that is meant to be approached and experienced in order.',
      },
      { type: 'h2', text: 'Motifs drawn from the Nile' },
      {
        type: 'p',
        text: 'Much of the decorative vocabulary came from the river. Columns were carved to resemble bundles of papyrus or opening lotus flowers, and palm-leaf capitals echoed the date palms along the banks. The cavetto cornice — the concave, outward-curving moulding above temple doorways — is another signature detail that adapts surprisingly well to joinery and architectural trims.',
      },
      { type: 'h2', text: 'From the 1920s to today' },
      {
        type: 'p',
        text: 'Egypt has inspired designers before. After the discovery of Tutankhamun’s tomb in 1922, Egyptian motifs swept through Art Deco architecture, jewellery and furniture around the world. That moment is a useful lesson: the most elegant interpretations simplified the motifs into clean, geometric forms rather than copying them literally.',
      },
      {
        type: 'quote',
        text: 'Use Pharaonic motifs the way the ancient builders did — with discipline, repetition and a clear sense of hierarchy.',
      },
      { type: 'h2', text: 'Elements to use with confidence' },
      {
        type: 'list',
        items: [
          'Fluted or tapered columns and pilasters inspired by papyrus and lotus forms',
          'Cavetto-style cornices over doorways, niches and joinery',
          'Stepped, symmetrical wall compositions around a strong central axis',
          'Limestone, sandstone and granite in honed, matte finishes',
          'Accents of gold leaf, brass and deep lapis or turquoise blue',
        ],
      },
      { type: 'h2', text: 'What to avoid' },
      {
        type: 'p',
        text: 'Hieroglyph wallpaper, plaster statues and gold everywhere quickly turn a home into a theme. We prefer one architectural gesture — a pair of columns framing a doorway, a stone wall with a carved border or a single statement light — supported by a restrained palette of stone, sand and gold.',
      },
      { type: 'h2', text: 'Materials and palette' },
      {
        type: 'p',
        text: 'Egypt’s own stones are the natural starting point: limestone and sandstone in warm creams and ochres, black and rose granite for contrast, and alabaster wherever light can glow through it. Pair them with walnut or ebony-stained timber, linen and brushed brass for an interior that feels ancient in spirit and entirely contemporary in use.',
      },
    ],
    bodyAr: [
      {
        type: 'p',
        text: 'قليلة هي تقاليد التصميم التي يسهل التعرّف عليها كتقاليد مصر القديمة. فقد بُنيت معابدها ومقابرها على هندسة صارمة ومقياس مهيب ومجموعة صغيرة من الرموز تتكرّر بانضباط. وهذا الإحساس بالنظام، أكثر من أي زخرفة بعينها، هو ما يمنح التراث الفرعوني قوته في المساحات الحديثة.',
      },
      { type: 'h2', text: 'لغة من النظام والتماثل' },
      {
        type: 'p',
        text: 'نُظّمت العمارة المصرية القديمة على محاور واضحة، وتتابعت مساحاتها من أفنية مضيئة إلى قاعات أكثر عتمة وخصوصية، ومنحها التناسب والتماثل هيبتها الهادئة. وفي المنزل يمكن للمبدأ نفسه أن يصوغ بهو المدخل، أو ممرًا طويلًا، أو غرفة طعام رسمية يُقترب منها ويُعاش فيها بترتيب.',
      },
      { type: 'h2', text: 'زخارف مستلهمة من النيل' },
      {
        type: 'p',
        text: 'جاء كثير من مفردات الزخرفة من النهر؛ فقد نُحتت الأعمدة على هيئة حزم من البردي أو زهور لوتس متفتّحة، وحاكت تيجان سعف النخيل أشجار النخيل على الضفاف. كما يُعدّ الكورنيش المقعّر، أي الإفريز المنحني إلى الخارج أعلى مداخل المعابد، تفصيلًا مميّزًا يتكيّف بسهولة مدهشة مع أعمال النجارة والحليات المعمارية.',
      },
      { type: 'h2', text: 'من عشرينيات القرن الماضي إلى اليوم' },
      {
        type: 'p',
        text: 'ألهمت مصر المصممين من قبل؛ فبعد اكتشاف مقبرة توت عنخ آمون عام 1922، انتشرت الزخارف المصرية في عمارة الآرت ديكو والمجوهرات والأثاث حول العالم. وتلك اللحظة درس مفيد: فأكثر التفسيرات أناقة بسّطت الزخارف إلى أشكال هندسية نظيفة بدلًا من نسخها حرفيًا.',
      },
      {
        type: 'quote',
        text: 'استخدم الزخارف الفرعونية كما استخدمها البنّاؤون القدماء: بانضباط وتكرار وإحساس واضح بالتدرّج.',
      },
      { type: 'h2', text: 'عناصر تُستخدم بثقة' },
      {
        type: 'list',
        items: [
          'أعمدة وأكتاف مخدّدة أو مستدقّة مستوحاة من أشكال البردي واللوتس',
          'أفاريز على طراز الكورنيش المقعّر فوق الأبواب والكوّات والنجارة',
          'تكوينات جدارية متدرّجة ومتماثلة حول محور مركزي قوي',
          'الحجر الجيري والرملي والجرانيت بتشطيبات مطفية',
          'لمسات من ورق الذهب والنحاس والأزرق اللازوردي أو الفيروزي',
        ],
      },
      { type: 'h2', text: 'ما يجب تجنّبه' },
      {
        type: 'p',
        text: 'ورق الحائط المزيّن بالهيروغليفية، والتماثيل الجبسية، والذهب في كل مكان، كلها تحوّل المنزل سريعًا إلى ديكور مسرحي. نحن نفضّل لفتة معمارية واحدة، كزوج من الأعمدة يؤطّر مدخلًا، أو جدار حجري بإطار منحوت، أو قطعة إضاءة لافتة، تدعمها لوحة ألوان هادئة من الحجر والرمل والذهب.',
      },
      { type: 'h2', text: 'الخامات والألوان' },
      {
        type: 'p',
        text: 'أحجار مصر نفسها هي نقطة البداية الطبيعية: الحجر الجيري والرملي بدرجات الكريمي والمغرة الدافئة، والجرانيت الأسود والوردي للتباين، والألباستر حيث يمكن للضوء أن يتوهّج من خلاله. وامزجها بخشب الجوز أو الخشب المصبوغ بلون الأبنوس، والكتان، والنحاس المصقول، لتحصل على مساحة قديمة الروح ومعاصرة تمامًا في استخدامها.',
      },
    ],
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
    body: [
      {
        type: 'p',
        text: 'In the narrow lanes of Old Cairo, around the walls of the Roman fortress of Babylon, stand some of Egypt’s oldest churches. Their interiors — and the collections of the nearby Coptic Museum — reveal a design heritage that is calm, tactile and deeply Egyptian, shaped by the same climate, materials and craftsmen as the rest of the country’s history.',
      },
      { type: 'h2', text: 'A tradition of woven linen' },
      {
        type: 'p',
        text: 'Egypt has woven linen since the time of the Pharaohs, and Coptic weavers turned it into an art. Tunics and hangings of fine linen were decorated with tapestry-woven bands and roundels in wool — madder reds, indigo blues and deep purples — filled with vines, birds, fish and geometric interlace. Many survive today thanks to Egypt’s dry climate, and they remain a remarkable source of pattern and colour.',
      },
      { type: 'h2', text: 'Wood, ivory and the inlaid screen' },
      {
        type: 'p',
        text: 'The most striking feature of a Coptic church interior is the wooden screen that separates the sanctuary from the nave. The finest examples, like those in the Hanging Church, are made of dark wood inlaid with ivory and bone in geometric patterns of crosses and stars. Coptic and Islamic woodwork in Cairo share many techniques — turned wood, panelled doors and geometric inlay — a reminder of how closely the city’s crafts have always been connected.',
      },
      { type: 'h2', text: 'Light, plaster and calm' },
      {
        type: 'p',
        text: 'Coptic churches are modest in scale and quiet in mood. Whitewashed or plastered walls, timber ceilings, arched openings and small windows keep the light soft, while icons with gold backgrounds and hanging lamps add warmth. They are a reminder that a room can feel precious without being large or loud.',
      },
      {
        type: 'quote',
        text: 'Coptic interiors show how much warmth simple materials can hold — linen, wood, plaster and a little gold.',
      },
      { type: 'h2', text: 'Bringing it into a modern interior' },
      {
        type: 'list',
        items: [
          'Linen upholstery and curtains with woven bands or borders in muted reds and blues',
          'Inlaid wooden screens or cabinet doors with simple geometric patterns',
          'Arched niches and openings in smooth plaster walls',
          'Exposed timber ceilings and beams in warm, dark wood',
          'Warm, low lighting from lanterns and wall lamps rather than bright overhead light',
        ],
      },
      { type: 'h2', text: 'Materials and palette' },
      {
        type: 'p',
        text: 'The palette is natural and restrained: undyed linen, warm white plaster, dark wood and touches of madder red, indigo and gold. Used with care, it creates interiors that feel serene and rooted — a quiet counterpoint to the richer heritages of the region, and a natural fit for bedrooms, studies and reading rooms.',
      },
    ],
    bodyAr: [
      {
        type: 'p',
        text: 'في أزقّة مصر القديمة الضيقة، حول أسوار حصن بابليون الروماني، تقف بعض أقدم كنائس مصر. وتكشف مساحاتها الداخلية، ومعها مقتنيات المتحف القبطي القريب، عن تراث تصميمي هادئ وملموس ومصري في جوهره، صاغه المناخ نفسه والخامات نفسها والحِرفيون أنفسهم الذين صنعوا بقية تاريخ البلاد.',
      },
      { type: 'h2', text: 'تقليد من الكتان المنسوج' },
      {
        type: 'p',
        text: 'نسجت مصر الكتان منذ عصر الفراعنة، وحوّله النسّاجون الأقباط إلى فن. فقد زُيّنت الأردية والمعلّقات المصنوعة من الكتان الرقيق بأشرطة ودوائر منسوجة من الصوف، بالأحمر الفُوّي والأزرق النيلي والأرجواني العميق، تملؤها الكروم والطيور والأسماك والضفائر الهندسية. وقد بقي كثير منها حتى اليوم بفضل مناخ مصر الجاف، وما زالت مصدرًا رائعًا للأنماط والألوان.',
      },
      { type: 'h2', text: 'الخشب والعاج والحجاب المطعّم' },
      {
        type: 'p',
        text: 'أكثر ما يلفت النظر في الكنيسة القبطية هو الحجاب الخشبي الذي يفصل الهيكل عن صحن الكنيسة. وأجمل نماذجه، كتلك الموجودة في الكنيسة المعلّقة، مصنوعة من خشب داكن مطعّم بالعاج والعظم في أنماط هندسية من الصلبان والنجوم. ويتشارك فن الخشب القبطي والإسلامي في القاهرة كثيرًا من التقنيات، كالخشب المخروط والأبواب المجمّعة من حشوات والتطعيم الهندسي؛ تذكيرًا بمدى الترابط الدائم بين حِرف المدينة.',
      },
      { type: 'h2', text: 'الضوء والجص والسكينة' },
      {
        type: 'p',
        text: 'الكنائس القبطية متواضعة في مقياسها وهادئة في روحها؛ فالجدران المبيّضة أو المكسوّة بالجص، والأسقف الخشبية، والفتحات المقوّسة، والنوافذ الصغيرة، تُبقي الضوء ناعمًا، بينما تضيف الأيقونات ذات الخلفيات الذهبية والقناديل المعلّقة دفئًا. وهي تذكير بأن الغرفة يمكن أن تبدو ثمينة دون أن تكون كبيرة أو صاخبة.',
      },
      {
        type: 'quote',
        text: 'تُظهر المساحات القبطية كم من الدفء يمكن أن تحمله خامات بسيطة: الكتان والخشب والجص وقليل من الذهب.',
      },
      { type: 'h2', text: 'كيف ننقله إلى مساحة حديثة' },
      {
        type: 'list',
        items: [
          'مفروشات وستائر من الكتان بأشرطة أو حواف منسوجة بدرجات هادئة من الأحمر والأزرق',
          'حواجز خشبية أو أبواب خزائن مطعّمة بأنماط هندسية بسيطة',
          'كوّات وفتحات مقوّسة في حوائط من الجص الناعم',
          'أسقف وعوارض خشبية ظاهرة بخشب دافئ داكن',
          'إضاءة دافئة منخفضة من الفوانيس والأباليك بدلًا من الإضاءة العلوية الساطعة',
        ],
      },
      { type: 'h2', text: 'الخامات والألوان' },
      {
        type: 'p',
        text: 'الألوان طبيعية ومتّزنة: كتان غير مصبوغ، وجص أبيض دافئ، وخشب داكن، ولمسات من الأحمر الفُوّي والنيلي والذهبي. وحين تُستخدم بعناية تصنع مساحات هادئة ومتجذّرة، تمثّل نقطة توازن هادئة أمام التراثات الأكثر ثراءً في المنطقة، وتناسب بطبيعتها غرف النوم والمكاتب وغرف القراءة.',
      },
    ],
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
    body: [
      {
        type: 'p',
        text: 'In the second half of the nineteenth century, Khedive Ismail set out to build a modern capital beside medieval Cairo. Wide boulevards, squares and grand apartment buildings rose in what is now downtown, many of them designed by European architects. Today those buildings — with their tall ceilings, carved façades and generous rooms — are one of Egypt’s most loved design heritages.',
      },
      { type: 'h2', text: 'A Paris on the Nile' },
      {
        type: 'p',
        text: 'Inspired by the boulevards of Paris, the new districts mixed neo-classical and Italianate styles, followed later by Art Nouveau and Art Deco. The same eclecticism carried on into the twentieth century, from the Moorish-inspired arcades of Heliopolis to the streamlined apartment blocks of the 1930s. Together they created a distinctly Egyptian version of Belle Époque elegance.',
      },
      { type: 'h2', text: 'What defines these interiors' },
      {
        type: 'list',
        items: [
          'Generous ceiling heights finished with plaster cornices and ceiling roses',
          'Tall double doors and French windows with timber shutters',
          'Herringbone and chevron parquet floors in oak and other hardwoods',
          'Patterned cement tiles in entrances, kitchens and bathrooms',
          'Wrought-iron balconies, marble staircases and brass door furniture',
        ],
      },
      { type: 'h2', text: 'Restoring, not freezing' },
      {
        type: 'p',
        text: 'Many clients today own or buy apartments in these historic buildings. The best renovations protect what makes them special — ceiling heights, mouldings, original doors and floors — while quietly upgrading everything behind the walls: wiring, plumbing, air conditioning and kitchens. Where originals have been lost, panel mouldings and cornices can be reinstated in proportions that respect the building.',
      },
      {
        type: 'quote',
        text: 'In a classic apartment, the architecture is already the luxury. Our job is to let it breathe again.',
      },
      { type: 'h2', text: 'Bringing the style into a new home' },
      {
        type: 'p',
        text: 'The Khedivial look works just as well in new villas and apartments. Wall panelling, a well-proportioned cornice, herringbone parquet and tall doors create instant character, especially when paired with contemporary furniture and art rather than reproduction antiques. The contrast keeps the style fresh and easy to live with.',
      },
      { type: 'h2', text: 'Materials and palette' },
      {
        type: 'list',
        items: [
          'Soft whites, warm greys and muted greens for panelled walls',
          'Oak or walnut parquet in herringbone or chevron patterns',
          'Carrara or Egyptian marble for entrances and bathrooms',
          'Brass hardware with crystal or opaline glass lighting',
          'Velvet and linen upholstery mixed with modern, clean-lined furniture',
        ],
      },
      {
        type: 'p',
        text: 'It is exactly the kind of project our Renovation & Enhancement service is made for: upgrading an existing space with high-quality materials and modern comfort, while keeping the character that made it worth loving in the first place.',
      },
    ],
    bodyAr: [
      {
        type: 'p',
        text: 'في النصف الثاني من القرن التاسع عشر، شرع الخديوي إسماعيل في بناء عاصمة حديثة إلى جوار القاهرة القديمة. فارتفعت شوارع واسعة وميادين وعمارات سكنية فخمة في ما يُعرف اليوم بوسط البلد، صمّم كثيرًا منها معماريون أوروبيون. واليوم تُعدّ هذه المباني، بأسقفها العالية وواجهاتها المنحوتة وغرفها الرحبة، من أحب التراثات التصميمية إلى قلوب المصريين.',
      },
      { type: 'h2', text: 'باريس على ضفاف النيل' },
      {
        type: 'p',
        text: 'استلهمت الأحياء الجديدة جادّات باريس، ومزجت بين الطرازين الكلاسيكي الجديد والإيطالي، ثم الآرت نوفو والآرت ديكو لاحقًا. واستمر هذا التنوّع في القرن العشرين، من أروقة مصر الجديدة المستوحاة من الطراز المغربي الأندلسي إلى عمارات الثلاثينيات الانسيابية. وصنعت هذه الطرز معًا نسخة مصرية خالصة من أناقة الزمن الجميل.',
      },
      { type: 'h2', text: 'ما يميّز هذه المساحات' },
      {
        type: 'list',
        items: [
          'أسقف شاهقة مشطّبة بكرانيش جبسية ووحدات زخرفية في منتصف السقف',
          'أبواب مزدوجة طويلة ونوافذ فرنسية بشيش خشبي',
          'أرضيات باركيه بنقشة عظم السمكة أو الشيفرون من البلوط وغيره من الأخشاب الصلبة',
          'بلاط إسمنتي منقوش في المداخل والمطابخ والحمّامات',
          'بلكونات من الحديد المشغول، وسلالم رخامية، ومقابض أبواب نحاسية',
        ],
      },
      { type: 'h2', text: 'نُرمّم ولا نُجمّد' },
      {
        type: 'p',
        text: 'يملك كثير من العملاء اليوم شققًا في هذه المباني التاريخية أو يشترونها. وأفضل أعمال التجديد تحمي ما يجعلها مميّزة، كارتفاع الأسقف والحليات والأبواب والأرضيات الأصلية، بينما تحدّث بهدوء كل ما خلف الجدران: الكهرباء والسباكة والتكييف والمطابخ. وحيث فُقدت العناصر الأصلية، يمكن إعادة الحليات والكرانيش بنِسب تحترم المبنى.',
      },
      {
        type: 'quote',
        text: 'في الشقة الكلاسيكية، العمارة نفسها هي الفخامة، ومهمتنا أن نتركها تتنفّس من جديد.',
      },
      { type: 'h2', text: 'كيف ننقل الطراز إلى بيت جديد' },
      {
        type: 'p',
        text: 'يناسب الطابع الخديوي الفيلات والشقق الجديدة أيضًا؛ فتجليد الحوائط بالحليات، وكرنيش متناسب، وباركيه بنقشة عظم السمكة، وأبواب طويلة، كلها تمنح المكان شخصية فورية، خاصة حين تُمزج بأثاث وأعمال فنية معاصرة بدلًا من التحف المقلّدة. ويُبقي هذا التباين الطراز حيًا وسهل المعيشة.',
      },
      { type: 'h2', text: 'الخامات والألوان' },
      {
        type: 'list',
        items: [
          'درجات الأبيض الناعم والرمادي الدافئ والأخضر الهادئ للحوائط المجلّدة',
          'باركيه من البلوط أو الجوز بنقشة عظم السمكة أو الشيفرون',
          'رخام كرارة أو رخام مصري للمداخل والحمّامات',
          'إكسسوارات نحاسية مع إضاءة من الكريستال أو الزجاج الأوبالين',
          'مفروشات من القطيفة والكتان مع أثاث معاصر بخطوط نظيفة',
        ],
      },
      {
        type: 'p',
        text: 'وهذا تحديدًا نوع المشاريع الذي صُمّمت له خدمة التجديد والتطوير لدينا: تطوير مساحة قائمة بخامات عالية الجودة وراحة عصرية، مع الحفاظ على الطابع الذي جعلها تستحق الحب من الأساس.',
      },
    ],
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
    body: [
      {
        type: 'p',
        text: 'Along the Nile near Aswan, Nubian villages greet visitors with walls painted in bright blues and yellows, decorated doorways and cool, domed rooms. It is architecture made from the earth and finished by hand — and one of Egypt’s richest sources of inspiration for warm, characterful interiors.',
      },
      { type: 'h2', text: 'Building with earth' },
      {
        type: 'p',
        text: 'Traditional Nubian houses were built from mud brick and plastered with earth and lime. Rooms were often roofed with vaults and domes laid without timber formwork — a technique that impressed the Egyptian architect Hassan Fathy, who adapted Nubian building methods in his own work, most famously at New Gourna near Luxor in the 1940s. Thick walls and curved roofs keep the rooms noticeably cooler in the desert heat.',
      },
      { type: 'h2', text: 'A courtyard at the centre' },
      {
        type: 'p',
        text: 'Most houses are arranged around an open courtyard, the hosh, where family life takes place in the shade of the walls. Built-in mud benches, or mastabas, line the façades and courtyards, offering seating that is part of the architecture itself.',
      },
      { type: 'h2', text: 'Colour and decoration' },
      {
        type: 'p',
        text: 'Nubian decoration is generous and personal. Façades are painted in strong colours and decorated with geometric borders, hand-painted motifs and, traditionally, plates and woven baskets set into or hung on the walls. Every house tells something about the family who lives in it.',
      },
      {
        type: 'quote',
        text: 'Nubian design reminds us that a home can be cool, calm and joyful at the same time.',
      },
      { type: 'h2', text: 'Bringing it into a modern interior' },
      {
        type: 'list',
        items: [
          'Vaulted or domed plaster ceilings over a living room, entrance or bathroom',
          'Built-in plastered benches with cushions in place of freestanding sofas',
          'One bold colour — Nubian blue, ochre or turquoise — against warm white walls',
          'Handwoven palm-fibre baskets and plates arranged as wall art',
          'Hand-painted geometric borders around doors, niches and windows',
        ],
      },
      { type: 'h2', text: 'Materials and palette' },
      {
        type: 'p',
        text: 'The palette starts with the earth: lime plaster, clay tones, natural palm fibre and rough-sawn timber, with colour used in confident blocks rather than everywhere. In contemporary homes we often translate mud plaster into textured lime plaster or tadelakt-style finishes that are durable and easy to maintain, while keeping the soft, hand-finished look that makes Nubian interiors so inviting.',
      },
    ],
    bodyAr: [
      {
        type: 'p',
        text: 'على ضفاف النيل قرب أسوان، تستقبل القرى النوبية زوّارها بجدران مطلية بالأزرق والأصفر الزاهيين، ومداخل مزخرفة، وغرف مقبّبة باردة. إنها عمارة مصنوعة من الأرض ومشطّبة باليد، ومن أغنى مصادر الإلهام في مصر للمساحات الداخلية الدافئة ذات الشخصية.',
      },
      { type: 'h2', text: 'البناء بالطين' },
      {
        type: 'p',
        text: 'بُنيت البيوت النوبية التقليدية من الطوب اللبن، وكُسيت بلياسة من الطين والجير. وكثيرًا ما سُقفت الغرف بأقبية وقباب تُبنى دون قوالب خشبية، وهي تقنية أبهرت المعماري المصري حسن فتحي الذي طوّع أساليب البناء النوبي في أعماله، وأشهرها قرية القرنة الجديدة قرب الأقصر في أربعينيات القرن الماضي. وتحافظ الجدران السميكة والأسقف المنحنية على برودة ملحوظة داخل الغرف رغم حرارة الصحراء.',
      },
      { type: 'h2', text: 'الفناء في القلب' },
      {
        type: 'p',
        text: 'تلتف معظم البيوت حول فناء مكشوف هو «الحوش»، حيث تدور حياة الأسرة في ظل الجدران. وتصطف على الواجهات وفي الأفنية مصاطب مبنية من الطين، توفّر جلسات هي جزء من العمارة نفسها.',
      },
      { type: 'h2', text: 'الألوان والزخرفة' },
      {
        type: 'p',
        text: 'الزخرفة النوبية سخية وشخصية؛ إذ تُطلى الواجهات بألوان قوية وتُزيَّن بأشرطة هندسية ورسوم يدوية، وتقليديًا بأطباق وسلال منسوجة تُثبّت في الجدران أو تُعلّق عليها. وكل بيت يحكي شيئًا عن الأسرة التي تسكنه.',
      },
      {
        type: 'quote',
        text: 'يذكّرنا التصميم النوبي بأن البيت يمكن أن يكون باردًا وهادئًا ومبهجًا في الوقت نفسه.',
      },
      { type: 'h2', text: 'كيف ننقله إلى مساحة حديثة' },
      {
        type: 'list',
        items: [
          'أسقف مقبّبة أو على شكل أقبية من الجص فوق المعيشة أو المدخل أو الحمّام',
          'مصاطب مدمجة مكسوّة بالبلياسة مع وسائد بدلًا من الكنب المنفصل',
          'لون واحد جريء، كالأزرق النوبي أو المغرة أو الفيروزي، على حوائط بيضاء دافئة',
          'سلال وأطباق مصنوعة يدويًا من سعف النخيل تُنسَّق كلوحات على الحائط',
          'أشرطة هندسية مرسومة يدويًا حول الأبواب والكوّات والنوافذ',
        ],
      },
      { type: 'h2', text: 'الخامات والألوان' },
      {
        type: 'p',
        text: 'تبدأ الألوان من الأرض: الجص الجيري، ودرجات الطين، وسعف النخيل الطبيعي، والخشب الخام، ويُستخدم اللون في مساحات واضحة وواثقة لا في كل مكان. وفي البيوت المعاصرة نترجم لياسة الطين غالبًا إلى بلياسة جيرية محبّبة أو تشطيبات على طراز التادلاكت، تكون متينة وسهلة الصيانة، مع الحفاظ على الملمس اليدوي الناعم الذي يجعل المساحات النوبية مرحّبة إلى هذا الحد.',
      },
    ],
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
    body: [
      {
        type: 'p',
        text: 'Moroccan and Andalusian design share a single root. The courtyards, gardens and carved surfaces of al-Andalus, seen at their most refined in the Alhambra in Granada, speak the same language as the houses and palaces of Morocco, where Andalusian craftsmen and families settled over the centuries. The result is one of the world’s most admired craft traditions.',
      },
      { type: 'h2', text: 'The riad: a garden inside the house' },
      {
        type: 'p',
        text: 'A riad is a house built around an interior garden or courtyard, often with a fountain or pool at its centre and rooms opening onto galleries on every side. From the street it is almost invisible; inside, it is calm, shaded and private. Water, planting and the sky become part of the interior.',
      },
      { type: 'h2', text: 'The crafts that define the style' },
      {
        type: 'list',
        items: [
          'Zellige: hand-cut pieces of glazed terracotta tile assembled into geometric mosaics',
          'Tadelakt: a polished lime plaster, burnished with stones and sealed with black soap, traditionally used in hammams',
          'Carved plaster, or gebs, in delicate geometric and floral patterns',
          'Carved and painted cedar wood for ceilings, doors and screens',
          'Pierced brass and copper lanterns that scatter patterned light',
        ],
      },
      { type: 'h2', text: 'Using it with restraint' },
      {
        type: 'p',
        text: 'The richness of Moroccan craft can easily overwhelm a room. In a contemporary home we let one craft lead — a zellige wall behind a kitchen or vanity, a tadelakt bathroom, or a set of arched openings framing a view — and keep the surfaces around it calm, with plain plaster, natural linen and timber, so the craftsmanship stands out.',
      },
      {
        type: 'quote',
        text: 'In a riad, luxury is not the ornament on the walls — it is the shade, the sound of water and the quiet at the centre of the house.',
      },
      { type: 'h2', text: 'Ideas for modern homes' },
      {
        type: 'list',
        items: [
          'Horseshoe or pointed arches for doorways, niches and shower openings',
          'A small indoor water feature or courtyard planting where the plan allows',
          'Seamless tadelakt or microcement finishes for bathrooms',
          'Cream Berber wool rugs with dark geometric lines to soften stone floors',
          'Low seating and floor cushions for an informal family lounge',
        ],
      },
      { type: 'h2', text: 'Materials and palette' },
      {
        type: 'p',
        text: 'The palette moves from earthy terracotta, ochre and dusty rose to the deep greens and blues of glazed tile. With natural light and generous planting it brings warmth to apartments and villas alike — and suits Egypt’s climate especially well, where shade and water have always been among the most precious things a home can offer.',
      },
    ],
    bodyAr: [
      {
        type: 'p',
        text: 'ينبع التصميم المغربي والأندلسي من جذر واحد. فالأفنية والحدائق والأسطح المنقوشة في الأندلس، التي بلغت ذروة رقيّها في قصر الحمراء بغرناطة، تتحدث اللغة نفسها التي تتحدثها بيوت المغرب وقصوره، حيث استقر الحرفيون والعائلات الأندلسية عبر القرون. والنتيجة واحدة من أكثر التقاليد الحِرفية إثارة للإعجاب في العالم.',
      },
      { type: 'h2', text: 'الرياض: حديقة داخل البيت' },
      {
        type: 'p',
        text: 'الرياض بيت يُبنى حول حديقة أو فناء داخلي، تتوسّطه غالبًا نافورة أو بركة، وتنفتح غرفه على أروقة من كل الجهات. يكاد يكون خفيًا من الشارع، أما من الداخل فهو هادئ وظليل وخاص، ويصبح الماء والنبات والسماء جزءًا من المساحة الداخلية.',
      },
      { type: 'h2', text: 'الحِرف التي تصنع الطراز' },
      {
        type: 'list',
        items: [
          'الزليج: قطع من البلاط الفخاري المزجّج تُقطع باليد وتُجمع في فسيفساء هندسية',
          'التادلاكت: بلياسة جيرية مصقولة تُلمَّع بالحجارة وتُعزل بالصابون الأسود، استُخدمت تقليديًا في الحمّامات',
          'الجبس المنقوش بأنماط هندسية ونباتية دقيقة',
          'خشب الأرز المنحوت والملوّن للأسقف والأبواب والشاشات',
          'فوانيس مخرّمة من النحاس الأصفر والأحمر تنثر ضوءًا منقوشًا',
        ],
      },
      { type: 'h2', text: 'استخدمه باعتدال' },
      {
        type: 'p',
        text: 'يمكن لثراء الحِرفة المغربية أن يطغى على الغرفة بسهولة. لذلك نترك في البيت المعاصر حِرفة واحدة تقود المشهد، كحائط من الزليج خلف المطبخ أو وحدة الحوض، أو حمّام بالتادلاكت، أو مجموعة من الفتحات المقوّسة تؤطّر إطلالة، ونُبقي الأسطح حولها هادئة ببلياسة بسيطة وكتان طبيعي وخشب، لتبرز الحِرفة.',
      },
      {
        type: 'quote',
        text: 'في الرياض، لا تكمن الفخامة في الزخارف على الجدران، بل في الظل وصوت الماء والسكينة في قلب البيت.',
      },
      { type: 'h2', text: 'أفكار للبيوت الحديثة' },
      {
        type: 'list',
        items: [
          'أقواس حدوية أو مدبّبة للمداخل والكوّات وفتحات الدش',
          'نافورة داخلية صغيرة أو زراعة في فناء حيث يسمح المخطط',
          'تشطيبات متصلة بالتادلاكت أو الميكروسمنت للحمّامات',
          'سجاد أمازيغي من الصوف بلون كريمي وخطوط هندسية داكنة لتلطيف الأرضيات الحجرية',
          'جلسات منخفضة ووسائد أرضية لصالة عائلية غير رسمية',
        ],
      },
      { type: 'h2', text: 'الخامات والألوان' },
      {
        type: 'p',
        text: 'تتدرّج الألوان من التراكوتا والمغرة والوردي الترابي إلى الأخضر والأزرق العميقين في البلاط المزجّج. ومع الضوء الطبيعي والنباتات الوفيرة، تمنح الدفء للشقق والفيلات على حد سواء، وتناسب مناخ مصر بشكل خاص، حيث كان الظل والماء دائمًا من أثمن ما يمكن أن يقدّمه البيت.',
      },
    ],
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
    body: [
      {
        type: 'p',
        text: 'Behind plain doors in the old city of Damascus lie some of the most beautiful houses in the Arab world. Rooms open onto a courtyard filled with citrus trees, jasmine and the sound of a fountain, and every surface — stone, wood and plaster — carries the mark of a craftsman.',
      },
      { type: 'h2', text: 'The courtyard and the liwan' },
      {
        type: 'p',
        text: 'The traditional Damascene house is built around a paved courtyard with a fountain at its centre. On one side, the liwan — a tall space beneath a great arch, open to the courtyard — serves as a shaded sitting room for warm days, while the enclosed reception halls, or qa‘as, are richly decorated for winter and formal occasions.',
      },
      { type: 'h2', text: 'Ablaq: architecture in stripes' },
      {
        type: 'p',
        text: 'One of the most distinctive features of Levantine architecture is ablaq: alternating courses of light and dark stone — typically pale limestone and black basalt — that give walls and arches a striking striped rhythm. The Azm Palace in Damascus, built in the eighteenth century, is a celebrated example.',
      },
      { type: 'h2', text: 'Painted wood and mother-of-pearl' },
      {
        type: 'p',
        text: 'Inside, walls and ceilings were lined with ‘ajami panels: wood decorated with raised, painted and gilded patterns that glow in low light. Furniture and cabinets were often inlaid with mother-of-pearl, bone and contrasting woods in geometric designs — a craft Damascene workshops have kept alive for generations. A complete reception room from an eighteenth-century Damascus house is displayed at the Metropolitan Museum of Art in New York.',
      },
      {
        type: 'quote',
        text: 'The Damascene house layers stone, wood, water and scent — a luxury that speaks to every sense, not only the eye.',
      },
      { type: 'h2', text: 'Bringing it into a modern interior' },
      {
        type: 'list',
        items: [
          'Striped stone or two-tone tile to frame an arch, fireplace or entrance',
          'One statement piece of mother-of-pearl inlay furniture in an otherwise calm room',
          'Painted or gilded timber ceiling panels over a dining or reception room',
          'A small fountain or water wall in a courtyard, terrace or entrance hall',
          'Jasmine, citrus and climbing plants to bring the courtyard feeling indoors',
        ],
      },
      { type: 'h2', text: 'Materials and palette' },
      {
        type: 'p',
        text: 'The palette balances cool stone with warm wood: ivory limestone and charcoal basalt, walnut and rosewood, and accents of deep red, green and gold drawn from painted ceilings. Because the style is so richly layered, we keep the architecture simple and let a few crafted pieces carry the heritage — the same approach we take in every project where history meets everyday living.',
      },
    ],
    bodyAr: [
      {
        type: 'p',
        text: 'خلف أبواب بسيطة في دمشق القديمة تختبئ بعض أجمل البيوت في العالم العربي. تنفتح الغرف على فناء مليء بأشجار الحمضيات والياسمين وصوت النافورة، ويحمل كل سطح فيه، من الحجر إلى الخشب والجص، بصمة حِرفي.',
      },
      { type: 'h2', text: 'الفناء والليوان' },
      {
        type: 'p',
        text: 'يُبنى البيت الدمشقي التقليدي حول فناء مرصوف تتوسّطه «البحرة». وعلى أحد جوانبه يقع الليوان، وهو فراغ مرتفع تحت قوس كبير مفتوح على الفناء، يُستخدم مجلسًا ظليلًا في الأيام الدافئة، بينما تُزيَّن قاعات الاستقبال المغلقة بثراء لفصل الشتاء والمناسبات الرسمية.',
      },
      { type: 'h2', text: 'الأبلق: عمارة بالخطوط' },
      {
        type: 'p',
        text: 'من أكثر سمات العمارة الشامية تميّزًا «الأبلق»: مداميك متناوبة من الحجر الفاتح والداكن، عادةً الحجر الجيري الشاحب والبازلت الأسود، تمنح الجدران والأقواس إيقاعًا مخطّطًا لافتًا. ويُعدّ قصر العظم في دمشق، الذي بُني في القرن الثامن عشر، مثالًا شهيرًا عليه.',
      },
      { type: 'h2', text: 'الخشب الملوّن والصدف' },
      {
        type: 'p',
        text: 'وفي الداخل، كُسيت الجدران والأسقف بألواح «العجمي»: خشب مزيّن بزخارف بارزة ملوّنة ومذهّبة تتوهّج في الضوء الخافت. وكثيرًا ما طُعّم الأثاث والخزائن بالصدف والعظم والأخشاب المتباينة في تصاميم هندسية، وهي حِرفة حافظت عليها ورش دمشق جيلًا بعد جيل. وتُعرض قاعة استقبال كاملة من بيت دمشقي يعود إلى القرن الثامن عشر في متحف المتروبوليتان للفنون في نيويورك.',
      },
      {
        type: 'quote',
        text: 'يجمع البيت الدمشقي طبقات من الحجر والخشب والماء والعطر؛ فخامة تخاطب كل الحواس لا العين وحدها.',
      },
      { type: 'h2', text: 'كيف ننقله إلى مساحة حديثة' },
      {
        type: 'list',
        items: [
          'حجر مخطّط أو بلاط بلونين لتأطير قوس أو مدفأة أو مدخل',
          'قطعة أثاث واحدة مطعّمة بالصدف في غرفة هادئة',
          'ألواح سقف خشبية ملوّنة أو مذهّبة فوق غرفة الطعام أو الاستقبال',
          'نافورة صغيرة أو جدار مائي في فناء أو تراس أو بهو المدخل',
          'الياسمين والحمضيات والنباتات المتسلّقة لنقل إحساس الفناء إلى الداخل',
        ],
      },
      { type: 'h2', text: 'الخامات والألوان' },
      {
        type: 'p',
        text: 'توازن الألوان بين برودة الحجر ودفء الخشب: حجر جيري عاجي وبازلت فحمي، وخشب الجوز والورد، ولمسات من الأحمر العميق والأخضر والذهبي المستوحاة من الأسقف الملوّنة. ولأن الطراز غني بطبقاته، نُبقي العمارة بسيطة ونترك لقطع حِرفية قليلة أن تحمل التراث، وهو النهج نفسه الذي نتبعه في كل مشروع يلتقي فيه التاريخ بالحياة اليومية.',
      },
    ],
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
