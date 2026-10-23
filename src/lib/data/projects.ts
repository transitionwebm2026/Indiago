import type { Localized } from '@/lib/i18n/types';
import type { ServiceId } from './services';

export type ProjectCategory = 'residential' | 'commercial' | 'corporate';

export const projectCategories: ProjectCategory[] = ['residential', 'commercial', 'corporate'];

export interface Project {
  id: string;
  title: Localized;
  category: ProjectCategory;
  location: Localized;
  year: number;
  /** Floor area in square metres. */
  area: number;
  scope: Localized;
  summary: Localized;
  /** Long-form design story (English). */
  concept: string[];
  materials: { name: string; detail: string }[];
  services: ServiceId[];
  /** Image ID or /public path — see lib/images.ts */
  cover: string;
  gallery: string[];
  featured?: boolean;
}

const locations = {
  zayed: { en: 'Sheikh Zayed', ar: 'الشيخ زايد' },
  newCairo: { en: 'New Cairo', ar: 'القاهرة الجديدة' },
  northCoast: { en: 'North Coast', ar: 'الساحل الشمالي' },
} satisfies Record<string, Localized>;

/**
 * Sample portfolio content — replace titles, copy and imagery with the studio's real projects.
 * Each entry automatically generates a static page at /portfolio/[id]/.
 */
