import type { Metadata } from 'next';
import { DeliverablesAccordion } from '@/components/services/DeliverablesAccordion';
import { ServicesGrid } from '@/components/services/ServicesGrid';
import { ServicesHero } from '@/components/services/ServicesHero';
import { WorkflowSection } from '@/components/services/WorkflowSection';
import { CtaBanner } from '@/components/shared/CtaBanner';

export const metadata: Metadata = {
  title: 'Services & Process',
  description:
    'Interior & concept design, detailed working drawings, turnkey fit-out, FF&E procurement, commercial fit-out and renovation — delivered through a clear 4-step workflow with defined deliverables.',
  alternates: { canonical: '/services/' },
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesGrid />
      <WorkflowSection />
      <DeliverablesAccordion />
      <CtaBanner />
    </>
  );
}
