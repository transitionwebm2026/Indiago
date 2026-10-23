'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useId, useState, type FormEvent } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Highlight } from '@/components/ui/Highlight';
import { Reveal } from '@/components/ui/Reveal';
import { hasWeb3Forms, mailtoLink, submitToWeb3Forms } from '@/lib/forms';
import { isValidEmail } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'success' | 'fallback' | 'error' | 'invalid';

/**
 * Newsletter sign-up. Posts to Web3Forms when a key is configured;
 * otherwise opens the visitor's email app addressed to the studio.
 */
export function NewsletterSignup() {
  const { t } = useLanguage();
  const copy = t.blog.newsletter;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const inputId = useId();
  const messageId = useId();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setStatus('invalid');
      return;
    }

    if (!hasWeb3Forms) {
      window.location.href = mailtoLink(
        'Blog newsletter subscription',
        `Please add ${email.trim()} to the Indigo Interiors blog newsletter.`,
      );
      setStatus('fallback');
      return;
    }

    setStatus('sending');
    const ok = await submitToWeb3Forms('New blog newsletter subscriber', { Email: email.trim(), email: email.trim() });
    setStatus(ok ? 'success' : 'error');
    if (ok) setEmail('');
  };

  const feedback =
    status === 'success'
      ? copy.success
      : status === 'fallback'
        ? copy.fallback
        : status === 'error'
          ? copy.error
          : status === 'invalid'
            ? copy.invalid
            : null;
  const isError = status === 'error' || status === 'invalid';

  return (
    <section className="relative isolate overflow-hidden bg-indigo py-20 text-ivory md:py-28">
      <div className="container-luxe grid items-end gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <Eyebrow surface="dark">{copy.eyebrow}</Eyebrow>
          <h2 className="mt-6 text-balance font-serif text-4xl leading-[1.12] tracking-wide sm:text-5xl">
            <Highlight text={copy.title} surface="dark" />
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-ivory/70">{copy.body}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} noValidate className="w-full">
            <label htmlFor={inputId} className="sr-only">
              {copy.label}
            </label>
            <div className="flex flex-col gap-3 transition-colors sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:border sm:border-ivory/25 sm:p-1.5 sm:focus-within:border-champagne">
              <input
                id={inputId}
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status !== 'idle' && status !== 'sending') setStatus('idle');
                }}
                placeholder={copy.placeholder}
                aria-invalid={status === 'invalid'}
                aria-describedby={messageId}
                className="h-14 min-w-0 flex-1 rounded-full border border-ivory/25 bg-transparent px-6 text-ivory transition-colors placeholder:text-ivory/40 focus:border-champagne focus:outline-none focus-visible:outline-none sm:h-12 sm:border-0"
              />
              <Button type="submit" size="lg" disabled={status === 'sending'} className="shrink-0 sm:min-h-12">
                {status === 'sending' ? copy.sending : copy.button}
              </Button>
            </div>
            <div id={messageId} aria-live="polite" className="mt-4 min-h-[1.5rem] text-sm">
              <AnimatePresence mode="wait">
                {feedback ? (
                  <motion.p
                    key={status}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={isError ? 'text-champagne-400' : 'flex items-center gap-2 text-champagne'}
                  >
                    {!isError && <Check aria-hidden className="h-4 w-4" strokeWidth={1.5} />}
                    {feedback}
                  </motion.p>
                ) : (
                  <motion.p key="privacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-ivory/45">
                    {copy.privacy}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
