export const serviceIds = [
  'interior-design',
  'fit-out',
  'finishing',
  'design-execution',
  'renovation',
  'joinery-styling',
] as const;

export type ServiceId = (typeof serviceIds)[number];

/** The four core services featured on the home page. */
export const coreServiceIds: ServiceId[] = ['interior-design', 'fit-out', 'finishing', 'design-execution'];

export const serviceImages: Record<ServiceId, string> = {
  'interior-design': '/images/projects/arabian-majlis/01.jpg',
  'fit-out': '/images/projects/department-of-finance/01.jpg',
  finishing: '/images/site/flooring.jpg',
  'design-execution': '/images/projects/al-borg-laboratories/01.jpg',
  renovation: '/images/site/ceiling-works.jpg',
  'joinery-styling': '/images/projects/sun-capital-residence/02.jpg',
};

export function isServiceId(value: string): value is ServiceId {
  return (serviceIds as readonly string[]).includes(value);
}
