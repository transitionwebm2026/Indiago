'use client';

import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { toast } from 'sonner';
import { socialIcons } from '@/components/icons/SocialIcons';
import { adminKeys, fetchContentRows, fetchSettingsRow, friendlyError, saveSettings } from '@/lib/cms/admin';
import { cmsKeys } from '@/lib/cms/api';
import { rowToSettings } from '@/lib/cms/mappers';
import { deepEqual } from '@/lib/cms/merge';
import { navLinkKeys, sectionsByKey } from '@/lib/cms/sections';
import { defaultSiteSettings, resolveSite, socialPlatforms, type NavLink, type SiteSettings, type SocialId, type SocialLink } from '@/lib/site';
import { isValidEmail } from '@/lib/utils';
import { ContentSectionEditor } from '../ContentSectionEditor';
import { BilingualInput, ListControls } from '../fields';
import { RequireInitialized } from '../ImportContent';
import { ImageField } from '../MediaField';
import { AdminButton, Card, Field, PageHeader, SaveBar, Select, Spinner, Tabs, TextArea, TextInput, Toggle, moveItem, useUnsavedWarning } from '../ui';

type Tab = 'brand' | 'navigation' | 'contact' | 'map' | 'social' | 'founder' | 'footer';

const tabs: { value: Tab; label: string }[] = [
  { value: 'brand', label: 'Brand & Logo' },
  { value: 'navigation', label: 'Navigation' },
  { value: 'contact', label: 'Contact' },
  { value: 'map', label: 'Map' },
  { value: 'social', label: 'Social' },
  { value: 'founder', label: 'Founder' },
  { value: 'footer', label: 'Footer' },
];

const platformLabels: Record<SocialId, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  x: 'X (Twitter)',
  youtube: 'YouTube',
  whatsapp: 'WhatsApp',
  website: 'Website',
};

/** Accepts either a Google Maps embed URL or the whole <iframe> snippet from "Share → Embed a map". */
function extractEmbedSrc(input: string) {
  const match = /src=["']([^"']+)["']/i.exec(input);
  return (match ? match[1] : input).trim();
}

function validate(settings: SiteSettings): string | null {
  if (settings.email && !isValidEmail(settings.email)) return 'The email address doesn’t look right.';
  if (settings.whatsappNumber && settings.whatsappNumber.replace(/\D/g, '').length < 8) return 'The WhatsApp number needs the country code, e.g. 201119777662.';
  if (settings.nav.some((link) => !link.href.trim() || !link.label.en.trim())) return 'Every menu link needs an English name and an address.';
  if (settings.social.some((link) => !link.href.trim())) return 'Every social profile needs a link.';
  return null;
}

export function SettingsView() {
  return (
    <>
      <PageHeader title="Global Settings" description="Studio details used across the whole website: logo, menu, contact information, map, social profiles and footer." />
      <RequireInitialized>
        <SettingsForm />
      </RequireInitialized>
    </>
  );
}

