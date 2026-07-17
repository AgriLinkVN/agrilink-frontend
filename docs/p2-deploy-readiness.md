# P2 Product Deploy Readiness

Generated: 2026-07-17

Status: deploy is intentionally deferred. Product deploy tasks stay FALSE until staging/production URLs, secrets, and database targets are available.

## Current Decision

- `I2-10 Tự deploy product service lên staging`: FALSE, deferred.
- `I3-8 Cấu hình Cloudinary production key`: FALSE, deferred until production Cloudinary account/preset is provided.
- `I4-8 Deploy product module production + test search`: FALSE, deferred.

## Frontend Readiness

Use `.env.example` as the source checklist for frontend deployment variables.

Required for Product pages:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_BACKEND_URL`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

Required for QR/map product surfaces:

- `NEXT_PUBLIC_MAPBOX_TOKEN`

Optional:

- `NEXT_PUBLIC_SENTRY_DSN`

## Pre-Deploy Checks

Run these before publishing a frontend deployment:

```bash
npm ci
npm run lint
npm run build
```

Production requirements:

- `NEXT_PUBLIC_BACKEND_URL` must point to the deployed backend origin, not localhost.
- `NEXT_PUBLIC_SITE_URL` must match the public frontend domain for canonical URLs, sitemap, Open Graph, and robots.
- The backend `CORS_ORIGINS` value must include the frontend domain.
- Remote image hosts used by product images must stay covered in `next.config.ts`.

## P2 Smoke Test

After deploy, verify these product routes:

1. `/search` loads products and filters.
2. `/products/:id` renders gallery, contact actions, seller card, verified certification badges, and metadata.
3. `/dashboard/farmer/products/new` creates a product with images/certifications.
4. `/dashboard/farmer/products` shows seller-owned products across statuses through `/products/me`.
5. Seller status actions work for `draft -> pending_approval`, `active -> out_of_stock`, and `out_of_stock -> active`.
6. `/dashboard/state/certifications` can approve and reject certification requests.
7. `/dashboard/buyer/wishlist` loads saved products and remove actions.
8. `/seller/:id` renders public seller profile, products, and reviews.
9. `/sitemap.xml` includes active product URLs.

## Known Gaps

- No staging or production frontend URL has been provided yet.
- No production Cloudinary upload preset has been provided yet.
- No production backend URL has been provided yet.
