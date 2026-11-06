'use client';

import { WhatsAppIcon } from '@/components/icons/SocialIcons';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
import { Highlight } from '@/components/ui/Highlight';
import { Reveal } from '@/components/ui/Reveal';
import { useSite } from '@/lib/cms/hooks';
import { routes } from '@/lib/routes';

/** A compact Deep Indigo strip that closes the Services page: one line of copy and the two ways to start. */
export function ServicesCta() {
  const { t } = useLanguage();
  const { whatsappLink } = useSite();
  const copy = t.services.cta;

  return (
    <section className="bg-ivory pb-20 md:pb-28">
      <div className="container-luxe">
        <Reveal>
          <div className="flex flex-col gap-5 rounded-[1.25rem] bg-indigo px-5 py-6 text-ivory sm:px-8 sm:py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div>
              <h2 className="text-balance font-serif text-xl leading-snug tracking-wide sm:text-2xl">
                <Highlight text={copy.title} surface="dark" />
              </h2>
              <p className="mt-1.5 text-[0.82rem] leading-relaxed text-ivory/70">{copy.body}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
              <ButtonLink href={routes.inquiry} size="sm" arrow>
                {t.cta.primary}
              </ButtonLink>
              <ButtonLink href={whatsappLink(t.whatsapp.defaultMessage)} variant="outline-light" size="sm">
                <WhatsAppIcon className="h-4 w-4" />
                {t.cta.whatsapp}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
