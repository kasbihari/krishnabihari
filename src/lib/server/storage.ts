import crypto from 'node:crypto';
import { supabaseAdmin } from './supabase-admin';

/**
 * Public-read Supabase Storage bucket for project / portfolio images.
 * Must match the bucket created in
 * supabase/migrations/20260909_storage_bucket.sql.
 */
export const STORAGE_BUCKET = 'project-images';

/** Allowed image MIME types mapped to their file extension. */
export const IMAGE_MIME_ALLOWLIST: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

/** Maximum accepted upload size in bytes (kept under Vercel's ~4.5 MB body limit). */
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export type ImageScope = 'portfolio' | 'client';

export function isAllowedImageMime(mime: string): boolean {
  return Object.prototype.hasOwnProperty.call(IMAGE_MIME_ALLOWLIST, mime);
}

/**
 * Build a collision-safe, traversal-safe storage path.
 * The client filename is never used; the extension is derived from the
 * validated MIME type.
 */
export function buildStoragePath(
  scope: ImageScope,
  entityId: string,
  mime: string,
): string {
  const ext = IMAGE_MIME_ALLOWLIST[mime] ?? 'bin';
  const stamp = Date.now();
  const rand = crypto.randomBytes(6).toString('hex');
  return `${scope}/${entityId}/${stamp}-${rand}.${ext}`;
}

/** Full public URL for a stored object path. */
export function publicImageUrl(path: string): string {
  const base = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
  return `${base}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
}

/** True when the URL is a full public URL pointing into our bucket. */
export function isManagedImageUrl(url: string): boolean {
  const base = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
  if (!base) return false;
  const prefix = `${base}/storage/v1/object/public/${STORAGE_BUCKET}/`;
  return url.startsWith(prefix);
}

/** Inverse of publicImageUrl: extract the object path from a managed URL. */
export function extractStoragePathFromUrl(url: string): string | null {
  const base = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
  if (!base) return null;
  const prefix = `${base}/storage/v1/object/public/${STORAGE_BUCKET}/`;
  if (!url.startsWith(prefix)) return null;
  const path = url.slice(prefix.length);
  return path.length > 0 ? path : null;
}

/**
 * Upload an image to Supabase Storage and return its public URL.
 * Validates MIME type and size server-side.
 */
export async function uploadImage(
  scope: ImageScope,
  entityId: string,
  file: { name: string; type: string; size: number; arrayBuffer: () => Promise<ArrayBuffer> },
): Promise<{ url: string } | { error: string }> {
  if (!supabaseAdmin) {
    return { error: 'Supabase is not configured.' };
  }

  const mime = file.type;
  if (!isAllowedImageMime(mime)) {
    return { error: 'Unsupported file type. Use JPEG, PNG, WebP, GIF or AVIF.' };
  }

  if (file.size <= 0) {
    return { error: 'The uploaded file is empty.' };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { error: 'Image is too large. Maximum size is 4 MB.' };
  }

  const path = buildStoragePath(scope, entityId, mime);

  let bytes: ArrayBuffer;
  try {
    bytes = await file.arrayBuffer();
  } catch {
    return { error: 'Unable to read the uploaded file.' };
  }

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(path, bytes, { contentType: mime, upsert: false });

  if (error) {
    return { error: `Upload failed: ${error.message}` };
  }

  return { url: publicImageUrl(path) };
}

/**
 * Delete a single managed image by its public URL. No-op for URLs that do
 * not point into our bucket (external images are left untouched).
 */
export async function deleteImageByUrl(
  url: string,
): Promise<{ ok: true } | { error: string }> {
  if (!supabaseAdmin) {
    return { error: 'Supabase is not configured.' };
  }

  const path = extractStoragePathFromUrl(url);
  if (!path) {
    // Not one of ours — nothing to delete.
    return { ok: true };
  }

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .remove([path]);

  if (error) {
    return { error: `Delete failed: ${error.message}` };
  }

  return { ok: true };
}

/**
 * Best-effort cleanup of managed images that are no longer referenced.
 * Deletes any managed URL present in `previousUrls` but absent from
 * `nextUrls`. Failures are logged, never thrown.
 */
export async function deleteOrphanedImages(
  previousUrls: string[],
  nextUrls: string[],
): Promise<void> {
  const next = new Set(nextUrls);
  const toDelete = previousUrls.filter(
    (url) => isManagedImageUrl(url) && !next.has(url),
  );
  await deleteManagedUrls(toDelete);
}

/** Best-effort removal of every managed URL in the list (e.g. on project delete). */
export async function deleteAllManagedImages(urls: string[]): Promise<void> {
  await deleteManagedUrls(urls.filter((url) => isManagedImageUrl(url)));
}

async function deleteManagedUrls(urls: string[]): Promise<void> {
  if (urls.length === 0 || !supabaseAdmin) return;

  const paths = urls
    .map((url) => extractStoragePathFromUrl(url))
    .filter((p): p is string => p !== null);

  if (paths.length === 0) return;

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .remove(paths);

  if (error) {
    console.error('Failed to remove managed images:', error.message);
  }
}
