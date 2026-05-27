"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, MapPin, Star, SlidersHorizontal, Grid3X3, List, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge, FarmingBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PRODUCTS = [
  { id: "1", name: "Xoài cát Hòa Lộc loại 1", province: "Tiền Giang", price: 45000, unit: "kg", farming_type: "vietgap" as const, rating: 4.8, sold: 1200, seller: "HTX Xoài Cát Tiền Giang", stock: 500, harvest_date: "15/06/2025", icon: "🥭" },
  { id: "2", name: "Rau muống hữu cơ Đà Lạt", province: "Lâm Đồng", price: 25000, unit: "kg", farming_type: "organic" as const, rating: 4.9, sold: 890, seller: "Nông trại Xanh", stock: 200, harvest_date: "01/06/2025", icon: "🥬" },
  { id: "3", name: "Thanh long ruột đỏ xuất khẩu", province: "Bình Thuận", price: 35000, unit: "kg", farming_type: "globalgap" as const, rating: 4.7, sold: 2100, seller: "HTX Thanh Long BT", stock: 1000, harvest_date: "20/06/2025", icon: "🍈" },
  { id: "4", name: "Gạo ST25 đặc sản Sóc Trăng", province: "Sóc Trăng", price: 28000, unit: "kg", farming_type: "vietgap" as const, rating: 4.9, sold: 5400, seller: "Hộ Hồ Quang Cua", stock: 2000, harvest_date: "30/05/2025", icon: "🌾" },
  { id: "5", name: "Cà phê Arabica Cầu Đất", province: "Lâm Đồng", price: 120000, unit: "kg", farming_type: "organic" as const, rating: 4.8, sold: 340, seller: "Nông trại Cầu Đất Farm", stock: 150, harvest_date: "Tháng 12/2025", icon: "☕" },
  { id: "6", name: "Bưởi da xanh Bến Tre", province: "Bến Tre", price: 32000, unit: "kg", farming_type: "vietgap" as const, rating: 4.6, sold: 780, seller: "HTX Bưởi Bến Tre", stock: 800, harvest_date: "01/07/2025", icon: "🍋" },
  { id: "7", name: "Dưa hấu không hạt", province: "Long An", price: 18000, unit: "kg", farming_type: "traditional" as const, rating: 4.5, sold: 1500, seller: "Hộ ông Trần Văn Bình", stock: 3000, harvest_date: "10/06/2025", icon: "🍉" },
  { id: "8", name: "Sầu riêng Ri6 Tiền Giang", province: "Tiền Giang", price: 85000, unit: "kg", farming_type: "vietgap" as const, rating: 4.9, sold: 2800, seller: "HTX Sầu Riêng Cai Lậy", stock: 600, harvest_date: "15/07/2025", icon: "🥝" },
];

const PROVINCES = ["Tất cả", "Tiền Giang", "Lâm Đồng", "Bình Thuận", "Sóc Trăng", "Bến Tre", "Long An", "Đà Lạt"];
const FARMING_TYPES = ["Tất cả", "Hữu cơ", "VietGAP", "GlobalGAP", "Truyền thống"];
const CATEGORIES = ["Tất cả", "Lúa gạo", "Rau củ", "Trái cây", "Thủy sản", "Cà phê - Gia vị"];
const SORT_OPTIONS = ["Phổ biến nhất", "Giá thấp → cao", "Giá cao → thấp", "Mới nhất", "Đánh giá cao"];

export default function MarketplacePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProvince, setSelectedProvince] = useState("Tất cả");
  const [selectedSort, setSelectedSort] = useState("Phổ biến nhất");
  const [showFilters, setShowFilters] = useState(false);

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
                placeholder="Tìm sản phẩm, vùng trồng, HTX..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-soft"
              />
            </div>
            <Button className="rounded-full px-6">Tìm kiếm</Button>
            <Button variant="secondary" className="rounded-full gap-2" onClick={() => setShowFilters(!showFilters)}>
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
                      onClick={() => setSelectedProvince(p)}
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
                  {FARMING_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="accent-primary w-4 h-4 rounded" defaultChecked={type === "Tất cả"} />
                      <span className="text-sm text-muted group-hover:text-ink transition-colors">{type}</span>
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

              <Button variant="secondary" size="sm">Xóa bộ lọc</Button>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted">
                Hiển thị <span className="font-semibold text-ink">{PRODUCTS.length}</span> sản phẩm
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

            {/* Product grid */}
            <div className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                : "flex flex-col gap-4"
            )}>
              {PRODUCTS.map((product) => (
                viewMode === "grid" ? (
                  <Link
                    key={product.id}
                    href={`/marketplace/${product.id}`}
                    className="group bg-white rounded-xl border border-hairline overflow-hidden card-shadow card-shadow-hover"
                  >
                    <div className="aspect-4/3 bg-surface-green flex items-center justify-center text-5xl relative">
                      {product.icon}
                      <div className="absolute top-3 right-3">
                        <button className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                          ♡
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start gap-2 mb-1.5">
                        <h3 className="text-sm font-semibold text-ink flex-1 leading-tight group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <FarmingBadge type={product.farming_type} />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted mb-2">
                        <MapPin size={11} className="text-primary" />{product.province}
                        <span className="mx-1">·</span>
                        <span>Còn {product.stock.toLocaleString("vi-VN")} {product.unit}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        <Star size={12} fill="#F59E0B" stroke="none" />
                        <span className="text-xs font-semibold text-ink">{product.rating}</span>
                        <span className="text-xs text-muted">· Đã bán {product.sold.toLocaleString("vi-VN")} {product.unit}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-primary">{product.price.toLocaleString("vi-VN")}đ</span>
                          <span className="text-xs text-muted">/{product.unit}</span>
                        </div>
                        <Button size="sm" className="text-xs h-8 px-3">Đặt mua</Button>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <Link
                    key={product.id}
                    href={`/marketplace/${product.id}`}
                    className="group bg-white rounded-xl border border-hairline p-4 card-shadow card-shadow-hover flex items-center gap-4"
                  >
                    <div className="w-20 h-20 rounded-xl bg-surface-green flex items-center justify-center text-3xl shrink-0">
                      {product.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-ink group-hover:text-primary transition-colors flex-1">{product.name}</h3>
                        <FarmingBadge type={product.farming_type} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted mb-1">
                        <span className="flex items-center gap-1"><MapPin size={11} className="text-primary" />{product.province}</span>
                        <span className="flex items-center gap-1"><Star size={11} fill="#F59E0B" stroke="none" />{product.rating}</span>
                        <span>Còn {product.stock.toLocaleString("vi-VN")} {product.unit}</span>
                      </div>
                      <p className="text-xs text-muted">{product.seller}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-lg font-bold text-primary">{product.price.toLocaleString("vi-VN")}đ</div>
                      <div className="text-xs text-muted mb-2">/{product.unit}</div>
                      <Button size="sm" className="text-xs h-8 px-3">Đặt mua</Button>
                    </div>
                  </Link>
                )
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-10">
              {[1,2,3,4,5].map((p) => (
                <button
                  key={p}
                  className={cn(
                    "w-9 h-9 rounded-lg text-sm font-medium transition-all",
                    p === 1 ? "bg-primary text-white" : "border border-hairline text-muted hover:border-primary hover:text-primary"
                  )}
                >{p}</button>
              ))}
              <span className="text-muted px-2">...</span>
              <button className="w-9 h-9 rounded-lg text-sm font-medium border border-hairline text-muted hover:border-primary hover:text-primary">12</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
