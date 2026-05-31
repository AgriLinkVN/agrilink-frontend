"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Star, SlidersHorizontal, Grid3X3, List, ChevronDown, Phone } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { FarmingBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  fetchProducts,
  getPrimaryImage,
  getProductProvince,
  type Product,
} from "@/lib/products-api";

const PROVINCES = ["Tất cả", "Tiền Giang", "Lâm Đồng", "Bình Thuận", "Sóc Trăng", "Bến Tre", "Long An"];
const FARMING_TYPES: { label: string; value: string }[] = [
  { label: "Hữu cơ", value: "organic" },
  { label: "VietGAP", value: "vietgap" },
  { label: "GlobalGAP", value: "globalgap" },
  { label: "Truyền thống", value: "traditional" },
];
const CATEGORIES = ["Tất cả", "Lúa gạo", "Rau củ", "Trái cây", "Thủy sản", "Cà phê - Gia vị"];
const SORT_OPTIONS = ["Mới nhất", "Giá thấp → cao", "Giá cao → thấp"];

export default function MarketplacePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProvince, setSelectedProvince] = useState("Tất cả");
  const [selectedSort, setSelectedSort] = useState("Mới nhất");
  const [selectedFarming, setSelectedFarming] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 12;

  const load = useCallback(async () => {
    setLoading(true);
    const farming = selectedFarming.length === 1 ? selectedFarming[0] : undefined;
    const result = await fetchProducts({ page, limit, search: search || undefined, farmingType: farming });
    setProducts(result.data);
    setTotal(result.total);
    setLoading(false);
  }, [page, search, selectedFarming]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* Page header */}
      <div className="bg-surface-soft border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-ink mb-4">Sàn nông sản AgriLink</h1>

          {/* Search bar */}
          <div className="flex gap-3 max-w-2xl">
            <div className="flex-1 flex items-center gap-2 h-12 px-4 rounded-full border border-hairline bg-white card-shadow">
              <Search size={16} className="text-muted shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { setSearch(searchInput); setPage(1); } }}
                placeholder="Tìm sản phẩm, vùng trồng, HTX..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-soft"
              />
            </div>
            <Button className="rounded-full px-6" onClick={() => { setSearch(searchInput); setPage(1); }}>
              Tìm kiếm
            </Button>
            <Button variant="secondary" className="rounded-full gap-2">
              <SlidersHorizontal size={16} /> Bộ lọc
            </Button>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="border-b border-hairline bg-white sticky top-[72px] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  cat === "Tất cả"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar filters — desktop */}
          <aside className="w-60 shrink-0 hidden lg:block">
            <div className="sticky top-36 flex flex-col gap-6">
              {/* Province */}
              <div>
                <h3 className="text-sm font-semibold text-ink mb-3">Tỉnh thành</h3>
                <div className="flex flex-col gap-1">
                  {PROVINCES.map((p) => (
                    <button
                      key={p}
                      onClick={() => { setSelectedProvince(p); setPage(1); }}
                      className={cn(
                        "text-left px-3 py-2 rounded-lg text-sm transition-all",
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
              <div>
                <h3 className="text-sm font-semibold text-ink mb-3">Loại canh tác</h3>
                <div className="flex flex-col gap-2">
                  {FARMING_TYPES.map(({ label, value }) => (
                    <label key={value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="accent-primary w-4 h-4 rounded"
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
              <div>
                <h3 className="text-sm font-semibold text-ink mb-3">Khoảng giá (đ/kg)</h3>
                <div className="flex gap-2 items-center">
                  <input type="number" placeholder="Từ" className="w-full h-9 px-3 text-sm border border-border-strong rounded-lg outline-none focus:border-primary" />
                  <span className="text-muted shrink-0">—</span>
                  <input type="number" placeholder="Đến" className="w-full h-9 px-3 text-sm border border-border-strong rounded-lg outline-none focus:border-primary" />
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-sm font-semibold text-ink mb-3">Đánh giá</h3>
                {[4.5, 4.0, 3.5].map((r) => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer py-1">
                    <input type="radio" name="rating" className="accent-primary" />
                    <Star size={13} fill="#F59E0B" stroke="none" />
                    <span className="text-sm text-muted">{r}+ sao</span>
                  </label>
                ))}
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedFarming([]);
                  setSelectedProvince("Tất cả");
                  setSearch("");
                  setSearchInput("");
                  setPage(1);
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted">
                {loading ? (
                  "Đang tải..."
                ) : (
                  <>Hiển thị <span className="font-semibold text-ink">{products.length}</span> / <span className="font-semibold text-ink">{total}</span> sản phẩm</>
                )}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 border border-hairline rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn("w-8 h-8 rounded flex items-center justify-center transition-colors",
                      viewMode === "grid" ? "bg-primary text-white" : "text-muted hover:text-ink"
                    )}
                  ><Grid3X3 size={16} /></button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn("w-8 h-8 rounded flex items-center justify-center transition-colors",
                      viewMode === "list" ? "bg-primary text-white" : "text-muted hover:text-ink"
                    )}
                  ><List size={16} /></button>
                </div>
                <div className="flex items-center gap-2 border border-hairline rounded-lg px-3 h-9 cursor-pointer hover:border-primary transition-colors">
                  <span className="text-sm text-ink">{selectedSort}</span>
                  <ChevronDown size={14} className="text-muted" />
                </div>
              </div>
            </div>

            {/* Loading skeleton */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
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
            {!loading && (
              <div className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                  : "flex flex-col gap-4"
              )}>
                {products.map((product) => {
                  const imageUrl = getPrimaryImage(product);
                  const province = getProductProvince(product);
                  return viewMode === "grid" ? (
                    <Link
                      key={product.id}
                      href={`/marketplace/${product.id}`}
                      className="group bg-white rounded-xl border border-hairline overflow-hidden card-shadow card-shadow-hover"
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
                          <div className="absolute top-3 right-3">
                            <FarmingBadge type={product.farmingType} />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-ink mb-1.5 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-muted mb-2">
                          <MapPin size={11} className="text-primary shrink-0" />{province}
                          <span className="mx-1">·</span>
                          <span>Còn {product.availableQuantity.toLocaleString("vi-VN")} {product.unit}</span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <span className="text-lg font-bold text-primary">{Number(product.pricePerUnit).toLocaleString("vi-VN")}đ</span>
                            <span className="text-xs text-muted">/{product.unit}</span>
                          </div>
                          <Button size="sm" variant="secondary" className="text-xs h-8 px-3 gap-1.5">
                            <Phone size={12} />Liên hệ
                          </Button>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      key={product.id}
                      href={`/marketplace/${product.id}`}
                      className="group bg-white rounded-xl border border-hairline p-4 card-shadow card-shadow-hover flex items-center gap-4"
                    >
                      <div className="w-20 h-20 rounded-xl bg-surface-green relative overflow-hidden shrink-0">
                        <Image src={imageUrl} alt={product.name} fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-ink group-hover:text-primary transition-colors flex-1 truncate">{product.name}</h3>
                          {product.farmingType && <FarmingBadge type={product.farmingType} />}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted mb-1">
                          <span className="flex items-center gap-1"><MapPin size={11} className="text-primary" />{province}</span>
                          <span>Còn {product.availableQuantity.toLocaleString("vi-VN")} {product.unit}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-lg font-bold text-primary">{Number(product.pricePerUnit).toLocaleString("vi-VN")}đ</div>
                        <div className="text-xs text-muted mb-2">/{product.unit}</div>
                        <Button size="sm" variant="secondary" className="text-xs h-8 px-3 gap-1.5"><Phone size={12} />Liên hệ</Button>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={cn(
                        "w-9 h-9 rounded-lg text-sm font-medium transition-all",
                        p === page ? "bg-primary text-white" : "border border-hairline text-muted hover:border-primary hover:text-primary"
                      )}
                    >{p}</button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