export const projects: Project[] = [
  {
    id: 'al-safa-villa',
    title: { en: 'Al Safa Villa', ar: 'فيلا الصفا' },
    category: 'residential',
    location: locations.zayed,
    year: 2025,
    area: 620,
    scope: { en: 'Concept to turnkey handover', ar: 'من الفكرة حتى التسليم المتكامل' },
    summary: {
      en: 'A family villa reorganised around natural light, with honed travertine, smoked oak and bronze detailing throughout.',
      ar: 'فيلا عائلية أُعيد تنظيمها حول الضوء الطبيعي، بتفاصيل من الترافرتين المصقول والبلوط المدخّن والبرونز.',
    },
    concept: [
      'The brief was a home that could host large family gatherings yet still feel intimate on an ordinary weekday. We opened the ground floor into a sequence of connected living, dining and kitchen zones, defined by changes in ceiling height and lighting rather than walls.',
      'A restrained palette of honed travertine, smoked oak and bronze runs throughout, giving the villa a calm continuity. Bespoke joinery conceals storage and services so every surface stays composed, while layered lighting lets each space shift from bright family mornings to soft, intimate evenings.',
    ],
    materials: [
      { name: 'Honed travertine', detail: 'Flooring & feature walls, book-matched' },
      { name: 'Smoked oak', detail: 'Engineered flooring & wall cladding' },
      { name: 'Bronze metalwork', detail: 'Handrails, trims & joinery details' },
      { name: 'Limewash plaster', detail: 'Living & dining walls' },
      { name: 'Bouclé & linen', detail: 'Upholstery & window treatments' },
    ],
    services: ['concept-design', 'working-drawings', 'turnkey-fit-out', 'ffe-procurement'],
    cover: '1600585154084-4e5fe7c39198',
    gallery: [
      '1604014237800-1c9102c219da',
      '1600607687939-ce8a6c25118c',
      '1600585152220-90363fe7e115',
      '1629079447777-1e605162dc8d',
      '1617098900591-3f90928e8c54',
      '1600607687920-4e2a09cf159d',
    ],
    featured: true,
  },
  {
    id: 'maison-restaurant-lounge',
    title: { en: 'Maison Restaurant & Lounge', ar: 'مطعم وصالة ميزون' },
    category: 'commercial',
    location: locations.zayed,
    year: 2025,
    area: 480,
    scope: { en: 'Brand-led hospitality fit-out', ar: 'تجهيز ضيافة يعبّر عن العلامة التجارية' },
    summary: {
      en: 'A hospitality fit-out balancing intimate lounge seating with an efficient, high-capacity dining floor.',
      ar: 'مشروع ضيافة يوازن بين جلسات صالة حميمة وصالة طعام عالية الكفاءة والسعة.',
    },
    concept: [
      'The operator wanted a destination that could serve a busy lunch crowd and transform into an atmospheric lounge in the evening. Zoned lighting scenes, flexible table layouts and careful acoustic treatment make that shift seamless.',
      'Dark timber, aged brass and deep upholstery create warmth, while a carefully planned back-of-house keeps service fast and discreet. Every guest touchpoint — from the entrance sequence to the bar — was designed around the brand’s story.',
    ],
    materials: [
      { name: 'Dark-stained ash', detail: 'Wall slats & bar front' },
      { name: 'Aged brass', detail: 'Bar details & decorative lighting' },
      { name: 'Terrazzo', detail: 'Dining-floor finish' },
      { name: 'Velvet & leather', detail: 'Banquettes & lounge seating' },
      { name: 'Acoustic panels', detail: 'Concealed within the ceiling design' },
    ],
    services: ['commercial-fit-out', 'concept-design', 'working-drawings', 'turnkey-fit-out'],
    cover: '1517248135467-4c7edcad34c4',
    gallery: ['1554118811-1e0d58224f24', '1559329007-40df8a9345d8', '1551298370-9d3d53740c72'],
    featured: true,
  },
  {
    id: 'meridian-corporate-hq',
    title: { en: 'Meridian Corporate Headquarters', ar: 'المقر الرئيسي لميريديان' },
    category: 'corporate',
    location: locations.zayed,
    year: 2024,
    area: 1350,
    scope: { en: 'Workplace strategy & full fit-out', ar: 'استراتيجية بيئة العمل والتنفيذ الكامل' },
    summary: {
      en: 'A headquarters that balances focused work, collaboration and client hospitality across one open floor.',
      ar: 'مقر رئيسي يوازن بين العمل المركّز والتعاون واستقبال العملاء على طابق مفتوح واحد.',
    },
    concept: [
      'The client’s teams had outgrown a cellular office. We developed a workplace strategy combining open workstations, focus rooms and collaborative zones, organised along a clear central spine that makes wayfinding intuitive.',
      'Glass-fronted meeting rooms keep daylight flowing deep into the plan, while a refined client suite and boardroom express the brand’s confidence through stone, timber and precise detailing.',
    ],
    materials: [
      { name: 'Acoustic glass', detail: 'Meeting-room partitions' },
      { name: 'Carpet tiles', detail: 'Acoustic-grade workspace flooring' },
      { name: 'Oak veneer', detail: 'Reception & boardroom joinery' },
      { name: 'Porcelain stone', detail: 'Reception & pantry floors' },
      { name: 'Linear LED', detail: 'Glare-controlled task lighting' },
    ],
    services: ['concept-design', 'working-drawings', 'turnkey-fit-out', 'ffe-procurement'],
    cover: '1462826303086-329426d1aef5',
    gallery: [
      '1497366811353-6870744d04b2',
      '1497366216548-37526070297c',
      '1524758631624-e2822e304c36',
      '1504384308090-c894fdcc538d',
    ],
    featured: true,
  },
  {
    id: 'katameya-penthouse',
    title: { en: 'Katameya Heights Penthouse', ar: 'بنتهاوس مرتفعات القطامية' },
    category: 'residential',
    location: locations.newCairo,
    year: 2024,
    area: 410,
    scope: { en: 'Interior design, joinery & FF&E', ar: 'تصميم داخلي ونجارة وتوريد أثاث' },
    summary: {
      en: 'A double-height penthouse in smoked glass, walnut and charcoal stone, tuned for evening entertaining.',
      ar: 'بنتهاوس بارتفاع مزدوج من الزجاج المدخّن وخشب الجوز والحجر الفحمي، مُهيّأ لأمسيات الضيافة.',
    },
    concept: [
      'Panoramic views and a double-height living room set the stage. We leaned into a deeper, moodier palette so the penthouse feels most alive at dusk, when layered lighting reveals the textures of walnut, stone and smoked glass.',
      'A sculptural staircase anchors the plan, while a concealed bar and media wall allow the main living space to move easily between quiet evenings and large gatherings.',
    ],
    materials: [
      { name: 'Nero Marquina marble', detail: 'Kitchen island & bathroom vanities' },
      { name: 'American walnut', detail: 'Joinery, wall panelling & staircase' },
      { name: 'Smoked glass', detail: 'Partitions & display cabinetry' },
      { name: 'Brushed brass', detail: 'Lighting details & hardware' },
      { name: 'Wool & velvet', detail: 'Upholstery & rugs' },
    ],
    services: ['concept-design', 'working-drawings', 'ffe-procurement'],
    cover: '1564078516393-cf04bd966897',
    gallery: [
      '1618219740975-d40978bb7378',
      '1617104678098-de229db51175',
      '1588854337236-6889d631faa8',
      '1604709177225-055f99402ea3',
    ],
  },
  {
    id: 'zayed-courtyard-residence',
    title: { en: 'Zayed Courtyard Residence', ar: 'منزل الفناء بالشيخ زايد' },
    category: 'residential',
    location: locations.zayed,
    year: 2023,
    area: 380,
    scope: { en: 'Full renovation & modernisation', ar: 'تجديد وتحديث شامل' },
    summary: {
      en: 'A complete renovation that opened a dated layout around a light-filled courtyard and a calm ivory palette.',
      ar: 'تجديد شامل فتح مخططًا قديمًا حول فناء مليء بالضوء ولوحة ألوان عاجية هادئة.',
    },
    concept: [
      'This existing home had good bones but a fragmented layout. We removed non-structural partitions, reorganised circulation around the internal courtyard and introduced generous glazing to bring daylight deep into the plan.',
      'Classic coffered ceilings were retained and refined, paired with soft ivory walls, pale oak and quiet marble so the renovated home feels both fresh and timeless.',
    ],
    materials: [
      { name: 'Calacatta-look porcelain', detail: 'Kitchen worktops & splashback' },
      { name: 'Pale European oak', detail: 'Flooring & bespoke joinery' },
      { name: 'Satin lacquer', detail: 'Kitchen & wardrobe fronts' },
      { name: 'Carrara marble', detail: 'Bathroom floors & walls' },
      { name: 'Linen sheers', detail: 'Full-height window treatments' },
    ],
    services: ['renovation', 'concept-design', 'working-drawings', 'turnkey-fit-out'],
    cover: '1598928506311-c55ded91a20c',
    gallery: [
      '1600210491892-03d54c0aaf87',
      '1582582621959-48d27397dc69',
      '1507089947368-19c1da9775ae',
      '1600566752355-35792bedcfea',
      '1618221639244-c1a8502c0eb9',
    ],
  },
  {
    id: 'sahel-summer-villa',
    title: { en: 'Sahel Summer Villa', ar: 'فيلا الساحل الصيفية' },
    category: 'residential',
    location: locations.northCoast,
    year: 2025,
    area: 540,
    scope: { en: 'Interior architecture & fit-out', ar: 'عمارة داخلية وتنفيذ' },
    summary: {
      en: 'A coastal retreat in lime plaster, natural stone and teak, designed for barefoot summers by the sea.',
      ar: 'ملاذ ساحلي من الجص الجيري والحجر الطبيعي وخشب التيك، صُمّم لصيف هادئ على البحر.',
    },
    concept: [
      'Designed for long summers with extended family, the villa blurs inside and out. Large sliding openings connect the living spaces to the terraces and pool, while deep overhangs keep the interiors cool and shaded.',
      'Materials were chosen to withstand salt air and sand: textured lime plaster, honed limestone and weathered teak, softened with natural linens and woven lighting.',
    ],
    materials: [
      { name: 'Textured lime plaster', detail: 'Interior & exterior walls' },
      { name: 'Honed limestone', detail: 'Flooring flowing out to the terraces' },
      { name: 'Teak', detail: 'Outdoor furniture & pergola details' },
      { name: 'Woven rattan', detail: 'Pendant lighting & accents' },
      { name: 'Performance linen', detail: 'Outdoor-grade upholstery' },
    ],
    services: ['concept-design', 'working-drawings', 'turnkey-fit-out', 'ffe-procurement'],
    cover: '1613490493576-7fde63acd811',
    gallery: [
      '1600596542815-ffad4c1539a9',
      '1512917774080-9991f1c4c750',
      '1597211833712-5e41faa202ea',
      '1628745277862-bc0b2d68c50c',
      '1600210492486-724fe5c67fb0',
    ],
  },
  {
    id: 'atelier-boutique',
    title: { en: 'Atelier Fashion Boutique', ar: 'بوتيك أتيليه للأزياء' },
    category: 'commercial',
    location: locations.newCairo,
    year: 2023,
    area: 220,
    scope: { en: 'Retail concept & fit-out', ar: 'تصميم وتنفيذ منفذ بيع' },
    summary: {
      en: 'A retail concept that turns a compact unit into a gallery-like setting for a growing fashion label.',
      ar: 'تصميم تجاري يحوّل وحدة صغيرة إلى مساحة تشبه المعرض لعلامة أزياء صاعدة.',
    },
    concept: [
      'Working within a compact footprint, we planned the boutique as a clear loop that leads customers past every collection without crowding. Modular display systems let the team restyle the store each season.',
      'An industrial shell of exposed services and steel is warmed with timber, soft lighting and a neutral backdrop that lets the garments take centre stage.',
    ],
    materials: [
      { name: 'Blackened steel', detail: 'Modular rails & shelving' },
      { name: 'Natural oak', detail: 'Display tables & fitting rooms' },
      { name: 'Polished concrete', detail: 'Flooring' },
      { name: 'Track lighting', detail: 'Adjustable, high-CRI display lighting' },
    ],
    services: ['commercial-fit-out', 'concept-design', 'turnkey-fit-out'],
    cover: '1441986300917-64674bd600d8',
    gallery: ['1567401893414-76b7b1e5a7a5', '1538688525198-9b88f6f53126'],
  },
  {
    id: 'vertex-executive-offices',
    title: { en: 'Vertex Executive Offices', ar: 'مكاتب فيرتكس التنفيذية' },
    category: 'corporate',
    location: locations.newCairo,
    year: 2022,
    area: 760,
    scope: { en: 'Corporate interiors & MEP coordination', ar: 'تصميم مكاتب وتنسيق كهروميكانيكي' },
    summary: {
      en: 'Executive offices and a lounge-style client area, detailed with timber slats and deep, calm tones.',
      ar: 'مكاتب تنفيذية ومنطقة استقبال بطابع الصالات، بتفاصيل من الشرائح الخشبية وألوان هادئة عميقة.',
    },
    concept: [
      'Designed for a leadership team that frequently hosts clients, these offices behave more like a private members’ club than a typical workplace. Lounge seating, warm lighting and a muted palette create a reassuring first impression.',
      'Behind the scenes, full MEP coordination and integrated technology keep the spaces flexible for meetings, presentations and quiet, focused work.',
    ],
    materials: [
      { name: 'Timber slats', detail: 'Feature walls & acoustic ceilings' },
      { name: 'Exposed concrete', detail: 'Selected walls & columns' },
      { name: 'Wool upholstery', detail: 'Lounge & meeting seating' },
      { name: 'Integrated AV', detail: 'Concealed within joinery' },
    ],
    services: ['concept-design', 'working-drawings', 'turnkey-fit-out'],
    cover: '1600508774634-4e11d34730e2',
    gallery: ['1599696848652-f0ff23bc911f', '1600494603989-9650cf6ddd3d', '1551298370-9d3d53740c72'],
  },
];

