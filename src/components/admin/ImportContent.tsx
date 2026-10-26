'use client';

import { DownloadCloud, Sparkles } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useSWRConfig } from 'swr';
import { toast } from 'sonner';
import { friendlyError } from '@/lib/cms/admin';
import { importDefaultContent } from '@/lib/cms/seed';
import { useAdmin } from './AdminShell';
import { AdminButton, Card, Spinner } from './ui';

function useImport() {
  const { mutate } = useSWRConfig();
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      const result = await importDefaultContent();
      toast.success('Website content imported', {
        description: `${result.projects} projects, ${result.posts} articles, ${result.services} services and ${result.steps} process steps are now editable.`,
      });
      // Refresh everything, including the public-site cache in this browser.
      await mutate((key) => typeof key === 'string' && (key.startsWith('admin:') || key.startsWith('cms:')));
    } catch (error) {
      toast.error('Import failed', { description: friendlyError(error) });
    } finally {
      setBusy(false);
    }
  };

  return { run, busy };
}

/** First-run step: copies the website's current content into the CMS. */
export function ImportContentCard() {
  const { run, busy } = useImport();
  return (
    <Card className="overflow-hidden border-champagne bg-gradient-to-br from-white to-champagne-100">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-indigo text-champagne">
          <Sparkles className="h-6 w-6" strokeWidth={1.5} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-2xl tracking-wide text-indigo">One last step: import your website</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal-soft">
            The website is still showing its built-in content. Import it once — every project, article, service, photo and contact detail is copied into
            the dashboard, and from then on everything you save here appears on the live site instantly.
          </p>
        </div>
        <AdminButton variant="primary" icon={DownloadCloud} loading={busy} onClick={run}>
          Import website content
        </AdminButton>
      </div>
    </Card>
  );
}

/** Restores built-in projects/articles/services that were deleted, without touching edited ones. */
export function RestoreDefaultsButton() {
  const { run, busy } = useImport();
  return (
    <AdminButton variant="secondary" size="sm" icon={DownloadCloud} loading={busy} onClick={run}>
      Restore missing defaults
    </AdminButton>
  );
}

/** Editing screens wait for the import, so nothing is saved into a half-empty CMS. */
export function RequireInitialized({ children }: { children: ReactNode }) {
  const { initialized } = useAdmin();
  if (initialized === undefined) {
    return (
      <div className="grid h-64 place-items-center">
        <Spinner />
      </div>
    );
  }
  return initialized ? <>{children}</> : <ImportContentCard />;
}
