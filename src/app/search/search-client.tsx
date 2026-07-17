"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search/search-bar";
import { FilterPanel } from "@/components/search/filter-panel";
import { SortBar } from "@/components/search/sort-bar";
import { ProductCard } from "@/components/search/product-card";
import { ProductSkeletonGrid } from "@/components/search/product-skeleton";
import { EmptyState } from "@/components/search/empty-state";
import { InfiniteSentinel } from "@/components/search/infinite-sentinel";

import { api } from "@/lib/api";
import { useSearchProducts } from "@/lib/hooks/use-search-products";
import { useCategories } from "@/lib/hooks/use-categories";
import { useProvinces } from "@/lib/hooks/use-provinces";
import { useAuthStore } from "@/store/authStore";
import type { SearchFilter, SortBy, SortOrder } from "@/types/search";

interface Props {
  initialFilter: SearchFilter;
}

function filterToQuery(f: SearchFilter): string {
  const sp = new URLSearchParams();
  if (f.search) sp.set("q", f.search);
  if (f.categoryId) sp.set("category", f.categoryId);
  if (f.provinceId) sp.set("province", f.provinceId);
  if (f.minPrice !== undefined) sp.set("minPrice", String(f.minPrice));
  if (f.maxPrice !== undefined) sp.set("maxPrice", String(f.maxPrice));
  if (f.farmingType) sp.set("farming", f.farmingType);
  if (f.sortBy && f.sortBy !== "createdAt") sp.set("sortBy", f.sortBy);
  if (f.order && f.order !== "DESC") sp.set("order", f.order);
  return sp.toString();
}

export function SearchClient({ initialFilter }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((s) => s.accessToken);

  const [filter, setFilter] = useState<SearchFilter>({
    sortBy: "createdAt",
    order: "DESC",
    ...initialFilter,
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [wishlistOverrides, setWishlistOverrides] = useState<{
    token: string | null;
    values: Record<string, boolean>;
  }>({ token: null, values: {} });

  const { data: categories } = useCategories();
  const { data: provinces } = useProvinces();
  const provinceNameMap = useMemo(
    () => new Map(provinces.map((p) => [p.id, p.name])),
    [provinces],
  );

  const { items, total, loading, loadingMore, error, hasMore, loadMore } =
    useSearchProducts(filter);

  const { data: wishlistIds = [] } = useQuery({
    queryKey: ["wishlist", "ids", accessToken],
    queryFn: () => api.get<string[]>("/wishlist/ids", accessToken),
    enabled: !!accessToken,
    staleTime: 30_000,
  });
  const wishlistedIds = useMemo(() => {
    if (!accessToken) return new Set<string>();

    const ids = new Set(wishlistIds);
    const overrides =
      wishlistOverrides.token === accessToken ? wishlistOverrides.values : {};
    for (const [productId, active] of Object.entries(overrides)) {
      if (active) ids.add(productId);
      else ids.delete(productId);
    }
    return ids;
  }, [accessToken, wishlistIds, wishlistOverrides]);

  // Sync URL when filter changes (replace, not push — không spam history)
  useEffect(() => {
    const qs = filterToQuery(filter);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [filter, pathname, router]);

  const patch = useCallback((p: Partial<SearchFilter>) => {
    setFilter((f) => ({ ...f, ...p }));
  }, []);

  const reset = useCallback(() => {
    setFilter({ sortBy: "createdAt", order: "DESC" });
  }, []);

  const updateWishlistState = useCallback((productId: string, active: boolean) => {
    setWishlistOverrides((current) => ({
      token: accessToken,
      values: {
        ...(current.token === accessToken ? current.values : {}),
        [productId]: active,
      },
    }));
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* Header + search bar */}
      <div className="bg-surface-soft border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-ink mb-4">Tìm kiếm sản phẩm</h1>
          <div className="flex gap-3 max-w-2xl">
            <div className="flex-1">
              <SearchBar
                defaultValue={filter.search ?? ""}
                onSubmit={(v) => patch({ search: v || undefined })}
              />
            </div>
            <Button
              variant="secondary"
              className="rounded-full gap-2 lg:hidden"
              onClick={() => setMobileFilterOpen(true)}
            >
              <SlidersHorizontal size={16} /> Lọc
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <FilterPanel
            filter={filter}
            categories={categories}
            provinces={provinces}
            onChange={patch}
            onReset={reset}
            mobileOpen={mobileFilterOpen}
            onMobileClose={() => setMobileFilterOpen(false)}
          />

          <div className="flex-1 min-w-0">
            <SortBar
              total={total}
              sortBy={filter.sortBy ?? "createdAt"}
              order={filter.order ?? "DESC"}
              onChange={(sortBy: SortBy, order: SortOrder) =>
                patch({ sortBy, order })
              }
            />

            {error && (
              <div className="mb-4 p-4 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">
                Lỗi tải dữ liệu: {error}
              </div>
            )}

            {loading ? (
              <ProductSkeletonGrid />
            ) : items.length === 0 ? (
              <EmptyState onReset={reset} />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {items.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      provinceName={provinceNameMap.get(p.provinceId)}
                      initialWishlisted={wishlistedIds.has(p.id)}
                      onWishlistChange={updateWishlistState}
                    />
                  ))}
                </div>

                {loadingMore && (
                  <div className="mt-6">
                    <ProductSkeletonGrid count={4} />
                  </div>
                )}

                <InfiniteSentinel
                  onIntersect={loadMore}
                  disabled={!hasMore || loadingMore}
                />

                {!hasMore && items.length > 0 && (
                  <p className="text-center text-xs text-muted mt-10">
                    Đã hiển thị tất cả {total.toLocaleString("vi-VN")} sản phẩm
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