function SettingsForm() {
  const { mutate } = useSWRConfig();
  const { data: row, error } = useSWR(adminKeys.settings, fetchSettingsRow);
  const initial = useMemo(() => (row ? rowToSettings(row) : row === null ? defaultSiteSettings : null), [row]);
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [tab, setTab] = useState<Tab>('brand');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial && !form) setForm(initial);
  }, [initial, form]);

  const dirty = Boolean(form && initial && !deepEqual(form, initial));
  useUnsavedWarning(dirty);

  if (error) return <p className="rounded-2xl bg-error/10 p-4 text-sm text-error">{friendlyError(error)}</p>;
  if (!form) {
    return (
      <div className="grid h-64 place-items-center">
        <Spinner />
      </div>
    );
  }

  const set = (change: Partial<SiteSettings>) => setForm((current) => (current ? { ...current, ...change } : current));

  const save = async () => {
    const problem = validate(form);
    if (problem) {
      toast.error('Please check the form', { description: problem });
      return;
    }
    setSaving(true);
    try {
      await saveSettings(form);
      await Promise.all([mutate(adminKeys.settings), mutate(cmsKeys.settings)]);
      toast.success('Settings saved', { description: 'The website updates for visitors straight away.' });
    } catch (saveError) {
      toast.error('Couldn’t save settings', { description: friendlyError(saveError) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs label="Settings sections" tabs={tabs} value={tab} onChange={setTab} />

      {tab === 'brand' && <BrandTab form={form} set={set} />}
      {tab === 'navigation' && <NavigationTab form={form} set={set} />}
      {tab === 'contact' && <ContactTab form={form} set={set} />}
      {tab === 'map' && <MapTab form={form} set={set} />}
      {tab === 'social' && <SocialTab form={form} set={set} />}
      {tab === 'founder' && <FounderTab form={form} set={set} />}
      {tab === 'footer' && <FooterTab form={form} set={set} />}

      <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={() => initial && setForm(initial)} saveLabel="Save settings" />
    </div>
  );
}

interface TabProps {
  form: SiteSettings;
  set: (change: Partial<SiteSettings>) => void;
}

function BrandTab({ form, set }: TabProps) {
  return (
    <Card title="Brand & logo" description="How the studio is named and shown at the top of every page.">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Studio name" htmlFor="site-name" hint="Used for the logo’s alt text and email subjects.">
            <TextInput id="site-name" value={form.name} onChange={(event) => set({ name: event.target.value })} />
          </Field>
          <Field label="Website address" htmlFor="site-url" hint="The live domain, e.g. https://www.indigoegy.com">
            <TextInput id="site-url" type="url" value={form.url} onChange={(event) => set({ url: event.target.value })} />
          </Field>
        </div>
        <ImageField
          label="Logo"
          folder="site"
          aspect="aspect-[5/2]"
          optional
          value={form.logo}
          onChange={(logo) => set({ logo })}
          hint="Shown in the header, footer and map card on Deep Indigo. Use a transparent PNG or SVG in Champagne/light colours. Leave empty to keep the built-in Indigo wordmark."
        />
      </div>
    </Card>
  );
}

function NavigationTab({ form, set }: TabProps) {
  const update = (index: number, change: Partial<NavLink>) => set({ nav: form.nav.map((link, i) => (i === index ? { ...link, ...change } : link)) });

  return (
    <Card
      title="Menu links"
      description="The links in the header, the mobile menu and the footer. Hide a page with the switch, change the order with the arrows."
    >
      <div className="space-y-3">
        {form.nav.map((link, index) => {
          const builtIn = navLinkKeys.includes(link.id);
          return (
            <div key={link.id} className="rounded-2xl border border-indigo/10 bg-linen/40 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <Toggle label={builtIn ? `Page link ${index + 1}` : `Custom link ${index + 1}`} checked={link.visible} onChange={(visible) => update(index, { visible })} />
                {/* Built-in pages can be hidden but not deleted, so they can always be brought back. */}
                <ListControls
                  index={index}
                  count={form.nav.length}
                  noun="link"
                  onMove={(to) => set({ nav: moveItem(form.nav, index, to) })}
                  onRemove={builtIn ? undefined : () => set({ nav: form.nav.filter((_, i) => i !== index) })}
                />

              </div>
              <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                <BilingualInput label="Link name" value={link.label} onChange={(label) => update(index, { label })} />
                <Field label="Goes to" hint={builtIn ? 'Built-in page.' : 'A page like /about/ or a full address https://…'}>
                  <TextInput value={link.href} disabled={builtIn} onChange={(event) => update(index, { href: event.target.value })} placeholder="/contact/" />
                </Field>
              </div>
            </div>
          );
        })}
        <AdminButton
          variant="secondary"
          size="sm"
          icon={Plus}
          onClick={() => set({ nav: [...form.nav, { id: `link-${Date.now().toString(36)}`, href: '', label: { en: '', ar: '' }, visible: true }] })}
        >
          Add custom link
        </AdminButton>
      </div>
      <div className="mt-6 border-t border-indigo/5 pt-5">
        <Toggle
          label="Show the “Request Consultation” button in the header"
          description="The button text itself is edited in Pages Content → Shared → Header & menu."
          checked={form.showNavCta}
          onChange={(showNavCta) => set({ showNavCta })}
        />
      </div>
    </Card>
  );
}

function ContactTab({ form, set }: TabProps) {
  return (
    <Card title="Contact information" description="Shown in the footer, the contact page, the call button and the WhatsApp widget.">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Email" htmlFor="email">
            <TextInput id="email" type="email" value={form.email} onChange={(event) => set({ email: event.target.value })} />
          </Field>
          <Field label="WhatsApp number" htmlFor="whatsapp" hint="Digits only, with the country code — e.g. 201119777662.">
            <TextInput id="whatsapp" inputMode="numeric" dir="ltr" value={form.whatsappNumber} onChange={(event) => set({ whatsappNumber: event.target.value.replace(/[^\d]/g, '') })} />
          </Field>
          <Field label="Phone · Egypt" htmlFor="phone" hint="Written as visitors should see it, e.g. +20 111 977 7662.">
            <TextInput id="phone" type="tel" dir="ltr" value={form.phone} onChange={(event) => set({ phone: event.target.value })} />
          </Field>
          <Field label="Phone · UAE" htmlFor="phone-uae" optional hint="Leave empty to hide it everywhere.">
            <TextInput id="phone-uae" type="tel" dir="ltr" value={form.uaePhone} onChange={(event) => set({ uaePhone: event.target.value })} />
          </Field>
        </div>
        <BilingualInput label="Studio address" value={form.address} onChange={(address) => set({ address })} />
      </div>
    </Card>
  );
}

/** Keeps what's typed (e.g. "30.") as text, and reports a number only once it parses. */
function CoordinateInput({ id, value, onChange, placeholder }: { id: string; value: number | null; onChange: (value: number | null) => void; placeholder: string }) {
  const [text, setText] = useState(value === null ? '' : String(value));
  return (
    <TextInput
      id={id}
      inputMode="decimal"
      dir="ltr"
      value={text}
      placeholder={placeholder}
      onChange={(event) => {
        const next = event.target.value;
        setText(next);
        onChange(next.trim() === '' || Number.isNaN(Number(next)) ? null : Number(next));
      }}
    />
  );
}

function MapTab({ form, set }: TabProps) {
  const resolved = resolveSite(form);
  const setMap = (change: Partial<SiteSettings['map']>) => set({ map: { ...form.map, ...change } });

  return (
    <Card title="Map" description="The map on the contact page and every “Get Directions” link.">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Field label="Location to show" htmlFor="map-query" hint="An address or place name, exactly as you would type it into Google Maps.">
            <TextInput id="map-query" value={form.map.query} onChange={(event) => setMap({ query: event.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Latitude" htmlFor="map-lat" optional hint="Pins an exact point.">
              <CoordinateInput id="map-lat" value={form.map.lat} onChange={(lat) => setMap({ lat })} placeholder="30.0444" />
            </Field>
            <Field label="Longitude" htmlFor="map-lng" optional>
              <CoordinateInput id="map-lng" value={form.map.lng} onChange={(lng) => setMap({ lng })} placeholder="31.2357" />
            </Field>
          </div>
          <Field
            label="Custom Google Maps embed"
            htmlFor="map-embed"
            optional
            hint="In Google Maps choose Share → Embed a map → Copy HTML, and paste it here. Overrides the location above for the map itself."
          >
            <TextArea id="map-embed" rows={3} dir="ltr" value={form.map.embedUrl} onChange={(event) => setMap({ embedUrl: extractEmbedSrc(event.target.value) })} placeholder="<iframe src=&quot;https://www.google.com/maps/embed?…&quot;></iframe>" />
          </Field>
        </div>
        <div>
          <p className="mb-1.5 text-sm font-medium text-indigo">Preview</p>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-indigo/10 bg-linen">
            <iframe title="Map preview" src={resolved.mapsEmbedUrl} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <a href={resolved.mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-champagne-800 underline-offset-2 hover:underline">
            Test the “Get Directions” link ↗
          </a>
        </div>
      </div>
    </Card>
  );
}

function SocialTab({ form, set }: TabProps) {
  const update = (index: number, change: Partial<SocialLink>) => set({ social: form.social.map((link, i) => (i === index ? { ...link, ...change } : link)) });

  return (
    <Card title="Social profiles" description="Icons in the footer and the “Follow us” rail on every hero.">
      <div className="space-y-3">
        {form.social.map((link, index) => {
          const Icon = socialIcons[link.id];
          return (
            <div key={index} className="grid items-end gap-3 rounded-2xl border border-indigo/10 bg-linen/40 p-4 md:grid-cols-[auto_12rem_1fr_auto]">
              <span className="hidden h-11 w-11 place-items-center rounded-xl bg-indigo text-champagne md:grid">
                <Icon className="h-5 w-5" />
              </span>
              <Field label="Platform">
                <Select value={link.id} onChange={(event) => update(index, { id: event.target.value as SocialId, label: platformLabels[event.target.value as SocialId] })}>
                  {socialPlatforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platformLabels[platform]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Profile link">
                <TextInput type="url" dir="ltr" value={link.href} onChange={(event) => update(index, { href: event.target.value })} placeholder="https://www.instagram.com/…" />
              </Field>
              <div className="flex items-center gap-2 pb-1">
                <Toggle label={<span className="sr-only">Visible</span>} checked={link.visible} onChange={(visible) => update(index, { visible })} />
                <ListControls
                  index={index}
                  count={form.social.length}
                  noun="profile"
                  onMove={(to) => set({ social: moveItem(form.social, index, to) })}
                  onRemove={() => set({ social: form.social.filter((_, i) => i !== index) })}
                />
              </div>
            </div>
          );
        })}
        <AdminButton
          variant="secondary"
          size="sm"
          icon={Plus}
          onClick={() => set({ social: [...form.social, { id: 'instagram', label: 'Instagram', href: '', visible: true }] })}
        >
          Add profile
        </AdminButton>
      </div>
    </Card>
  );
}

function FounderTab({ form, set }: TabProps) {
  const founder = form.founder;
  const setFounder = (change: Partial<SiteSettings['founder']>) => set({ founder: { ...founder, ...change } });

  return (
    <Card title="Founder" description="Shown on the home page, the About page, the contact page and as the byline on the founder’s articles. The biography is in Pages Content → About.">
      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <BilingualInput label="Name" value={founder.name} onChange={(name) => setFounder({ name })} />
          <BilingualInput label="Title" value={founder.role} onChange={(role) => setFounder({ role })} />
          <Field label="Initials" htmlFor="initials" hint="Shown in a circle when there is no portrait.">
            <TextInput id="initials" maxLength={3} value={founder.initials} onChange={(event) => setFounder({ initials: event.target.value.toUpperCase() })} className="max-w-[6rem]" />
          </Field>
        </div>
        <ImageField label="Portrait" folder="team" aspect="aspect-[4/5]" optional value={founder.portrait} onChange={(portrait) => setFounder({ portrait })} hint="A portrait (4:5) photo works best." />
      </div>
    </Card>
  );
}

function FooterTab({ form, set }: TabProps) {
  const { mutate } = useSWRConfig();
  const { data: rows } = useSWR(adminKeys.content, fetchContentRows);
  const [open, setOpen] = useState(true);
  const section = sectionsByKey.get('footer');
  const credit = form.credit;
  const setCredit = (change: Partial<SiteSettings['credit']>) => set({ credit: { ...credit, ...change } });

  return (
    <div className="space-y-6">
      <Card title="Copyright & credit" description="The bottom row of the footer.">
        <div className="space-y-6">
          <Field label="Copyright year" htmlFor="copyright-year">
            <TextInput
              id="copyright-year"
              type="number"
              value={form.copyrightYear}
              onChange={(event) => set({ copyrightYear: Number(event.target.value) || new Date().getFullYear() })}
              className="max-w-[8rem]"
            />
          </Field>
          <Toggle label="Show the website credit" checked={credit.visible} onChange={(visible) => setCredit({ visible })} />
          {credit.visible && (
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Credit name" htmlFor="credit-name">
                <TextInput id="credit-name" value={credit.name} onChange={(event) => setCredit({ name: event.target.value })} />
              </Field>
              <Field label="Credit link" htmlFor="credit-url">
                <TextInput id="credit-url" type="url" dir="ltr" value={credit.href} onChange={(event) => setCredit({ href: event.target.value })} />
              </Field>
              <ImageField label="Credit logo" folder="site" optional compact value={credit.logo} onChange={(logo) => setCredit({ logo })} />
            </div>
          )}
        </div>
      </Card>

      {section && rows && (
        <div>
          <p className="mb-2 text-xs text-charcoal-muted">Footer text is saved separately with its own button:</p>
          <ContentSectionEditor
            key={rows.find((row) => row.section === 'footer')?.updated_at ?? 'default'}
            section={section}
            row={rows.find((row) => row.section === 'footer')}
            projects={[]}
            open={open}
            onToggle={() => setOpen((value) => !value)}
            onSaved={() => {
              void mutate(adminKeys.content);
              void mutate(cmsKeys.content);
            }}
          />
        </div>
      )}
    </div>
  );
}
