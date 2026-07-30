const rawApiUrl =
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  process.env.NEXT_PUBLIC_BACKEND_URL?.trim() ||
  null;

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export const runtimeConfig = Object.freeze({
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
  apiUrl: rawApiUrl ? normalizeUrl(rawApiUrl) : null,
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://agrilink.vn",
});

export function getApiUrl(): string {
  if (runtimeConfig.apiUrl) return runtimeConfig.apiUrl;
  throw new Error(
    "Real Mode requires NEXT_PUBLIC_API_URL or NEXT_PUBLIC_BACKEND_URL.",
  );
}

export function getApiBaseUrl(): string {
  return `${getApiUrl()}/api/v1`;
}
