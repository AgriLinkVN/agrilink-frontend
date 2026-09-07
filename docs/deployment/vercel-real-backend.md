# Vercel Frontend With Render Backend

## Architecture

```text
Vercel Next.js frontend
  -> Render NestJS backend
  -> Supabase PostgreSQL
```

The Vercel application calls the Render NestJS service directly over HTTPS.
The backend owns the `/api/v1` prefix and returns the standard `{ data }`
response envelope. Authentication uses a bearer access token and an HTTP-only
refresh-token cookie. Socket.IO derives its origin from the API URL unless
`NEXT_PUBLIC_WS_URL` is configured.

## Required Vercel Variables

Configure these values for Production, Preview, and Development as appropriate:

```text
NEXT_PUBLIC_SITE_URL=https://your-vercel-production-domain.example
NEXT_PUBLIC_API_URL=https://your-render-backend.onrender.com/api/v1
NEXT_PUBLIC_WS_URL=https://your-render-backend.onrender.com
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
NEXT_PUBLIC_SENTRY_DSN=
```

`NEXT_PUBLIC_API_URL` is canonical and must include `/api/v1`. New deployments
must use the canonical variable rather than the temporary compatibility alias.
Do not put private backend, Supabase, Cloudinary, Firebase, or database secrets
in variables prefixed with `NEXT_PUBLIC_`.

## Build Settings

Use Node.js 22, install with `npm ci`, and build with `npm run build`. Keep the
framework preset and output directory at the Vercel defaults for Next.js.
Production builds must not call the backend while compiling.

## Backend CORS

On Render, set the backend `CORS_ORIGINS` to include the exact Vercel production
origin. Add preview origins individually only when they are intentionally
allowed. For example:

```text
CORS_ORIGINS=https://your-vercel-production-domain.example
```

Authentication crosses origins and uses credentials, including an HTTP-only
refresh-token cookie. The backend must therefore keep credentialed CORS enabled,
and its cookie policy must support the deployed HTTPS frontend/backend origin
pair. Run the backend with `NODE_ENV=production` so the current refresh-token
policy emits `Secure; SameSite=None`; frontend API requests already use
`credentials: include`. Do not use `*` with credentials. Each configured origin
must include its scheme and must not include a path or trailing slash.

## Release Checks

Confirm that deployed variables contain no localhost URL, that the backend has
a public HTTPS domain, and that login, refresh, logout, `/users/me`, products,
uploads, and notifications use real backend responses. This document does not
claim a concrete Render deployment URL before one exists.
