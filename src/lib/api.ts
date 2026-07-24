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

// ── Auto-refresh token ────────────────────────────────────────────────────────

let refreshPromise: Promise<string | null> | null = null;

async function tryRefreshToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) return null;
      const json = await res.json();
      const token = json?.data?.accessToken ?? json?.accessToken;
      if (token) {
        // Update zustand store dynamically
        const { useAuthStore } = await import('@/store/authStore');
        const user = useAuthStore.getState().user;
        if (user) useAuthStore.getState().setAuth(token, user);
        try { localStorage.setItem('agrilink_access_token', token); } catch {}
      }
      return token ?? null;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

async function redirectToLogin() {
  if (typeof window === 'undefined') return;
  const { useAuthStore } = await import('@/store/authStore');
  useAuthStore.getState().logout();
  try { localStorage.removeItem('agrilink_access_token'); localStorage.removeItem('agrilink_user'); } catch {}
  window.location.href = '/auth/login';
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

  const res = await fetch(`${BASE}${path}`, { ...options, headers, credentials: 'include' });

  if (res.status === 204) return undefined as T;

  if (res.status === 401 && token && path !== '/auth/refresh') {
    const newToken = await tryRefreshToken();
    if (newToken) {
      // Retry with new token
      headers.Authorization = `Bearer ${newToken}`;
      const retryRes = await fetch(`${BASE}${path}`, { ...options, headers, credentials: 'include' });
      if (retryRes.ok) {
        const json = await retryRes.json();
        return json.data as T;
      }
    }
    redirectToLogin();
    throw new ApiError(401, { message: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.' });
  }

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
  | 'avatar'
  | `avatar_${string}`;

export type PrivateStorageAssetType =
  | 'CERTIFICATION'
  | 'KYC_IDENTITY'
  | 'BUSINESS_LICENSE';

interface StorageImageUploadResult {
  secure_url: string;
}

interface StorageDownloadUrlResult {
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

export async function uploadPrivateDocument(
  file: File,
  assetType: PrivateStorageAssetType,
  token?: string | null,
): Promise<string> {
  if (!token) throw new Error('Vui lòng đăng nhập để tải tài liệu.');
  if (file.size < 1 || file.size > 10 * 1024 * 1024) {
    throw new Error('Tài liệu phải có kích thước từ 1 byte đến 10 MB.');
  }

  const contentType = file.type || 'application/octet-stream';
  const intent = await api.post<{
    fileId: string;
    uploadUrl: string;
    expiresAt: string;
  }>(
    '/storage/uploads/intents',
    {
      assetType,
      originalName: file.name,
      declaredMime: contentType,
      sizeBytes: file.size,
    },
    token,
  );
  const upload = await fetch(intent.uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      'cache-control': 'max-age=3600',
      'x-upsert': 'false',
    },
    body: file,
  });
  if (!upload.ok) {
    throw new Error('Không thể tải tài liệu lên kho lưu trữ riêng tư.');
  }
  await api.post(`/storage/uploads/${intent.fileId}/complete`, {}, token);
  return intent.fileId;
}

export async function getStoredFileDownloadUrl(
  fileId: string,
  token?: string | null,
): Promise<StorageDownloadUrlResult> {
  return api.get<StorageDownloadUrlResult>(
    `/storage/files/${fileId}/download-url`,
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
