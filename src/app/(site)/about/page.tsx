import type { Metadata } from 'next';
import { AboutHero } from '@/components/about/AboutHero';
import { CraftSection } from '@/components/about/CraftSection';
import { FounderSection } from '@/components/about/FounderSection';
import { MaterialsSection } from '@/components/about/MaterialsSection';
import { MetricsSection } from '@/components/about/MetricsSection';
import { StorySection } from '@/components/about/StorySection';
import { VisionSection } from '@/components/about/VisionSection';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'About the Studio',
  description:
    'Indigo Interiors brings UAE standards of quality, precision and project discipline to Egypt. Meet founder Ahmed Abo Mosallam — our vision, mission, values, craftsmanship and quality control.',
  path: routes.about,
});

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <StorySection />
      <FounderSection />
      <VisionSection />
      <CraftSection />
      <MaterialsSection />
      <MetricsSection />
      <CtaBanner background="ivory" />
    </>
  );
}
