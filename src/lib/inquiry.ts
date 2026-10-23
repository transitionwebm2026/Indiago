import type { ServiceId } from '@/lib/data/services';
import { en } from '@/lib/i18n/en';

const options = en.contact.form.options;

export type PropertyType = keyof typeof options.propertyType;
export type PropertyStatus = keyof typeof options.status;
export type BudgetRange = keyof typeof options.budget;
export type StartTimeline = keyof typeof options.timeline;

export interface InquiryData {
  name: string;
  phone: string;
  email: string;
  propertyType: PropertyType | '';
  status: PropertyStatus | '';
  area: string;
  location: string;
  services: ServiceId[];
  budget: BudgetRange | '';
  timeline: StartTimeline | '';
  references: string;
  notes: string;
}

export const emptyInquiry: InquiryData = {
  name: '',
  phone: '',
  email: '',
  propertyType: '',
  status: '',
  area: '',
  location: '',
  services: [],
  budget: '',
  timeline: '',
  references: '',
  notes: '',
};

const serviceTitle = (id: ServiceId) => en.services.items.find((item) => item.id === id)?.title ?? id;

/**
 * Field values for the studio, always in English so every brief reads the same
 * regardless of the language the visitor browsed in.
 */
export function inquiryFields(data: InquiryData): Record<string, string> {
  return {
    Name: data.name.trim(),
    'Phone / WhatsApp': data.phone.trim(),
    Email: data.email.trim() || '—',
    'Property type': data.propertyType ? options.propertyType[data.propertyType] : '—',
    'Property status': data.status ? options.status[data.status] : '—',
    Area: data.area ? `${data.area.trim()} sqm` : '—',
    Location: data.location.trim() || '—',
    Services: data.services.map(serviceTitle).join(', ') || '—',
    Budget: data.budget ? options.budget[data.budget] : '—',
    'Preferred start': data.timeline ? options.timeline[data.timeline] : '—',
    References: data.references.trim() || '—',
    Notes: data.notes.trim() || '—',
  };
}

/** Formats the brief as a WhatsApp message (WhatsApp renders *text* as bold). */
export function buildInquiryMessage(data: InquiryData) {
  const f = inquiryFields(data);
  const line = (label: string) => (f[label] && f[label] !== '—' ? `${label}: ${f[label]}` : null);

  return [
    '*New Project Inquiry — Indigo Interiors*',
    '',
    '*1. Contact Details*',
    line('Name'),
    line('Phone / WhatsApp'),
    line('Email'),
    '',
    '*2. Property Details*',
    line('Property type'),
    line('Property status'),
    line('Area'),
    line('Location'),
    '',
    '*3. Scope & Budget*',
    line('Services'),
    line('Budget'),
    '',
    '*4. Timeline & References*',
    line('Preferred start'),
    f.References !== '—' ? `References:\n${f.References}` : null,
    line('Notes'),
  ]
    .filter((entry): entry is string => entry !== null)
    .join('\n');
}
