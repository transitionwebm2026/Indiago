import type { Metadata } from 'next';
import { PortfolioExplorer } from '@/components/portfolio/PortfolioExplorer';
import { PortfolioHero } from '@/components/portfolio/PortfolioHero';
import { CtaBanner } from '@/components/shared/CtaBanner';

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Selected hospitality, government, healthcare and residential interiors by Indigo Interiors across Abu Dhabi and Greater Cairo — Mynt Restaurant, Arabian Majlis, Department of Finance, Al Borg Laboratories and Sun Capital Residence.',
  alternates: { canonical: '/portfolio/' },
};

export default function PortfolioPage() {
  return (
    <>
      <PortfolioHero />
      <PortfolioExplorer />
      <CtaBanner />
    </>
  );
}
