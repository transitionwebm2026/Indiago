import type { ReactNode } from 'react';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { WhatsAppWidget } from './WhatsAppWidget';

/** Header, footer and WhatsApp launcher around every public page (the admin dashboard has its own shell). */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}
