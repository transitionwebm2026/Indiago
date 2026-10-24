import { DraftingCompass, Hammer, HardHat, PaintRoller, PenTool, Sofa, type LucideIcon } from 'lucide-react';
import { isServiceId, type ServiceId } from '@/lib/data/services';

const icons: Record<ServiceId, LucideIcon> = {
  'interior-design': PenTool,
  'fit-out': HardHat,
  finishing: PaintRoller,
  'design-execution': DraftingCompass,
  renovation: Hammer,
  'joinery-styling': Sofa,
};

export function ServiceIcon({ id, className }: { id: string; className?: string }) {
  const Icon = isServiceId(id) ? icons[id] : PenTool;
  return <Icon aria-hidden strokeWidth={1.2} className={className} />;
}
