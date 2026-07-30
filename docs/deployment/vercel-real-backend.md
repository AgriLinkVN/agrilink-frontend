# Vercel Frontend With Railway Backend

## Architecture

The Vercel application calls the Railway NestJS service directly over HTTPS.
The backend owns the `/api/v1` prefix and returns the standard `{ data }`
response envelope. Authentication uses a bearer access token and an HTTP-only
refresh-token cookie. Socket.IO derives its origin from the API URL unless
`NEXT_PUBLIC_WS_URL` is configured.

## Required Vercel Variables

Configure these values for Production, Preview, and Development as appropriate:

```text
NEXT_PUBLIC_SITE_URL=https://your-frontend-domain.example
NEXT_PUBLIC_API_URL=https://your-backend-domain.example/api/v1
NEXT_PUBLIC_WS_URL=https://your-backend-domain.example
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
NEXT_PUBLIC_SENTRY_DSN=
```

`NEXT_PUBLIC_API_URL` is canonical and must include `/api/v1`. The deprecated
`NEXT_PUBLIC_BACKEND_URL` is accepted temporarily, but new deployments must not
use it. Do not put private backend, Supabase, Cloudinary, Firebase, or database
secrets in variables prefixed with `NEXT_PUBLIC_`.

## Build Settings

Use Node.js 22, install with `npm ci`, and build with `npm run build`. Keep the
framework preset and output directory at the Vercel defaults for Next.js.
Production builds must not call the backend while compiling.

## Backend CORS

Set the backend `CORS_ORIGINS` to the exact Vercel production and preview
origins that are permitted to send credentialed requests. Do not use `*` with
cookies. Each configured origin must include its scheme and must not include a
path or trailing slash.

## Release Checks

Confirm that deployed variables contain no localhost URL, that the backend has
a public HTTPS domain, and that login, refresh, logout, `/users/me`, products,
uploads, and notifications use real backend responses. This document does not
claim that either Vercel or Railway is currently deployed.
