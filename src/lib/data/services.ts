import type { Localized } from '@/lib/i18n/types';

export interface Service {
  /** URL-safe ID: the /services/#id anchor, and how projects and inquiries refer to the service. */
  id: string;
  /** Icon name — see components/services/ServiceIcon.tsx */
  icon: string;
  /** Image ID or /public path — see lib/images.ts */
  image: string;
  title: Localized;
  summary: Localized;
  /** Bullet points on the service card. */
  deliverables: Localized[];
  /** One of the core services featured on the home page. */
  core: boolean;
}

export interface ProcessStep {
  title: Localized;
  duration: Localized;
  summary: Localized;
  /** Checklist shown with the step in the workflow timeline. */
  points: Localized[];
  /** What the client receives at this stage (deliverables accordion). */
  deliverables: Localized[];
}

/** Pairs an English list with its Arabic translation, item by item. */
const pairs = (en: string[], ar: string[]): Localized[] => en.map((value, index) => ({ en: value, ar: ar[index] ?? '' }));

/**
 * Built-in services. With the CMS enabled these seed the `services` table and are
 * replaced by whatever the studio edits in the dashboard.
 */
export const services: Service[] = [
  {
    id: 'interior-design',
    icon: 'pen-tool',
    image: '/images/services/interior-design.jpg',
    title: { en: 'Interior Design & 3D Visualization', ar: 'التصميم الداخلي وتصميم 3D' },
    summary: {
      en: 'Concepts, space planning, material palettes and photorealistic renders, so clients see the space before work begins.',
      ar: 'فكرة التصميم، وتوزيع المساحات، واختيار الخامات والألوان، وصور 3D واقعية ترى بها المكان قبل أن نبدأ التنفيذ.',
    },
    deliverables: pairs(
      ['Design concepts', 'Space planning & layouts', 'Material & colour palettes', 'Photorealistic 3D renders'],
      ['فكرة التصميم', 'توزيع المساحات والأثاث', 'الخامات والألوان', 'صور 3D واقعية'],
    ),
    core: true,
  },
  {
    id: 'fit-out',
    icon: 'hard-hat',
    image: '/images/services/fit-out.jpg',
    title: { en: 'Integrated Fit-Out Solutions', ar: 'التشطيب والتجهيز المتكامل' },
    summary: {
      en: 'Complete project management from design interpretation to handover, with integrated control of quality, cost and time.',
      ar: 'نستلم المشروع من قراءة التصميم حتى التسليم، ونتابع الجودة والتكلفة والوقت في كل خطوة.',
    },
    deliverables: pairs(
      ['Complete project management', 'Design interpretation to handover', 'Quality, cost & time control', 'Progress reporting & QA/QC checks'],
      ['إدارة المشروع بالكامل', 'من قراءة التصميم حتى التسليم', 'متابعة الجودة والتكلفة والوقت', 'تقارير دورية وفحوصات جودة'],
    ),
    core: true,
  },
  {
    id: 'finishing',
    icon: 'paint-roller',
    image: '/images/services/finishing.jpg',
    title: { en: 'Interior Finishing Works', ar: 'أعمال التشطيبات الداخلية' },
    summary: {
      en: 'Walls, ceilings, flooring, joinery, painting, lighting and decorative details, finished to UAE QA/QC standards.',
      ar: 'حوائط وأسقف وأرضيات ونجارة ودهانات وإضاءة وتفاصيل ديكور، بتشطيب على معايير الجودة الإماراتية.',
    },
    deliverables: pairs(
      ['Walls & ceilings', 'Flooring & joinery', 'Painting & lighting', 'Decorative details'],
      ['الحوائط والأسقف', 'الأرضيات والنجارة', 'الدهانات والإضاءة', 'تفاصيل الديكور'],
    ),
    core: true,
  },
  {
    id: 'design-execution',
    icon: 'drafting-compass',
    image: '/images/services/design-execution.jpg',
    title: { en: 'Custom Design Execution', ar: 'تنفيذ التصميمات الخاصة' },
    summary: {
      en: 'Translating designer and architect concepts into built results, working closely with their teams to protect design intent.',
      ar: 'عندك تصميم من مصمم أو معماري؟ ننفّذه على أرض الواقع بالتنسيق معه، ونحافظ على كل تفصيلة كما رُسمت.',
    },
    deliverables: pairs(
      [
        'Designer & architect concepts, built',
        'Close collaboration with design teams',
        'Design intent protected on site',
        'Built results that match the vision',
      ],
      ['تنفيذ تصميمات المصممين والمعماريين', 'تنسيق مستمر مع فريق التصميم', 'الالتزام بروح التصميم في الموقع', 'نتيجة مطابقة لما تخيّلته'],
    ),
    core: true,
  },
  {
    id: 'renovation',
    icon: 'hammer',
    image: '/images/services/renovation.jpg',
    title: { en: 'Renovation & Enhancement', ar: 'التجديد والتطوير' },
    summary: {
      en: 'Upgrading existing spaces with high-quality materials and modern aesthetics, with a focus on comfort, efficiency and elegance.',
      ar: 'نجدّد المساحات القائمة بخامات أفضل وشكل عصري، مع الاهتمام بالراحة والعملية والأناقة.',
    },
    deliverables: pairs(
      ['Upgrades to existing spaces', 'High-quality materials', 'Modern aesthetics', 'Comfort, efficiency & elegance'],
      ['تجديد المساحات القائمة', 'خامات عالية الجودة', 'شكل عصري', 'راحة وعملية وأناقة'],
    ),
    core: false,
  },
  {
    id: 'joinery-styling',
    icon: 'sofa',
    image: '/images/services/joinery-styling.jpg',
    title: { en: 'Joinery, Furniture & Styling', ar: 'النجارة والأثاث والتنسيق' },
    summary: {
      en: 'Bespoke wardrobes, kitchens and feature walls, plus furniture, lighting and accessories curated to complete the space.',
      ar: 'دواليب ومطابخ وحوائط ديكورية مصمّمة خصيصًا، مع اختيار الأثاث والإضاءة والإكسسوارات حتى يكتمل المكان.',
    },
    deliverables: pairs(
      ['Bespoke wardrobes & kitchens', 'Feature walls', 'Furniture & lighting selection', 'Accessories & final styling'],
      ['دواليب ومطابخ تفصيل', 'حوائط ديكورية', 'اختيار الأثاث والإضاءة', 'الإكسسوارات والتنسيق النهائي'],
    ),
    core: false,
  },
];

