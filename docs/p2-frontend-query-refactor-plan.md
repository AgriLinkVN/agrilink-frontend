# P2 Frontend Query Refactor Plan

## Muc tieu

Refactor cac luong lay du lieu FE sang TanStack Query de giam fetch thu cong trong `useEffect`, han che double request khi filter thay doi, va de React Query quan ly cache/loading/error/cancel request.

Pham vi uu tien cho P2:

- Marketplace product browse/search/filter.
- Search page infinite products.
- Category/province reference data.
- Cac page dashboard dang fetch bang effect se tach phase sau vi khong nam truc tiep trong P2 marketplace flow.

## Nguyen tac refactor

- Data server/cache nen di qua `useQuery` hoac `useInfiniteQuery`.
- UI draft state van duoc phep dung `useState`, vi no khong phai server data.
- Khi filter thay doi, reset `page` trong cung mot state update de tranh request page cu.
- Query key phai mo ta du query params dang goi API.
- Query function nen nhan `AbortSignal` neu helper API ho tro.
- Khong dung `useEffect` de set lai state co the tinh truc tiep tu props/query result.

## Phase 1 - P2 Marketplace va Search Hooks

Trang/file:

- `src/app/marketplace/page.tsx`
- `src/lib/products-api.ts`
- `src/lib/hooks/use-search-products.ts`
- `src/lib/hooks/use-categories.ts`
- `src/lib/hooks/use-provinces.ts`
- `src/app/search/search-client.tsx`

Viec can lam:

- Gom marketplace filter/page thanh mot `MarketplaceQuery`.
- Doi product/category fetch trong marketplace sang `useQuery`.
- Doi `useSearchProducts` tu effect + manual abort sang `useInfiniteQuery`.
- Doi `useCategories` va `useProvinces` sang `useQuery`.
- Doi wishlist ids trong search page sang `useQuery` de bo fetch effect.
- Them `AbortSignal` cho `fetchProducts`/`fetchCategories` neu can.

Acceptance criteria:

- Doi tinh/category/farming/search khong goi request voi page cu roi moi reset page.
- `npm run lint` thanh cong.
- `npm run build` thanh cong.
- Search page van load more duoc bang sentinel.
- Marketplace van co fallback mock data khi backend loi.

## Phase 2 - Dashboard State/Admin Data Fetching

Trang/file:

- `src/app/dashboard/state/page.tsx`
- `src/app/dashboard/state/audit-logs/page.tsx`
- `src/app/dashboard/state/cooperatives/page.tsx`
- `src/app/dashboard/state/violations/page.tsx`

Viec can lam:

- Doi cac fetch trong effect sang `useQuery`.
- Query key phai gom page/limit/status khi co phan trang.
- Bo state `loading/data/total` trung gian neu co the lay tu query result.
- Giu action export PDF la event handler rieng, khong dua vao `useQuery`.

Acceptance criteria:

- Khong con manual fetch effect cho cac list dashboard.
- Pagination audit logs chi refetch theo `page`.
- Dashboard state render loading/error/empty ro rang.

## Phase 3 - UI Derived State va Local Sync Cleanup

Trang/file:

- `src/components/search/filter-price.tsx`
- `src/components/ads/BannerSlider.tsx`
- `src/lib/auth-context.tsx`

Viec can lam:

- `filter-price`: danh gia lai local draft state; neu can sync prop reset thi dung controlled remount/key hoac event handler ro rang, tranh effect chi de mirror props.
- `BannerSlider`: fetch da dung `useQuery`; chi giu effect timer vi day la external timer. Kiem tra reset/safe index khi data banners thay doi.
- `auth-context`: hydration effect la dong bo voi external Zustand persist, chap nhan duoc; chi can giu fallback SSR an toan.

Acceptance criteria:

- Khong doi nghiep vu auth/banner.
- Khong con set state sync trong effect chi de mirror props.

## Phase 4 - Query Key Standardization

Trang/file:

- Cac hook dung React Query trong `src/lib/hooks`.
- Cac query trong `src/app` va `src/components`.

Viec can lam:

- Dat convention query key: `['products', 'search', filter]`, `['categories', 'tree']`, `['provinces']`, `['wishlist', 'ids', userId/tokenScope]`.
- Can nhac tao helper query key neu duplicate tang.
- Chuan hoa `staleTime`:
  - Categories/provinces: 10-30 phut.
  - Product search/list: 30 giay.
  - Ads/banner: 5 phut.
  - Admin dashboard: 15-30 giay.

Acceptance criteria:

- Query key de review va invalidate.
- Khong them abstraction neu duplicate con thap.

## Thu tu PR de review

1. PR Phase 1: marketplace/search hooks P2.
2. PR Phase 2: dashboard state/admin data fetching.
3. PR Phase 3-4: cleanup derived state va query convention.

