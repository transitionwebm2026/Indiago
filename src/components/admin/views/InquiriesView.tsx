'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Archive, Download, ExternalLink, FileText, Inbox, Mail, Phone, RotateCcw, Search, Trash2, UserCheck, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { toast } from 'sonner';
import { WhatsAppIcon } from '@/components/icons/SocialIcons';
import { adminKeys, deleteInquiry, fetchAdminServices, fetchInquiries, friendlyError, inquiryFileUrl, updateInquiry } from '@/lib/cms/admin';
import type { InquiryRow, InquiryStatus } from '@/lib/cms/types';
import { optionLabel } from '@/lib/inquiry';
import { buildWhatsappLink, telHref } from '@/lib/site';
import { cn } from '@/lib/utils';
import { AdminButton, Badge, Card, EmptyState, IconButton, PageHeader, Spinner, Tabs, TextArea, TextInput, formatDateTime, timeAgo, useConfirm } from '../ui';

type Filter = InquiryStatus | 'all';

const statusTone = { New: 'indigo', Contacted: 'success', Archived: 'neutral' } as const;

/** wa.me needs the country code; Egyptian mobiles are often typed locally as 01X XXXX XXXX. */
function whatsappDigits(phone: string) {
  const digits = phone.replace(/\D/g, '').replace(/^00/, '');
  return /^01\d{9}$/.test(digits) ? `20${digits.slice(1)}` : digits;
}

