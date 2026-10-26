'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { FilterBar, type FilterOption } from '@/components/ui/FilterBar';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { usePosts } from '@/lib/cms/hooks';
import { blogCategories, getFeaturedPost, type BlogCategory } from '@/lib/data/posts';
import { EASE } from '@/lib/motion';
import { ArticleCard } from './ArticleCard';

type Filter = 'all' | BlogCategory;

export function JournalExplorer() {
  const { t } = useLanguage();
  const posts = usePosts();
  const [filter, setFilter] = useState<Filter>('all');

  // The featured article has its own spotlight above the grid.
  const gridPosts = useMemo(() => {
    const featured = getFeaturedPost(posts);
    return posts.filter((post) => post.slug !== featured?.slug);
  }, [posts]);

  const visible = useMemo(
    () => (filter === 'all' ? gridPosts : gridPosts.filter((post) => post.category === filter)),
    [filter, gridPosts],
  );

  const options: FilterOption<Filter>[] = [
    { value: 'all', label: t.common.all, count: gridPosts.length },
    ...blogCategories.map((category) => ({
      value: category,
      label: t.blogCategories[category],
      count: gridPosts.filter((post) => post.category === category).length,
    })),
  ];

  return (
    <section className="section-y bg-ivory">
      <div className="container-luxe">
        <div className="flex flex-col gap-8 border-b border-indigo/10 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <Eyebrow>{t.blog.latest}</Eyebrow>
          <FilterBar id="journal-filter" label={t.blog.filterLabel} options={options} value={filter} onChange={setFilter} />
        </div>

        <motion.div layout className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((post) => (
              <motion.div
                key={post.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <ArticleCard post={post} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {visible.length === 0 && <p className="mt-14 text-center text-charcoal-soft">{t.blog.empty}</p>}
      </div>
    </section>
  );
}
