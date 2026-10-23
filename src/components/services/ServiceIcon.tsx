import { Hammer, HardHat, PenTool, Ruler, Sofa, Store, type LucideIcon } from 'lucide-react';
import { isServiceId, type ServiceId } from '@/lib/data/services';

const icons: Record<ServiceId, LucideIcon> = {
  'concept-design': PenTool,
  'working-drawings': Ruler,
  'turnkey-fit-out': HardHat,
  'ffe-procurement': Sofa,
  'commercial-fit-out': Store,
  renovation: Hammer,
};

export function ServiceIcon({ id, className }: { id: string; className?: string }) {
  const Icon = isServiceId(id) ? icons[id] : PenTool;
  return <Icon aria-hidden strokeWidth={1.2} className={className} />;
}
