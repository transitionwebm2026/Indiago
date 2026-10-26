'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ExternalLink, Send, Trash2, Wand2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { toast } from 'sonner';
import { adminKeys, deletePost, emptyPost, fetchAdminPost, friendlyError, savePost, type PostDraft } from '@/lib/cms/admin';
import { cmsKeys } from '@/lib/cms/api';
import { isValidSlug, slugify } from '@/lib/cms/ids';
import { estimateReadTime } from '@/lib/cms/markdown';
import { deepEqual } from '@/lib/cms/merge';
import type { PostStatus } from '@/lib/cms/types';
import { authorIds, blogCategories } from '@/lib/data/posts';
import { en } from '@/lib/i18n/en';
import { postHref } from '@/lib/routes';
import { site } from '@/lib/site';
import { useAdmin } from '../AdminShell';
import { BilingualInput } from '../fields';
import { RequireInitialized } from '../ImportContent';
import { MarkdownEditor } from '../MarkdownEditor';
import { ImageField } from '../MediaField';
import { AdminButton, AdminLinkButton, Badge, Card, Field, PageHeader, Select, Spinner, Tabs, TextInput, Toggle, useConfirm, useUnsavedWarning } from '../ui';

const authorLabels = { founder: 'Founder', studio: 'Indigo Design Studio' } as const;

export function PostEditorView() {
  const id = useSearchParams().get('id');
  return (
    <RequireInitialized>
      <PostEditorLoader key={id ?? 'new'} id={id} />
    </RequireInitialized>
  );
}

function PostEditorLoader({ id }: { id: string | null }) {
  const { data, error } = useSWR(id ? adminKeys.post(id) : null, () => fetchAdminPost(id!));

  if (!id) return <PostEditor initial={emptyPost()} />;
  if (error) return <p className="rounded-2xl bg-error/10 p-4 text-sm text-error">{friendlyError(error)}</p>;
  if (data === undefined) {
    return (
      <div className="grid h-64 place-items-center">
        <Spinner />
      </div>
    );
  }
  if (data === null) {
    return (
      <Card>
        <p className="text-sm text-charcoal-soft">This article no longer exists.</p>
        <AdminLinkButton href="/admin/blog/" variant="secondary" className="mt-4">
          Back to the blog
        </AdminLinkButton>
      </Card>
    );
  }
  return <PostEditor initial={data} />;
}

