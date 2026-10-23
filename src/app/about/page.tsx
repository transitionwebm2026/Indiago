import type { Metadata } from 'next';
import { AboutHero } from '@/components/about/AboutHero';
import { CraftSection } from '@/components/about/CraftSection';
import { FounderSection } from '@/components/about/FounderSection';
import { MaterialsSection } from '@/components/about/MaterialsSection';
import { MetricsSection } from '@/components/about/MetricsSection';
import { StorySection } from '@/components/about/StorySection';
import { CtaBanner } from '@/components/shared/CtaBanner';

export const metadata: Metadata = {
  title: 'About the Studio',
  description:
    'Refined, composed and precise interior architecture. Meet Indigo Interiors and founder Ahmed Abomosallam — our philosophy, craftsmanship, quality control and material standards.',
  alternates: { canonical: '/about/' },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <StorySection />
      <FounderSection />
      <CraftSection />
      <MaterialsSection />
      <MetricsSection />
      <CtaBanner background="ivory" />
    </>
  );
}
