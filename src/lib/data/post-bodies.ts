import { postSummaries, type ArticleBlock, type Post } from './posts';

/**
 * Article text for the built-in blog posts. Only server-rendered article pages and the dashboard's
 * "Import website content" read it, so it never ships in the JavaScript of other pages.
 */
const bodies: Record<string, { body: ArticleBlock[]; bodyAr?: ArticleBlock[] }> = {
  'arabian-heritage-modern-majlis': {
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
        text: 'قبل التكييف بزمن طويل، كانت بيوت الخليج تُبنى حول ثلاثة أشياء: الحر، والضوء، وإكرام الضيف. الجدران السميكة والأفنية الظليلة وغرف الاستقبال صنعت أسلوب حياة ما زلنا نعرفه، ولغة تصميم تنتقل بسهولة إلى البيوت المعاصرة.',
      },
      { type: 'h2', text: 'بيت مبني على الضيافة' },
      {
        type: 'p',
        text: 'المجلس هو قلب البيت الخليجي: هنا يُستقبل الضيف، وتُصبّ القهوة، ويطول الحديث. الجلسات ممتدة على طول الجدران فيرى الجميع بعضهم، والوسط مفتوح، والمضيف يرى كل ضيوفه. تخطيط صنعته آداب الضيافة قبل أن تصنعه العمارة.',
      },
      { type: 'h2', text: 'عناصر تستحق أن نأخذها معنا' },
      {
        type: 'list',
        items: [
          'البارجيل أو برج الهواء، الذي كان يلتقط النسيم ويدفعه إلى الغرف',
          'الأبواب والشبابيك الخشبية المحفورة، وكثيرًا ما تزيّنها مسامير نحاس وحشوات هندسية',
          'حوائط وسواتر الجص المنقوش، تكسر الضوء وتعطي الجدار ملمسًا',
          'نسيج السدو، حرفة البادية بخطوطه الهندسية بالأحمر والأسود ولون الصوف الطبيعي',
          'الحجر المرجاني والجص، والأسقف من جذوع الدنشل وحصير السعف التي كانت تحفظ برودة البيت',
        ],
      },
      { type: 'h2', text: 'نستوحي ولا ننسخ' },
      {
        type: 'p',
        text: 'البيت المستوحى من التراث لا يجب أن يشبه المتحف. نبدأ من المسقط: مجلس واسع بجلسات مدمجة، ووسط مفتوح، ومدخل يليق بالضيوف. بعدها نختار عنصرًا أو اثنين من التراث فقط. باب خشبي محفور، أو سقف بعروق خشب ظاهرة، أو ساتر واحد من الجص المنقوش، يكفي ليعطي المكان روحه، وهو أفضل بكثير من غرفة مليئة بقطع مقلّدة.',
      },
      {
        type: 'quote',
        text: 'التراث يظهر في نِسب المكان وفي كرم الضيافة، قبل أن يظهر في الزخارف.',
      },
      { type: 'h2', text: 'الخامات والألوان' },
      {
        type: 'p',
        text: 'ألوان الخليج من الأرض: الرمل والطين والجص الجيري والخشب الذي لوّحته الشمس، مع أحمر غامق في المفروشات. نمزجها بخامات معاصرة مثل الحجر الجيري المطفي وخشب البلوط والنحاس المصقول، فيبدو المكان أصيلًا دون أن يبدو قديمًا.',
      },
      {
        type: 'list',
        items: [
          'حوائط بالجص الجيري أو بلياسة محبّبة بدرجات الرمل',
          'جلسات أرضية منخفضة بمساند ووسائد ثابتة',
          'سجاد منقوش ومفروشات مستوحاة من السدو، تكون هي مصدر اللون',
          'إضاءة نحاس أو برونز مخرّمة بزخارف هندسية',
          'تجاويف مقوّسة للمباخر ودلال القهوة والكتب',
        ],
      },
      { type: 'h2', text: 'الضوء والهواء والخصوصية' },
      {
        type: 'p',
        text: 'كانت البيوت القديمة تتحكم في الشمس بفتحات صغيرة مظللة وسواتر وأفنية. في البيت الحديث تتحول الفكرة نفسها إلى شبابيك عميقة، وستائر خفيفة، وسواتر خشبية تحفظ الخصوصية دون أن تُظلم المكان. وهذا ما طبّقناه في مشروع المجلس العربي بأبوظبي: تجاويف مقوّسة، ومشربيات خشبية محفورة، وثريات مزخرفة حول مجلس صُمّم لجمعات العائلة.',
      },
    ],
  },
  'islamic-cairo-mashrabiya-geometry-light': {
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
        text: 'تجوّل في بيوت القاهرة القديمة، مثل بيت السحيمي في شارع المعز، أو بيت الكريتلية (متحف جاير أندرسون) بجوار جامع ابن طولون، وستلاحظ أنها حلّت نفس المشكلات التي نصمّم لها اليوم: الخصوصية، والراحة في الحر، والضوء الجميل، وغرفة تليق بالضيوف.',
      },
      { type: 'h2', text: 'بيت يعيش من الداخل' },
      {
        type: 'p',
        text: 'كان البيت القاهري يواجه الشارع بجدار هادئ، وينفتح من الداخل على حوش مزروع. وكانت «القاعة»، وهي غرفة الاستقبال الرئيسية، عالية السقف غالبًا، في وسطها جزء منخفض اسمه «الدُّرقاعة» قد تتوسّطه فسقية صغيرة، وحوله جلسات مرتفعة. أما الملاقف فوق السطح فكانت تسحب الهواء البحري البارد إلى داخل القاعة.',
      },
      { type: 'h2', text: 'المشربية: خصوصية وهواء وضوء' },
      {
        type: 'p',
        text: 'المشربية ساتر خشبي بارز، مصنوع من قطع خشب مخروطة تُجمَّع في أشكال هندسية. كانت تسمح لأهل البيت برؤية الشارع دون أن يراهم أحد، وتُدخل الهواء، وتحوّل شمس الظهر إلى ظلال ناعمة على الأرض. ويقال إن اسمها جاء من «الشُّرب»، لأن قلل الماء كانت توضع فيها لتبرد مع الهواء.',
      },
      { type: 'h2', text: 'عناصر ما زالت تصلح اليوم' },
      {
        type: 'list',
        items: [
          'المشربية كفاصل بين مساحتين، أو ضلف دولاب، أو ساتر للشباك',
          'النجمة الهندسية في الخشب المطعّم أو النحاس أو البلاط',
          'القمريات: زجاج ملوّن مثبّت في جص مفرّغ',
          'أرضيات رخام ملوّن بتطعيمات هندسية',
          'سقف خشبي منقوش وملوّن فوق غرفة المعيشة',
        ],
      },
      { type: 'h2', text: 'كيف نستخدمها في بيت حديث' },
      {
        type: 'p',
        text: 'السر في الاعتدال وفي المقاس. لوح مشربية بطول الحائط يكفي لتحديد مدخل أو لحجب السفرة، مع بقاء الضوء يمرّ بين المساحتين. والزخارف الهندسية أجمل عندما تكون عنصرًا واحدًا قويًا، ساترًا أو أرضية أو سقفًا، على حوائط بسيطة هادئة. ماكينات الـ CNC جعلت هذه الأشكال أرخص في الخشب والمعدن، لكن الخرط اليدوي ما زال فيه دفء لا تقدر عليه الماكينة.',
      },
      {
        type: 'quote',
        text: 'لم تكن المشربية مجرد زينة. كانت تكييفًا وخصوصية وفنًا في قطعة نجارة واحدة.',
      },
      { type: 'h2', text: 'الخامات والألوان' },
      {
        type: 'list',
        items: [
          'خشب صلب غامق مثل الجوز أو الماهوجني للسواتر والأبواب',
          'حوائط جص بلون أبيض دافئ أو بلون الحجر الجيري',
          'رخام أبيض وأسود وأحمر للأرضيات والتطعيم',
          'فوانيس نحاس مخرّمة ترسم الضوء على الحوائط',
          'زجاج ملوّن بقدر بسيط: فيروزي وكهرماني وأخضر غامق',
        ],
      },
      {
        type: 'p',
        text: 'وفي مشروع دائرة المالية بأبوظبي، كان ساتر بزخارف هندسية عربية هو أبرز ما في المناطق العامة. دليل على أن هذه اللغة القديمة تعيش بسهولة بجوار الزجاج والمعدن والإضاءة الحديثة.',
      },
    ],
  },
  'pharaonic-heritage-modern-interiors': {
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
        text: 'قليل من الطرز يمكن التعرّف عليه بسرعة مثل طراز مصر القديمة. معابدها ومقابرها قامت على هندسة صارمة، ومقاييس ضخمة، ورموز قليلة تتكرر بانضباط. وهذا الإحساس بالنظام، أكثر من أي زخرفة بعينها، هو ما يجعل التراث الفرعوني قويًا في البيوت الحديثة.',
      },
      { type: 'h2', text: 'نظام وتماثل' },
      {
        type: 'p',
        text: 'كانت العمارة المصرية القديمة تُرتّب على محاور واضحة، تنتقل فيها من أفنية مضيئة إلى قاعات أهدأ وأكثر خصوصية، وتستمد هيبتها من التناسب والتماثل. في البيت، يمكن أن يرسم المبدأ نفسه شكل المدخل، أو ممرًا طويلًا، أو غرفة سفرة رسمية تصل إليها خطوة بخطوة.',
      },
      { type: 'h2', text: 'زخارف من النيل' },
      {
        type: 'p',
        text: 'كثير من الزخارف جاء من النهر نفسه: أعمدة على شكل حزم البردي أو زهرة اللوتس، وتيجان تشبه سعف النخيل على الضفاف. وهناك أيضًا «الكورنيش المصري»، الإفريز المقعّر أعلى مداخل المعابد، وهو تفصيلة تصلح بسهولة مدهشة في النجارة والحليات.',
      },
      { type: 'h2', text: 'من العشرينيات إلى اليوم' },
      {
        type: 'p',
        text: 'ليست أول مرة تُلهم فيها مصر المصممين. بعد اكتشاف مقبرة توت عنخ آمون عام 1922، انتشرت الزخارف المصرية في عمارة الآرت ديكو وفي المجوهرات والأثاث حول العالم. والدرس من تلك الفترة واضح: أجمل التصميمات بسّطت الزخارف إلى خطوط هندسية نظيفة، ولم تنسخها كما هي.',
      },
      {
        type: 'quote',
        text: 'استخدم الزخارف الفرعونية كما استخدمها المصري القديم: بانضباط، وتكرار، وإحساس واضح بالترتيب.',
      },
      { type: 'h2', text: 'عناصر تستخدمها بثقة' },
      {
        type: 'list',
        items: [
          'أعمدة وأكتاف مخدّدة أو مستدقّة مستوحاة من البردي واللوتس',
          'إفريز على طريقة الكورنيش المصري فوق الأبواب والتجاويف والنجارة',
          'تكوين متماثل على الحائط حول محور واضح في المنتصف',
          'حجر جيري ورملي وجرانيت بتشطيب مطفي',
          'لمسات من ورق الذهب والنحاس والأزرق اللازوردي أو الفيروزي',
        ],
      },
      { type: 'h2', text: 'ما يجب أن تتجنّبه' },
      {
        type: 'p',
        text: 'ورق حائط بالهيروغليفية، وتماثيل جبس، وذهب في كل ركن: كلها تحوّل البيت بسرعة إلى ديكور فيلم. نحن نفضّل لمسة معمارية واحدة، عمودين يحيطان بالمدخل مثلًا، أو حائط حجر بإطار محفور، أو قطعة إضاءة لافتة، وحولها ألوان هادئة من الحجر والرمل والذهب.',
      },
      { type: 'h2', text: 'الخامات والألوان' },
      {
        type: 'p',
        text: 'أحجار مصر نفسها هي البداية الطبيعية: الحجر الجيري والرملي بدرجات الكريمي والمغرة، والجرانيت الأسود والوردي للتباين، والألباستر في الأماكن التي يمكن أن يمرّ الضوء من خلالها. أضف إليها خشب الجوز أو الخشب المصبوغ بلون الأبنوس، والكتان، والنحاس المصقول، لتحصل على مكان روحه قديمة واستخدامه عصري تمامًا.',
      },
    ],
  },
  'coptic-heritage-linen-inlaid-wood': {
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
        text: 'في حواري مصر القديمة الضيقة، حول أسوار حصن بابليون الروماني، تقف بعض أقدم كنائس مصر. ومن داخلها، ومن مقتنيات المتحف القبطي القريب، نكتشف تراثًا هادئًا ومصريًا في جوهره، صنعه نفس المناخ ونفس الخامات ونفس الحِرفيين الذين صنعوا بقية تاريخ البلد.',
      },
      { type: 'h2', text: 'الكتان المنسوج' },
      {
        type: 'p',
        text: 'نسج المصريون الكتان منذ أيام الفراعنة، وحوّله النسّاجون الأقباط إلى فن. الملابس والمعلّقات المصنوعة من الكتان الرقيق كانت تُزيَّن بشرائط ودوائر من الصوف، بالأحمر الفُوّي والأزرق النيلي والبنفسجي الغامق، وفيها عناقيد عنب وطيور وأسماك وضفائر هندسية. بقي كثير منها حتى اليوم بفضل جو مصر الجاف، وما زالت مصدرًا رائعًا للنقوش والألوان.',
      },
      { type: 'h2', text: 'الخشب والعاج والحجاب المطعّم' },
      {
        type: 'p',
        text: 'أكثر ما يلفت النظر في الكنيسة القبطية هو حجاب الهيكل الخشبي. وأجمل نماذجه، مثل حجاب الكنيسة المعلّقة، من خشب غامق مطعّم بالعاج والعظم في أشكال هندسية من الصلبان والنجوم. ويشترك الخشب القبطي والإسلامي في القاهرة في تقنيات كثيرة، مثل الخرط والأبواب المجمّعة من حشوات والتطعيم الهندسي. تذكير بأن حِرف المدينة كانت دائمًا تأخذ من بعضها.',
      },
      { type: 'h2', text: 'ضوء هادئ وجص وسكينة' },
      {
        type: 'p',
        text: 'الكنائس القبطية صغيرة في حجمها وهادئة في روحها. الحوائط المبيّضة بالجير أو الجص، والأسقف الخشبية، والفتحات المقوّسة، والشبابيك الصغيرة، تُبقي الضوء ناعمًا، بينما تضيف الأيقونات بخلفياتها الذهبية والقناديل المعلّقة دفئًا. تذكير بأن الغرفة يمكن أن تكون ثمينة دون أن تكون كبيرة أو صاخبة.',
      },
      {
        type: 'quote',
        text: 'المساحات القبطية تثبت كم من الدفء يمكن أن تحمله خامات بسيطة: كتان وخشب وجص وقليل من الذهب.',
      },
      { type: 'h2', text: 'كيف نستخدمه في بيت حديث' },
      {
        type: 'list',
        items: [
          'مفروشات وستائر كتان بشرائط أو أطراف منسوجة بدرجات هادئة من الأحمر والأزرق',
          'سواتر خشبية أو ضلف دواليب مطعّمة بأشكال هندسية بسيطة',
          'تجاويف وفتحات مقوّسة في حوائط جص ناعمة',
          'أسقف وعروق خشب ظاهرة بلون دافئ غامق',
          'إضاءة دافئة منخفضة من الفوانيس والأباليك بدلًا من السبوتات القوية',
        ],
      },
      { type: 'h2', text: 'الخامات والألوان' },
      {
        type: 'p',
        text: 'الألوان طبيعية وهادئة: كتان خام، وجص أبيض دافئ، وخشب غامق، ولمسات من الأحمر الفُوّي والنيلي والذهبي. وعندما تُستخدم بعناية تصنع مكانًا هادئًا ومريحًا، يوازن الطرز الأكثر زخرفة في المنطقة، ويناسب بطبيعته غرف النوم والمكاتب وأركان القراءة.',
      },
    ],
  },
  'khedivial-cairo-belle-epoque-interiors': {
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
        text: 'في النصف الثاني من القرن التاسع عشر، بدأ الخديوي إسماعيل بناء عاصمة حديثة بجوار القاهرة القديمة: شوارع واسعة، وميادين، وعمارات فخمة في ما نعرفه اليوم بوسط البلد، صمّم كثيرًا منها معماريون أوروبيون. واليوم تبقى هذه العمارات، بأسقفها العالية وواجهاتها المنحوتة وغرفها الواسعة، من أقرب الطرز إلى قلوب المصريين.',
      },
      { type: 'h2', text: 'باريس على النيل' },
      {
        type: 'p',
        text: 'استوحت الأحياء الجديدة شوارع باريس، وجمعت بين الطراز الكلاسيكي والإيطالي، ثم الآرت نوفو والآرت ديكو لاحقًا. واستمر التنوع في القرن العشرين، من بواكي مصر الجديدة بطرازها المغربي الأندلسي إلى عمارات الثلاثينيات بخطوطها الانسيابية. ومن كل هذا خرجت نسخة مصرية خالصة من أناقة الزمن الجميل.',
      },
      { type: 'h2', text: 'ما يميّز هذه البيوت' },
      {
        type: 'list',
        items: [
          'أسقف عالية جدًا بكرانيش جبس ووردة في منتصف السقف',
          'أبواب طويلة بضلفتين وشبابيك فرنسية بشيش خشب',
          'باركيه عظم سمكة أو شيفرون من البلوط وغيره من الأخشاب الصلبة',
          'بلاط موزاييك منقوش في المداخل والمطابخ والحمّامات',
          'بلكونات حديد مشغول، وسلالم رخام، وأكر أبواب نحاس',
        ],
      },
      { type: 'h2', text: 'نرمّم ولا نحنّط' },
      {
        type: 'p',
        text: 'كثير من عملائنا يملكون أو يشترون شققًا في هذه العمارات القديمة. وأفضل تجديد هو الذي يحافظ على ما يميّزها، مثل ارتفاع الأسقف والحليات والأبواب والأرضيات الأصلية، ويجدّد في هدوء كل ما وراء الحوائط: الكهرباء والسباكة والتكييف والمطبخ. وما ضاع من العناصر الأصلية يمكن إعادته، بكرانيش وحليات بنِسب تحترم المبنى.',
      },
      {
        type: 'quote',
        text: 'في الشقة القديمة، العمارة نفسها هي الفخامة. ومهمتنا أن نتركها تتنفّس من جديد.',
      },
      { type: 'h2', text: 'الطراز نفسه في بيت جديد' },
      {
        type: 'p',
        text: 'الطابع الخديوي يناسب الفيلات والشقق الجديدة أيضًا. تجاليد الحوائط بالحليات، وكرنيش بمقاس مناسب، وباركيه عظم سمكة، وأبواب طويلة، كلها تعطي المكان شخصية من أول نظرة، خاصة مع أثاث ولوحات معاصرة بدلًا من التحف المقلّدة. هذا التباين هو ما يُبقي الطراز حيًا ومريحًا للمعيشة.',
      },
      { type: 'h2', text: 'الخامات والألوان' },
      {
        type: 'list',
        items: [
          'أبيض ناعم ورمادي دافئ وأخضر هادئ للحوائط ذات التجاليد',
          'باركيه بلوط أو جوز بنقشة عظم السمكة أو الشيفرون',
          'رخام كرارة أو رخام مصري للمداخل والحمّامات',
          'إكسسوارات نحاس مع نجف كريستال أو زجاج أوبالين',
          'مفروشات قطيفة وكتان مع أثاث معاصر بخطوط بسيطة',
        ],
      },
      {
        type: 'p',
        text: 'وهذا بالضبط نوع المشاريع الذي نقدّم له خدمة التجديد والتطوير: نطوّر المكان بخامات عالية الجودة وراحة عصرية، ونحافظ على الطابع الذي جعلك تحبه من الأساس.',
      },
    ],
  },
  'nubian-heritage-colour-domes-handcraft': {
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
        text: 'على ضفاف النيل قرب أسوان، تستقبلك القرى النوبية بحوائط مدهونة بالأزرق والأصفر، ومداخل مزخرفة، وغرف مقبّبة باردة. عمارة من الطين، تشطيبها باليد، ومن أغنى مصادر الإلهام في مصر لمساحات دافئة لها شخصية.',
      },
      { type: 'h2', text: 'البناء بالطين' },
      {
        type: 'p',
        text: 'كان البيت النوبي يُبنى بالطوب اللبن، ويُلَيَّس بالطين والجير. وكثيرًا ما كانت الغرف تُسقف بقباب وأقبية تُبنى دون قوالب خشب، وهي طريقة أبهرت المعماري حسن فتحي، فاستخدمها في أعماله، وأشهرها قرية القرنة الجديدة قرب الأقصر في الأربعينيات. والجدران السميكة والأسقف المنحنية تحفظ برودة الغرف رغم حرارة الصحراء.',
      },
      { type: 'h2', text: 'الحوش في القلب' },
      {
        type: 'p',
        text: 'أغلب البيوت تلتف حول حوش مكشوف، فيه تدور حياة الأسرة في ظل الحوائط. وعلى الواجهات وحول الحوش مصاطب مبنية بالطين، جلسات هي جزء من البيت نفسه.',
      },
      { type: 'h2', text: 'الألوان والزخرفة' },
      {
        type: 'p',
        text: 'الزخرفة النوبية كريمة ولها طابع شخصي. الواجهات مدهونة بألوان قوية، وعليها أشرطة هندسية ورسومات يدوية، وقديمًا أطباق وسلال من الخوص مثبّتة على الحوائط أو معلّقة عليها. كل بيت يحكي شيئًا عن الأسرة التي تسكنه.',
      },
      {
        type: 'quote',
        text: 'البيت النوبي يذكّرنا بأن المكان يمكن أن يكون باردًا وهادئًا ومبهجًا في الوقت نفسه.',
      },
      { type: 'h2', text: 'كيف نستخدمه في بيت حديث' },
      {
        type: 'list',
        items: [
          'سقف على شكل قبة أو قبو من الجص فوق المعيشة أو المدخل أو الحمّام',
          'مصاطب مبنية بلياسة ناعمة ووسائد، بدلًا من الكنب المنفصل',
          'لون واحد جريء، أزرق نوبي أو مغرة أو فيروزي، على حوائط بيضاء دافئة',
          'سلال وأطباق خوص يدوية تُنسَّق على الحائط كلوحة',
          'أشرطة هندسية مرسومة باليد حول الأبواب والتجاويف والشبابيك',
        ],
      },
      { type: 'h2', text: 'الخامات والألوان' },
      {
        type: 'p',
        text: 'الألوان من الأرض: الجص الجيري، ودرجات الطين، والخوص الطبيعي، والخشب الخام. واللون يُستخدم في مساحات واضحة وجريئة، لا في كل مكان. وفي البيوت الحديثة نستبدل لياسة الطين عادةً ببلياسة جيرية محبّبة أو تشطيب بطريقة التادلاكت، أمتن وأسهل في الصيانة، مع نفس الملمس اليدوي الناعم الذي يجعل البيت النوبي مرحّبًا إلى هذا الحد.',
      },
    ],
  },
  'moroccan-andalusian-heritage-zellige-tadelakt': {
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
        text: 'التصميم المغربي والأندلسي فرعان من شجرة واحدة. الأفنية والحدائق والأسطح المنقوشة في الأندلس، التي بلغت قمتها في قصر الحمراء بغرناطة، تتكلم نفس لغة البيوت والقصور في المغرب، حيث استقر الحِرفيون والعائلات الأندلسية عبر القرون. والنتيجة واحدة من أجمل الحِرف التقليدية في العالم.',
      },
      { type: 'h2', text: 'الرياض: حديقة داخل البيت' },
      {
        type: 'p',
        text: 'الرياض بيت مبني حول حديقة أو فناء داخلي، في وسطه غالبًا نافورة أو بركة، وغرفه تنفتح على أروقة من كل الجهات. من الشارع لا تكاد تراه، أما من الداخل فهو هادئ وظليل وخاص، والماء والنبات والسماء جزء من البيت.',
      },
      { type: 'h2', text: 'الحِرف التي صنعت الطراز' },
      {
        type: 'list',
        items: [
          'الزليج: قطع بلاط فخاري مزجّج تُقطع باليد وتُركّب في فسيفساء هندسية',
          'التادلاكت: بلياسة جيرية تُصقل بالحجر وتُعزل بالصابون الأسود، وكانت تُستخدم في الحمّامات',
          'الجبس المنقوش بأشكال هندسية ونباتية دقيقة',
          'خشب الأرز المحفور والملوّن للأسقف والأبواب والسواتر',
          'فوانيس نحاس أصفر وأحمر مخرّمة ترسم الضوء على الحوائط',
        ],
      },
      { type: 'h2', text: 'استخدمه بحساب' },
      {
        type: 'p',
        text: 'غنى الحِرفة المغربية قد يطغى على الغرفة بسهولة. لذلك نختار في البيت المعاصر حرفة واحدة تكون هي البطل: حائط زليج خلف المطبخ أو الحوض، أو حمّام بالتادلاكت، أو أقواس تؤطّر منظرًا. وحولها نُبقي كل شيء هادئًا، بلياسة بسيطة وكتان طبيعي وخشب، فتظهر الحِرفة كما يجب.',
      },
      {
        type: 'quote',
        text: 'في الرياض، الفخامة ليست في زخارف الحوائط، بل في الظل، وصوت الماء، والهدوء في قلب البيت.',
      },
      { type: 'h2', text: 'أفكار للبيوت الحديثة' },
      {
        type: 'list',
        items: [
          'أقواس على شكل حدوة حصان أو مدبّبة للمداخل والتجاويف وفتحة الدش',
          'نافورة داخلية صغيرة أو زرع في فناء، إذا سمح المسقط',
          'تشطيب متصل بالتادلاكت أو الميكروسمنت للحمّامات',
          'سجاد أمازيغي من الصوف بلون كريمي وخطوط غامقة يدفّئ الأرضيات الحجر',
          'جلسات منخفضة ووسائد أرضية لركن عائلي غير رسمي',
        ],
      },
      { type: 'h2', text: 'الخامات والألوان' },
      {
        type: 'p',
        text: 'الألوان تتدرج من التراكوتا والمغرة والوردي الترابي إلى الأخضر والأزرق الغامقين في البلاط المزجّج. ومع الضوء الطبيعي والزرع الكثير، تعطي الدفء للشقق والفيلات على حد سواء. وهي مناسبة لجو مصر بالذات، فالظل والماء كانا دائمًا أغلى ما يقدمه البيت.',
      },
    ],
  },
  'damascene-house-levantine-heritage': {
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
        text: 'خلف أبواب بسيطة في دمشق القديمة تختبئ بعض أجمل بيوت العالم العربي. الغرف تنفتح على فناء فيه شجر الليمون والنارنج والياسمين وصوت النافورة، وكل سطح فيه، من الحجر إلى الخشب والجص، يحمل بصمة صانع.',
      },
      { type: 'h2', text: 'الفناء والليوان' },
      {
        type: 'p',
        text: 'البيت الدمشقي التقليدي مبني حول فناء مرصوف تتوسطه «البحرة». وعلى أحد جوانبه الليوان، مساحة مرتفعة تحت قوس كبير مفتوح على الفناء، يجلس فيها أهل البيت في الظل أيام الحر. أما قاعات الاستقبال المغلقة فكانت مزخرفة بثراء للشتاء والمناسبات.',
      },
      { type: 'h2', text: 'الأبلق: عمارة مخطّطة' },
      {
        type: 'p',
        text: 'من أشهر ملامح العمارة الشامية «الأبلق»: صفوف متبادلة من الحجر الفاتح والغامق، عادةً حجر جيري فاتح وبازلت أسود، تعطي الحوائط والأقواس إيقاعًا مخطّطًا لافتًا. وقصر العظم في دمشق، الذي بُني في القرن الثامن عشر، من أشهر أمثلته.',
      },
      { type: 'h2', text: 'الخشب الملوّن والصدف' },
      {
        type: 'p',
        text: 'في الداخل، كانت الحوائط والأسقف تُكسى بخشب «العجمي»، المزيّن بزخارف بارزة ملوّنة ومذهّبة تلمع في الضوء الخافت. وكثيرًا ما كان الأثاث والصناديق يُطعَّم بالصدف والعظم وأنواع خشب مختلفة في أشكال هندسية، وهي حرفة توارثتها ورش دمشق جيلًا بعد جيل. وفي متحف المتروبوليتان بنيويورك قاعة استقبال كاملة من بيت دمشقي من القرن الثامن عشر.',
      },
      {
        type: 'quote',
        text: 'البيت الدمشقي طبقات من الحجر والخشب والماء ورائحة الياسمين. فخامة تحسّها بكل حواسك، لا بعينك فقط.',
      },
      { type: 'h2', text: 'كيف نستخدمه في بيت حديث' },
      {
        type: 'list',
        items: [
          'حجر مخطّط أو بلاط بلونين حول قوس أو مدفأة أو مدخل',
          'قطعة أثاث واحدة مطعّمة بالصدف في غرفة هادئة',
          'سقف خشبي ملوّن أو مذهّب فوق السفرة أو الاستقبال',
          'نافورة صغيرة أو حائط مائي في الفناء أو التراس أو المدخل',
          'ياسمين وليمون ونباتات متسلّقة تنقل إحساس الفناء إلى الداخل',
        ],
      },
      { type: 'h2', text: 'الخامات والألوان' },
      {
        type: 'p',
        text: 'الألوان توازن بين برودة الحجر ودفء الخشب: حجر جيري عاجي وبازلت فحمي، وخشب جوز وورد، ولمسات من الأحمر الغامق والأخضر والذهبي من الأسقف الملوّنة. ولأن الطراز غني بطبيعته، نُبقي العمارة بسيطة ونترك القطع الحِرفية القليلة تحمل التراث. وهو نفس ما نفعله في كل مشروع يلتقي فيه التاريخ بالحياة اليومية.',
      },
    ],
  },
  'quiet-luxury-interior-trends-2026': {
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
    bodyAr: [
      {
        type: 'p',
        text: 'الفخامة في التصميم الداخلي غيّرت لهجتها. القطع الصارخة والأسطح اللامعة التي سيطرت على السنوات العشر الماضية تتراجع، ويحل محلها شيء أهدأ: غرف تشعر بأنها غالية بسبب طريقة صنعها، لا بسبب صوتها العالي.',
      },
      { type: 'h2', text: 'الملمس قبل الزخرفة' },
      {
        type: 'p',
        text: 'أجمل غرف 2026 تعتمد على اللمس: ترافرتين مطفي، وحوائط بدهان جيري، وتنجيد بوكليه وكتان، وخشب تظهر عروقه. عندما تكون الأسطح بهذا الغنى، لا تحتاج الغرفة إلى إكسسوارات كثيرة.',
      },
      { type: 'h2', text: 'ألوان محايدة أدفأ وأعمق' },
      {
        type: 'p',
        text: 'الأبيض الناصع يتراجع، ومكانه درجات محايدة متداخلة: عاجي، وكتاني، ورملي، وبيج مائل للرمادي، ومعها لون واحد غامق يثبّت المكان، مثل الكحلي أو الباذنجاني أو بني التبغ. هذا التباين يعطي الغرفة شخصية ويُبقيها مريحة للعين.',
      },
      {
        type: 'quote',
        text: 'الغرفة يجب أن تكون جميلة من كل كرسي فيها، لا من زاوية الباب التي تُلتقط منها الصورة فقط.',
      },
      { type: 'h2', text: 'قطع أقل، لكن أجود' },
      {
        type: 'p',
        text: 'الفخامة الهادئة تميل إلى قطع أثاث تعيش طويلًا ووراءها صنعة حقيقية: ترابيزة سفرة من خشب طبيعي، أو كرسي بتصميم نحتي، أو كونسول مشطّب باليد. وننصح عملاءنا بألا يستعجلوا، وأن يختاروا القطع على مهل، فيكتسب البيت شخصيته مع الوقت.',
      },
      {
        type: 'list',
        items: [
          'اختر خامات طبيعية يزداد جمالها مع الاستخدام',
          'لا تتجاوز ثلاث أو أربع درجات لونية في الغرفة الواحدة',
          'استثمر في إضاءة على أكثر من مستوى ويمكن التحكم في شدتها',
          'خبّئ التخزين، لتبقى الأسطح هادئة ومرتبة',
        ],
      },
      { type: 'h2', text: 'الضوء هو الخامة الأخيرة' },
      {
        type: 'p',
        text: 'وفي النهاية، الإضاءة هي التي تصنع الفرق. إضاءة خطية مخفية، ولمبات بلون دافئ 2700 كلفن، وأباجورات في أماكنها الصحيحة، تجعل نفس الغرفة مشرقة وعملية بالنهار، ودافئة بالليل. وهذا هو البيت الذي يُعاش فيه فعلًا.',
      },
    ],
  },
  'choosing-natural-stone': {
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
    bodyAr: [
      {
        type: 'p',
        text: 'الحجر الطبيعي من أطول الاستثمارات عمرًا في أي بيت، ومن أسهلها في الخطأ أيضًا. الشكل الجميل نصف القرار فقط، والنصف الآخر هو كيف سيتصرف الحجر في المكان نفسه: مع الإضاءة، ومع الاستخدام اليومي، ومع طريقة التنظيف.',
      },
      { type: 'h2', text: 'الرخام: جماله دائم، لكنه يتأثر' },
      {
        type: 'p',
        text: 'عروق الرخام لا ينافسها شيء في الحوائط الديكورية والحمّامات والأرضيات المميّزة. لكن الرخام حجر جيري، فالأحماض مثل الليمون والخل ومنظفات الكلور تترك على سطحه اللامع بقعًا باهتة. لهذا ننصح غالبًا في المطابخ بتشطيب مطفي، يخفي آثار الاستخدام ويكتسب مع الوقت لمعة هادئة.',
      },
      { type: 'h2', text: 'الترافرتين: دفء وملمس' },
      {
        type: 'p',
        text: 'مسام الترافرتين الطبيعية ودرجاته الدافئة تناسب التصميمات الهادئة ذات الروح المتوسطية. إذا مُلئت مسامه وشُطّب مطفيًا يصبح أرضية جميلة وعملية، وإذا تُركت مسامه مفتوحة يكون مثاليًا للحوائط الديكورية والواجهات الخارجية.',
      },
      { type: 'h2', text: 'الأونيكس: مسرح للضوء' },
      {
        type: 'p',
        text: 'الأونيكس شبه شفاف، ولهذا يكون مبهرًا عندما تضيئه من الخلف: في واجهة كاونتر، أو مكتب استقبال، أو حائط حمّام الضيوف. لكنه أضعف وأكثر حساسية من الرخام، فنستخدمه في الأماكن قليلة الحركة التي نريد أن نلفت النظر فيها.',
      },
      { type: 'h2', text: 'كيف نختار الحجر' },
      {
        type: 'list',
        items: [
          'نزور المخزن ونختار الألواح بأنفسنا، لوحًا لوحًا',
          'نطابق الألواح حتى تستمر العروق عبر الفواصل',
          'نحدد السُّمك ونوع التشطيب وتفاصيل الحواف في الرسومات',
          'نعزل الحجر بالطريقة الصحيحة، ونسلّمك دليلًا بسيطًا للعناية به',
        ],
      },
      {
        type: 'p',
        text: 'عندما يُختار الحجر ويُنفَّذ بهذه الطريقة، لا يكون مجرد ديكور. يصبح جزءًا من ذاكرة البيت.',
      },
    ],
  },
  'space-planning-daily-rituals': {
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
    bodyAr: [
      {
        type: 'p',
        text: 'أغلب مشاكل التوزيع لا تظهر إلا بعد السكن: باب يفتح على الحائط الوحيد الفارغ، أو سفرة بعيدة عن المطبخ، أو دولاب في مكان لا يحتاجه أحد. هذه ليست مشاكل ديكور، بل مشاكل تخطيط، وحلّها يكون قبل اختيار أي تشطيب.',
      },
      { type: 'h2', text: 'ابدأ بيوم عادي في حياتك' },
      {
        type: 'p',
        text: 'في بداية كل مشروع سكني نرسم مع العميل شكل يوم عادي ويوم إجازة: من يستيقظ أولًا، وأين تُترك شنط المدرسة، وكيف يُستقبل الضيوف، وأين تجتمع الأسرة بالليل. هذه التفاصيل الصغيرة هي الهيكل الذي نبني عليه التوزيع.',
      },
      { type: 'h2', text: 'مناطق، لا غرف فقط' },
      {
        type: 'p',
        text: 'المساحات المفتوحة تنجح عندما تكون مقسّمة بذكاء. السجاد، وتغيّر منسوب السقف، ودوائر الإضاءة، والنجارة، كلها تحدد مكان الطبخ والأكل والجلوس من غير حوائط، فيبقى الضوء والكلام يتنقلان بحرية.',
      },
      {
        type: 'list',
        items: [
          'اترك ممرات الحركة الرئيسية بعرض 90 إلى 120 سم',
          'ضع التخزين حيث تحتاجه، لا حيث يسهل تنفيذه',
          'خطّط أماكن البرايز والإضاءة حسب الأثاث، لا حسب الحوائط',
          'اترك مساحة مرنة، لأن احتياجات الأسرة ستتغير',
        ],
      },
      { type: 'h2', text: 'صمّم لعشر سنوات قادمة' },
      {
        type: 'p',
        text: 'غرفة الطفل الصغير تصبح غرفة مذاكرة، وغرفة المذاكرة تصبح غرفة شاب. لذلك نصمّم نجارة يمكن تعديلها، وتوصيلات كهرباء وتكييف محايدة، ليتطور البيت مع أصحابه من غير تكسير.',
      },
    ],
  },
  'shell-and-core-to-handover': {
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
    bodyAr: [
      {
        type: 'p',
        text: 'استلام وحدة على الطوب الأحمر شيء مفرح ومربك في الوقت نفسه: مساحة فارغة يمكنك أن تصنع فيها ما تريد، لكن أمامك مئات القرارات. ومعرفة ترتيب خطوات مشروع تسليم المفتاح تزيل معظم هذا القلق.',
      },
      { type: 'h2', text: '1. فهم المطلوب ورفع المقاسات' },
      {
        type: 'p',
        text: 'نبدأ بجلسة نفهم فيها احتياجاتك بالتفصيل، ثم نرفع الوحدة بالمقاسات: المناسيب، والفتحات، وأماكن التوصيلات الموجودة. وفي هذه المرحلة نتفق على الميزانية والمدة، قبل أن يبدأ التصميم وليس بعده.',
      },
      { type: 'h2', text: '2. الفكرة والاعتماد' },
      {
        type: 'p',
        text: 'توزيع المساحات ولوحات الإلهام وصور الـ 3D ترسم شكل المكان. تراجع الفكرة وتعتمدها قبل أن ندخل في الرسومات التنفيذية، وهذا يجعل التعديلات أسرع وأقل تكلفة.',
      },
      { type: 'h2', text: '3. التصميم التنفيذي' },
      {
        type: 'p',
        text: 'تتحول الفكرة المعتمدة إلى رسومات تنفيذية كاملة: الأسقف، والإضاءة، والكهرباء، والتنسيق بين الكهرباء والسباكة والتكييف، والنجارة، وجدول كامل للتشطيبات. هذه الرسومات هي ما يجعل المقاول ينفّذ بدقة.',
      },
      { type: 'h2', text: '4. التنفيذ في الموقع' },
      {
        type: 'list',
        items: [
          'المرحلة الأولى: الحوائط الخفيفة، ومسارات الكهرباء والسباكة والتكييف، وهياكل الأسقف',
          'استلام كل الأعمال قبل قفل الحوائط والأسقف',
          'المرحلة الثانية: التشطيبات والنجارة والأدوات الصحية والإكسسوارات',
          'تركيب الأثاث والإضاءة والمفروشات',
        ],
      },
      { type: 'h2', text: '5. الملاحظات والتسليم' },
      {
        type: 'p',
        text: 'قبل التسليم نمرّ معك على كل غرفة بقائمة ملاحظات مفصّلة، ونغلق كل بند فيها. وتستلم رسومات ما بعد التنفيذ، والضمانات، ودليلًا للعناية بالمكان، ومعها بيت جاهز للسكن.',
      },
      {
        type: 'quote',
        text: 'أفضل تسليم هو الذي لا يفاجئك فيه شيء، لأنك فهمت كل خطوة أوصلتك إليه.',
      },
    ],
  },
  'layered-lighting': {
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
    bodyAr: [
      {
        type: 'p',
        text: 'الإضاءة غالبًا آخر شيء يفكر فيه العميل، وأول شيء يلاحظه. الغرفة التي فيها مصدر ضوء واحد في السقف ستبدو دائمًا باهتة، مهما كانت تشطيباتها جميلة.',
      },
      { type: 'h2', text: 'ثلاث طبقات في تكوين واحد' },
      {
        type: 'list',
        items: [
          'إضاءة عامة: إضاءة مخفية في الأسقف وسبوتات هادئة تنير المكان كله',
          'إضاءة للعمل: ضوء مركّز للمطبخ والقراءة والمرآة والمكتب',
          'إضاءة جمالية: إضاءة على الحوائط واللوحات والتجاويف تعطي المكان عمقًا',
        ],
      },
      { type: 'h2', text: 'لون الإضاءة مهم' },
      {
        type: 'p',
        text: 'في البيوت نختار إضاءة بيضاء دافئة، عادةً من 2700 إلى 3000 كلفن، وبمؤشر ألوان عالٍ (CRI)، ليظهر الحجر والخشب ولون البشرة بشكل طبيعي. أما في المكاتب فقد نستخدم ضوءًا أبرد قليلًا يساعد على التركيز، مع الحفاظ على راحة العين.',
      },
      { type: 'h2', text: 'التحكم هو كل شيء' },
      {
        type: 'p',
        text: 'عندما تكون الإضاءة على دوائر منفصلة ويمكن التحكم في شدتها، تتحول الغرفة الواحدة إلى أكثر من غرفة. غرفة المعيشة يمكن أن تكون مضيئة بعد الظهر مع العائلة، وهادئة في سهرة حديث، ومبهرة عند وصول الضيوف، بلمسة واحدة على لوحة التحكم.',
      },
    ],
  },
  'natural-timber-egypt-climate': {
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
    bodyAr: [
      {
        type: 'p',
        text: 'الخشب يعطي دفئًا لا تعطيه أي خامة أخرى، لكن في جو مصر يجب أن يُختار بحرص. الفرق الكبير بين داخل مكيّف وخارج حار وجاف يجعل الخشب يتمدد وينكمش، والخشب المختار بشكل خاطئ يتشقق أو يتقوّس أو تظهر فيه فراغات.',
      },
      { type: 'h2', text: 'خشب طبيعي أم هندسي؟' },
      {
        type: 'p',
        text: 'للأرضيات والألواح الكبيرة ننصح غالبًا بالخشب الهندسي: طبقة خشب طبيعي حقيقية فوق قلب متعدد الطبقات ثابت. شكله وملمسه مثل الخشب الطبيعي تمامًا، لكن حركته أقل بكثير. أما الخشب الطبيعي المصمت فنستخدمه في الأثاث والدرابزين والتفاصيل التي يظهر فيها جماله.',
      },
      { type: 'h2', text: 'التجفيف والتأقلم' },
      {
        type: 'p',
        text: 'نشترط خشبًا مجففًا في الأفران، ونتركه في الموقع فترة ليتأقلم قبل التركيب. ونقيس نسبة الرطوبة ونسجّلها، وهي خطوة صغيرة تمنع أغلب المشاكل لاحقًا.',
      },
      {
        type: 'list',
        items: [
          'اختر أنواعًا ثابتة مثل البلوط والجوز والتيك',
          'اترك فواصل تمدد مخفية خلف الوزرة والحليات',
          'استخدم تشطيبات مقاومة للأشعة فوق البنفسجية بجوار الشبابيك الكبيرة',
          'حافظ على نسبة رطوبة ثابتة داخل البيت قدر الإمكان',
        ],
      },
      { type: 'h2', text: 'تشطيب يعيش طويلًا' },
      {
        type: 'p',
        text: 'زيوت الشمع الصلب تعطي الأرضيات والنجارة شكلًا طبيعيًا ويسهل إصلاحها، أما الورنيش فيناسب الأسطح التي تُلمس كثيرًا في الأماكن التجارية. وفي الحالتين، التشطيب جزء من المواصفات من البداية، وليس شيئًا نفكر فيه في الآخر.',
      },
    ],
  },
  'how-to-brief-your-interior-designer': {
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
    bodyAr: [
      {
        type: 'p',
        text: 'أهم ما يمكن أن تحضره معك في أول لقاء هو ملخص واضح لما تريد. الملخص الجيد يختصر مرحلة الفكرة، ويركّز الميزانية، ويساعد المصمم على أن يفهم ليس فقط ما تريده، بل لماذا تريده.',
      },
      { type: 'h2', text: 'ماذا تجهّز' },
      {
        type: 'list',
        items: [
          'رسومات الوحدة وصورها، وحالتها الحالية (على الطوب الأحمر أو تجديد)',
          'من سيستخدم المكان وكيف: الروتين اليومي، والضيوف، والعمالة المنزلية',
          'الأشياء التي لا تستغني عنها، والأشياء التي ترفضها تمامًا',
          'ميزانية تقريبية واقعية، وموعد تحب أن تستلم فيه',
          'صور لأماكن أعجبتك، وأخرى لم تعجبك',
        ],
      },
      { type: 'h2', text: 'احكِ عن الإحساس، لا الشكل فقط' },
      {
        type: 'p',
        text: 'صور الإلهام مفيدة، لكن الإحساس الذي وراءها أهم. هل تريد مكانًا هادئًا؟ واسعًا؟ دافئًا؟ جريئًا؟ عندما تصف ما تريد أن تشعر به في المكان، نستطيع أن نفهم الصور ونبني عليها، بدلًا من أن ننسخها.',
      },
      { type: 'h2', text: 'كن صريحًا في الميزانية' },
      {
        type: 'p',
        text: 'عندما تخبرنا بميزانيتك التقريبية، فأنت لا تلتزم بصرفها كلها. هي فقط أداة تساعد المصمم على أن يعرف أين يوجّه الميزانية لتعطي أكبر قيمة. ونموذج تفاصيل المشروع في صفحة التواصل بداية جيدة.',
      },
    ],
  },
};

/** The built-in articles with their text. */
export const posts: Post[] = postSummaries.map((summary) => ({ ...summary, ...bodies[summary.slug] }));

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
