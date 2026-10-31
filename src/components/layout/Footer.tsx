'use client';

import Image from 'next/image';
import { ArrowUp } from 'lucide-react';
import type { ReactNode } from 'react';
import { socialIcons } from '@/components/icons/SocialIcons';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Link } from '@/components/ui/Link';
import { useServices, useSite } from '@/lib/cms/hooks';
import { serviceHref } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';

function FooterColumn({ title, className, children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <h2 className="text-[0.64rem] font-medium uppercase tracking-ultra text-champagne">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

const linkClass = 'text-sm text-ivory/70 transition-colors duration-300 hover:text-champagne';

/** Compact footer: the brand with its social links, then three link columns, then a single bottom row. */
export function Footer() {
  const { t, l } = useLanguage();
  const { site } = useSite();
  const services = useServices();
  const socials = site.social.filter((social) => social.visible);

  return (
    <footer className="relative isolate overflow-hidden rounded-t-[2rem] bg-indigo text-ivory md:rounded-t-[2.5rem]">
      <div className="container-luxe">
        <div className="grid gap-10 pb-10 pt-12 md:pt-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo className="h-11" />
            <p className="mt-5 max-w-xs font-serif text-base leading-snug tracking-wide text-ivory/75">{t.footer.tagline}</p>
            {socials.length > 0 && (
              <ul aria-label={t.footer.follow} className="mt-6 flex flex-wrap gap-2.5">
                {socials.map((social) => {
                  const Icon = socialIcons[social.id];
                  return (
                    <li key={social.id}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="grid h-9 w-9 place-items-center rounded-full border border-ivory/15 text-ivory/70 transition-colors duration-300 hover:border-champagne hover:text-champagne"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:col-span-8">
            <FooterColumn title={t.footer.explore}>
              <ul className="space-y-2.5">
                {site.nav
                  .filter((link) => link.visible)
                  .map((link) => (
                    <li key={link.id}>
                      {/^https?:/.test(link.href) ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                          {l(link.label)}
                        </a>
                      ) : (
                        <Link href={link.href} className={linkClass}>
                          {l(link.label)}
                        </Link>
                      )}
                    </li>
                  ))}
              </ul>
            </FooterColumn>

            <FooterColumn title={t.footer.services}>
              <ul className="space-y-2.5">
                {services.map((service) => (
                  <li key={service.id}>
                    <Link href={serviceHref(service.id)} className={linkClass}>
                      {l(service.title)}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn title={t.footer.contact} className="col-span-2 sm:col-span-1">
              <dl className="space-y-2.5 text-sm">
                <div>
                  <dt className="sr-only">{t.contact.info.address}</dt>
                  <dd>
                    <a href={site.mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {l(site.address)}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">{t.contact.info.phone}</dt>
                  <dd>
                    <a href={site.phoneHref} dir="ltr" className={cn(linkClass, 'inline-block')}>
                      {site.phone}
                    </a>
                  </dd>
                </div>
                {site.uaePhone && (
                  <div>
                    <dt className="sr-only">{t.contact.info.phoneUae}</dt>
                    <dd>
                      <a href={site.uaePhoneHref} dir="ltr" className={cn(linkClass, 'inline-block')}>
                        {site.uaePhone}
                      </a>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="sr-only">{t.contact.info.email}</dt>
                  <dd>
                    <a href={`mailto:${site.email}`} className={cn(linkClass, 'break-all')}>
                      {site.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </FooterColumn>
          </div>
        </div>

        {/* From lg up the credit sits centred between the copyright and back-to-top; narrower, the three stack.
            On phones the extra bottom space keeps them clear of the fixed WhatsApp/call launchers. */}
        <div className="flex flex-col items-center gap-4 border-t border-ivory/10 pb-40 pt-6 text-center text-xs text-ivory/60 sm:pb-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-8 lg:text-start">
          <p>
            © {site.copyrightYear} {t.brand}. {t.footer.rights}
          </p>
          {/* The gradient runs from champagne behind the label to indigo behind the agency name, in either reading direction. */}
          {site.credit.visible && site.credit.name ? (
            <a
              href={site.credit.href}
              target="_blank"
              rel="noopener"
              className="group/credit relative isolate inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-l from-indigo-600 to-champagne-600 px-4 py-1.5 text-[0.8125rem] font-semibold text-white shadow-[0_10px_28px_-12px_rgba(213,182,144,0.55)] ring-1 ring-inset ring-white/20 transition-[transform,box-shadow] duration-500 ease-luxe [text-shadow:0_1px_2px_rgba(23,18,44,0.35)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-12px_rgba(213,182,144,0.75)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne rtl:bg-gradient-to-r sm:gap-3 sm:px-5 sm:text-sm"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -start-1/3 -z-10 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-0 group-hover/credit:translate-x-[400%] group-hover/credit:duration-1000 group-hover/credit:ease-luxe rtl:group-hover/credit:-translate-x-[400%]"
              />
              <span>{t.footer.credit}</span>
              {site.credit.logo && (
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/15 ring-1 ring-inset ring-white/25 transition-transform duration-500 ease-luxe group-hover/credit:scale-110">
                  <Image src={site.credit.logo} alt="" width={240} height={143} unoptimized className="h-auto w-6" />
                </span>
              )}
              <span dir="ltr" className="font-bold tracking-wide">
                {site.credit.name}
              </span>
              {/* Spoken after the visible words, so voice-control users can say what they see. */}
              <span className="sr-only"> {t.footer.newTab}</span>
            </a>
          ) : (
            <span aria-hidden />
          )}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex w-fit items-center gap-2 uppercase tracking-luxe transition-colors hover:text-champagne lg:justify-self-end"
          >
            {t.common.backToTop}
            <ArrowUp aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </footer>
  );
}
