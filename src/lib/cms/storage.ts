import { loadSupabase, supabaseAnonKey, supabaseUrl } from '@/lib/supabase/config';
import { uuid } from './ids';

export const MEDIA_BUCKET = 'media';
export const INQUIRY_BUCKET = 'inquiry-files';

/** Top-level folders of the `media` bucket, one per part of the dashboard. */
export const mediaFolders = ['site', 'projects', 'blog', 'services', 'team'] as const;
export type MediaFolder = (typeof mediaFolders)[number];

export const MAX_MEDIA_BYTES = 50 * 1024 * 1024;

export function publicMediaUrl(path: string) {
  return `${supabaseUrl}/storage/v1/object/public/${MEDIA_BUCKET}/${path.split('/').map(encodeURIComponent).join('/')}`;
}

/** "Living Room (Final).JPG" → "living-room-final.jpg" */
export function safeFileName(name: string) {
  const dot = name.lastIndexOf('.');
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  const extension = dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, '') : '';
  return `${base || 'file'}${extension ? `.${extension}` : ''}`;
}

const OPTIMIZABLE = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Photos straight from a camera or phone are often 5–15 MB. Large JPEG/PNG/WebP images are
 * scaled down to `maxDimension` and re-encoded as WebP, which keeps the website fast.
 * Anything that wouldn't get smaller is uploaded untouched.
 */
export async function optimizeImage(file: File, maxDimension = 2560, quality = 0.86): Promise<File> {
  if (!OPTIMIZABLE.includes(file.type) || typeof createImageBitmap !== 'function') return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 1.5 * 1024 * 1024) {
      bitmap.close();
      return file;
    }
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
    if (!blob || blob.type !== 'image/webp' || blob.size >= file.size) return file;
    const name = file.name.replace(/\.[^.]+$/, '') + '.webp';
    return new File([blob], name, { type: 'image/webp', lastModified: Date.now() });
  } catch {
    return file;
  }
}

export class UploadError extends Error {}

interface UploadOptions {
  bucket: string;
  path: string;
  file: File;
  /** Access token of the signed-in admin, or the anon key for visitors. */
  token: string;
  onProgress?: (fraction: number) => void;
  signal?: AbortSignal;
}

/**
 * Uploads straight to Supabase Storage over XHR — unlike fetch, XHR reports upload
 * progress, which drives the progress bars in the dashboard and the inquiry form.
 */
export function uploadToStorage({ bucket, path, file, token, onProgress, signal }: UploadOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const encodedPath = path.split('/').map(encodeURIComponent).join('/');
    xhr.open('POST', `${supabaseUrl}/storage/v1/object/${bucket}/${encodedPath}`);
    xhr.setRequestHeader('apikey', supabaseAnonKey);
    xhr.setRequestHeader('authorization', `Bearer ${token}`);
    xhr.setRequestHeader('x-upsert', 'false');
    xhr.setRequestHeader('cache-control', 'max-age=31536000');
    xhr.setRequestHeader('content-type', file.type || 'application/octet-stream');

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(event.loaded / event.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(1);
        resolve();
        return;
      }
      let message = `Upload failed (${xhr.status})`;
      try {
        const body = JSON.parse(xhr.responseText) as { message?: string; error?: string };
        message = body.message || body.error || message;
      } catch {
        // Non-JSON error page — keep the status message.
      }
      if (/mime type/i.test(message)) message = 'This file type is not allowed here.';
      if (/maximum allowed size|payload too large/i.test(message) || xhr.status === 413) message = 'This file is too large.';
      if (xhr.status === 403 || /row-level security|unauthorized/i.test(message)) message = 'Permission denied — please sign in again.';
      reject(new UploadError(message));
    };
    xhr.onerror = () => reject(new UploadError('Network error — check your connection and try again.'));
    xhr.onabort = () => reject(new UploadError('Upload cancelled.'));
    signal?.addEventListener('abort', () => xhr.abort());
    xhr.send(file);
  });
}

/** Admin upload into the public `media` bucket; resolves to the file's public URL. */
export async function uploadMedia(
  file: File,
  folder: MediaFolder,
  options: { onProgress?: (fraction: number) => void; signal?: AbortSignal; optimize?: boolean } = {},
): Promise<string> {
  const supabase = await loadSupabase();
  if (!supabase) throw new UploadError('Supabase is not configured.');
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new UploadError('Your session has expired — please sign in again.');

  const prepared = options.optimize === false ? file : await optimizeImage(file);
  if (prepared.size > MAX_MEDIA_BYTES) throw new UploadError('Files must be smaller than 50 MB.');

  const path = `${folder}/${Date.now().toString(36)}-${uuid().slice(0, 8)}-${safeFileName(prepared.name)}`;
  await uploadToStorage({ bucket: MEDIA_BUCKET, path, file: prepared, token, onProgress: options.onProgress, signal: options.signal });
  return publicMediaUrl(path);
}

/** Path inside the `media` bucket for one of its public URLs, or null for any other address. */
export function mediaPathFromUrl(url: string) {
  const prefix = `${supabaseUrl}/storage/v1/object/public/${MEDIA_BUCKET}/`;
  return url.startsWith(prefix) ? decodeURIComponent(url.slice(prefix.length)) : null;
}

export interface MediaItem {
  path: string;
  url: string;
  name: string;
  folder: MediaFolder;
  size: number;
  type: string;
  createdAt: string;
}

/** The media library: every uploaded file, newest first. */
export async function listMedia(): Promise<MediaItem[]> {
  const supabase = await loadSupabase();
  if (!supabase) return [];
  const lists = await Promise.all(
    mediaFolders.map(async (folder) => {
      const { data, error } = await supabase.storage
        .from(MEDIA_BUCKET)
        .list(folder, { limit: 500, sortBy: { column: 'created_at', order: 'desc' } });
      if (error) throw new Error(error.message);
      return (data ?? [])
        .filter((item) => item.id && !item.name.startsWith('.'))
        .map((item) => {
          const metadata = (item.metadata ?? {}) as { size?: number; mimetype?: string };
          const path = `${folder}/${item.name}`;
          return {
            path,
            url: publicMediaUrl(path),
            name: item.name.replace(/^[a-z0-9]+-[a-f0-9]{8}-/, ''),
            folder,
            size: metadata.size ?? 0,
            type: metadata.mimetype ?? '',
            createdAt: item.created_at ?? '',
          } satisfies MediaItem;
        });
    }),
  );
  return lists.flat().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function deleteMedia(paths: string[]) {
  const supabase = await loadSupabase();
  if (!supabase || paths.length === 0) return;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove(paths);
  if (error) throw new Error(error.message);
}
