'use client';

import Link from 'next/link';
import { ArrowRight, FileText, FolderKanban, Inbox, PenSquare, Settings2, Wrench, type LucideIcon } from 'lucide-react';
import useSWR from 'swr';
import { adminKeys, fetchStats, friendlyError } from '@/lib/cms/admin';
import { optionLabel } from '@/lib/inquiry';
import { useAdmin } from '../AdminShell';
import { ImportContentCard, RestoreDefaultsButton } from '../ImportContent';
import { AdminLinkButton, Badge, Card, EmptyState, PageHeader, Spinner, timeAgo } from '../ui';

function Stat({ label, value, detail, href, icon: Icon, highlight }: { label: string; value: number; detail?: string; href: string; icon: LucideIcon; highlight?: boolean }) {
  return (
    <Link
      href={href}
      className={
        highlight
          ? 'group rounded-2xl bg-indigo p-5 text-ivory shadow-lg shadow-indigo/20 transition-transform hover:-translate-y-0.5'
          : 'group rounded-2xl border border-champagne/40 bg-white p-5 transition-[transform,border-color] hover:-translate-y-0.5 hover:border-champagne'
      }
    >
      <div className="flex items-center justify-between">
        <span className={highlight ? 'text-sm text-ivory/70' : 'text-sm text-charcoal-soft'}>{label}</span>
        <Icon aria-hidden className={highlight ? 'h-5 w-5 text-champagne' : 'h-5 w-5 text-champagne-700'} strokeWidth={1.5} />
      </div>
      <p className="mt-4 font-serif text-4xl tabular-nums tracking-wide">{value}</p>
      {detail && <p className={highlight ? 'mt-1 text-xs text-ivory/60' : 'mt-1 text-xs text-charcoal-muted'}>{detail}</p>}
    </Link>
  );
}

const shortcuts: { href: string; label: string; body: string; icon: LucideIcon }[] = [
  { href: '/admin/projects/edit/', label: 'Add a project', body: 'Photos, story, materials and before/after.', icon: FolderKanban },
  { href: '/admin/blog/edit/', label: 'Write an article', body: 'Draft, preview and publish to the blog.', icon: PenSquare },
  { href: '/admin/content/', label: 'Edit page text', body: 'Headlines, paragraphs and hero photos.', icon: FileText },
  { href: '/admin/settings/', label: 'Contact details', body: 'Phones, address, map, logo and social links.', icon: Settings2 },
  { href: '/admin/services/', label: 'Services & process', body: 'Service cards and the five-step process.', icon: Wrench },
];

export function OverviewView() {
  const { user, initialized } = useAdmin();
  const { data, error, isLoading } = useSWR(initialized ? adminKeys.stats : null, fetchStats, { refreshInterval: 60000 });
  const name = user.email?.split('@')[0] ?? '';

  return (
    <>
      <PageHeader
        title={`Welcome${name ? `, ${name}` : ''}`}
        description="Everything you change here is live on indigoegy.com within seconds — no rebuild or upload needed."
        actions={initialized ? <RestoreDefaultsButton /> : undefined}
      />

      {initialized === false && <ImportContentCard />}

      {initialized && (
        <div className="space-y-8">
          {error && <p className="rounded-2xl bg-error/10 p-4 text-sm text-error">{friendlyError(error)}</p>}
          {isLoading || !data ? (
            <div className="grid h-40 place-items-center">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="New inquiries" value={data.newInquiries} detail={`${data.totalInquiries} in total`} href="/admin/inquiries/" icon={Inbox} highlight />
                <Stat label="Published projects" value={data.publishedProjects} detail={`${data.totalProjects - data.publishedProjects} hidden`} href="/admin/projects/" icon={FolderKanban} />
                <Stat label="Published articles" value={data.publishedPosts} detail={`${data.draftPosts} drafts`} href="/admin/blog/" icon={PenSquare} />
                <Stat label="Services" value={data.services} href="/admin/services/" icon={Wrench} />
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <Card
                  title="Latest inquiries"
                  description="Briefs sent from the contact page."
                  actions={
                    <AdminLinkButton href="/admin/inquiries/" variant="ghost" size="sm" icon={ArrowRight}>
                      Open inbox
                    </AdminLinkButton>
                  }
                  bodyClassName="p-0 sm:p-0"
                >
                  {data.recent.length === 0 ? (
                    <EmptyState icon={Inbox} title="No inquiries yet" body="When a client sends a project brief, it appears here instantly." />
                  ) : (
                    <ul className="divide-y divide-indigo/5">
                      {data.recent.map((inquiry) => (
                        <li key={inquiry.id}>
                          <Link href={`/admin/inquiries/?id=${inquiry.id}`} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-linen/60 sm:px-6">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-linen font-serif text-sm text-indigo">
                              {inquiry.client_name.slice(0, 1).toUpperCase()}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-indigo">{inquiry.client_name}</p>
                              <p className="truncate text-xs text-charcoal-muted">
                                {[inquiry.property_type && optionLabel('propertyType', inquiry.property_type), inquiry.budget && optionLabel('budget', inquiry.budget)]
                                  .filter(Boolean)
                                  .join(' · ') || inquiry.phone}
                              </p>
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-1">
                              {inquiry.status === 'New' && <Badge tone="indigo">New</Badge>}
                              <span className="text-xs text-charcoal-muted">{timeAgo(inquiry.created_at)}</span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>

                <Card title="Quick actions">
                  <ul className="space-y-2">
                    {shortcuts.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.href}>
                          <Link href={item.href} className="group flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-linen">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo/5 text-champagne-700 transition-colors group-hover:bg-indigo group-hover:text-champagne">
                              <Icon aria-hidden className="h-[18px] w-[18px]" strokeWidth={1.6} />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-medium text-indigo">{item.label}</span>
                              <span className="block text-xs text-charcoal-muted">{item.body}</span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </Card>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
