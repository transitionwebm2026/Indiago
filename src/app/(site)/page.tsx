import type { Metadata } from 'next';
import { AboutPreview } from '@/components/home/AboutPreview';
import { HomeHero } from '@/components/home/HomeHero';
import { JournalPreview } from '@/components/home/JournalPreview';
import { PortfolioPreview } from '@/components/home/PortfolioPreview';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { WhyIndigo } from '@/components/home/WhyIndigo';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { pageMetadata, siteDescription } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: { absolute: 'Indigo Interiors — Interior Architecture & Turnkey Fit-out | Sheikh Zayed, Egypt' },
  description: siteDescription,
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <AboutPreview />
      <WhyIndigo />
      <PortfolioPreview />
      <ServicesPreview />
      <JournalPreview />
      <CtaBanner interactive />
    </>
  );
}
