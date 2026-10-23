# Indigo Interiors — Website

Luxury interior architecture studio website for **Indigo Interiors** (Sheikh Zayed, Egypt), built with
Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS and Framer Motion. The site is a fully
static export, ready to upload to Hostinger shared hosting.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site generated in /out
npm run preview    # serve /out locally to check the production build
```

## Deploying to Hostinger

1. Run `npm run build`. Next.js writes the complete site to `out/` (one `index.html` per route,
   e.g. `out/about/index.html`, `out/portfolio/al-safa-villa/index.html`).
2. In hPanel open **File Manager → public_html** (or connect over FTP).
3. Upload the **contents** of `out/` (not the folder itself), including the hidden `.htaccess` file.
4. Once SSL is active, uncomment the HTTPS redirect in `.htaccess`.

No Node.js server is needed — forms talk to WhatsApp / Web3Forms directly from the browser.

## Forms

| Form | Default behaviour | With `NEXT_PUBLIC_WEB3FORMS_KEY` |
| --- | --- | --- |
| Project inquiry (`/contact/`) | Opens WhatsApp with a formatted brief, or the visitor's email app | "Send via Email" posts to Web3Forms |
| Blog newsletter | Opens the visitor's email app | Posts to Web3Forms |

To enable Web3Forms: create a free key at <https://web3forms.com>, copy `.env.example` to
`.env.local`, paste the key, then rebuild. The key is inlined at build time.

## Editing content

| What | Where |
| --- | --- |
| Phone, email, address, social links | `src/lib/site.ts` |
| All page copy (English & Arabic) | `src/lib/i18n/en.ts`, `src/lib/i18n/ar.ts` |
| Portfolio projects (each creates `/portfolio/[id]/`) | `src/lib/data/projects.ts` |
| Blog articles (each creates `/blog/[slug]/`) | `src/lib/data/posts.ts` |
| Service images | `src/lib/data/services.ts` |
| Hero sliders (three project photos per page, 3 s each) | `src/lib/data/heroes.ts` |
| Section images | `src/lib/images.ts` |
| Brand colours & fonts | `tailwind.config.ts` |

In headings, wrap words in `*asterisks*` to render them as Champagne highlights.

### Images

Placeholder photography is loaded from Unsplash by photo ID. To use the studio's own photos, put
them in `public/images/…` and use the path (e.g. `/images/projects/al-safa/cover.jpg`) wherever an
ID appears. The founder portrait is set via `site.founder.portrait`; until then an elegant monogram
is shown.

## Language (EN / AR)

The toggle switches all interface and page copy to Arabic and flips the layout to right-to-left;
the choice is remembered per visitor. Project and article titles and summaries are bilingual;
long-form article bodies and project concept text are English-only and show a notice in Arabic mode.

## Project structure

```
src/
  app/                 routes (/, about, portfolio, portfolio/[id], services, blog, blog/[slug], contact)
  components/
    layout/            Navbar, Footer, Logo, LanguageToggle, WhatsAppWidget
    ui/                Buttons, headings, PageHero, FilterBar, Lightbox, Counter, Reveal…
    home/ about/ portfolio/ services/ blog/ contact/   page sections
    shared/            CtaBanner
    providers/         LanguageProvider (i18n + RTL + reduced-motion config)
  lib/                 site config, routes, data, i18n dictionaries, form helpers
```
