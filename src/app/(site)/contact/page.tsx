import type { Metadata } from 'next';
import { ContactHero } from '@/components/contact/ContactHero';
import { InquirySection } from '@/components/contact/InquirySection';
import { StudioInfo } from '@/components/contact/StudioInfo';
import { StudioMap } from '@/components/contact/StudioMap';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Start Your Project',
  description:
    'Start your project journey with Indigo Interiors. Send a four-step project brief via WhatsApp or email, or visit the studio at Villa 40 Al Safa St., Sheikh Zayed. Call +20 111 977 7662.',
  path: routes.contact,
});

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <InquirySection />
      <StudioInfo />
      <StudioMap />
    </>
  );
}
