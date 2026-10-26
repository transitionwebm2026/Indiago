import { posts } from '@/lib/data/post-bodies';
import { projects } from '@/lib/data/projects';
import { processSteps, services } from '@/lib/data/services';
import { defaultSiteSettings } from '@/lib/site';
import { requireSupabase } from '@/lib/supabase/client';
import { postToRow, projectToRow, serviceToRow, settingsToRow, stepToRow } from './mappers';

/**
 * "Import website content": copies the site's built-in projects, articles, services,
 * process steps and studio details into the CMS. Anything already in the CMS (matched
 * by slug) is left untouched, so it is safe to run again to restore deleted defaults.
 *
 * The settings row goes in last: it is what switches the public site over to the CMS,
 * so visitors never see a half-imported website.
 */
export async function importDefaultContent() {
  const supabase = requireSupabase();
  const check = ({ error }: { error: unknown }) => {
    if (error) throw error;
  };

  check(
    await supabase
      .from('services')
      .upsert(services.map((service, index) => serviceToRow(service, index)), { onConflict: 'slug', ignoreDuplicates: true }),
  );

  const { count, error } = await supabase.from('process_steps').select('id', { count: 'exact', head: true });
  if (error) throw error;
  if (!count) check(await supabase.from('process_steps').insert(processSteps.map((step, index) => stepToRow(step, index))));

  check(
    await supabase
      .from('projects')
      .upsert(projects.map((project, index) => projectToRow(project, index)), { onConflict: 'slug', ignoreDuplicates: true }),
  );

  check(await supabase.from('blog_posts').upsert(posts.map(postToRow), { onConflict: 'slug', ignoreDuplicates: true }));

  check(await supabase.from('site_settings').upsert(settingsToRow(defaultSiteSettings), { onConflict: 'id', ignoreDuplicates: true }));

  return { projects: projects.length, posts: posts.length, services: services.length, steps: processSteps.length };
}
