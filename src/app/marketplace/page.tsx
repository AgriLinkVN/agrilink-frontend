"use client";

import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Search, Star, Grid3X3, List,
  ChevronDown, ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ProductGridCard, ProductListCard } from "@/components/marketplace/product-card";
import { AdCarousel } from "@/components/marketplace/ad-carousel";
import { AdBanner } from "@/components/ads/ad-banner";
import { cn } from "@/lib/utils";
import {
  fetchProducts,
  fetchCategories,
  FALLBACK_CATEGORIES,
  FARMING_TYPE_OPTIONS,
  type Product,
} from "@/lib/products-api";

// Top provinces for sidebar (most agricultural)
const SIDEBAR_PROVINCES = [
  "Tất cả",
  "Tiền Giang", "Lâm Đồng", "Bình Thuận", "Sóc Trăng",
  "Bến Tre", "Long An", "An Giang", "Đắk Lắk",
  "Bắc Giang", "Lào Cai", "Hà Giang", "Kiên Giang",
];
const SORT_OPTIONS = [
  { label: "Mới nhất", value: "createdAt_DESC" },
  { label: "Giá thấp → cao", value: "price_ASC" },
  { label: "Giá cao → thấp", value: "price_DESC" },
  { label: "Xem nhiều nhất", value: "view_DESC" },
];

const LIMIT = 9;

interface MarketplaceQuery {
  search: string;
  categoryId: string;
  province: string;
  farmingTypes: string[];
  minPrice: string;
  maxPrice: string;
  sort: string;
  page: number;
}

const INITIAL_QUERY: MarketplaceQuery = {
  search: "",
  categoryId: "all",
  province: "Tất cả",
  farmingTypes: [],
  minPrice: "",
  maxPrice: "",
  sort: "createdAt_DESC",
  page: 1,
};

function parsePriceFilter(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const price = Number(trimmed);
  return Number.isFinite(price) && price >= 0 ? price : undefined;
}

function sortProducts(products: Product[], sortValue: string): Product[] {
  const arr = [...products];
  if (sortValue === "price_ASC") return arr.sort((a, b) => Number(a.pricePerUnit) - Number(b.pricePerUnit));
  if (sortValue === "price_DESC") return arr.sort((a, b) => Number(b.pricePerUnit) - Number(a.pricePerUnit));
  if (sortValue === "view_DESC") return arr.sort((a, b) => b.viewCount - a.viewCount);
  return arr; // createdAt_DESC — default order from API
}

