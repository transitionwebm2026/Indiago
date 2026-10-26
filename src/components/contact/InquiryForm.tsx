'use client';

import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { WhatsAppIcon } from '@/components/icons/SocialIcons';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Highlight } from '@/components/ui/Highlight';
import { useServices, useSite } from '@/lib/cms/hooks';
import { uuid } from '@/lib/cms/ids';
import { saveInquiry, uploadInquiryFile } from '@/lib/cms/inquiries';
import { hasWeb3Forms, mailtoLink, submitToWeb3Forms } from '@/lib/forms';
import { en } from '@/lib/i18n/en';
import {
  buildInquiryMessage,
  emptyInquiry,
  inquiryFields,
  type BudgetRange,
  type InquiryData,
  type PropertyStatus,
  type PropertyType,
  type StartTimeline,
} from '@/lib/inquiry';
import { EASE } from '@/lib/motion';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { cn, isValidEmail, isValidPhone, pad } from '@/lib/utils';
import { ChoiceGroup, TextField } from './FormFields';
import { ReferenceFiles, type AttachedFile } from './ReferenceFiles';

type Errors = Partial<Record<keyof InquiryData, string>>;
type Result = 'whatsapp' | 'email' | 'mailto' | null;

const TOTAL_STEPS = 4;

const slide: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 36 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -36 }),
};

function toOptions<T extends string>(record: Record<T, string>) {
  return (Object.keys(record) as T[]).map((value) => ({ value, label: record[value] }));
}

/**
 * Four-step project brief. Static hosting has no server, so the completed brief is
 * delivered as a pre-filled WhatsApp message, or via Web3Forms / the visitor's email app.
 * With the CMS configured, every brief (and its reference files) also lands in the
 * dashboard's Project Inquiries inbox.
 */
