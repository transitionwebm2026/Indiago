import type { Locale } from '@/lib/i18n';
import { referenceLinks, type InquiryData } from '@/lib/inquiry';
import { loadSupabase, supabaseAnonKey } from '@/lib/supabase/config';
import { INQUIRY_BUCKET, safeFileName, uploadToStorage } from './storage';
import type { InquiryFile } from './types';

/** Visitors' reference files: a few photos or PDFs, kept in the private `inquiry-files` bucket. */
export const INQUIRY_FILE_LIMIT = 5;
export const INQUIRY_FILE_BYTES = 10 * 1024 * 1024;
export const INQUIRY_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'];

export function uploadInquiryFile(inquiryId: string, file: File, onProgress?: (fraction: number) => void): Promise<InquiryFile> {
  const path = `inquiries/${inquiryId}/${Date.now().toString(36)}-${safeFileName(file.name)}`;
  return uploadToStorage({ bucket: INQUIRY_BUCKET, path, file, token: supabaseAnonKey, onProgress }).then(() => ({
    path,
    name: file.name,
    size: file.size,
    type: file.type,
  }));
}

/**
 * Saves the brief to the studio's inbox. Visitors can insert but never read inquiries back,
 * so the row is written without returning it. Resolves false on failure — the brief has
 * already gone out by WhatsApp or email, so the visitor isn't blocked.
 */
export async function saveInquiry(id: string, data: InquiryData, files: InquiryFile[], locale: Locale): Promise<boolean> {
  const supabase = await loadSupabase();
  if (!supabase) return false;
  const area = Number(data.area);
  const { error } = await supabase.from('project_inquiries').insert({
    id,
    client_name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email.trim(),
    property_type: data.propertyType,
    property_status: data.status,
    property_area: area > 0 ? area : null,
    location: data.location.trim(),
    services: data.services,
    budget: data.budget,
    timeline: data.timeline,
    reference_links: referenceLinks(data.references),
    reference_files: files,
    notes: data.notes.trim(),
    locale,
  });
  if (error) console.warn('Could not save the inquiry to the CMS:', error.message);
  return !error;
}
