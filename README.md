# Indigo Interiors — Website

Luxury interior architecture studio website for **Indigo Interiors** (Sheikh Zayed, Egypt), built with
Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS and Framer Motion. The site is a fully
static export, ready to upload to Hostinger shared hosting, with a Supabase-powered content
management dashboard at **`/admin/`**.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site generated in /out
npm run preview    # serve /out locally to check the production build
```

Without Supabase credentials the website runs exactly as before on its built-in content, and
`/admin/` explains how to connect it.

## Content management (Supabase)

### How it works

- Every page is still pre-rendered as static HTML with the built-in content, so the site is fast,
  SEO-friendly and hostable anywhere.
- In the browser, each section then loads its live content from Supabase and swaps it in. Returning
  visitors get the latest content straight from their browser cache, then a fresh copy.
- **Supabase Realtime** pushes every save to open pages, so changes appear for all visitors within
  seconds — no rebuild, no upload.
- Projects and articles created in the dashboard after the last build are served by a shell page
  (`/portfolio/_/`, `/blog/_/`) through a rewrite in `public/.htaccess`, so their pretty URLs work
  immediately.
- The website keeps showing its built-in content until you click **Import website content** in the
  dashboard, so a freshly created, empty database never blanks the live site.

### One-time setup

1. **Create a Supabase project** at <https://supabase.com> (the free plan is enough).
2. **Run the migration**: Supabase → SQL Editor → paste and run
   [`supabase/migrations/20261025000000_indigo_cms.sql`](supabase/migrations/20261025000000_indigo_cms.sql).
   It creates the tables, Row Level Security, the `media` (public) and `inquiry-files` (private)
   storage buckets and the Realtime publication. It is safe to run again.
3. **Create the studio's login**: Authentication → Users → *Add user* (email + password, tick
   *Auto Confirm User*). Then in the SQL Editor run:
   ```sql
   select public.make_admin('owner@indigoegy.com');
   ```
   Only users added this way can edit content or read inquiries.
4. **Lock down sign-ups**: Authentication → Sign In / Providers → turn off *Allow new users to sign
   up*. (Admins are added by you, never by the public.)
5. **Password reset links**: Authentication → URL Configuration → set *Site URL* to
   `https://www.indigoegy.com` and add `https://www.indigoegy.com/admin/` to *Redirect URLs*.
6. **Connect the website**: copy `.env.example` to `.env.local` and fill in
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (Project Settings → API
   Keys — the *publishable* key, never a *secret* or *service_role* key). Then `npm run build` and
   deploy (below).
7. **Open `https://www.indigoegy.com/admin/`**, sign in, and click **Import website content**. Every
   project, article, service, process step and studio detail is copied into the dashboard.

After this, the only reason to rebuild is code changes — content never needs one.

Good to know: the static HTML itself always carries the built-in content; CMS content is applied in
the browser a moment after the page loads. Google renders JavaScript and indexes the live content,
but social-media link previews (Open Graph) and the sitemap use the built-in content and titles.
First-time visitors may glimpse the built-in text for a split second before an edited version
replaces it; returning visitors see the edited version immediately from their browser cache.

### The dashboard

| Section | What you edit |
| --- | --- |
| Overview | New-inquiry count, latest briefs, quick links, "Restore missing defaults" |
| Global Settings | Logo, menu links (rename, reorder, hide, add), phones, email, WhatsApp, address, map, social profiles, founder, footer |
| Pages Content | Every headline, paragraph, button and hero photo on every page, in English and Arabic |
| Portfolio | Projects: text, cover, gallery, before/after and 3D-render-vs-real pairs, featured, visible, order |
| Services & Process | Service cards (icon, photo, bullets, home-page flag) and the execution process steps |
| Blog / Journal | Articles with a Markdown editor and live preview, drafts, featured article |
| Project Inquiries | Briefs from the contact page (with reference files), live alerts, notes, status |

Uploads go straight from the computer to Supabase Storage with a progress bar; large photos are
resized to 2560 px and converted to WebP in the browser first. Everything uploaded is reusable from
the **media library** in any image field.

### Security

- The anon key is public by design; Row Level Security decides what it can do. Visitors can read
  published content and *insert* inquiries (and upload reference files) — nothing else.
- Writes, drafts, hidden projects, inquiries and inquiry files are visible only to users in
  `public.admins`.
- `/admin/` is excluded from search engines (`robots.txt` and a `noindex` meta tag).

### Code map