function PostEditor({ initial }: { initial: PostDraft }) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { user } = useAdmin();
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [saving, setSaving] = useState<PostStatus | null>(null);
  const { confirm, dialog } = useConfirm();
  const isNew = !draft.id;
  const dirty = !deepEqual(draft, saved);
  useUnsavedWarning(dirty);

  const set = (change: Partial<PostDraft>) => setDraft((current) => ({ ...current, ...change }));

  useEffect(() => {
    if (!slugTouched) setDraft((current) => ({ ...current, slug: slugify(current.title_en) }));
  }, [draft.title_en, slugTouched]);

  const save = async (status: PostStatus) => {
    if (!draft.title_en.trim()) return void toast.error('Please enter the article title in English.');
    if (!isValidSlug(draft.slug)) return void toast.error('The web address can only use lowercase letters, numbers and dashes.');
    if (status === 'published' && !draft.content_en.trim()) return void toast.error('Write the English article text before publishing.');
    setSaving(status);
    try {
      const row = await savePost({ ...draft, status, title_en: draft.title_en.trim(), title_ar: draft.title_ar.trim() });
      setSaved(row);
      setDraft(row);
      setSlugTouched(true);
      const goingLive = status === 'published' && saved.status !== 'published';
      toast.success(goingLive ? 'Article published' : status === 'draft' ? 'Draft saved' : 'Article updated', {
        description: status === 'published' ? 'It’s live on the blog now.' : 'Only admins can see drafts.',
      });
      void mutate(adminKeys.posts);
      void mutate(adminKeys.post(row.id), row, { revalidate: false });
      void mutate(cmsKeys.posts);
      void mutate(cmsKeys.post(row.slug));
      if (saved.slug && saved.slug !== row.slug) void mutate(cmsKeys.post(saved.slug));
      if (isNew) router.replace(`/admin/blog/edit/?id=${row.id}`);
    } catch (error) {
      toast.error('Couldn’t save the article', { description: friendlyError(error) });
    } finally {
      setSaving(null);
    }
  };

  const remove = async () => {
    if (!draft.id) return;
    const ok = await confirm({ title: `Delete “${saved.title_en}”?`, body: 'The article is removed permanently.', confirmLabel: 'Delete article', danger: true });
    if (!ok) return;
    try {
      await deletePost(draft.id);
      setSaved(draft);
      toast.success('Article deleted');
      void mutate(adminKeys.posts);
      void mutate(cmsKeys.posts);
      router.push('/admin/blog/');
    } catch (error) {
      toast.error('Couldn’t delete the article', { description: friendlyError(error) });
    }
  };

  const published = saved.status === 'published';

  return (
    <>
      <Link href="/admin/blog/" className="mb-4 inline-flex items-center gap-1.5 text-sm text-charcoal-soft hover:text-indigo">
        <ArrowLeft className="h-4 w-4" /> All articles
      </Link>
      <PageHeader
        title={isNew ? 'New article' : saved.title_en || 'Edit article'}
        description={isNew ? `Writing as ${user.email}. Save a draft at any time — nothing goes live until you publish.` : undefined}
        actions={
          <>
            {!isNew && (published ? <Badge tone="success">Published</Badge> : <Badge tone="warning">Draft</Badge>)}
            {!isNew && published && (
              <AdminLinkButton href={postHref(saved.slug)} external variant="secondary" size="sm" icon={ExternalLink}>
                View
              </AdminLinkButton>
            )}
            {!isNew && (
              <AdminButton variant="danger" size="sm" icon={Trash2} onClick={remove}>
                Delete
              </AdminButton>
            )}
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-6">
          <Card>
            <div className="space-y-6">
              <BilingualInput label="Title" required value={{ en: draft.title_en, ar: draft.title_ar }} onChange={(value) => set({ title_en: value.en, title_ar: value.ar })} />
              <BilingualInput label="Excerpt" hint="Two or three sentences shown on article cards and in search results." multiline value={{ en: draft.excerpt_en, ar: draft.excerpt_ar }} onChange={(value) => set({ excerpt_en: value.en, excerpt_ar: value.ar })} />
            </div>
          </Card>

          <Card
            title="Article"
            description={language === 'ar' ? 'Without Arabic text, Arabic readers see the English article with a short notice.' : undefined}
            actions={
              <Tabs
                label="Article language"
                value={language}
                onChange={setLanguage}
                tabs={[
                  { value: 'en', label: 'English' },
                  { value: 'ar', label: 'العربية' },
                ]}
              />
            }
          >
            {language === 'en' ? (
              <MarkdownEditor lang="en" value={draft.content_en} onChange={(content_en) => set({ content_en })} placeholder="Start with a strong opening paragraph…" />
            ) : (
              <MarkdownEditor lang="ar" value={draft.content_ar} onChange={(content_ar) => set({ content_ar })} placeholder="ابدأ بفقرة افتتاحية قوية…" />
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Publishing">
            <div className="space-y-3">
              <AdminButton className="w-full" icon={Send} onClick={() => void save('published')} loading={saving === 'published'} disabled={saving !== null || (published && !dirty)}>
                {published ? 'Update article' : 'Publish'}
              </AdminButton>
              <AdminButton className="w-full" variant="secondary" onClick={() => void save('draft')} loading={saving === 'draft'} disabled={saving !== null || (!published && !dirty && !isNew)}>
                {published ? 'Unpublish (move to drafts)' : 'Save draft'}
              </AdminButton>
              {dirty && <p className="text-center text-xs text-[#8A5A12]">You have unsaved changes</p>}
            </div>
          </Card>

          <Card title="Details">
            <div className="space-y-5">
              <ImageField label="Cover image" folder="blog" value={draft.cover_image_url} onChange={(cover_image_url) => set({ cover_image_url })} aspect="aspect-[16/10]" />
              <Field
                label="Web address"
                htmlFor="post-slug"
                hint={
                  <>
                    {site.url.replace(/^https?:\/\//, '')}/blog/<strong className="text-indigo">{draft.slug || '…'}</strong>/
                  </>
                }
              >
                <TextInput
                  id="post-slug"
                  dir="ltr"
                  value={draft.slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    set({ slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') });
                  }}
                  onBlur={() => set({ slug: slugify(draft.slug) })}
                />
              </Field>
              <Field label="Category" htmlFor="post-category">
                <Select id="post-category" value={draft.category} onChange={(event) => set({ category: event.target.value })}>
                  {blogCategories.map((category) => (
                    <option key={category} value={category}>
                      {en.blogCategories[category]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Author" htmlFor="post-author">
                <Select id="post-author" value={draft.author} onChange={(event) => set({ author: event.target.value })}>
                  {authorIds.map((author) => (
                    <option key={author} value={author}>
                      {authorLabels[author]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Publication date" htmlFor="post-date">
                <TextInput id="post-date" type="date" value={draft.published_at} onChange={(event) => set({ published_at: event.target.value || new Date().toISOString().slice(0, 10) })} />
              </Field>
              <Field label="Reading time (minutes)" htmlFor="post-read">
                <div className="flex gap-2">
                  <TextInput id="post-read" type="number" min={1} max={120} value={draft.read_time} onChange={(event) => set({ read_time: Math.max(1, Number(event.target.value) || 1) })} className="max-w-[6rem]" />
                  <AdminButton variant="secondary" icon={Wand2} onClick={() => set({ read_time: estimateReadTime(draft.content_en) })}>
                    Estimate
                  </AdminButton>
                </div>
              </Field>
              <Toggle label="Featured article" description="Shown in the spotlight at the top of the blog page." checked={draft.is_featured} onChange={(is_featured) => set({ is_featured })} />
            </div>
          </Card>
        </div>
      </div>
      {dialog}
    </>
  );
}
