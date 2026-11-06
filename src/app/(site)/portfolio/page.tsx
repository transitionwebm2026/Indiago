import type { Metadata } from 'next';
import { PortfolioExplorer } from '@/components/portfolio/PortfolioExplorer';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Portfolio',
  description:
    'Selected hospitality, government, healthcare and residential interiors by Indigo Interiors across Abu Dhabi and Greater Cairo — Mynt Restaurant, Arabian Majlis, Department of Finance, Al Borg Laboratories and Sun Capital Residence.',
  path: routes.portfolio,
});

/** The page opens straight onto the projects: there is no title section above the filter and grid. */
export default function PortfolioPage() {
  return <PortfolioExplorer />;
}
