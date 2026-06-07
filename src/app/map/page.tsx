"use client";

import { useState, useMemo, useCallback } from "react";
import ReactDOM from "react-dom";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Filter, X, Search, ChevronRight, Users, Ruler, TrendingUp, GitMerge } from "lucide-react";
import { cn } from "@/lib/utils";
import { VietnamMapbox } from "@/components/map/vietnam-mapbox";
import { vietnamProvinces, type VietnamProvince } from "@/lib/vietnam-provinces";
import { REGION_LABELS_VI, type Region } from "@/data/province-mapping";

/* ── Bộ lọc ──────────────────────────────────────────────── */

const REGIONS = [
  { key: "all", label: "Tất cả" },
  { key: "North", label: "Miền Bắc" },
  { key: "Central", label: "Miền Trung" },
  { key: "Highlands", label: "Tây Nguyên" },
  { key: "South", label: "Miền Nam" },
] as const;

const PRODUCTS_FILTER = ["Tất cả", "Lúa gạo", "Rau củ", "Trái cây", "Cà phê", "Thủy sản"] as const;

const FARMING_TYPES = ["Tất cả", "Hữu cơ", "VietGAP", "GlobalGAP", "Truyền thống"] as const;

const FARMING_MAP: Record<string, string> = {
  "Hữu cơ": "Organic",
  "VietGAP": "VietGAP",
  "GlobalGAP": "GlobalGAP",
  "Truyền thống": "Traditional",
};

const PRODUCT_MAP: Record<string, string[]> = {
  "Lúa gạo": ["Rice", "ST25"],
  "Rau củ": ["Vegetables", "Carrot", "Garlic"],
  "Trái cây": ["Mango", "Durian", "Dragon fruit", "Longan", "Coconut", "Pomelo", "Orange", "Lychee", "Grape", "Pineapple", "Fruit", "Banana"],
  "Cà phê": ["Coffee"],
  "Thủy sản": ["Seafood", "Shrimp", "Crab", "Fish", "Tuna"],
};

/* ── Group provinces by region ──────────────────────────────── */

const PROVINCE_GROUPS = (["North", "Central", "Highlands", "South"] as Region[]).map(region => ({
  region,
  label: REGION_LABELS_VI[region],
  provinces: vietnamProvinces.filter(p => p.region === region),
}));

/* ── Trang chính ─────────────────────────────────────────── */

