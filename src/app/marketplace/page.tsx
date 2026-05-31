"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search, MapPin, Star, SlidersHorizontal, Grid3X3, List,
  ChevronDown, Phone, ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { FarmingBadge } from "@/components/ui/badge";
import { PageHero } from "@/components/ui/page-hero";
import { cn } from "@/lib/utils";
import {
  fetchProducts,
  getPrimaryImage,
  getProductProvince,
  type Product,
} from "@/lib/products-api";

const PROVINCES = [
  "Tất cả", "Tiền Giang", "Lâm Đồng", "Bình Thuận",
  "Sóc Trăng", "Bến Tre", "Long An", "Đà Lạt", "Đồng Tháp",
];
const FARMING_TYPES: { label: string; value: string }[] = [
  { label: "Hữu cơ", value: "organic" },
  { label: "VietGAP", value: "vietgap" },
  { label: "GlobalGAP", value: "globalgap" },
  { label: "Truyền thống", value: "traditional" },
];
const CATEGORIES = ["Tất cả", "Lúa gạo", "Rau củ", "Trái cây", "Thủy sản", "Cà phê - Gia vị"];
const SORT_OPTIONS = [
  { label: "Mới nhất", value: "createdAt_DESC" },
  { label: "Giá thấp → cao", value: "price_ASC" },
  { label: "Giá cao → thấp", value: "price_DESC" },
  { label: "Xem nhiều nhất", value: "view_DESC" },
];

const LIMIT = 6;

function sortProducts(products: Product[], sortValue: string): Product[] {
  const arr = [...products];
  if (sortValue === "price_ASC") return arr.sort((a, b) => Number(a.pricePerUnit) - Number(b.pricePerUnit));
  if (sortValue === "price_DESC") return arr.sort((a, b) => Number(b.pricePerUnit) - Number(a.pricePerUnit));
  if (sortValue === "view_DESC") return arr.sort((a, b) => b.viewCount - a.viewCount);
  return arr; // createdAt_DESC — default order from API
}

