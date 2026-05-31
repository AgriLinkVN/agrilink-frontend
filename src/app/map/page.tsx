"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Filter, X, Layers, ZoomIn, ZoomOut, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { MapboxCanvas } from "@/components/map/mapbox-canvas";

const PROVINCES_DATA = [
  { name: "Lâm Đồng", region: "Tây Nguyên", products: ["Rau", "Cà phê", "Hoa"], area: "9,773 km²", farms: 1240 },
  { name: "Tiền Giang", region: "Nam Bộ", products: ["Xoài", "Sầu riêng", "Lúa gạo"], area: "2,484 km²", farms: 2100 },
  { name: "Bình Thuận", region: "Nam Trung Bộ", products: ["Thanh long", "Điều"], area: "7,812 km²", farms: 890 },
  { name: "Sóc Trăng", region: "Nam Bộ", products: ["Gạo ST25", "Tôm"], area: "3,312 km²", farms: 1560 },
  { name: "Gia Lai", region: "Tây Nguyên", products: ["Cà phê", "Hồ tiêu"], area: "15,537 km²", farms: 670 },
  { name: "Đắk Lắk", region: "Tây Nguyên", products: ["Cà phê", "Sầu riêng"], area: "13,125 km²", farms: 980 },
];

const FARMING_TYPES = ["Tất cả", "Hữu cơ", "VietGAP", "GlobalGAP", "Truyền thống"];
const PRODUCTS_FILTER = ["Tất cả", "Lúa gạo", "Rau củ", "Trái cây", "Cà phê", "Thủy sản"];
const SEASONS = ["Tất cả", "Tháng 6-8", "Tháng 9-11", "Tháng 12-2", "Tháng 3-5"];