/** The studio's execution process, from first meeting to handover. */
export const processSteps: ProcessStep[] = [
  {
    title: { en: 'Consultation', ar: 'الاستشارة' },
    duration: { en: '1–2 weeks', ar: 'أسبوع إلى أسبوعين' },
    summary: {
      en: 'A site visit to understand your goals, timeline and budget.',
      ar: 'نزور الموقع ونفهم ما تريده، ومتى تريده، وفي حدود أي ميزانية.',
    },
    points: pairs(
      ['Site visit & measurements', 'Goals & design brief', 'Timeline alignment', 'Budget workshop'],
      ['زيارة الموقع وأخذ المقاسات', 'فهم احتياجاتك', 'الاتفاق على الجدول الزمني', 'تحديد الميزانية'],
    ),
    deliverables: pairs(
      ['Site visit & measurements', 'Documented design brief', 'Budget & timeline framework', 'Project proposal'],
      ['زيارة الموقع وأخذ المقاسات', 'ملخص مكتوب لاحتياجاتك', 'تصوّر مبدئي للميزانية والمدة', 'عرض فني ومالي'],
    ),
  },
  {
    title: { en: 'Concept Design', ar: 'التصميم المبدئي' },
    duration: { en: '3–4 weeks', ar: '3 إلى 4 أسابيع' },
    summary: {
      en: 'Layouts, mood boards and 3D visuals that set the direction for your space.',
      ar: 'توزيع الأثاث ولوحات الإلهام وصور 3D، لنتفق معًا على شكل المكان.',
    },
    points: pairs(
      ['Furniture layouts', 'Mood boards', 'Colour & material direction', '3D visuals'],
      ['توزيع الأثاث', 'لوحات الإلهام', 'الألوان والخامات', 'صور 3D'],
    ),
    deliverables: pairs(
      ['2D furniture layouts', 'Mood board, colour & material direction', '3D visuals of key spaces', 'Concept presentation'],
      ['توزيع أثاث 2D', 'لوحة إلهام للألوان والخامات', 'صور 3D للمساحات الرئيسية', 'عرض تقديمي للفكرة'],
    ),
  },
  {
    title: { en: 'Design & BOQ', ar: 'التصميم والمقايسة' },
    duration: { en: '4–6 weeks', ar: '4 إلى 6 أسابيع' },
    summary: {
      en: 'Working drawings, specifications and an itemized quotation, so scope and budget are clear before work begins.',
      ar: 'رسومات تنفيذية ومواصفات ومقايسة مفصّلة، فتعرف نطاق العمل والتكلفة قبل أن نبدأ.',
    },
    points: pairs(
      ['Working drawings', 'Materials & finishes specifications', 'Itemized Bill of Quantities', 'Final quotation'],
      ['الرسومات التنفيذية', 'مواصفات الخامات والتشطيبات', 'مقايسة تفصيلية', 'عرض السعر النهائي'],
    ),
    deliverables: pairs(
      ['Working drawings', 'Ceiling, lighting & flooring plans', 'Materials & finishes schedule', 'Itemized Bill of Quantities'],
      ['الرسومات التنفيذية', 'مخططات الأسقف والإضاءة والأرضيات', 'جدول الخامات والتشطيبات', 'مقايسة تفصيلية'],
    ),
  },
  {
    title: { en: 'Execution', ar: 'التنفيذ' },
    duration: { en: 'Project-dependent', ar: 'حسب حجم المشروع' },
    summary: {
      en: 'Site works with progress reporting and QA/QC checks at every stage.',
      ar: 'أعمال الموقع بكل بنودها، مع تقارير دورية وفحص جودة في كل مرحلة.',
    },
    points: pairs(
      ['Site works across every trade', 'Progress reporting', 'QA/QC inspections', 'Quality, cost & time control'],
      ['كل أعمال الموقع', 'تقارير دورية', 'فحوصات الجودة', 'متابعة الجودة والتكلفة والوقت'],
    ),
    deliverables: pairs(
      ['Site progress reports', 'Approved shop drawings & samples', 'QA/QC inspection checklists', 'Budget & programme tracking'],
      ['تقارير سير العمل', 'رسومات الورش والعينات المعتمدة', 'قوائم فحص الجودة', 'متابعة الميزانية والجدول الزمني'],
    ),
  },
  {
    title: { en: 'Handover', ar: 'التسليم' },
    duration: { en: 'On completion', ar: 'عند الانتهاء' },
    summary: {
      en: 'Final styling, snagging and a guided walkthrough of your finished space.',
      ar: 'اللمسات الأخيرة، وإغلاق كل الملاحظات، ثم جولة معك في المكان قبل أن تستلمه.',
    },
    points: pairs(
      ['Final styling', 'Snagging & close-out', 'Guided walkthrough', 'Handover of the finished space'],
      ['اللمسات الأخيرة', 'إغلاق الملاحظات', 'جولة استلام معك', 'تسليم المكان جاهزًا'],
    ),
    deliverables: pairs(
      ['Final styling', 'Completed snag list', 'Guided walkthrough', 'As-built documentation', 'Warranty & maintenance guide'],
      ['اللمسات الأخيرة والتنسيق', 'قائمة ملاحظات مغلقة بالكامل', 'جولة استلام', 'رسومات ما بعد التنفيذ (As-built)', 'دليل الضمان والصيانة'],
    ),
  },
];

export function getService(list: Service[], id: string) {
  return list.find((service) => service.id === id);
}
