const API_PREFIX = "/api/v1";

function trimTrailingSlashes(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

function normalizeApiUrl(value: string, appendApiPrefix: boolean): string {
  const normalized = trimTrailingSlashes(value);
  if (!appendApiPrefix || normalized.endsWith(API_PREFIX)) {
    return normalized;
  }
  return `${normalized}${API_PREFIX}`;
}

export function getApiBaseUrl(): string {
  const canonicalUrl = process.env.NEXT_PUBLIC_API_URL;
  if (canonicalUrl?.trim()) {
    return normalizeApiUrl(canonicalUrl, false);
  }

  const legacyUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (legacyUrl?.trim()) {
    return normalizeApiUrl(legacyUrl, true);
  }

  throw new Error(
    "Missing NEXT_PUBLIC_API_URL. Configure the backend API URL before making API requests.",
  );
}

export function getSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl?.trim()) {
    throw new Error(
      "Missing NEXT_PUBLIC_SITE_URL. Configure the public frontend URL.",
    );
  }
  return trimTrailingSlashes(siteUrl);
}

export function getBuildSafeSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return siteUrl?.trim()
    ? trimTrailingSlashes(siteUrl)
    : "https://example.invalid";
}

export function getBackendOrigin(): string {
  return new URL(getApiBaseUrl()).origin;
}

export function getWebSocketBaseUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_WS_URL;
  return configuredUrl?.trim()
    ? trimTrailingSlashes(configuredUrl)
    : getBackendOrigin();
}
