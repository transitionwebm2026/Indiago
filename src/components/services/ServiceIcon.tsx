import {
  Armchair,
  Building2,
  DraftingCompass,
  Gem,
  Hammer,
  HardHat,
  Home,
  Lamp,
  Layers,
  PaintRoller,
  PenTool,
  Ruler,
  Sofa,
  Sparkles,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

/** Icons the studio can choose for a service in the CMS. */
export const serviceIcons: Record<string, { icon: LucideIcon; label: string }> = {
  'pen-tool': { icon: PenTool, label: 'Design pen' },
  'hard-hat': { icon: HardHat, label: 'Hard hat' },
  'paint-roller': { icon: PaintRoller, label: 'Paint roller' },
  'drafting-compass': { icon: DraftingCompass, label: 'Compass' },
  hammer: { icon: Hammer, label: 'Hammer' },
  sofa: { icon: Sofa, label: 'Sofa' },
  armchair: { icon: Armchair, label: 'Armchair' },
  lamp: { icon: Lamp, label: 'Lamp' },
  ruler: { icon: Ruler, label: 'Ruler' },
  layers: { icon: Layers, label: 'Layers' },
  wrench: { icon: Wrench, label: 'Wrench' },
  home: { icon: Home, label: 'Home' },
  building: { icon: Building2, label: 'Building' },
  gem: { icon: Gem, label: 'Gem' },
  sparkles: { icon: Sparkles, label: 'Sparkles' },
};

export function ServiceIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = serviceIcons[icon]?.icon ?? PenTool;
  return <Icon aria-hidden strokeWidth={1.2} className={className} />;
}
