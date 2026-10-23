'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { WorkflowTimeline } from './WorkflowTimeline';

export function WorkflowSection() {
  const { t } = useLanguage();
  const workflow = t.services.workflow;

  return (
    <section id="process" className="section-y relative isolate scroll-mt-20 overflow-hidden bg-indigo text-ivory">
      <div className="container-luxe">
        <SectionHeading surface="dark" eyebrow={workflow.eyebrow} title={workflow.title} body={workflow.body} />
        <Reveal delay={0.15} className="mt-16">
          <WorkflowTimeline variant="full" />
        </Reveal>
      </div>
    </section>
  );
}
