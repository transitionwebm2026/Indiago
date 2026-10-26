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
    image: '/images/projects/arabian-majlis/01.jpg',
    title: { en: 'Interior Design & 3D Visualization', ar: 'التصميم الداخلي والتصوّر ثلاثي الأبعاد' },
    summary: {
      en: 'Concepts, space planning, material palettes and photorealistic renders, so clients see the space before work begins.',
      ar: 'أفكار تصميمية وتخطيط للمساحات ولوحات خامات وتصوّرات واقعية، لترى مساحتك قبل بدء العمل.',
    },
    deliverables: pairs(
      ['Design concepts', 'Space planning & layouts', 'Material & colour palettes', 'Photorealistic 3D renders'],
      ['أفكار التصميم', 'تخطيط المساحات وتوزيع الأثاث', 'لوحات الخامات والألوان', 'تصوّرات ثلاثية الأبعاد واقعية'],
    ),
    core: true,
  },
  {
    id: 'fit-out',
    icon: 'hard-hat',
    image: '/images/projects/department-of-finance/01.jpg',
    title: { en: 'Integrated Fit-Out Solutions', ar: 'حلول التجهيز المتكاملة' },
    summary: {
      en: 'Complete project management from design interpretation to handover, with integrated control of quality, cost and time.',
      ar: 'إدارة كاملة للمشروع من قراءة التصميم وحتى التسليم، مع ضبط متكامل للجودة والتكلفة والوقت.',
    },
    deliverables: pairs(
      ['Complete project management', 'Design interpretation to handover', 'Quality, cost & time control', 'Progress reporting & QA/QC checks'],
      ['إدارة كاملة للمشروع', 'من قراءة التصميم حتى التسليم', 'ضبط الجودة والتكلفة والوقت', 'تقارير سير العمل وفحوصات الجودة'],
    ),
    core: true,
  },
  {
    id: 'finishing',
    icon: 'paint-roller',
    image: '/images/site/flooring.jpg',
    title: { en: 'Interior Finishing Works', ar: 'أعمال التشطيبات الداخلية' },
    summary: {
      en: 'Walls, ceilings, flooring, joinery, painting, lighting and decorative details, finished to UAE QA/QC standards.',
      ar: 'الحوائط والأسقف والأرضيات والنجارة والدهانات والإضاءة والتفاصيل الديكورية، بتشطيب وفق معايير ضبط الجودة الإماراتية.',
    },
    deliverables: pairs(
      ['Walls & ceilings', 'Flooring & joinery', 'Painting & lighting', 'Decorative details'],
      ['الحوائط والأسقف', 'الأرضيات والنجارة', 'الدهانات والإضاءة', 'التفاصيل الديكورية'],
    ),
    core: true,
  },
  {
    id: 'design-execution',
    icon: 'drafting-compass',
    image: '/images/projects/al-borg-laboratories/01.jpg',
    title: { en: 'Custom Design Execution', ar: 'تنفيذ التصاميم المخصّصة' },
    summary: {
      en: 'Translating designer and architect concepts into built results, working closely with their teams to protect design intent.',
      ar: 'نحوّل أفكار المصممين والمعماريين إلى واقع منفّذ، بالتعاون الوثيق مع فرقهم للحفاظ على روح التصميم.',
    },
    deliverables: pairs(
      [
        'Designer & architect concepts, built',
        'Close collaboration with design teams',
        'Design intent protected on site',
        'Built results that match the vision',
      ],
      ['تنفيذ تصاميم المصممين والمعماريين', 'تعاون وثيق مع فرق التصميم', 'الحفاظ على روح التصميم في الموقع', 'نتيجة منفّذة مطابقة للرؤية'],
    ),
    core: true,
  },
  {
    id: 'renovation',
    icon: 'hammer',
    image: '/images/site/ceiling-works.jpg',
    title: { en: 'Renovation & Enhancement', ar: 'التجديد والتطوير' },
    summary: {
      en: 'Upgrading existing spaces with high-quality materials and modern aesthetics, with a focus on comfort, efficiency and elegance.',
      ar: 'تطوير المساحات القائمة بخامات عالية الجودة وجماليات عصرية، مع التركيز على الراحة والكفاءة والأناقة.',
    },
    deliverables: pairs(
      ['Upgrades to existing spaces', 'High-quality materials', 'Modern aesthetics', 'Comfort, efficiency & elegance'],
      ['تطوير المساحات القائمة', 'خامات عالية الجودة', 'جماليات عصرية', 'الراحة والكفاءة والأناقة'],
    ),
    core: false,
  },
  {
    id: 'joinery-styling',
    icon: 'sofa',
    image: '/images/projects/sun-capital-residence/02.jpg',
    title: { en: 'Joinery, Furniture & Styling', ar: 'النجارة والأثاث والتنسيق' },
    summary: {
      en: 'Bespoke wardrobes, kitchens and feature walls, plus furniture, lighting and accessories curated to complete the space.',
      ar: 'دواليب ومطابخ وحوائط مميّزة مصمّمة خصيصًا، مع أثاث وإضاءة وإكسسوارات مختارة بعناية لتكتمل المساحة.',
    },
    deliverables: pairs(
      ['Bespoke wardrobes & kitchens', 'Feature walls', 'Furniture & lighting selection', 'Accessories & final styling'],
      ['دواليب ومطابخ مخصّصة', 'حوائط مميّزة', 'اختيار الأثاث والإضاءة', 'الإكسسوارات والتنسيق النهائي'],
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
      ar: 'زيارة للموقع لفهم أهدافك وجدولك الزمني وميزانيتك.',
    },
    points: pairs(
      ['Site visit & measurements', 'Goals & design brief', 'Timeline alignment', 'Budget workshop'],
      ['زيارة الموقع وأخذ المقاسات', 'الأهداف وملخص التصميم', 'مواءمة الجدول الزمني', 'جلسة تحديد الميزانية'],
    ),
    deliverables: pairs(
      ['Site visit & measurements', 'Documented design brief', 'Budget & timeline framework', 'Project proposal'],
      ['زيارة الموقع وأخذ المقاسات', 'ملخص تصميم موثّق', 'إطار للميزانية والجدول الزمني', 'العرض الفني'],
    ),
  },
  {
    title: { en: 'Concept Design', ar: 'التصميم المبدئي' },
    duration: { en: '3–4 weeks', ar: '3–4 أسابيع' },
    summary: {
      en: 'Layouts, mood boards and 3D visuals that set the direction for your space.',
      ar: 'مخططات ولوحات إلهام وتصوّرات ثلاثية الأبعاد تحدّد توجّه مساحتك.',
    },
    points: pairs(
      ['Furniture layouts', 'Mood boards', 'Colour & material direction', '3D visuals'],
      ['مخططات توزيع الأثاث', 'لوحات الإلهام', 'توجّه الألوان والخامات', 'تصوّرات ثلاثية الأبعاد'],
    ),
    deliverables: pairs(
      ['2D furniture layouts', 'Mood board, colour & material direction', '3D visuals of key spaces', 'Concept presentation'],
      ['مخططات توزيع الأثاث ثنائية الأبعاد', 'لوحة إلهام وتوجّه الألوان والخامات', 'تصوّرات ثلاثية الأبعاد للمساحات الرئيسية', 'عرض الفكرة'],
    ),
  },
  {
    title: { en: 'Design & BOQ', ar: 'التصميم وجدول الكميات' },
    duration: { en: '4–6 weeks', ar: '4–6 أسابيع' },
    summary: {
      en: 'Working drawings, specifications and an itemized quotation, so scope and budget are clear before work begins.',
      ar: 'رسومات تنفيذية ومواصفات وعرض سعر تفصيلي، ليكون نطاق العمل والميزانية واضحين قبل البدء.',
    },
    points: pairs(
      ['Working drawings', 'Materials & finishes specifications', 'Itemized Bill of Quantities', 'Final quotation'],
      ['الرسومات التنفيذية', 'مواصفات الخامات والتشطيبات', 'جدول كميات تفصيلي', 'عرض السعر النهائي'],
    ),
    deliverables: pairs(
      ['Working drawings', 'Ceiling, lighting & flooring plans', 'Materials & finishes schedule', 'Itemized Bill of Quantities'],
      ['الرسومات التنفيذية', 'مخططات الأسقف والإضاءة والأرضيات', 'جدول الخامات والتشطيبات', 'جدول كميات تفصيلي'],
    ),
  },
  {
    title: { en: 'Execution', ar: 'التنفيذ' },
    duration: { en: 'Project-dependent', ar: 'حسب حجم المشروع' },
    summary: {
      en: 'Site works with progress reporting and QA/QC checks at every stage.',
      ar: 'أعمال الموقع مع تقارير دورية عن سير العمل وفحوصات الجودة في كل مرحلة.',
    },
    points: pairs(
      ['Site works across every trade', 'Progress reporting', 'QA/QC inspections', 'Quality, cost & time control'],
      ['أعمال الموقع بجميع تخصصاتها', 'تقارير سير العمل', 'فحوصات ضبط الجودة', 'ضبط الجودة والتكلفة والوقت'],
    ),
    deliverables: pairs(
      ['Site progress reports', 'Approved shop drawings & samples', 'QA/QC inspection checklists', 'Budget & programme tracking'],
      ['تقارير سير العمل في الموقع', 'رسومات الورش والعيّنات المعتمدة', 'قوائم فحص الجودة', 'متابعة الميزانية والجدول الزمني'],
    ),
  },
  {
    title: { en: 'Handover', ar: 'التسليم' },
    duration: { en: 'On completion', ar: 'عند الاكتمال' },
    summary: {
      en: 'Final styling, snagging and a guided walkthrough of your finished space.',
      ar: 'التنسيق النهائي ومعالجة الملاحظات وجولة إرشادية في مساحتك المكتملة.',
    },
    points: pairs(
      ['Final styling', 'Snagging & close-out', 'Guided walkthrough', 'Handover of the finished space'],
      ['التنسيق النهائي', 'معالجة الملاحظات وإغلاقها', 'جولة إرشادية', 'تسليم المساحة مكتملة'],
    ),
    deliverables: pairs(
      ['Final styling', 'Completed snag list', 'Guided walkthrough', 'As-built documentation', 'Warranty & maintenance guide'],
      ['التنسيق النهائي', 'قائمة ملاحظات مكتملة', 'جولة إرشادية', 'مستندات ما بعد التنفيذ', 'دليل الضمان والصيانة'],
    ),
  },
];

export function getService(list: Service[], id: string) {
  return list.find((service) => service.id === id);
}
