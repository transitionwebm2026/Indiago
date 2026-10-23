'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Link2 } from 'lucide-react';
import { useEffect, useState, type ComponentType, type SVGProps } from 'react';
import { FacebookIcon, LinkedInIcon, WhatsAppIcon, XIcon } from '@/components/icons/SocialIcons';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/utils';

const buttonClass =
  'grid h-11 w-11 place-items-center rounded-full border border-indigo/15 text-indigo transition-colors duration-300 hover:border-indigo hover:bg-indigo hover:text-champagne';

export function ShareBar({ url, title, className }: { url: string; title: string; className?: string }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const networks: { label: string; href: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`, Icon: WhatsAppIcon },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, Icon: FacebookIcon },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, Icon: LinkedInIcon },
    { label: 'X', href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, Icon: XIcon },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard is unavailable on insecure origins; the share links still work.
    }
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-4 lg:flex-col lg:items-start', className)}>
      <p className="text-[0.62rem] font-medium uppercase tracking-ultra text-charcoal-muted">{t.article.share}</p>
      <ul className="flex flex-wrap gap-2 lg:flex-col">
        {networks.map(({ label, href, Icon }) => (
          <li key={label}>
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${t.article.share}: ${label}`} className={buttonClass}>
              <Icon className="h-4 w-4" />
            </a>
          </li>
        ))}
        <li className="relative">
          <button type="button" onClick={copyLink} aria-label={t.article.copyLink} className={buttonClass}>
            {copied ? <Check className="h-4 w-4" strokeWidth={1.75} /> : <Link2 className="h-4 w-4" strokeWidth={1.75} />}
          </button>
          <AnimatePresence>
            {copied && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute start-0 top-full z-10 mt-2 whitespace-nowrap rounded-full bg-indigo px-3 py-1 text-[0.62rem] text-champagne lg:start-full lg:top-1/2 lg:ms-3 lg:mt-0 lg:-translate-y-1/2"
              >
                {t.article.copied}
              </motion.span>
            )}
          </AnimatePresence>
        </li>
      </ul>
      <span aria-live="polite" className="sr-only">
        {copied ? t.article.copied : ''}
      </span>
    </div>
  );
}
