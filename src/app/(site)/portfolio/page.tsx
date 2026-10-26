import type { Metadata } from 'next';
import { PortfolioExplorer } from '@/components/portfolio/PortfolioExplorer';
import { PortfolioHero } from '@/components/portfolio/PortfolioHero';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Portfolio',
  description:
    'Selected hospitality, government, healthcare and residential interiors by Indigo Interiors across Abu Dhabi and Greater Cairo — Mynt Restaurant, Arabian Majlis, Department of Finance, Al Borg Laboratories and Sun Capital Residence.',
  path: routes.portfolio,
});

export default function PortfolioPage() {
  return (
    <>
      <PortfolioHero />
      <PortfolioExplorer />
      <CtaBanner />
    </>
  );
}
