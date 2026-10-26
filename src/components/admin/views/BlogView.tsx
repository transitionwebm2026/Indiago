'use client';

import Link from 'next/link';
import { ExternalLink, PenSquare, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { toast } from 'sonner';
import { adminKeys, deletePost, fetchAdminPosts, friendlyError, updatePost, type AdminPostSummary } from '@/lib/cms/admin';
import { cmsKeys } from '@/lib/cms/api';
import { en } from '@/lib/i18n/en';
import { postHref } from '@/lib/routes';
import { formatDate } from '@/lib/utils';
import { RequireInitialized } from '../ImportContent';
import { MediaPreview } from '../MediaField';
import { AdminLinkButton, Badge, Card, EmptyState, IconButton, PageHeader, Spinner, Tabs, TextInput, useConfirm } from '../ui';

type Filter = 'all' | 'published' | 'draft';

export function BlogView() {
  return (
    <>
      <PageHeader
        title="Blog / Journal"
        description="Write articles in English and Arabic. Drafts stay private until you publish them. The newest featured article (★) leads the blog page."
        actions={
          <AdminLinkButton href="/admin/blog/edit/" icon={Plus}>
            New article
          </AdminLinkButton>
        }
      />
      <RequireInitialized>
        <PostList />
      </RequireInitialized>
    </>
  );
}

function PostList() {
  const { mutate } = useSWRConfig();
  const { data: posts, error, mutate: mutateList } = useSWR(adminKeys.posts, fetchAdminPosts);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const { confirm, dialog } = useConfirm();

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (posts ?? []).filter(
      (post) => (filter === 'all' || post.status === filter) && (!term || `${post.title_en} ${post.title_ar}`.toLowerCase().includes(term)),
    );
  }, [posts, filter, query]);

  const refreshPublic = (slug?: string) => {
    void mutate(cmsKeys.posts);
    if (slug) void mutate(cmsKeys.post(slug));
  };

  const toggleFeatured = async (post: AdminPostSummary) => {
    try {
      await updatePost(post.id, { is_featured: !post.is_featured });
      toast.success(post.is_featured ? 'No longer featured' : 'Featured on the blog page');
      void mutateList();
      refreshPublic(post.slug);
    } catch (toggleError) {
      toast.error('Couldn’t update the article', { description: friendlyError(toggleError) });
    }
  };

  const remove = async (post: AdminPostSummary) => {
    const ok = await confirm({
      title: `Delete “${post.title_en}”?`,
      body: 'The article is removed from the website immediately. This can’t be undone — switch it back to Draft instead if you might want it later.',
      confirmLabel: 'Delete article',
      danger: true,
    });
    if (!ok) return;
    try {
      await deletePost(post.id);
      toast.success('Article deleted');
      void mutateList();
      refreshPublic(post.slug);
    } catch (deleteError) {
      toast.error('Couldn’t delete the article', { description: friendlyError(deleteError) });
    }
  };

  if (error) return <p className="rounded-2xl bg-error/10 p-4 text-sm text-error">{friendlyError(error)}</p>;
  if (!posts) {
    return (
      <div className="grid h-48 place-items-center">
        <Spinner />
      </div>
    );
  }

  const count = (status: Filter) => (status === 'all' ? posts.length : posts.filter((post) => post.status === status).length);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          label="Filter articles"
          value={filter}
          onChange={setFilter}
          tabs={[
            { value: 'all', label: 'All', count: count('all') },
            { value: 'published', label: 'Published', count: count('published') },
            { value: 'draft', label: 'Drafts', count: count('draft') },
          ]}
        />
        <div className="relative sm:w-72">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" />
          <TextInput placeholder="Search articles" value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" aria-label="Search articles" />
        </div>
      </div>

      <Card bodyClassName="p-0">
        {visible.length === 0 ? (
          <EmptyState
            icon={PenSquare}
            title="No articles here"
            body={filter === 'draft' ? 'Drafts you save appear here.' : 'Write your first article to start the journal.'}
            action={
              <AdminLinkButton href="/admin/blog/edit/" icon={Plus}>
                New article
              </AdminLinkButton>
            }
          />
        ) : (
          <ul className="divide-y divide-indigo/5">
            {visible.map((post) => (
              <li key={post.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <Link href={`/admin/blog/edit/?id=${post.id}`} className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-linen">
                    {post.cover_image_url && <MediaPreview src={post.cover_image_url} alt="" />}
                  </Link>
                  <div className="min-w-0">
                    <Link href={`/admin/blog/edit/?id=${post.id}`} className="line-clamp-2 font-medium text-indigo hover:text-champagne-800">
                      {post.title_en || 'Untitled article'}
                    </Link>
                    <p className="mt-0.5 text-xs text-charcoal-muted">
                      {en.blogCategories[post.category as keyof typeof en.blogCategories] ?? post.category} · {formatDate(post.published_at, 'en')}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {post.status === 'published' ? <Badge tone="success">Published</Badge> : <Badge tone="warning">Draft</Badge>}
                      {post.is_featured && (
                        <Badge tone="champagne">
                          <Star className="h-3 w-3 fill-current" /> Featured
                        </Badge>
                      )}
                      {!post.title_ar && <Badge>No Arabic title</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center">
                  <IconButton icon={Star} label={post.is_featured ? 'Remove from featured' : 'Feature on the blog page'} onClick={() => void toggleFeatured(post)} className={post.is_featured ? 'text-champagne-700' : undefined} />
                  <IconButton icon={ExternalLink} label="View on website" disabled={post.status !== 'published'} onClick={() => window.open(postHref(post.slug), '_blank', 'noopener')} />
                  <Link href={`/admin/blog/edit/?id=${post.id}`} aria-label="Edit article" title="Edit article" className="grid h-9 w-9 place-items-center rounded-lg text-charcoal-soft hover:bg-indigo/5 hover:text-indigo">
                    <Pencil aria-hidden className="h-4 w-4" strokeWidth={1.75} />
                  </Link>
                  <IconButton icon={Trash2} label="Delete article" tone="danger" onClick={() => void remove(post)} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
      {dialog}
    </div>
  );
}