| What | Where |
| --- | --- |
| SQL schema, RLS, storage, realtime | `supabase/migrations/` |
| Supabase client | `src/lib/supabase/client.ts` |
| Live-content hooks (`useSite`, `useProjects`, `usePosts`, `useServices`, `useMedia`…) | `src/lib/cms/hooks.ts` |
| Public fetchers / dashboard data access | `src/lib/cms/api.ts`, `src/lib/cms/admin.ts` |
| Editable page sections (drives the Pages Content screen) | `src/lib/cms/sections.ts` |
| Uploads, image optimisation, media library | `src/lib/cms/storage.ts` |
| Dashboard UI | `src/components/admin/`, routes in `src/app/admin/` |
| SWR cache + realtime subscription | `src/components/providers/CmsProvider.tsx` |

New copy added to `src/lib/i18n/en.ts` / `ar.ts` becomes editable automatically when it sits under
a section listed in `src/lib/cms/sections.ts`.

## Deploying to Hostinger

1. Run `npm run build`. Next.js writes the complete site to `out/` (one `index.html` per route,
   e.g. `out/about/index.html`, `out/portfolio/mynt-restaurant/index.html`).
2. In hPanel open **File Manager → public_html** (or connect over FTP).
3. Upload the **contents** of `out/` (not the folder itself), including the hidden `.htaccess` file —
   it also routes projects and articles created after the build.
4. Once SSL is active, uncomment the HTTPS redirect in `.htaccess`.

No Node.js server is needed — the browser talks to Supabase, WhatsApp and Web3Forms directly.

## Forms

| Form | Default behaviour | With `NEXT_PUBLIC_WEB3FORMS_KEY` |
| --- | --- | --- |
| Project inquiry (`/contact/`) | Opens WhatsApp with a formatted brief, or the visitor's email app | "Send via Email" posts to Web3Forms |
| Blog newsletter | Opens the visitor's email app | Posts to Web3Forms |

With Supabase connected, every project brief is also saved to **Project Inquiries** in the
dashboard, and visitors can attach up to five reference photos or PDFs.

To enable Web3Forms: create a free key at <https://web3forms.com>, add it to `.env.local`, then
rebuild. The key is inlined at build time.

## Editing content without the dashboard

These files hold the built-in content — what the site shows without Supabase, and what
"Import website content" copies into it.

| What | Where |
| --- | --- |
| Phone, email, address, social links, founder | `src/lib/site.ts` |
| All page copy (English & Arabic) | `src/lib/i18n/en.ts`, `src/lib/i18n/ar.ts` |
| Portfolio projects (each creates `/portfolio/[id]/`) | `src/lib/data/projects.ts` |
| Blog articles (each creates `/blog/[slug]/`) | `src/lib/data/posts.ts` |
| Services and process steps | `src/lib/data/services.ts` |
| Hero sliders (three project photos per page, 3 s each) | `src/lib/data/heroes.ts` |
| Section images | `src/lib/images.ts` |
| Brand colours & fonts | `tailwind.config.ts` |

In headings, wrap words in `*asterisks*` to render them as Champagne highlights.

### Images

Placeholder photography is loaded from Unsplash by photo ID. To use the studio's own photos, upload
them in the dashboard, or put them in `public/images/…` and use the path (e.g.
`/images/projects/al-safa/cover.jpg`) wherever an ID appears.

## Language (EN / AR)

The toggle switches all interface and page copy to Arabic and flips the layout to right-to-left;
the choice is remembered per visitor. Every CMS field has an English and an Arabic box; an empty
Arabic box falls back to the English text. Articles without an Arabic body show the English text
with a short notice. The dashboard itself is always English.

## Project structure

```
src/
  app/
    (site)/            public routes (/, about, portfolio, portfolio/[id], services, blog, blog/[slug], contact)
    admin/             dashboard routes (overview, settings, content, projects, services, blog, inquiries)
  components/
    admin/             dashboard shell, forms, uploader, media library, editors
    layout/            Navbar, Footer, Logo, LanguageToggle, WhatsAppWidget, SiteChrome
    ui/                Buttons, headings, PageHero, FilterBar, Lightbox, Counter, Reveal…
    home/ about/ portfolio/ services/ blog/ contact/   page sections
    shared/            CtaBanner, RouteStatus
    providers/         CmsProvider (live content), LanguageProvider (i18n + RTL)
  lib/
    cms/               Supabase CMS: hooks, fetchers, mappers, sections, storage, seed
    supabase/          Supabase client
                       site config, routes, data, i18n dictionaries, form helpers
supabase/migrations/   database schema, security policies, storage buckets, realtime
```
