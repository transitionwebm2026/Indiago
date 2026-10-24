'use client';

import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import type { ReactNode } from 'react';
import { socialIcons } from '@/components/icons/SocialIcons';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
import { primaryNav, routes, serviceHref } from '@/lib/routes';
import { mapsDirectionsUrl, site } from '@/lib/site';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';

function FooterColumn({ title, className, children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <h2 className="text-[0.66rem] font-medium uppercase tracking-ultra text-champagne">{title}</h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}

const linkClass = 'text-sm text-ivory/70 transition-colors duration-300 hover:text-champagne';

export function Footer() {
  const { t, l } = useLanguage();

  return (
    <footer className="relative isolate overflow-hidden rounded-t-[2rem] bg-indigo text-ivory md:rounded-t-[3rem]">
      <div className="container-luxe">
        <div className="flex flex-col gap-10 border-b border-ivory/10 py-16 md:flex-row md:items-end md:justify-between md:py-20">
          <div>
            <Logo className="h-12 md:h-14" />
            <p className="mt-7 max-w-sm font-serif text-xl leading-snug tracking-wide text-ivory/80">{t.footer.tagline}</p>
          </div>
          <div className="flex flex-col items-start gap-5 md:items-end">
            <p className="text-[0.66rem] uppercase tracking-ultra text-champagne">{t.footer.ctaTitle}</p>
            <ButtonLink href={routes.inquiry} arrow>
              {t.nav.cta}
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <FooterColumn title={t.footer.explore} className="lg:col-span-2">
            <ul className="space-y-3">
              {primaryNav.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className={linkClass}>
                    {t.nav[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title={t.footer.services} className="lg:col-span-3">
            <ul className="space-y-3">
              {t.services.items.map((service) => (
                <li key={service.id}>
                  <Link href={serviceHref(service.id)} className={linkClass}>
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title={t.footer.contact} className="lg:col-span-4">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="sr-only">{t.contact.info.address}</dt>
                <dd>
                  <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
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
              <div>
                <dt className="sr-only">{t.contact.info.phoneUae}</dt>
                <dd>
                  <a href={site.uaePhoneHref} dir="ltr" className={cn(linkClass, 'inline-block')}>
                    {site.uaePhone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">{t.contact.info.email}</dt>
                <dd>
                  <a href={`mailto:${site.email}`} className={cn(linkClass, 'break-all')}>
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">{t.contact.info.website}</dt>
                <dd>
                  <a href={site.url} className={linkClass}>
                    {site.displayUrl}
                  </a>
                </dd>
              </div>
              <div className="border-t border-ivory/10 pt-4">
                <dt className="text-[0.62rem] uppercase tracking-luxe text-ivory/40">{t.contact.info.management}</dt>
                <dd className="mt-1.5 text-ivory/80">
                  {l(site.founder.name)} <span className="text-ivory/50">— {l(site.founder.role)}</span>
                </dd>
              </div>
            </dl>
          </FooterColumn>

          <FooterColumn title={t.footer.follow} className="lg:col-span-3">
            <ul className="flex flex-wrap gap-3">
              {site.social.map((social) => {
                const Icon = socialIcons[social.id];
                return (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="grid h-11 w-11 place-items-center rounded-full border border-ivory/15 text-ivory/70 transition-colors duration-300 hover:border-champagne hover:text-champagne"
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </FooterColumn>
        </div>

        <div className="flex flex-col gap-4 border-t border-ivory/10 py-8 text-xs text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.copyrightYear} {t.brand}. {t.footer.rights}
          </p>
          <p>{t.footer.location}</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex w-fit items-center gap-2 uppercase tracking-luxe transition-colors hover:text-champagne"
          >
            {t.common.backToTop}
            <ArrowUp aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </footer>
  );
}
