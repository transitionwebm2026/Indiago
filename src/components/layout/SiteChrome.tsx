import type { ReactNode } from 'react';
import { SiteCredit } from './SiteCredit';
import { SiteMenu } from './SiteMenu';
import { WhatsAppWidget } from './WhatsAppWidget';

/**
 * The floating menu button and the WhatsApp launcher around every public page (the admin dashboard
 * has its own shell). There is no header bar and no full footer: each page ends with a slim band
 * that carries only the website credit.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteMenu />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteCredit />
      <WhatsAppWidget />
    </>
  );
}