export default function MarketplacePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState<MarketplaceQuery>(INITIAL_QUERY);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const minPrice = parsePriceFilter(query.minPrice);
  const maxPrice = parsePriceFilter(query.maxPrice);

  const updateQuery = (patch: Partial<MarketplaceQuery>, resetPage = true) => {
    setQuery((current) => ({
      ...current,
      ...patch,
      page: resetPage ? 1 : patch.page ?? current.page,
    }));
  };

  const productParams = useMemo(() => {
    const farming =
      query.farmingTypes.length === 1 ? query.farmingTypes[0] : undefined;
    return {
      page: 1,
      limit: 100,
      search: query.search || undefined,
      farmingType: farming,
      categoryId: query.categoryId !== "all" ? query.categoryId : undefined,
      minPrice,
      maxPrice,
    };
  }, [maxPrice, minPrice, query.categoryId, query.farmingTypes, query.search]);

  const { data: categories = FALLBACK_CATEGORIES } = useQuery({
    queryKey: ["marketplace", "categories"],
    queryFn: ({ signal }) => fetchCategories(signal),
    placeholderData: FALLBACK_CATEGORIES,
    staleTime: 10 * 60 * 1000,
  });

  const {
    data: productResult,
    isPending: loading,
    isFetching: productsFetching,
  } = useQuery({
    queryKey: ["marketplace", "products", productParams],
    queryFn: ({ signal }) => fetchProducts(productParams, signal),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const allProducts = productResult?.data ?? [];

  const filteredProducts = allProducts.filter((product) => {
    if (query.province !== "Tất cả") {
      const text = `${product.name} ${product.description ?? ""}`;
      if (!text.includes(query.province)) return false;
    }

    if (
      query.farmingTypes.length > 0 &&
      (!product.farmingType || !query.farmingTypes.includes(product.farmingType))
    ) {
      return false;
    }

    const price = Number(product.pricePerUnit);
    if (minPrice !== undefined && price < minPrice) return false;
    if (maxPrice !== undefined && price > maxPrice) return false;

    return true;
  });

  // Client-side sort + paginate
  const sorted = sortProducts(filteredProducts, query.sort);
  const totalPages = Math.max(1, Math.ceil(sorted.length / LIMIT));
  const currentPage = Math.min(query.page, totalPages);
  const products = sorted.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  const sortLabel = SORT_OPTIONS.find((o) => o.value === query.sort)?.label ?? "Sắp xếp";
  const hasActiveFilters =
    query.farmingTypes.length > 0 ||
    query.province !== "Tất cả" ||
    query.categoryId !== "all" ||
    Boolean(query.minPrice || query.maxPrice) ||
    Boolean(query.search);

  const clearFilters = () => {
    setSearchInput("");
    setQuery(INITIAL_QUERY);
  };

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 45%, #40916C 100%)" }}>

        {/* Blob decorations */}
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #95D5B2 0%, transparent 70%)" }} />
        <div className="absolute top-4 right-24 w-40 h-40 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #74C69D 0%, transparent 70%)" }} />
        <div className="absolute bottom-8 left-1/3 w-56 h-56 rounded-full opacity-8" style={{ background: "radial-gradient(circle, #52B788 0%, transparent 70%)" }} />
        <div className="absolute -bottom-8 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #B7E4C7 0%, transparent 70%)" }} />

        {/* Curved arc shapes */}
        <svg className="absolute top-0 right-0 opacity-10" width="340" height="340" viewBox="0 0 340 340" fill="none">
          <circle cx="340" cy="0" r="220" stroke="white" strokeWidth="1.5" fill="none" />
          <circle cx="340" cy="0" r="160" stroke="white" strokeWidth="1" fill="none" />
          <circle cx="340" cy="0" r="100" stroke="white" strokeWidth="0.8" fill="none" />
        </svg>
        <svg className="absolute bottom-0 left-0 opacity-8" width="240" height="180" viewBox="0 0 240 180" fill="none">
          <ellipse cx="0" cy="180" rx="200" ry="140" stroke="white" strokeWidth="1.2" fill="none" />
          <ellipse cx="0" cy="180" rx="130" ry="90" stroke="white" strokeWidth="0.8" fill="none" />
        </svg>

        {/* Floating dots */}
        <div className="absolute top-8 left-1/4 w-2 h-2 rounded-full bg-white/20" />
        <div className="absolute top-16 left-1/2 w-1.5 h-1.5 rounded-full bg-white/15" />
        <div className="absolute top-6 right-1/3 w-2.5 h-2.5 rounded-full bg-white/10" />
        <div className="absolute bottom-12 right-1/4 w-2 h-2 rounded-full bg-white/20" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
          <div className="flex flex-col lg:flex-row items-center gap-8">

            {/* Left text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                <span className="text-white/90 text-xs font-medium tracking-wide">Sàn nông sản AgriLink • Việt Nam</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 drop-shadow">
                Nông sản Việt Nam<br />
                <span className="text-emerald-300">chất lượng, minh bạch</span>
              </h1>
              <p className="text-white/70 text-sm max-w-md mx-auto lg:mx-0 mb-6">
                Kết nối trực tiếp người mua với hàng nghìn nông hộ, HTX và doanh nghiệp nông nghiệp trên toàn quốc.
              </p>

              {/* Stats chips */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {[
                  { val: "50+", lbl: "Sản phẩm" },
                  { val: "10", lbl: "Danh mục" },
                  { val: "30+", lbl: "Tỉnh thành" },
                ].map((s) => (
                  <div key={s.lbl} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2">
                    <span className="text-emerald-300 font-bold text-base">{s.val}</span>
                    <span className="text-white/70 text-xs">{s.lbl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: search card */}
            <div className="w-full lg:w-[420px] shrink-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 shadow-xl">
                <p className="text-white/80 text-xs font-medium mb-3 uppercase tracking-wider">Tìm sản phẩm</p>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 h-11 px-4 rounded-2xl bg-white/95 shadow-sm">
                    <Search size={15} className="text-primary shrink-0" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateQuery({ search: searchInput.trim() });
                        }
                      }}
                      placeholder="Xoài, gạo ST25, cà phê..."
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-soft text-ink"
                    />
                    {searchInput && (
                      <button
                        onClick={() => {
                          setSearchInput("");
                          updateQuery({ search: "" });
                        }}
                        className="text-muted hover:text-ink"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => updateQuery({ search: searchInput.trim() })}
                    className="h-11 px-5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-white font-semibold text-sm transition-all shadow-sm whitespace-nowrap"
                  >
                    Tìm
                  </button>
                </div>

                {/* Quick tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {["Gạo ST25", "Sầu riêng", "Cà phê", "Tôm sú", "Mật ong"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSearchInput(tag);
                        updateQuery({ search: tag });
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-white/15 text-white/80 hover:bg-white/25 transition-all border border-white/20"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 56L1440 56L1440 18C1200 56 960 2 720 18C480 34 240 2 0 18L0 56Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Category tabs — sticky ─────────────────────────────── */}
      <div className="bg-white sticky top-16 z-10 border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateQuery({ categoryId: cat.id })}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  query.categoryId === cat.id
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted hover:text-ink hover:bg-surface-soft"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Ad carousel — full width above product grid */}
        <div className="mb-6">
          <AdCarousel />
        </div>

        <div className="flex gap-7">

          {/* Sidebar */}
          <aside className="w-56 shrink-0 hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-5">

              {/* Province */}
              <div className="bg-white rounded-xl border border-hairline p-4">
                <h3 className="text-xs font-bold text-ink uppercase tracking-wide mb-3">Tỉnh thành</h3>
                <div className="flex flex-col gap-0.5">
                  {SIDEBAR_PROVINCES.map((p) => (
                    <button
                      key={p}
                      onClick={() => updateQuery({ province: p })}
                      className={cn(
                        "text-left px-3 py-1.5 rounded-lg text-sm transition-all",
                        query.province === p
                          ? "bg-primary-ultra-light text-primary font-semibold"
                          : "text-muted hover:text-ink hover:bg-surface-soft"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Farming type */}
              <div className="bg-white rounded-xl border border-hairline p-4">
                <h3 className="text-xs font-bold text-ink uppercase tracking-wide mb-3">Loại canh tác</h3>
                <div className="flex flex-col gap-2">
                  {FARMING_TYPE_OPTIONS.map(({ label, value }) => (
                    <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="accent-primary w-4 h-4 rounded shrink-0"
                        checked={query.farmingTypes.includes(value)}
                        onChange={(e) => {
                          setQuery((current) => ({
                            ...current,
                            farmingTypes: e.target.checked
                              ? [...current.farmingTypes, value]
                              : current.farmingTypes.filter((v) => v !== value),
                            page: 1,
                          }));
                        }}
                      />
                      <span className="text-sm text-muted group-hover:text-ink transition-colors">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="bg-white rounded-xl border border-hairline p-4">
                <h3 className="text-xs font-bold text-ink uppercase tracking-wide mb-3">Khoảng giá (đ/kg)</h3>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={query.minPrice}
                    onChange={(e) => updateQuery({ minPrice: e.target.value })}
                    placeholder="Từ"
                    className="w-full h-8 px-2 text-sm border border-hairline rounded-lg outline-none focus:border-primary"
                  />
                  <span className="text-muted text-xs shrink-0">—</span>
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={query.maxPrice}
                    onChange={(e) => updateQuery({ maxPrice: e.target.value })}
                    placeholder="Đến"
                    className="w-full h-8 px-2 text-sm border border-hairline rounded-lg outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="bg-white rounded-xl border border-hairline p-4">
                <h3 className="text-xs font-bold text-ink uppercase tracking-wide mb-3">Đánh giá</h3>
                {[4.5, 4.0, 3.5].map((r) => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer py-1">
                    <input type="radio" name="rating" className="accent-primary" />
                    <div className="flex items-center gap-1">
                      <Star size={12} fill="#F59E0B" stroke="none" />
                      <span className="text-sm text-muted">{r}+ sao</span>
                    </div>
                  </label>
                ))}
              </div>

              {hasActiveFilters && (
                <Button variant="secondary" size="sm" onClick={clearFilters} className="gap-1.5">
                  <X size={13} /> Xóa bộ lọc
                </Button>
              )}
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0 flex flex-col min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted">
                {loading ? "Đang tải..." : (
                  <>
                    <span className="font-semibold text-ink">{sorted.length}</span> sản phẩm
                    {hasActiveFilters && <span className="text-primary"> (đã lọc)</span>}
                    {productsFetching && <span className="text-muted"> · đang cập nhật</span>}
                  </>
                )}
              </p>
              <div className="flex items-center gap-2">
                {/* View toggle */}
                <div className="flex items-center gap-0.5 border border-hairline rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn("w-7 h-7 rounded flex items-center justify-center transition-colors",
                      viewMode === "grid" ? "bg-primary text-white" : "text-muted hover:text-ink"
                    )}
                  ><Grid3X3 size={14} /></button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn("w-7 h-7 rounded flex items-center justify-center transition-colors",
                      viewMode === "list" ? "bg-primary text-white" : "text-muted hover:text-ink"
                    )}
                  ><List size={14} /></button>
                </div>

                {/* Sort dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowSortDropdown((v) => !v)}
                    className="flex items-center gap-2 border border-hairline rounded-lg px-3 h-9 text-sm text-ink hover:border-primary transition-colors bg-white"
                  >
                    {sortLabel} <ChevronDown size={14} className="text-muted" />
                  </button>
                  {showSortDropdown && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setShowSortDropdown(false)} />
                      <div className="absolute right-0 top-10 z-30 bg-white border border-hairline rounded-xl shadow-lg py-1.5 w-48">
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              updateQuery({ sort: opt.value });
                              setShowSortDropdown(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-2 text-sm transition-colors",
                              query.sort === opt.value
                                ? "text-primary font-semibold bg-primary-ultra-light"
                                : "text-ink hover:bg-surface-soft"
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {query.search && (
                  <span className="flex items-center gap-1.5 text-xs bg-primary-ultra-light text-primary px-3 py-1 rounded-full font-medium">
                    &ldquo;{query.search}&rdquo;
                    <button
                      onClick={() => {
                        setSearchInput("");
                        updateQuery({ search: "" });
                      }}
                    >
                      <X size={11} />
                    </button>
                  </span>
                )}
                {query.province !== "Tất cả" && (
                  <span className="flex items-center gap-1.5 text-xs bg-primary-ultra-light text-primary px-3 py-1 rounded-full font-medium">
                    {query.province}
                    <button onClick={() => updateQuery({ province: "Tất cả" })}><X size={11} /></button>
                  </span>
                )}
                {(query.minPrice || query.maxPrice) && (
                  <span className="flex items-center gap-1.5 text-xs bg-primary-ultra-light text-primary px-3 py-1 rounded-full font-medium">
                    {query.minPrice || "0"}đ - {query.maxPrice || "∞"}đ
                    <button onClick={() => updateQuery({ minPrice: "", maxPrice: "" })}><X size={11} /></button>
                  </span>
                )}
                {query.farmingTypes.map((v) => (
                  <span key={v} className="flex items-center gap-1.5 text-xs bg-primary-ultra-light text-primary px-3 py-1 rounded-full font-medium">
                    {FARMING_TYPE_OPTIONS.find((f) => f.value === v)?.label}
                    <button
                      onClick={() => {
                        setQuery((current) => ({
                          ...current,
                          farmingTypes: current.farmingTypes.filter((x) => x !== v),
                          page: 1,
                        }));
                      }}
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: LIMIT }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-hairline overflow-hidden animate-pulse">
                    <div className="aspect-4/3 bg-surface-soft" />
                    <div className="p-4 flex flex-col gap-2">
                      <div className="h-4 bg-surface-soft rounded w-3/4" />
                      <div className="h-3 bg-surface-soft rounded w-1/2" />
                      <div className="h-5 bg-surface-soft rounded w-1/3 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Product grid */}
            {!loading && products.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-4xl mb-3">🌾</p>
                <p className="font-semibold text-ink mb-1">Không tìm thấy sản phẩm</p>
                <p className="text-sm text-muted mb-4">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                <Button variant="secondary" size="sm" onClick={clearFilters}>Xóa bộ lọc</Button>
                {/* AD SLOT: empty-state — gợi ý nông cụ khi không có sản phẩm */}
                <div className="mt-8 max-w-md mx-auto">
                  <AdBanner slotId="inline" index={0} />
                </div>
              </div>
            )}

            {!loading && products.length > 0 && (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {products.map((product, idx) => (
                    <>
                      <ProductGridCard key={product.id} product={product} />
                      {/* Native ad after row 3 (index 8 = end of 3rd row in 3-col grid) */}
                      {idx === 8 && (
                        <div key="native-ad-row3" className="col-span-full">
                          <AdBanner slotId="below-hero" index={0} />
                        </div>
                      )}
                    </>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {products.map((product, idx) => (
                    <>
                      <ProductListCard key={product.id} product={product} />
                      {idx === 4 && (
                        <div key="native-ad-list">
                          <AdBanner slotId="inline" index={0} />
                        </div>
                      )}
                    </>
                  ))}
                </div>
              )
            )}

            {/* Pagination */}
            {!loading && totalPages > 0 && (
              <div className="flex items-center justify-center gap-1.5 mt-auto pt-8">
                <button
                  onClick={() => updateQuery({ page: Math.max(1, currentPage - 1) }, false)}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-lg border border-hairline flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  // Show first, last, current ±1, and ellipsis
                  const show = p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1;
                  const ellipsisAfter = p === 1 && currentPage > 3;
                  const ellipsisBefore = p === totalPages && currentPage < totalPages - 2;
                  if (!show) return null;
                  return (
                    <span key={p} className="flex items-center gap-1.5">
                      {ellipsisAfter && <span className="text-muted text-sm px-1">…</span>}
                      <button
                        onClick={() => updateQuery({ page: p }, false)}
                        className={cn(
                          "w-9 h-9 rounded-lg text-sm font-medium transition-all",
                          p === currentPage
                            ? "bg-primary text-white shadow-sm"
                            : "border border-hairline text-muted hover:border-primary hover:text-primary"
                        )}
                      >{p}</button>
                      {ellipsisBefore && <span className="text-muted text-sm px-1">…</span>}
                    </span>
                  );
                })}

                <button
                  onClick={() => updateQuery({ page: Math.min(totalPages, currentPage + 1) }, false)}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-lg border border-hairline flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Page info */}
            {!loading && totalPages > 1 && (
              <p className="text-center text-xs text-muted mt-3">
                Trang {currentPage} / {totalPages}
              </p>
            )}

          </div>

          {/* ── Right ad column ───────────────────────────────── */}
          <aside className="w-52 shrink-0 hidden xl:block">
            <div className="sticky top-28 flex flex-col gap-4">
              <AdBanner slotId="sidebar" index={0} />
              <AdBanner slotId="sidebar" index={1} />
            </div>
          </aside>

        </div>
      </div>

      <Footer />
    </div>
  );
}