export default function MapPage() {
  const [showFilter, setShowFilter] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState("Tất cả");
  const [selectedFarming, setSelectedFarming] = useState("Tất cả");

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Navbar />

      <div className="flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 72px)" }}>
        {/* Filter panel */}
        {showFilter && (
          <div className="w-80 shrink-0 bg-white border-r border-hairline flex flex-col overflow-hidden">
            <div className="p-5 border-b border-hairline flex items-center justify-between">
              <h2 className="font-semibold text-ink flex items-center gap-2">
                <Filter size={18} className="text-primary" /> Bộ lọc bản đồ
              </h2>
              <button onClick={() => setShowFilter(false)} className="w-8 h-8 rounded-lg hover:bg-surface-soft flex items-center justify-center text-muted">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
              {/* Search province */}
              <div className="flex items-center gap-2 h-10 px-3 rounded-lg border border-border-strong focus-within:border-primary transition-colors">
                <Search size={15} className="text-muted" />
                <input type="text" placeholder="Tìm tỉnh thành..." className="flex-1 text-sm outline-none placeholder:text-muted-soft" />
              </div>

              {/* Product filter */}
              <div>
                <h3 className="text-sm font-semibold text-ink mb-3">Loại nông sản</h3>
                <div className="flex flex-wrap gap-2">
                  {PRODUCTS_FILTER.map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedProduct(p)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                        selectedProduct === p ? "bg-primary text-white" : "border border-hairline text-muted hover:border-primary hover:text-primary"
                      )}
                    >{p}</button>
                  ))}
                </div>
              </div>

              {/* Farming type */}
              <div>
                <h3 className="text-sm font-semibold text-ink mb-3">Loại canh tác</h3>
                <div className="flex flex-wrap gap-2">
                  {FARMING_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedFarming(t)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                        selectedFarming === t ? "bg-primary text-white" : "border border-hairline text-muted hover:border-primary hover:text-primary"
                      )}
                    >{t}</button>
                  ))}
                </div>
              </div>

              {/* Season */}
              <div>
                <h3 className="text-sm font-semibold text-ink mb-3">Mùa thu hoạch</h3>
                <div className="flex flex-col gap-1">
                  {SEASONS.map((s) => (
                    <label key={s} className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-surface-soft cursor-pointer">
                      <input type="radio" name="season" className="accent-primary" defaultChecked={s === "Tất cả"} />
                      <span className="text-sm text-muted">{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button variant="secondary" size="sm">Xóa bộ lọc</Button>
            </div>

            {/* Province list */}
            <div className="border-t border-hairline p-4">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Tỉnh trọng điểm (34)</h3>
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                {PROVINCES_DATA.map((prov) => (
                  <button
                    key={prov.name}
                    onClick={() => setSelectedProvince(prov.name === selectedProvince ? null : prov.name)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all",
                      selectedProvince === prov.name ? "bg-primary-ultra-light text-primary font-semibold" : "text-muted hover:text-ink hover:bg-surface-soft"
                    )}
                  >
                    <MapPin size={13} className={selectedProvince === prov.name ? "text-primary" : "text-muted"} />
                    {prov.name}
                    <span className="ml-auto text-xs opacity-70">{prov.farms}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Map area */}
        <div className="flex-1 relative bg-surface-green overflow-hidden">
          {/* Map placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-primary-ultra-light border-4 border-primary-light flex items-center justify-center mx-auto mb-4">
                <MapPin size={48} className="text-primary" />
              </div>
              <p className="text-lg font-semibold text-primary mb-2">Bản đồ GIS tương tác</p>
              <p className="text-sm text-muted mb-1">MapBox GL · Turf.js · 34 tỉnh thành</p>
              <p className="text-xs text-muted">Tích hợp trong Phase 2</p>
            </div>
          </div>

          {/* Mock province markers */}
          <div className="absolute inset-0">
            {[
              { name: "Tiền Giang", x: "38%", y: "72%", count: 2100 },
              { name: "Lâm Đồng", x: "55%", y: "62%", count: 1240 },
              { name: "Bình Thuận", x: "60%", y: "58%", count: 890 },
              { name: "Sóc Trăng", x: "35%", y: "78%", count: 1560 },
              { name: "Gia Lai", x: "52%", y: "48%", count: 670 },
            ].map(({ name, x, y, count }) => (
              <button
                key={name}
                onClick={() => setSelectedProvince(name)}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group",
                )}
                style={{ left: x, top: y }}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full border-4 border-white flex items-center justify-center text-white text-xs font-bold card-shadow transition-all",
                  selectedProvince === name ? "bg-primary-active scale-125" : "bg-primary group-hover:scale-110"
                )}>
                  {count > 1000 ? `${(count/1000).toFixed(1)}k` : count}
                </div>
                <span className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full bg-white card-shadow whitespace-nowrap",
                  selectedProvince === name ? "text-primary" : "text-ink"
                )}>{name}</span>
              </button>
            ))}
          </div>

          <MapboxCanvas />

          {/* Map controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {!showFilter && (
              <button onClick={() => setShowFilter(true)} className="w-10 h-10 bg-white rounded-xl card-shadow flex items-center justify-center text-muted hover:text-primary transition-colors">
                <Filter size={18} />
              </button>
            )}
            <button className="w-10 h-10 bg-white rounded-xl card-shadow flex items-center justify-center text-muted hover:text-primary transition-colors">
              <Layers size={18} />
            </button>
            <button className="w-10 h-10 bg-white rounded-xl card-shadow flex items-center justify-center text-muted hover:text-primary transition-colors">
              <ZoomIn size={18} />
            </button>
            <button className="w-10 h-10 bg-white rounded-xl card-shadow flex items-center justify-center text-muted hover:text-primary transition-colors">
              <ZoomOut size={18} />
            </button>
          </div>

          {/* Province info panel */}
          {selectedProvince && (
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 bg-white rounded-2xl card-shadow p-5 border border-hairline">
              {(() => {
                const prov = PROVINCES_DATA.find(p => p.name === selectedProvince);
                if (!prov) return null;
                return (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-ink">{prov.name}</h3>
                        <p className="text-xs text-muted">{prov.region} · {prov.area}</p>
                      </div>
                      <button onClick={() => setSelectedProvince(null)} className="w-8 h-8 rounded-full hover:bg-surface-soft flex items-center justify-center text-muted">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-surface-green rounded-lg p-3">
                        <p className="text-xs text-muted">Số nông trại</p>
                        <p className="text-lg font-bold text-primary">{prov.farms.toLocaleString("vi-VN")}</p>
                      </div>
                      <div className="bg-surface-green rounded-lg p-3">
                        <p className="text-xs text-muted">Sản phẩm đặc trưng</p>
                        <p className="text-sm font-semibold text-ink">{prov.products.length} loại</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {prov.products.map(p => <Badge key={p} variant="organic">{p}</Badge>)}
                    </div>
                    <Button size="sm" className="w-full" asChild>
                      <a href={`/marketplace?province=${prov.name}`}>Xem sản phẩm tại {prov.name}</a>
                    </Button>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
