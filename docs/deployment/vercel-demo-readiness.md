# Vercel Demo Readiness

Status: `READY_FOR_VERCEL_DEPLOYMENT`

## Current Build Error

Build ban đầu dừng tại `src/app/auth/login/page.tsx` vì truy cập
`err.message` khi `err` có kiểu `unknown`. Sau khi sửa lỗi này, TypeScript còn
phát hiện kiểu detail product không an toàn và `useRef` thiếu initial value
theo React 19.

## Root Cause

- Error handling chưa thu hẹp kiểu `unknown`.
- Một số view model dùng `Record<string, unknown>` nhưng UI truy cập property
  trực tiếp.
- API URL mặc định về localhost và các `fetch` trực tiếp vượt qua API client.
- Auth, refresh token, socket, upload và sitemap chưa có backend-free boundary.
- Mock product cũ vẫn thử gọi network trước khi fallback.

## Backend Coupling Inventory

| Feature | Boundary / source | Real endpoint | First render | Demo behavior |
| --- | --- | --- | --- | --- |
| Password/OTP login | `auth-data-source.ts` | `/auth/login`, `/auth/login-otp`, `/auth/send-otp` | Login only | Deterministic users, password and OTP |
| Current user/session | Auth store | `/users/me` | Protected UI | Persisted `demo-session:*` marker |
| Marketplace/search | `products-api.ts`, `apiGet` | `/products`, categories, geography | Yes | In-memory list, search, filter, sort, pagination |
| Product detail | `products-api.ts` | `/products/:id` | Detail route | Deterministic local fixture |
| Profiles | `api.ts`, profile page | `/profiles/*`, `/users/me` | Profile routes | Role fixture and local avatar preview |
| Certifications | Product fixtures/admin API | Product certification endpoints | Detail/admin | Verified, pending and rejected fixture states |
| Wishlist | `api.ts` | `/wishlist`, `/wishlist/ids` | Wishlist/detail | Local add/remove persisted in browser |
| Reviews | `api.ts` | `/reviews`, `/reviews/product/:id` | Marketplace detail | Fixture list and local create |
| Notifications | `api.ts`, socket | `/notifications/*`, WebSocket | Auth shell | Local read state; socket disabled |
| Admin dashboard | `api.ts` | `/admin/stats` | Admin dashboard | Derived fixture counts |
| Product moderation | `api.ts` | `/admin/products/*` | Admin products | Local approve/reject transition |
| Profile verification | `api.ts` | `/admin/pending-profiles` | Admin profiles | Local approve/reject transition |
| GIS/map | Existing P4 data source | P4 API/Mapbox | Map route | P4 mock data and missing-token fallback |
| Upload/KYC | Storage helpers/direct provider | Storage, Cloudinary, CCCD | User action | Object URL/explicit local demo result |

## Demo Mode Architecture

- `runtime-config.ts` is the single environment configuration source.
- `auth-data-source.ts` selects real or demo authentication at the boundary.
- `demo-api.ts` implements controlled REST-equivalent handlers for demo scope.
- `fixtures.ts` owns deterministic users, products, profiles and notifications.
- `api.ts` routes requests to the demo adapter before creating a network request.
- `products-api.ts` returns local fixtures immediately in Demo Mode.
- Zustand persists the user, role and non-JWT demo session marker.
- `agrilink-demo-data` stores wishlist, reviews, notifications and admin state.
- Protected navigation continues to use the existing client auth store; there is
  no server middleware and therefore no localStorage redirect loop.
- A root banner identifies every Demo Mode screen.

## Real Mode Preservation

- Existing endpoint paths, DTO unwrapping, bearer token and refresh logic remain.
- WebSocket reconnect behavior remains enabled in Real Mode.
- Upload providers remain enabled in Real Mode.
- `NEXT_PUBLIC_API_URL` is preferred; legacy `NEXT_PUBLIC_BACKEND_URL` remains
  supported.
- Real Mode never silently switches to demo data.
- Real Mode production build passed with `https://example.invalid` as a
  non-contacted compile-time URL.

## Environment Variables

Required for backend-free Vercel demo:

```env
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SITE_URL=https://<your-project>.vercel.app
NEXT_PUBLIC_P4_DATA_MODE=mock
```

No secret, backend URL, database URL, Mapbox token, Cloudinary credential or
Sentry DSN is required.

## Mocked Features

- Password and OTP authentication.
- Marketplace/search/detail/certification data.
- Wishlist, reviews and notifications.
- Role profile and local avatar preview.
- Admin counts and moderation transitions.
- State dashboard samples and report downloads.
- P4/GIS fixtures and provider fallback.

## Non-Mocked Features

The full UI and routing remain real frontend code. These external actions are
intentionally not performed in Demo Mode:

- Account registration persistence and real OTP delivery.
- REST backend, refresh token and WebSocket traffic.
- Cloudinary/Supabase/backend upload.
- CCCD/KYC provider processing.
- Production database mutations.

## Validation

| Gate | Result | Evidence |
| --- | --- | --- |
| TypeScript | PASS | `npx tsc --noEmit`, 0 errors |
| Lint | PASS | `npm run lint`, 0 errors and 9 existing UI warnings |
| P4 fixtures | PASS | 3 categories, 3 products, 3 provinces, 42 price points, 2 trace batches |
| P4 map runtime | PASS | missing-token, WebGL and online states valid |
| Demo build | PASS | Next.js 16.2.11, 52 routes, no API URL |
| Real build | PASS | Next.js 16.2.11, URL `https://example.invalid` |
| Unit tests | SKIPPED | Repository has no unit test command/framework |
| Browser smoke | PASS | Password/OTP, refresh, marketplace, search, detail, wishlist, review, profile, notifications, admin, map fallback, 404 |
| Browser console | PASS | 0 console errors and 0 page errors before expected 404 |
| Network isolation | PASS | 0 backend/localhost API requests and 0 failed requests |
| Hydration | PASS | 0 hydration errors during smoke routes |

## Files Fixed

- Shared error helper and safe login error handling.
- Runtime config, auth adapter, demo API and deterministic fixtures.
- API, product, socket, sitemap and direct-fetch boundaries.
- Demo banner, local generated image assets and demo review visibility.
- Admin/state/profile/upload/report compatibility changes.
- Environment template and Vercel deployment documentation.

## Known Limitations

- Registration demonstrates OTP steps but does not create a persistent account.
- Demo upload URLs are browser object URLs and are not durable across sessions.
- Only representative endpoints are implemented; unsupported integrations fail
  with an explicit Demo Mode message.
- Mapbox rendering requires a public token; without one the designed fallback
  appears and P4 data remains available.
- Lint retains nine non-blocking UI warnings for existing image tags and camera
  hook dependencies; there are no lint errors.
- This report verifies local readiness only. No Vercel deployment has been
  performed or claimed.

## Vercel Settings

- Framework: Next.js.
- Node.js: 22.x.
- Install: `npm ci`.
- Build: `npm run build`.
- Output: Next.js default.
- Required secrets: none for Demo Mode.

`READY_FOR_VERCEL_DEPLOYMENT`
