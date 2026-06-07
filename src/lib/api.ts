const RAW_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";
const API_PREFIX = "/api/v1";
const API_BASE_URL = RAW_BASE.replace(/\/$/, "") + API_PREFIX;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

interface Envelope<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
  signal?: AbortSignal,
): Promise<T> {
  const url = new URL(API_BASE_URL + path);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, String(v));
      }
    }
  }

  const res = await fetch(url.toString(), {
    signal,
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(res.status, body || res.statusText);
  }

  const json = (await res.json()) as Envelope<T> | T;
  if (json && typeof json === "object" && "data" in (json as object)) {
    return (json as Envelope<T>).data;
  }
  return json as T;
}
