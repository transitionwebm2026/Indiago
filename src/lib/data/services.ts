export const serviceIds = [
  'concept-design',
  'working-drawings',
  'turnkey-fit-out',
  'ffe-procurement',
  'commercial-fit-out',
  'renovation',
] as const;

export type ServiceId = (typeof serviceIds)[number];

/** The four core services featured on the home page. */
export const coreServiceIds: ServiceId[] = ['concept-design', 'working-drawings', 'turnkey-fit-out', 'ffe-procurement'];

export const serviceImages: Record<ServiceId, string> = {
  'concept-design': '1615529182904-14819c35db37',
  'working-drawings': '1503387762-592deb58ef4e',
  'turnkey-fit-out': '1541888946425-d81bb19240f5',
  'ffe-procurement': '1555041469-a586c61ea9bc',
  'commercial-fit-out': '1554118811-1e0d58224f24',
  renovation: '1600210491892-03d54c0aaf87',
};

export function isServiceId(value: string): value is ServiceId {
  return (serviceIds as readonly string[]).includes(value);
}