export const featuredProjects = projects.filter((project) => project.featured).slice(0, 3);

export function getProject(id: string) {
  return projects.find((project) => project.id === id);
}

export function getNextProject(id: string) {
  const index = projects.findIndex((project) => project.id === id);
  return projects[(index + 1) % projects.length];
}

/** Before / after transformation shown on the portfolio page. */
export const transformation = {
  before: '1504307651254-35680f356dfd',
  after: '1600585154084-4e5fe7c39198',
};

/**
 * Render vs execution pairs. Supply `render` and `photo` from the same camera angle;
 * with only one image the card shows a split "viewport" treatment of the same frame.
 */
export const renderPairs: { projectId: string; space: Localized; render: string; photo: string }[] = [
  {
    projectId: 'al-safa-villa',
    space: { en: 'Living Room', ar: 'غرفة المعيشة' },
    render: '1618221195710-dd6b41faaea6',
    photo: '1618221195710-dd6b41faaea6',
  },
  {
    projectId: 'zayed-courtyard-residence',
    space: { en: 'Entry Lounge', ar: 'صالة المدخل' },
    render: '1618219908412-a29a1bb7b86e',
    photo: '1618219908412-a29a1bb7b86e',
  },
  {
    projectId: 'katameya-penthouse',
    space: { en: 'Family Lounge', ar: 'صالة العائلة' },
    render: '1616486338812-3dadae4b4ace',
    photo: '1616486338812-3dadae4b4ace',
  },
];
