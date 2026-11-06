'use client';

import { AnimatePresence, m } from 'framer-motion';
import { Check } from 'lucide-react';
import { useId, useState, type FormEvent } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Highlight } from '@/components/ui/Highlight';
import { Reveal } from '@/components/ui/Reveal';
import { useSite } from '@/lib/cms/hooks';
import { hasWeb3Forms, mailtoLink, submitToWeb3Forms } from '@/lib/forms';
import { isValidEmail } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'success' | 'fallback' | 'error' | 'invalid';

/**
 * Newsletter sign-up, on the home, contact and blog pages and every article. Posts to Web3Forms
 * when a key is configured; otherwise opens the visitor's email app addressed to the studio.
 */
export function NewsletterSignup() {
  const { t } = useLanguage();
  const { site } = useSite();
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
        site.email,
        'Newsletter subscription',
        `Please add ${email.trim()} to the ${site.name} newsletter.`,
      );
      setStatus('fallback');
      return;
    }

    setStatus('sending');
    const ok = await submitToWeb3Forms('New newsletter subscriber', { Email: email.trim(), email: email.trim() }, site.name);
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

  // A compact, light framed card — it sits on the home, contact and blog pages without competing
  // with their Deep Indigo sections. On phones the field and the button stack at full width;
  // from sm up they share one rounded bar.
  return (
    <section className="bg-ivory py-14 md:py-20">
      <div className="container-luxe">
        <div className="card-frame grid grid-cols-1 items-center gap-6 rounded-[1.25rem] bg-white/70 px-5 py-6 min-[400px]:px-6 sm:px-8 sm:py-7 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          <Reveal className="min-w-0">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <h2 className="mt-3 text-balance font-serif text-xl leading-snug tracking-wide text-indigo sm:text-2xl">
              <Highlight text={copy.title} />
            </h2>
            <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-charcoal-soft">{copy.body}</p>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0">
            <form onSubmit={onSubmit} noValidate className="w-full min-w-0">
              <label htmlFor={inputId} className="sr-only">
                {copy.label}
              </label>
              <div className="flex flex-col gap-3 transition-colors sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:border sm:border-indigo/20 sm:bg-white sm:p-1.5 sm:focus-within:border-champagne-700">
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
                  // flex-1 only in the row layout: in the phone column its zero basis would squash the field's height.
                  className="h-12 w-full min-w-0 rounded-full border border-indigo/20 bg-white px-5 text-base text-indigo transition-colors placeholder:text-charcoal-muted/80 focus:border-champagne-700 focus:outline-none focus-visible:outline-none sm:h-11 sm:w-auto sm:flex-1 sm:border-0 sm:bg-transparent sm:px-5"
                />
                <Button type="submit" variant="solid-dark" disabled={status === 'sending'} className="w-full shrink-0 sm:w-auto sm:min-h-11">
                  {status === 'sending' ? copy.sending : copy.button}
                </Button>
              </div>
              <div id={messageId} aria-live="polite" className="mt-3 min-h-[1.25rem] text-[0.8rem]">
                <AnimatePresence mode="wait">
                  {feedback ? (
                    <m.p
                      key={status}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={isError ? 'text-error' : 'flex items-center gap-2 text-champagne-800'}
                    >
                      {!isError && <Check aria-hidden className="h-4 w-4" strokeWidth={1.5} />}
                      {feedback}
                    </m.p>
                  ) : (
                    <m.p key="privacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-charcoal-muted">
                      {copy.privacy}
                    </m.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
