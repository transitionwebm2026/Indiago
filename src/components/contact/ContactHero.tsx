'use client';

import { Mail, Phone } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/SocialIcons';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { PageHero } from '@/components/ui/PageHero';
import { useMedia, useSite } from '@/lib/cms/hooks';

const chipClass =
  'inline-flex items-center gap-2.5 rounded-full border border-ivory/20 px-4 py-2.5 text-sm text-ivory/80 transition-colors hover:border-champagne hover:text-champagne';

export function ContactHero() {
  const { t } = useLanguage();
  const { site, whatsappLink } = useSite();
  const { slides } = useMedia('contact.hero');
  const hero = t.contact.hero;

  return (
    <PageHero
      eyebrow={hero.eyebrow}
      title={hero.title}
      body={hero.body}
      slides={slides}
      crumbs={[{ label: t.nav.contact }]}
    >
      <div className="flex flex-wrap gap-2.5">
        <a href={whatsappLink(t.whatsapp.defaultMessage)} target="_blank" rel="noopener noreferrer" className={chipClass}>
          <WhatsAppIcon className="h-4 w-4 text-champagne" />
          WhatsApp
        </a>
        {site.phone && (
          <a href={site.phoneHref} className={chipClass}>
            <Phone aria-hidden className="h-4 w-4 text-champagne" strokeWidth={1.5} />
            <span dir="ltr">{site.phone}</span>
          </a>
        )}
        {site.email && (
          <a href={`mailto:${site.email}`} className={chipClass}>
            <Mail aria-hidden className="h-4 w-4 text-champagne" strokeWidth={1.5} />
            <span className="break-all">{site.email}</span>
          </a>
        )}
      </div>
    </PageHero>
  );
}