export default function MarketplacePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProvince, setSelectedProvince] = useState("Tất cả");
  const [selectedSort, setSelectedSort] = useState("createdAt_DESC");
  const [selectedFarming, setSelectedFarming] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const farming = selectedFarming.length === 1 ? selectedFarming[0] : undefined;
    const result = await fetchProducts({ page: 1, limit: 100, search: search || undefined, farmingType: farming });
    setAllProducts(result.data);
    setTotal(result.total);
    setLoading(false);
  }, [search, selectedFarming]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search, selectedFarming, selectedProvince, selectedSort]);

  // Client-side sort + paginate
  const sorted = sortProducts(allProducts, selectedSort);
  const totalPages = Math.max(1, Math.ceil(sorted.length / LIMIT));
  const products = sorted.slice((page - 1) * LIMIT, page * LIMIT);

  const sortLabel = SORT_OPTIONS.find((o) => o.value === selectedSort)?.label ?? "Sắp xếp";
  const hasActiveFilters = selectedFarming.length > 0 || selectedProvince !== "Tất cả" || search;

  const clearFilters = () => {
    setSelectedFarming([]);
    setSelectedProvince("Tất cả");
    setSearch("");
    setSearchInput("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* Page hero — compact banner with wave, centered like about page */}
      <PageHero variant="compact">
        <div className="flex items-center justify-center h-full pb-8 text-center px-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4">
              <Search size={15} className="text-primary-ultra-light" />
              <span className="text-white text-sm font-medium">Sàn nông sản AgriLink</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight drop-shadow-lg">
              Nông sản Việt Nam<br />
              <span className="text-primary-ultra-light">chất lượng, minh bạch, trực tiếp</span>
            </h1>
            <p className="text-white/80 text-sm max-w-lg mx-auto">
              Kết nối trực tiếp người mua với hàng nghìn nông hộ, HTX và doanh nghiệp nông nghiệp trên toàn quốc.
            </p>
          </div>
        </div>
      </PageHero>

      {/* Category tabs — sticky, top-16 = navbar h-16 */}
      <div className="bg-white sticky top-16 z-10 -mt-px">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  selectedCategory === cat
                    ? "bg-primary text-white"
                    : "text-muted hover:text-ink hover:bg-surface-soft"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search bar — below category tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <div className="flex gap-3 max-w-2xl">
          <div className="flex-1 flex items-center gap-2 h-11 px-4 rounded-full border border-hairline bg-white card-shadow">
            <Search size={16} className="text-muted shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { setSearch(searchInput); setPage(1); } }}
              placeholder="Tìm sản phẩm, vùng trồng, HTX..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-soft"
            />
            {searchInput && (
              <button onClick={() => { setSearchInput(""); setSearch(""); }} className="text-muted hover:text-ink">
                <X size={14} />
              </button>
            )}
          </div>
          <Button className="rounded-full px-6 h-11" onClick={() => { setSearch(searchInput); setPage(1); }}>
            Tìm kiếm
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-7">

          {/* Sidebar */}
          <aside className="w-56 shrink-0 hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-5">

              {/* Province */}
              <div className="bg-white rounded-xl border border-hairline p-4">
                <h3 className="text-xs font-bold text-ink uppercase tracking-wide mb-3">Tỉnh thành</h3>
                <div className="flex flex-col gap-0.5">
                  {PROVINCES.map((p) => (
                    <button
                      key={p}
                      onClick={() => { setSelectedProvince(p); setPage(1); }}
                      className={cn(
                        "text-left px-3 py-1.5 rounded-lg text-sm transition-all",
                        selectedProvince === p
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
                  {FARMING_TYPES.map(({ label, value }) => (
                    <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="accent-primary w-4 h-4 rounded shrink-0"
                        checked={selectedFarming.includes(value)}
                        onChange={(e) => {
                          setSelectedFarming((prev) =>
                            e.target.checked ? [...prev, value] : prev.filter((v) => v !== value)
                          );
                          setPage(1);
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
                  <input type="number" placeholder="Từ" className="w-full h-8 px-2 text-sm border border-hairline rounded-lg outline-none focus:border-primary" />
                  <span className="text-muted text-xs shrink-0">—</span>
                  <input type="number" placeholder="Đến" className="w-full h-8 px-2 text-sm border border-hairline rounded-lg outline-none focus:border-primary" />
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
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted">
                {loading ? "Đang tải..." : (
                  <>
                    <span className="font-semibold text-ink">{sorted.length}</span> sản phẩm
                    {hasActiveFilters && <span className="text-primary"> (đã lọc)</span>}
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
                            onClick={() => { setSelectedSort(opt.value); setShowSortDropdown(false); }}
                            className={cn(
                              "w-full text-left px-4 py-2 text-sm transition-colors",
                              selectedSort === opt.value
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
                {search && (
                  <span className="flex items-center gap-1.5 text-xs bg-primary-ultra-light text-primary px-3 py-1 rounded-full font-medium">
                    &ldquo;{search}&rdquo;
                    <button onClick={() => { setSearch(""); setSearchInput(""); }}><X size={11} /></button>
                  </span>
                )}
                {selectedProvince !== "Tất cả" && (
                  <span className="flex items-center gap-1.5 text-xs bg-primary-ultra-light text-primary px-3 py-1 rounded-full font-medium">
                    {selectedProvince}
                    <button onClick={() => setSelectedProvince("Tất cả")}><X size={11} /></button>
                  </span>
                )}
                {selectedFarming.map((v) => (
                  <span key={v} className="flex items-center gap-1.5 text-xs bg-primary-ultra-light text-primary px-3 py-1 rounded-full font-medium">
                    {FARMING_TYPES.find((f) => f.value === v)?.label}
                    <button onClick={() => setSelectedFarming((prev) => prev.filter((x) => x !== v))}><X size={11} /></button>
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
              <div className="py-24 text-center">
                <p className="text-4xl mb-3">🌾</p>
                <p className="font-semibold text-ink mb-1">Không tìm thấy sản phẩm</p>
                <p className="text-sm text-muted mb-4">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                <Button variant="secondary" size="sm" onClick={clearFilters}>Xóa bộ lọc</Button>
              </div>
            )}

            {!loading && products.length > 0 && (
              <div className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                  : "flex flex-col gap-3"
              )}>
                {products.map((product) => {
                  const imageUrl = getPrimaryImage(product);
                  const province = getProductProvince(product);
                  return viewMode === "grid" ? (
                    <Link
                      key={product.id}
                      href={`/marketplace/${product.id}`}
                      className="group bg-white rounded-xl border border-hairline overflow-hidden card-shadow hover:border-primary/30 hover:shadow-md transition-all duration-200"
                    >
                      <div className="aspect-4/3 bg-surface-green relative overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                        {product.farmingType && (
                          <div className="absolute top-2.5 right-2.5">
                            <FarmingBadge type={product.farmingType} />
                          </div>
                        )}
                        {/* View count */}
                        <div className="absolute bottom-2 left-2.5 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded-full">
                          👁 {product.viewCount.toLocaleString("vi-VN")}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-ink mb-1 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-muted mb-0.5">
                          <MapPin size={10} className="text-primary shrink-0" />{province}
                        </div>
                        <div className="text-xs text-muted mb-3">
                          Còn <span className="font-medium text-ink">{Number(product.availableQuantity).toLocaleString("vi-VN")}</span> {product.unit}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-base font-bold text-primary">{Number(product.pricePerUnit).toLocaleString("vi-VN")}đ</span>
                            <span className="text-xs text-muted">/{product.unit}</span>
                          </div>
                          <button
                            onClick={(e) => e.preventDefault()}
                            className="flex items-center gap-1 text-xs px-3 h-8 rounded-full border border-hairline bg-surface-green text-primary font-medium hover:border-primary hover:bg-primary hover:text-white transition-all"
                          >
                            <Phone size={11} /> Liên hệ
                          </button>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      key={product.id}
                      href={`/marketplace/${product.id}`}
                      className="group bg-white rounded-xl border border-hairline px-4 py-3.5 card-shadow hover:border-primary/30 hover:shadow-md transition-all duration-200 flex items-center gap-4"
                    >
                      <div className="w-18 h-18 rounded-xl bg-surface-green relative overflow-hidden shrink-0">
                        <Image src={imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="72px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-ink group-hover:text-primary transition-colors flex-1 line-clamp-1">{product.name}</h3>
                          {product.farmingType && <FarmingBadge type={product.farmingType} />}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted">
                          <span className="flex items-center gap-1"><MapPin size={10} className="text-primary" />{province}</span>
                          <span>Còn {Number(product.availableQuantity).toLocaleString("vi-VN")} {product.unit}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-base font-bold text-primary">{Number(product.pricePerUnit).toLocaleString("vi-VN")}đ</div>
                        <div className="text-xs text-muted mb-2">/{product.unit}</div>
                        <button
                          onClick={(e) => e.preventDefault()}
                          className="flex items-center gap-1 text-xs px-3 h-7 rounded-full border border-hairline bg-surface-green text-primary font-medium hover:border-primary transition-colors"
                        >
                          <Phone size={10} /> Liên hệ
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 0 && (
              <div className="flex items-center justify-center gap-1.5 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 rounded-lg border border-hairline flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  // Show first, last, current ±1, and ellipsis
                  const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                  const ellipsisAfter = p === 1 && page > 3;
                  const ellipsisBefore = p === totalPages && page < totalPages - 2;
                  if (!show) return null;
                  return (
                    <span key={p} className="flex items-center gap-1.5">
                      {ellipsisAfter && <span className="text-muted text-sm px-1">…</span>}
                      <button
                        onClick={() => setPage(p)}
                        className={cn(
                          "w-9 h-9 rounded-lg text-sm font-medium transition-all",
                          p === page
                            ? "bg-primary text-white shadow-sm"
                            : "border border-hairline text-muted hover:border-primary hover:text-primary"
                        )}
                      >{p}</button>
                      {ellipsisBefore && <span className="text-muted text-sm px-1">…</span>}
                    </span>
                  );
                })}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 rounded-lg border border-hairline flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Page info */}
            {!loading && totalPages > 1 && (
              <p className="text-center text-xs text-muted mt-3">
                Trang {page} / {totalPages}
              </p>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