export default function MapPage() {
  ReactDOM.preconnect("https://api.mapbox.com", { crossOrigin: "anonymous" });
  ReactDOM.preconnect("https://events.mapbox.com", { crossOrigin: "anonymous" });

  const [showFilter, setShowFilter] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState<VietnamProvince | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("Tất cả");
  const [selectedFarming, setSelectedFarming] = useState("Tất cả");
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);

  /* ── Lọc danh sách tỉnh ── */
  const filteredProvinces = useMemo(() => {
    return vietnamProvinces.filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.nameVi.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (selectedRegion !== "all" && p.region !== selectedRegion) return false;
      if (selectedProduct !== "Tất cả") {
        const keywords = PRODUCT_MAP[selectedProduct] || [];
        if (!p.products.some((prod) => keywords.some((kw) => prod.includes(kw)))) return false;
      }
      if (selectedFarming !== "Tất cả") {
        const key = FARMING_MAP[selectedFarming];
        if (key && !p.farmingTypes.includes(key)) return false;
      }
      return true;
    });
  }, [searchQuery, selectedRegion, selectedProduct, selectedFarming]);

  /** Mã tỉnh đã filter — pass xuống map để dim tỉnh không match */
  const filteredProvinceCodes = useMemo(() => {
    const hasFilter = searchQuery !== "" || selectedRegion !== "all" || selectedProduct !== "Tất cả" || selectedFarming !== "Tất cả";
    if (!hasFilter) return undefined;
    return filteredProvinces.map(p => p.code);
  }, [filteredProvinces, searchQuery, selectedRegion, selectedProduct, selectedFarming]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedRegion("all");
    setSelectedProduct("Tất cả");
    setSelectedFarming("Tất cả");
  };

  const hasActiveFilter =
    searchQuery !== "" ||
    selectedRegion !== "all" ||
    selectedProduct !== "Tất cả" ||
    selectedFarming !== "Tất cả";

  const handleSelectProvince = useCallback((prov: VietnamProvince) => {
    setSelectedProvince(prev => prev?.code === prov.code ? null : prov);
  }, []);

  return (
    <div className="h-dvh bg-canvas flex flex-col">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* ── Sidebar bộ lọc ── */}
        {showFilter && (
          <div className="w-80 shrink-0 bg-white border-r border-hairline flex flex-col overflow-hidden overscroll-contain">
            {/* Header */}
            <div className="p-5 border-b border-hairline flex items-center justify-between">
              <h2 className="font-semibold text-ink flex items-center gap-2">
                <Filter size={18} className="text-primary" /> Bộ lọc bản đồ
              </h2>
              <button
                onClick={() => setShowFilter(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-soft flex items-center justify-center text-muted"
              >
                <X size={16} />
              </button>
            </div>

            {/* Bộ lọc */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-5 flex flex-col gap-5">
              {/* Tìm kiếm */}
              <div className="flex items-center gap-2 h-10 px-3 rounded-lg border border-border-strong focus-within:border-primary transition-colors">
                <Search size={15} className="text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm tỉnh thành..."
                  className="flex-1 text-sm outline-none placeholder:text-muted-soft"
                />
              </div>

              {/* Vùng miền */}
              <div>
                <h3 className="text-sm font-semibold text-ink mb-2">Vùng miền</h3>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => setSelectedRegion(r.key)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                        selectedRegion === r.key
                          ? "bg-primary text-white"
                          : "border border-hairline text-muted hover:border-primary hover:text-primary"
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loại nông sản */}
              <div>
                <h3 className="text-sm font-semibold text-ink mb-2">Loại nông sản</h3>
                <div className="flex flex-wrap gap-2">
                  {PRODUCTS_FILTER.map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedProduct(p)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                        selectedProduct === p
                          ? "bg-primary text-white"
                          : "border border-hairline text-muted hover:border-primary hover:text-primary"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loại canh tác */}
              <div>
                <h3 className="text-sm font-semibold text-ink mb-2">Loại canh tác</h3>
                <div className="flex flex-wrap gap-2">
                  {FARMING_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedFarming(t)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                        selectedFarming === t
                          ? "bg-primary text-white"
                          : "border border-hairline text-muted hover:border-primary hover:text-primary"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Xóa bộ lọc */}
              {hasActiveFilter && (
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  Xóa bộ lọc
                </Button>
              )}
            </div>

            {/* Danh sách tỉnh — grouped by region */}
            <div className="border-t border-hairline flex flex-col overflow-hidden">
              <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wide">
                  Kết quả ({filteredProvinces.length})
                </h3>
              </div>
              <div className="flex-1 flex flex-col gap-0.5 overflow-y-auto overscroll-contain px-3 pb-3 max-h-72">
                {PROVINCE_GROUPS.map((group) => {
                  const groupFiltered = filteredProvinces.filter(p => p.region === group.region);
                  if (groupFiltered.length === 0) return null;
                  const isExpanded = expandedRegion === group.region;

                  return (
                    <div key={group.region}>
                      <button
                        onClick={() => setExpandedRegion(isExpanded ? null : group.region)}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted uppercase tracking-wide hover:text-primary transition-colors"
                      >
                        <span>{group.label} ({groupFiltered.length})</span>
                        <ChevronRight
                          size={12}
                          className={cn("transition-transform", isExpanded && "rotate-90")}
                        />
                      </button>
                      {isExpanded && groupFiltered.map((prov) => (
                        <button
                          key={prov.code}
                          onClick={() => handleSelectProvince(prov)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all w-full",
                            selectedProvince?.code === prov.code
                              ? "bg-primary-ultra-light text-primary font-semibold"
                              : "text-muted hover:text-ink hover:bg-surface-soft"
                          )}
                        >
                          <MapPin
                            size={13}
                            className={selectedProvince?.code === prov.code ? "text-primary" : "text-muted"}
                          />
                          <span className="flex-1 truncate">{prov.nameVi}</span>
                          <span className="text-[11px] opacity-60">
                            {prov.activeFarms.toLocaleString("vi-VN")}
                          </span>
                        </button>
                      ))}
                    </div>
                  );
                })}
                {filteredProvinces.length === 0 && (
                  <p className="px-3 py-4 text-sm text-muted text-center">
                    Không tìm thấy tỉnh phù hợp
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Khu vực bản đồ ── */}
        <div className="flex-1 relative overflow-hidden bg-[#eef1ec]">
          <VietnamMapbox
            selectedProvinceCode={selectedProvince?.code ?? null}
            visibleProvinceCodes={filteredProvinceCodes}
            onProvinceClick={(code) => {
              const province = vietnamProvinces.find((item) => item.code === code);
              if (province) {
                setSelectedProvince(province);
              }
            }}
          />

          {/* Thanh công cụ trên bản đồ */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            {!showFilter && (
              <button
                onClick={() => setShowFilter(true)}
                className="h-9 bg-white rounded-lg shadow-md flex items-center gap-2 px-3 text-sm font-semibold text-muted hover:text-primary transition-colors"
              >
                <Filter size={15} />
                Bộ lọc
              </button>
            )}
          </div>

          {/* Panel thông tin tỉnh — right side */}
          {selectedProvince && (
            <div className="absolute top-4 right-4 sm:w-96 bg-white rounded-2xl shadow-lg border border-hairline z-10 animate-in slide-in-from-right-4 duration-300">
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-ink text-lg">{selectedProvince.nameVi || selectedProvince.name}</h3>
                    <p className="text-xs text-muted">{selectedProvince.regionVi || REGION_LABELS_VI[selectedProvince.region as Region]}</p>
                    {selectedProvince.sapNhap && selectedProvince.sapNhap !== "không sáp nhập" && (
                      <p className="text-xs text-muted mt-0.5 flex items-center gap-1">
                        <GitMerge size={10} /> {selectedProvince.sapNhap}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedProvince(null)}
                    className="w-8 h-8 rounded-full hover:bg-surface-soft flex items-center justify-center text-muted"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Thống kê — 2x2 grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-surface-green rounded-lg p-3">
                    <p className="text-xs text-muted flex items-center gap-1"><Users size={11} /> Dân số</p>
                    <p className="text-base font-bold text-primary">
                      {selectedProvince.danSo ? (selectedProvince.danSo / 1_000_000).toFixed(1) + "M" : "N/A"}
                    </p>
                  </div>
                  <div className="bg-surface-green rounded-lg p-3">
                    <p className="text-xs text-muted flex items-center gap-1"><Ruler size={11} /> Diện tích</p>
                    <p className="text-base font-bold text-ink">
                      {selectedProvince.dienTich ? selectedProvince.dienTich.toLocaleString("vi-VN") + " km²" : "N/A"}
                    </p>
                  </div>
                  <div className="bg-surface-green rounded-lg p-3">
                    <p className="text-xs text-muted flex items-center gap-1"><TrendingUp size={11} /> Nông trại</p>
                    <p className="text-base font-bold text-primary">
                      {selectedProvince.activeFarms.toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <div className="bg-surface-green rounded-lg p-3">
                    <p className="text-xs text-muted">Giá TB</p>
                    <p className="text-base font-bold text-ink">
                      {(selectedProvince.avgPrice / 1000).toFixed(0)}k₫/kg
                    </p>
                  </div>
                </div>

                {/* Sản phẩm */}
                <div className="mb-4">
                  <p className="text-xs text-muted mb-2">Nông sản chính</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProvince.products.map((p) => (
                      <Badge key={p} variant="organic">{p}</Badge>
                    ))}
                  </div>
                </div>

                {/* Loại canh tác */}
                <div className="mb-4">
                  <p className="text-xs text-muted mb-2">Loại canh tác</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProvince.farmingTypes.map((t) => (
                      <Badge key={t} variant="vietgap">{t}</Badge>
                    ))}
                  </div>
                </div>

                <Button size="sm" className="w-full" asChild>
                  <a href={`/marketplace?province=${selectedProvince.slug}`}>
                    Xem sản phẩm tại {selectedProvince.nameVi}
                    <ChevronRight size={14} />
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
