const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';
const BASE = `${BACKEND}/api/v1`;

/**
 * Rich error thrown by `api.*` helpers when the response is not OK.
 * Exposes `status` and the full parsed `body` so callers can branch on
 * domain-specific fields like `code` or `affectedBulkListings`.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly body: Record<string, unknown>;
  constructor(status: number, body: Record<string, unknown>) {
    const msg =
      typeof body.message === 'string'
        ? body.message
        : Array.isArray(body.message)
          ? body.message.join(', ')
          : `HTTP ${status}`;
    super(msg);
    this.status = status;
    this.body = body;
    this.name = 'ApiError';
  }
}

// ── Core fetch helpers ────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) ?? {}),
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  // 204 No Content → no body to parse
  if (res.status === 204) return undefined as T;

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body as Record<string, unknown>);
  }

  const json = (await res.json()) as { data: T };
  return json.data;
}

export const api = {
  get: <T>(path: string, token?: string | null) =>
    request<T>(path, { method: 'GET' }, token),

  post: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }, token),

  patch: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(
      path,
      { method: 'PATCH', body: body ? JSON.stringify(body) : undefined },
      token,
    ),

  put: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(
      path,
      { method: 'PUT', body: body ? JSON.stringify(body) : undefined },
      token,
    ),

  delete: <T = void>(path: string, token?: string | null) =>
    request<T>(path, { method: 'DELETE' }, token),
};

// ── GET with query params + AbortSignal (dùng cho /search) ────────────────────

/**
 * GET helper hỗ trợ query params (skip undefined/empty) và AbortSignal.
 * Public endpoint — không gửi Authorization. Vẫn unwrap envelope `{data}` như request().
 */
export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
  signal?: AbortSignal,
): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.set(k, String(v));
      }
    }
  }

  const res = await fetch(url.toString(), {
    signal,
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body as Record<string, unknown>);
  }

  const json = (await res.json()) as { data: T };
  return json.data;
}

// ── Storage uploads via backend ───────────────────────────────────────────────

export type StorageImageType =
  | 'product'
  | 'ads'
  | 'reviews'
  | 'profile'
  | 'cccd'
  | 'business_license'
  | 'document'
  | 'avatar'
  | `avatar_${string}`;

interface StorageImageUploadResult {
  secure_url: string;
}

interface StorageDocumentUploadResult {
  path: string;
  fullPath: string;
}

interface StorageDownloadUrlResult {
  path: string;
  signedUrl: string;
  expiresIn: number;
}

async function uploadForm<T>(
  path: string,
  form: FormData,
  token?: string | null,
): Promise<T> {
  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers,
    body: form,
  });

  const json = (await res.json().catch(() => ({}))) as { data?: T } & Record<string, unknown>;

  if (!res.ok) {
    throw new ApiError(res.status, json);
  }

  return (json.data ?? json) as T;
}

export async function uploadImageToStorage(
  file: File,
  type: StorageImageType = 'product',
  token?: string | null,
): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  form.append('type', type);

  const data = await uploadForm<StorageImageUploadResult>(
    '/storage/images/upload',
    form,
    token,
  );

  return data.secure_url;
}

export async function uploadDocumentToStorage(
  file: File,
  path: string,
  token?: string | null,
): Promise<StorageDocumentUploadResult> {
  const form = new FormData();
  form.append('file', file);
  form.append('path', path);

  return uploadForm<StorageDocumentUploadResult>(
    '/storage/files/upload',
    form,
    token,
  );
}

export async function getDocumentDownloadUrl(
  path: string,
  token?: string | null,
): Promise<StorageDownloadUrlResult> {
  return api.get<StorageDownloadUrlResult>(
    `/storage/files/download-url?path=${encodeURIComponent(path)}`,
    token,
  );
}

// ── Cloudinary upload (forum editor, etc.) ──────────────────────────────────────

export async function uploadToCloudinary(
  file: File,
  folder: 'ads' | 'reviews' | 'products' | 'profiles' | 'forum' | 'misc' = 'misc',
): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? '');
  form.append('folder', folder);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: form },
  );
  const data = await res.json();
  return data.secure_url;
}