export function InquiryForm() {
  const { t, l, dir, locale } = useLanguage();
  const { site, whatsappLink } = useSite();
  const services = useServices();
  const form = t.contact.form;
  const baseId = useId();
  const fieldId = (key: keyof InquiryData) => `${baseId}-${key}`;

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<InquiryData>(emptyInquiry);
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<Result>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [files, setFiles] = useState<AttachedFile[]>([]);

  const cardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasNavigated = useRef(false);
  // One ID per brief, created on first use: it names the folder its reference files upload to.
  const inquiryIdRef = useRef<string | null>(null);
  const savedRef = useRef(false);
  const inquiryId = () => (inquiryIdRef.current ??= uuid());

  const uploading = files.some((file) => file.status === 'uploading');
  const storedFiles = files.flatMap((file) => (file.status === 'done' && file.stored ? [file.stored] : []));

  const addFiles = (chosen: File[]) => {
    const entries = chosen.map((file) => ({ key: uuid(), file }));
    setFiles((current) => [
      ...current,
      ...entries.map(({ key, file }) => ({ key, name: file.name, size: file.size, status: 'uploading' as const, progress: 0 })),
    ]);
    const patch = (key: string, change: Partial<AttachedFile>) =>
      setFiles((current) => current.map((item) => (item.key === key ? { ...item, ...change } : item)));
    for (const { key, file } of entries) {
      uploadInquiryFile(inquiryId(), file, (progress) => patch(key, { progress }))
        .then((stored) => patch(key, { status: 'done', progress: 1, stored }))
        .catch(() => patch(key, { status: 'error' }));
    }
  };

  /** Copies the brief into the CMS inbox once, alongside whichever channel the visitor chose. */
  const recordInquiry = () => {
    if (savedRef.current || !isSupabaseConfigured) return;
    savedRef.current = true;
    void saveInquiry(inquiryId(), data, storedFiles, locale);
  };

  // Pre-select the property type when arriving from a "?type=residential" link.
  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get('type');
    if (type && type in en.contact.form.options.propertyType) {
      setData((current) => ({ ...current, propertyType: type as PropertyType }));
    }
  }, []);

  // Move focus to the new step's heading so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (!hasNavigated.current) return;
    const timer = window.setTimeout(() => headingRef.current?.focus({ preventScroll: true }), 420);
    return () => window.clearTimeout(timer);
  }, [step, result]);

  const update = <K extends keyof InquiryData>(key: K, value: InquiryData[K]) => {
    setData((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  const toggleService = (id: string) =>
    update('services', data.services.includes(id) ? data.services.filter((item) => item !== id) : [...data.services, id]);

  const validate = (index: number): Errors => {
    const found: Errors = {};
    if (index === 0) {
      if (!data.name.trim()) found.name = form.errors.name;
      if (!isValidPhone(data.phone)) found.phone = form.errors.phone;
      if (data.email.trim() && !isValidEmail(data.email)) found.email = form.errors.email;
    }
    if (index === 1) {
      if (!data.propertyType) found.propertyType = form.errors.propertyType;
      if (!data.status) found.status = form.errors.status;
      if (!(Number(data.area) > 0)) found.area = form.errors.area;
    }
    if (index === 2) {
      if (data.services.length === 0) found.services = form.errors.services;
      if (!data.budget) found.budget = form.errors.budget;
    }
    if (index === 3) {
      if (!data.timeline) found.timeline = form.errors.timeline;
    }
    return found;
  };

  const scrollCardIntoView = () => {
    const card = cardRef.current;
    if (card && card.getBoundingClientRect().top < 80) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goTo = (target: number) => {
    hasNavigated.current = true;
    setDirection((target > step ? 1 : -1) * (dir === 'rtl' ? -1 : 1));
    setStep(target);
    scrollCardIntoView();
  };

  const showErrors = (found: Errors) => {
    setErrors(found);
    const firstKey = Object.keys(found)[0] as keyof InquiryData | undefined;
    if (firstKey) window.setTimeout(() => document.getElementById(fieldId(firstKey))?.focus(), 0);
  };

  const next = () => {
    const found = validate(step);
    if (Object.keys(found).length) return showErrors(found);
    goTo(step + 1);
  };

  /** Validates every step; jumps back to the first incomplete one. */
  const validateAll = () => {
    for (let index = 0; index < TOTAL_STEPS; index++) {
      const found = validate(index);
      if (Object.keys(found).length) {
        if (index !== step) goTo(index);
        setErrors(found);
        return false;
      }
    }
    return true;
  };

  const finish = (outcome: Exclude<Result, null>) => {
    hasNavigated.current = true;
    setResult(outcome);
    scrollCardIntoView();
  };

  const message = () => buildInquiryMessage(data, services, storedFiles.length);

  const sendWhatsApp = () => {
    if (uploading || !validateAll()) return;
    window.open(whatsappLink(message()), '_blank', 'noopener,noreferrer');
    recordInquiry();
    finish('whatsapp');
  };

  const sendEmail = async () => {
    if (uploading || !validateAll()) return;
    const subject = `Project inquiry — ${data.name.trim()}`;
    if (!hasWeb3Forms) {
      window.location.href = mailtoLink(site.email, subject, message().replace(/\*/g, ''));
      recordInquiry();
      finish('mailto');
      return;
    }
    setSending(true);
    setSendError(false);
    const fields = inquiryFields(data, services);
    const ok = await submitToWeb3Forms(subject, data.email.trim() ? { ...fields, email: data.email.trim() } : fields, site.name);
    setSending(false);
    if (ok) {
      recordInquiry();
      finish('email');
    } else setSendError(true);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step < TOTAL_STEPS - 1) next();
    else sendWhatsApp();
  };

  const reset = () => {
    setData(emptyInquiry);
    setFiles([]);
    inquiryIdRef.current = null;
    savedRef.current = false;
    setErrors({});
    setResult(null);
    setSendError(false);
    setDirection(-1);
    setStep(0);
  };

  if (result) {
    const body =
      result === 'whatsapp' ? form.successBodyWhatsapp : result === 'email' ? form.successBodyEmail : form.successBodyMailto;
    return (
      <div ref={cardRef} className="card-frame scroll-mt-28 rounded-[2rem] bg-white/70 p-8 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="py-6 text-center"
          role="status"
        >
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-champagne text-champagne-700">
            <Check aria-hidden className="h-7 w-7" strokeWidth={1.25} />
          </span>
          <h3 ref={headingRef} tabIndex={-1} className="mt-8 text-balance font-serif text-3xl tracking-wide text-indigo outline-none md:text-4xl">
            <Highlight text={form.successTitle} />
          </h3>
          <p className="mx-auto mt-5 max-w-md leading-relaxed text-charcoal-soft">{body}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <ButtonLink href={whatsappLink(message())} variant="primary">
              <WhatsAppIcon className="h-4 w-4" />
              {form.reopenWhatsapp}
            </ButtonLink>
            <Button variant="link-dark" onClick={reset}>
              {form.startOver}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const options = form.options;

  return (
    <div ref={cardRef} className="card-frame scroll-mt-28 rounded-[2rem] bg-white/70 p-6 sm:p-10">
      {/* Progress */}
      <div className="flex items-center justify-between gap-4 text-[0.64rem] font-medium uppercase tracking-luxe">
        <span className="text-champagne-800">
          {form.stepLabel} {pad(step + 1)} {form.of} {pad(TOTAL_STEPS)}
        </span>
        <span className="text-charcoal-muted md:hidden">{form.steps[step]}</span>
      </div>
      <ol className="mt-4 grid grid-cols-4 gap-2">
        {form.steps.map((label, index) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => index < step && goTo(index)}
              disabled={index > step}
              aria-current={index === step ? 'step' : undefined}
              aria-label={`${form.stepLabel} ${index + 1}: ${label}`}
              className="block w-full text-start disabled:cursor-default"
            >
              <span className="block h-1 overflow-hidden rounded-full bg-indigo/10">
                <motion.span
                  className="block h-full origin-left rounded-full bg-indigo rtl:origin-right"
                  initial={false}
                  animate={{ scaleX: index <= step ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              </span>
              <span
                className={cn(
                  'mt-3 hidden text-[0.6rem] font-medium uppercase leading-snug tracking-luxe transition-colors md:block',
                  index === step ? 'text-indigo' : index < step ? 'text-charcoal-soft' : 'text-charcoal-muted/70',
                )}
              >
                {label}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <form onSubmit={onSubmit} noValidate className="mt-10">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: EASE }}
            role="group"
            aria-labelledby={`${baseId}-step-title`}
          >
            <h3
              id={`${baseId}-step-title`}
              ref={headingRef}
              tabIndex={-1}
              className="font-serif text-2xl tracking-wide text-indigo outline-none md:text-3xl"
            >
              {form.stepIntros[step]}
            </h3>

            <div className="mt-9 grid gap-9">
              {step === 0 && (
                <>
                  <TextField
                    id={fieldId('name')}
                    label={form.fields.name}
                    placeholder={form.fields.namePh}
                    value={data.name}
                    onChange={(value) => update('name', value)}
                    error={errors.name}
                    autoComplete="name"
                  />
                  <div className="grid gap-9 sm:grid-cols-2">
                    <TextField
                      id={fieldId('phone')}
                      label={form.fields.phone}
                      placeholder={form.fields.phonePh}
                      value={data.phone}
                      onChange={(value) => update('phone', value)}
                      error={errors.phone}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      ltr
                    />
                    <TextField
                      id={fieldId('email')}
                      label={form.fields.email}
                      placeholder={form.fields.emailPh}
                      value={data.email}
                      onChange={(value) => update('email', value)}
                      error={errors.email}
                      optional={form.optional}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      ltr
                    />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <ChoiceGroup<PropertyType>
                    id={fieldId('propertyType')}
                    label={form.fields.propertyType}
                    options={toOptions(options.propertyType)}
                    value={data.propertyType}
                    onSelect={(value) => update('propertyType', value)}
                    error={errors.propertyType}
                  />
                  <ChoiceGroup<PropertyStatus>
                    id={fieldId('status')}
                    label={form.fields.status}
                    options={toOptions(options.status)}
                    value={data.status}
                    onSelect={(value) => update('status', value)}
                    error={errors.status}
                  />
                  <div className="grid gap-9 sm:grid-cols-2">
                    <TextField
                      id={fieldId('area')}
                      label={form.fields.area}
                      placeholder={form.fields.areaPh}
                      value={data.area}
                      onChange={(value) => update('area', value.replace(/[^\d.]/g, ''))}
                      error={errors.area}
                      inputMode="decimal"
                      ltr
                    />
                    <TextField
                      id={fieldId('location')}
                      label={form.fields.location}
                      placeholder={form.fields.locationPh}
                      value={data.location}
                      onChange={(value) => update('location', value)}
                      optional={form.optional}
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <ChoiceGroup<string>
                    id={fieldId('services')}
                    label={form.fields.services}
                    hint={form.fields.servicesHint}
                    options={services.map((service) => ({ value: service.id, label: l(service.title) }))}
                    values={data.services}
                    onToggle={toggleService}
                    error={errors.services}
                  />
                  <ChoiceGroup<BudgetRange>
                    id={fieldId('budget')}
                    label={form.fields.budget}
                    options={toOptions(options.budget)}
                    value={data.budget}
                    onSelect={(value) => update('budget', value)}
                    error={errors.budget}
                  />
                </>
              )}

              {step === 3 && (
                <>
                  <ChoiceGroup<StartTimeline>
                    id={fieldId('timeline')}
                    label={form.fields.timeline}
                    options={toOptions(options.timeline)}
                    value={data.timeline}
                    onSelect={(value) => update('timeline', value)}
                    error={errors.timeline}
                  />
                  <TextField
                    id={fieldId('references')}
                    label={form.fields.references}
                    placeholder={form.fields.referencesPh}
                    hint={form.fields.referencesHint}
                    value={data.references}
                    onChange={(value) => update('references', value)}
                    optional={form.optional}
                    multiline
                    ltr
                  />
                  {isSupabaseConfigured && (
                    <ReferenceFiles
                      id={`${baseId}-files`}
                      files={files}
                      copy={form.fields}
                      optional={form.optional}
                      onAdd={addFiles}
                      onRemove={(key) => setFiles((current) => current.filter((file) => file.key !== key))}
                    />
                  )}
                  <TextField
                    id={fieldId('notes')}
                    label={form.fields.notes}
                    placeholder={form.fields.notesPh}
                    value={data.notes}
                    onChange={(value) => update('notes', value)}
                    optional={form.optional}
                    multiline
                  />
                  <p className="rounded-2xl border border-champagne/40 bg-linen px-5 py-3.5 text-sm leading-relaxed text-charcoal-soft">
                    {form.reviewNote}
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {sendError && (
          <p role="alert" className="mt-6 text-sm text-error">
            {form.sendError}
          </p>
        )}

        <div className="mt-12 flex flex-col-reverse gap-5 border-t border-champagne/40 pt-8 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              className="group inline-flex items-center gap-2 self-start text-[0.7rem] font-medium uppercase tracking-[0.18em] text-indigo transition-colors hover:text-champagne-800"
            >
              <ArrowLeft
                aria-hidden
                strokeWidth={1.5}
                className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1 rtl:-scale-x-100 rtl:group-hover:translate-x-1"
              />
              {form.back}
            </button>
          ) : (
            <span />
          )}

          {step < TOTAL_STEPS - 1 ? (
            <Button type="submit" variant="solid-dark" arrow>
              {form.continue}
            </Button>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" variant="primary" disabled={uploading}>
                <WhatsAppIcon className="h-4 w-4" />
                {form.sendWhatsapp}
              </Button>
              <Button variant="outline-dark" onClick={sendEmail} disabled={sending || uploading}>
                {sending ? form.sending : form.sendEmail}
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
