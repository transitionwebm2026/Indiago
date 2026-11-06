'use client';

import Image from 'next/image';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Link } from '@/components/ui/Link';
import { useSite } from '@/lib/cms/hooks';
import { routes } from '@/lib/routes';
import { Logo } from './Logo';

/** The WhatsApp launchers watch this element and rise above it as it scrolls into view. */
export const SITE_CREDIT_ID = 'site-credit';

/**
 * The last thing on every page: a slim Deep Indigo band with the Indigo logo at the start (left in
 * English, right in Arabic) and the website's design & development credit in the centre (switched on
 * and edited in Global Settings → Footer). On phones the logo sits above the credit, both centred.
 * On the home page the band runs on from the closing banner, which shares its colour.
 */
export function SiteCredit() {
  const { t } = useLanguage();
  const { site } = useSite();
  const { credit } = site;
  const showCredit = credit.visible && Boolean(credit.name);

  return (
    <footer id={SITE_CREDIT_ID} className="bg-indigo">
      {/* From sm up three columns, so the credit sits in the true centre of the band whatever the logo's width. */}
      <div className="container-luxe flex flex-col items-center gap-5 py-8 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-8 sm:py-7">
        <Link href={routes.home} aria-label={`${site.name} — ${t.nav.home}`} className="shrink-0 sm:justify-self-start">
          <Logo className="h-11 sm:h-10" />
        </Link>

        {/* The gradient runs from champagne behind the label to indigo behind the agency name, in either reading direction. */}
        {showCredit && (
          <a
            href={credit.href}
            target="_blank"
            rel="noopener"
            className="group/credit relative isolate inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-l from-indigo-600 to-champagne-600 px-4 py-1.5 text-[0.8125rem] font-semibold text-white shadow-[0_10px_28px_-12px_rgba(213,182,144,0.55)] ring-1 ring-inset ring-white/20 transition-[transform,box-shadow] duration-500 ease-luxe [text-shadow:0_1px_2px_rgba(23,18,44,0.35)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-12px_rgba(213,182,144,0.75)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne rtl:bg-gradient-to-r sm:gap-3 sm:px-5 sm:text-sm"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -start-1/3 -z-10 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-0 group-hover/credit:translate-x-[400%] group-hover/credit:duration-1000 group-hover/credit:ease-luxe rtl:group-hover/credit:-translate-x-[400%]"
            />
            <span>{t.footer.credit}</span>
            {credit.logo && (
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/15 ring-1 ring-inset ring-white/25 transition-transform duration-500 ease-luxe group-hover/credit:scale-110">
                <Image src={credit.logo} alt="" width={240} height={143} unoptimized className="h-auto w-6" />
              </span>
            )}
            <span dir="ltr" className="font-bold tracking-wide">
              {credit.name}
            </span>
            {/* Spoken after the visible words, so voice-control users can say what they see. */}
            <span className="sr-only"> {t.footer.newTab}</span>
          </a>
        )}
      </div>
    </footer>
  );
}