export function InquiriesView() {
  const router = useRouter();
  const selectedId = useSearchParams().get('id');
  const { mutate } = useSWRConfig();
  const { data: inquiries, error, mutate: mutateList } = useSWR(adminKeys.inquiries, fetchInquiries);
  const { data: services } = useSWR(adminKeys.services, fetchAdminServices);
  const [filter, setFilter] = useState<Filter>('New');
  const [query, setQuery] = useState('');
  const { confirm, dialog } = useConfirm();

  const select = (id: string | null) => router.replace(id ? `/admin/inquiries/?id=${id}` : '/admin/inquiries/', { scroll: false });
  const selected = inquiries?.find((inquiry) => inquiry.id === selectedId) ?? null;

  // Opening a brief from elsewhere (e.g. the overview) shows it in its own tab.
  // Runs only when a different brief is opened, so changing its status keeps it in view.
  const selectedStatus = selected?.status;
  useEffect(() => {
    if (selectedStatus && filter !== 'all' && selectedStatus !== filter) setFilter(selectedStatus);
  }, [selected?.id]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (inquiries ?? []).filter(
      (inquiry) =>
        (filter === 'all' || inquiry.status === filter) &&
        (!term || `${inquiry.client_name} ${inquiry.phone} ${inquiry.email} ${inquiry.location}`.toLowerCase().includes(term)),
    );
  }, [inquiries, filter, query]);

  const refresh = () => {
    void mutateList();
    void mutate(adminKeys.newInquiries);
    void mutate(adminKeys.stats);
  };

  const setStatus = async (inquiry: InquiryRow, status: InquiryStatus) => {
    void mutateList((current) => current?.map((item) => (item.id === inquiry.id ? { ...item, status } : item)), { revalidate: false });
    try {
      await updateInquiry(inquiry.id, { status });
      toast.success(status === 'Contacted' ? 'Marked as contacted' : status === 'Archived' ? 'Archived' : 'Moved back to New');
    } catch (updateError) {
      toast.error('Couldn’t update the inquiry', { description: friendlyError(updateError) });
    } finally {
      refresh();
    }
  };

  const remove = async (inquiry: InquiryRow) => {
    const ok = await confirm({
      title: `Delete the brief from ${inquiry.client_name}?`,
      body: 'The inquiry and its reference files are deleted permanently. Archive it instead to keep a record.',
      confirmLabel: 'Delete permanently',
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteInquiry(inquiry);
      toast.success('Inquiry deleted');
      select(null);
      refresh();
    } catch (deleteError) {
      toast.error('Couldn’t delete the inquiry', { description: friendlyError(deleteError) });
    }
  };

  const counts = (status: Filter) => (inquiries ?? []).filter((inquiry) => status === 'all' || inquiry.status === status).length;
  const serviceTitle = (slug: string) => services?.find((service) => service.slug === slug)?.title_en ?? slug;

  return (
    <>
      <PageHeader
        title="Project Inquiries"
        description="Every brief sent from the contact page — new ones arrive here live. Reply on WhatsApp or by phone, then mark them as contacted."
      />

      {error ? (
        <p className="rounded-2xl bg-error/10 p-4 text-sm text-error">{friendlyError(error)}</p>
      ) : !inquiries ? (
        <div className="grid h-48 place-items-center">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs
              label="Filter inquiries"
              value={filter}
              onChange={setFilter}
              tabs={[
                { value: 'New', label: 'New', count: counts('New') },
                { value: 'Contacted', label: 'Contacted', count: counts('Contacted') },
                { value: 'Archived', label: 'Archived', count: counts('Archived') },
                { value: 'all', label: 'All', count: counts('all') },
              ]}
            />
            <div className="relative sm:w-72">
              <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" />
              <TextInput placeholder="Search name, phone or email" value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" aria-label="Search inquiries" />
            </div>
          </div>

          <div className={cn('grid gap-4', selected && 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]')}>
            <Card bodyClassName="p-0" className={cn(selected && 'hidden lg:block')}>
              {visible.length === 0 ? (
                <EmptyState icon={Inbox} title={filter === 'New' ? 'You’re all caught up' : 'Nothing here'} body={filter === 'New' ? 'New project briefs appear here the moment they’re sent.' : undefined} />
              ) : (
                <ul className="divide-y divide-indigo/5">
                  {visible.map((inquiry) => (
                    <li key={inquiry.id}>
                      <button
                        type="button"
                        onClick={() => select(inquiry.id)}
                        aria-current={selected?.id === inquiry.id}
                        className={cn('flex w-full items-start gap-3 px-5 py-4 text-start transition-colors hover:bg-linen/60', selected?.id === inquiry.id && 'bg-champagne-100')}
                      >
                        <span
                          className={cn(
                            'mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full font-serif text-sm',
                            inquiry.status === 'New' ? 'bg-indigo text-champagne' : 'bg-linen text-indigo',
                          )}
                        >
                          {inquiry.client_name.slice(0, 1).toUpperCase()}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className={cn('truncate text-sm text-indigo', inquiry.status === 'New' && 'font-semibold')}>{inquiry.client_name}</span>
                            <span className="shrink-0 text-xs text-charcoal-muted">{timeAgo(inquiry.created_at)}</span>
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-charcoal-soft">
                            {[inquiry.property_type && optionLabel('propertyType', inquiry.property_type), inquiry.property_area && `${inquiry.property_area} sqm`, inquiry.budget && optionLabel('budget', inquiry.budget)]
                              .filter(Boolean)
                              .join(' · ')}
                          </span>
                          <span className="mt-1.5 flex gap-1.5">
                            <Badge tone={statusTone[inquiry.status]}>{inquiry.status}</Badge>
                            {inquiry.reference_files.length > 0 && (
                              <Badge>
                                {inquiry.reference_files.length} {inquiry.reference_files.length === 1 ? 'file' : 'files'}
                              </Badge>
                            )}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {selected && (
              <InquiryDetail
                key={selected.id}
                inquiry={selected}
                serviceTitle={serviceTitle}
                onClose={() => select(null)}
                onStatus={(status) => void setStatus(selected, status)}
                onDelete={() => void remove(selected)}
                onNotesSaved={refresh}
              />
            )}
          </div>
        </div>
      )}
      {dialog}
    </>
  );
}

interface InquiryDetailProps {
  inquiry: InquiryRow;
  serviceTitle: (slug: string) => string;
  onClose: () => void;
  onStatus: (status: InquiryStatus) => void;
  onDelete: () => void;
  onNotesSaved: () => void;
}

function InquiryDetail({ inquiry, serviceTitle, onClose, onStatus, onDelete, onNotesSaved }: InquiryDetailProps) {
  const [notes, setNotes] = useState(inquiry.admin_notes);
  const [savingNotes, setSavingNotes] = useState(false);
  const firstName = inquiry.client_name.split(' ')[0];
  const whatsapp = buildWhatsappLink(
    whatsappDigits(inquiry.phone),
    inquiry.locale === 'ar'
      ? `مرحبًا ${firstName}، شكرًا لتواصلك مع إنديجو إنتيريورز بخصوص مشروعك.`
      : `Hello ${firstName}, thank you for contacting Indigo Interiors about your project.`,
  );

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      await updateInquiry(inquiry.id, { admin_notes: notes });
      toast.success('Notes saved');
      onNotesSaved();
    } catch (error) {
      toast.error('Couldn’t save the notes', { description: friendlyError(error) });
    } finally {
      setSavingNotes(false);
    }
  };

  const openFile = async (path: string) => {
    try {
      window.open(await inquiryFileUrl(path), '_blank', 'noopener');
    } catch (error) {
      toast.error('Couldn’t open the file', { description: friendlyError(error) });
    }
  };

  const rows: [string, string][] = [
    ['Property type', inquiry.property_type ? optionLabel('propertyType', inquiry.property_type) : '—'],
    ['Property status', inquiry.property_status ? optionLabel('status', inquiry.property_status) : '—'],
    ['Area', inquiry.property_area ? `${inquiry.property_area} sqm` : '—'],
    ['Location', inquiry.location || '—'],
    ['Services', inquiry.services.map(serviceTitle).join(', ') || '—'],
    ['Budget', inquiry.budget ? optionLabel('budget', inquiry.budget) : '—'],
    ['Preferred start', inquiry.timeline ? optionLabel('timeline', inquiry.timeline) : '—'],
    ['Website language', inquiry.locale === 'ar' ? 'Arabic' : 'English'],
  ];

  return (
    <Card
      title={inquiry.client_name}
      description={`Received ${formatDateTime(inquiry.created_at)}`}
      actions={
        <div className="flex items-center gap-2">
          <Badge tone={statusTone[inquiry.status]}>{inquiry.status}</Badge>
          <IconButton icon={X} label="Close" onClick={onClose} />
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#1F7A4D] px-4 text-sm font-medium text-white hover:bg-[#186440]">
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </a>
          <a href={telHref(inquiry.phone)} className="inline-flex h-10 items-center gap-2 rounded-xl border border-indigo/15 bg-white px-4 text-sm font-medium text-indigo hover:border-indigo/40">
            <Phone className="h-4 w-4" /> <span dir="ltr">{inquiry.phone}</span>
          </a>
          {inquiry.email && (
            <a
              href={`mailto:${inquiry.email}?subject=${encodeURIComponent('Your project with Indigo Interiors')}`}
              className="inline-flex h-10 max-w-full items-center gap-2 rounded-xl border border-indigo/15 bg-white px-4 text-sm font-medium text-indigo hover:border-indigo/40"
            >
              <Mail className="h-4 w-4 shrink-0" /> <span className="truncate">{inquiry.email}</span>
            </a>
          )}
        </div>

        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-medium uppercase tracking-wider text-charcoal-muted">{label}</dt>
              <dd className="mt-1 text-sm text-indigo">{value}</dd>
            </div>
          ))}
        </dl>

        {inquiry.notes && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-charcoal-muted">Client’s notes</p>
            <p dir="auto" className="mt-1.5 whitespace-pre-line rounded-xl bg-linen/60 p-4 text-sm leading-relaxed text-charcoal">
              {inquiry.notes}
            </p>
          </div>
        )}

        {(inquiry.reference_links.length > 0 || inquiry.reference_files.length > 0) && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-charcoal-muted">References</p>
            <ul className="mt-2 space-y-1.5">
              {inquiry.reference_links.map((link) => (
                <li key={link}>
                  <a
                    href={/^https?:\/\//.test(link) ? link : `https://${link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-full items-center gap-2 text-sm text-champagne-800 underline-offset-2 hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{link}</span>
                  </a>
                </li>
              ))}
              {inquiry.reference_files.map((file) => (
                <li key={file.path}>
                  <button
                    type="button"
                    onClick={() => void openFile(file.path)}
                    className="inline-flex max-w-full items-center gap-2 rounded-lg border border-indigo/10 bg-white px-3 py-2 text-sm text-indigo hover:border-champagne"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-champagne-700" />
                    <span className="truncate">{file.name}</span>
                    <span className="shrink-0 text-xs text-charcoal-muted">{Math.max(1, Math.round(file.size / 1024))} KB</span>
                    <Download className="h-3.5 w-3.5 shrink-0 text-charcoal-muted" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <label htmlFor="admin-notes" className="text-xs font-medium uppercase tracking-wider text-charcoal-muted">
            Studio notes (private)
          </label>
          <TextArea id="admin-notes" rows={3} className="mt-1.5" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Called on Sunday, site visit booked for…" />
          <AdminButton size="sm" variant="secondary" className="mt-2" onClick={saveNotes} loading={savingNotes} disabled={notes === inquiry.admin_notes}>
            Save notes
          </AdminButton>
        </div>

        <div className="flex flex-wrap justify-between gap-2 border-t border-indigo/5 pt-5">
          <div className="flex flex-wrap gap-2">
            {inquiry.status !== 'Contacted' && (
              <AdminButton icon={UserCheck} onClick={() => onStatus('Contacted')}>
                Mark as contacted
              </AdminButton>
            )}
            {inquiry.status !== 'Archived' && (
              <AdminButton variant="secondary" icon={Archive} onClick={() => onStatus('Archived')}>
                Archive
              </AdminButton>
            )}
            {inquiry.status !== 'New' && (
              <AdminButton variant="ghost" icon={RotateCcw} onClick={() => onStatus('New')}>
                Move to New
              </AdminButton>
            )}
          </div>
          <AdminButton variant="danger" icon={Trash2} onClick={onDelete}>
            Delete
          </AdminButton>
        </div>
      </div>
    </Card>
  );
}
