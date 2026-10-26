import type { Metadata } from 'next';
import { DeliverablesAccordion } from '@/components/services/DeliverablesAccordion';
import { DesignPackages } from '@/components/services/DesignPackages';
import { ServicesGrid } from '@/components/services/ServicesGrid';
import { ServicesHero } from '@/components/services/ServicesHero';
import { WorkflowSection } from '@/components/services/WorkflowSection';
import { CtaBanner } from '@/components/shared/CtaBanner';

export const metadata: Metadata = {
  title: 'Services & Process',
  description:
    'Interior design & 3D visualization, integrated fit-out, interior finishing, custom design execution, renovation and bespoke joinery — delivered through a clear 5-step process, with three design packages and a fixed 15% site-supervision fee.',
  alternates: { canonical: '/services/' },
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesGrid />
      <WorkflowSection />
      <DesignPackages />
      <DeliverablesAccordion />
      <CtaBanner />
    </>
  );
}
