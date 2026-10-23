import type { Metadata } from 'next';
import { BeforeAfterSection } from '@/components/portfolio/BeforeAfterSection';
import { PortfolioExplorer } from '@/components/portfolio/PortfolioExplorer';
import { PortfolioHero } from '@/components/portfolio/PortfolioHero';
import { RenderVsReality } from '@/components/portfolio/RenderVsReality';
import { CtaBanner } from '@/components/shared/CtaBanner';

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Residential, commercial and corporate interiors by Indigo Interiors across Sheikh Zayed, New Cairo and the North Coast — including before-and-after transformations and render-to-reality comparisons.',
  alternates: { canonical: '/portfolio/' },
};

export default function PortfolioPage() {
  return (
    <>
      <PortfolioHero />
      <PortfolioExplorer />
      <BeforeAfterSection />
      <RenderVsReality />
      <CtaBanner />
    </>
  );
}
