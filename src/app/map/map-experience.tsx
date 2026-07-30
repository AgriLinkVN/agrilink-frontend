"use client";

import {
  Check,
  ChevronRight,
  Filter,
  GitMerge,
  Layers3,
  MapPin,
  Ruler,
  Search,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { ResilientVietnamMap } from "@/components/map/resilient-vietnam-map";
import type { VietnamMapStyle } from "@/components/map/vietnam-mapbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { REGION_LABELS_VI, type Region } from "@/data/province-mapping";
import { cn } from "@/lib/utils";
import {
  vietnamProvinces,
  type VietnamProvince,
} from "@/lib/vietnam-provinces";

const REGIONS = [
  { key: "all", label: "Tất cả vùng" },
  { key: "North", label: "Miền Bắc" },
  { key: "Central", label: "Miền Trung" },
  { key: "Highlands", label: "Tây Nguyên" },
  { key: "South", label: "Miền Nam" },
] as const;

const PRODUCTS_FILTER = [
  "Tất cả",
  "Lúa gạo",
  "Rau củ",
  "Trái cây",
  "Cà phê",
  "Thủy sản",
] as const;

const QUICK_PRODUCTS = ["Lúa gạo", "Trái cây", "Cà phê", "Rau củ"] as const;

const FARMING_TYPES = [
  "Tất cả",
  "Hữu cơ",
  "VietGAP",
  "GlobalGAP",
  "Truyền thống",
] as const;

const FARMING_MAP: Record<string, string> = {
  "Hữu cơ": "Organic",
  VietGAP: "VietGAP",
  GlobalGAP: "GlobalGAP",
  "Truyền thống": "Traditional",
};

const PRODUCT_MAP: Record<string, string[]> = {
  "Lúa gạo": ["Rice", "ST25"],
  "Rau củ": ["Vegetables", "Carrot", "Garlic"],
  "Trái cây": [
    "Mango",
    "Durian",
    "Dragon fruit",
    "Longan",
    "Coconut",
    "Pomelo",
    "Orange",
    "Lychee",
    "Grape",
    "Pineapple",
    "Fruit",
    "Banana",
  ],
  "Cà phê": ["Coffee"],
  "Thủy sản": ["Seafood", "Shrimp", "Crab", "Fish", "Tuna"],
};

type AppliedFilters = {
  region: string;
  product: string;
  farming: string;
};

const DEFAULT_FILTERS: AppliedFilters = {
  region: "all",
  product: "Tất cả",
  farming: "Tất cả",
};

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLocaleLowerCase("vi")
    .trim();
}

function provinceHasProduct(province: VietnamProvince, productLabel: string) {
  if (productLabel === "Tất cả") return true;

  const keywords = PRODUCT_MAP[productLabel] ?? [];
  return province.products.some((product) =>
    keywords.some((keyword) =>
      normalizeSearch(product).includes(normalizeSearch(keyword)),
    ),
  );
}

function provinceMatchesSearch(province: VietnamProvince, query: string) {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return true;

  const nameMatches = [province.name, province.nameVi].some((name) =>
    normalizeSearch(name).includes(normalizedQuery),
  );
  const rawProductMatches = province.products.some((product) =>
    normalizeSearch(product).includes(normalizedQuery),
  );
  const productAliasMatches = Object.entries(PRODUCT_MAP).some(
    ([label, keywords]) =>
      normalizeSearch(label).includes(normalizedQuery) &&
      province.products.some((product) =>
        keywords.some((keyword) =>
          normalizeSearch(product).includes(normalizeSearch(keyword)),
        ),
      ),
  );

  return nameMatches || rawProductMatches || productAliasMatches;
}

function SelectableOption({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex min-h-11 items-center justify-between rounded-xl border px-3 text-left text-sm font-semibold transition-colors active:translate-y-px",
        active
          ? "border-primary bg-primary-ultra-light text-primary"
          : "border-hairline bg-white text-body-text hover:border-primary",
      )}
    >
      <span>{children}</span>
      {active ? <Check aria-hidden="true" size={16} /> : null}
    </button>
  );
}

function MapStyleSwitch({
  isMapboxReady,
  mapStyle,
  onChange,
  className,
}: {
  isMapboxReady: boolean;
  mapStyle: VietnamMapStyle;
  onChange: (style: VietnamMapStyle) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "items-center gap-1 rounded-xl border border-hairline bg-white p-1 shadow-md",
        className,
      )}
    >
      <span className="hidden items-center gap-1.5 px-2 text-sm font-semibold text-muted xl:flex">
        <Layers3 aria-hidden="true" size={16} />
        Nền bản đồ
      </span>
      {(
        [
          ["outdoors", "Địa hình"],
          ["satellite", "Vệ tinh"],
        ] as const
      ).map(([style, label]) => (
        <button
          key={style}
          type="button"
          disabled={!isMapboxReady}
          onClick={() => onChange(style)}
          aria-pressed={mapStyle === style}
          className={cn(
            "min-h-10 rounded-lg px-3 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-45",
            mapStyle === style
              ? "bg-primary text-white"
              : "text-muted hover:bg-surface-green hover:text-primary",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function MapExperience() {
  const searchAreaRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] =
    useState<VietnamProvince | null>(null);
  const [selectedRegion, setSelectedRegion] = useState(DEFAULT_FILTERS.region);
  const [selectedProduct, setSelectedProduct] = useState(
    DEFAULT_FILTERS.product,
  );
  const [selectedFarming, setSelectedFarming] = useState(
    DEFAULT_FILTERS.farming,
  );
  const [draftFilters, setDraftFilters] =
    useState<AppliedFilters>(DEFAULT_FILTERS);
  const [mapStyle, setMapStyle] = useState<VietnamMapStyle>("outdoors");
  const [isMapboxReady, setIsMapboxReady] = useState(false);
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        searchAreaRef.current &&
        !searchAreaRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setFilterOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const filteredProvinces = useMemo(
    () =>
      vietnamProvinces.filter((province) => {
        if (!provinceMatchesSearch(province, searchQuery)) return false;
        if (
          selectedRegion !== DEFAULT_FILTERS.region &&
          province.region !== selectedRegion
        ) {
          return false;
        }
        if (!provinceHasProduct(province, selectedProduct)) return false;
        if (selectedFarming !== DEFAULT_FILTERS.farming) {
          const farmingKey = FARMING_MAP[selectedFarming];
          if (
            farmingKey &&
            !province.farmingTypes.includes(farmingKey)
          ) {
            return false;
          }
        }

        return true;
      }),
    [searchQuery, selectedFarming, selectedProduct, selectedRegion],
  );

  const activeFilterCount = [
    selectedRegion !== DEFAULT_FILTERS.region,
    selectedProduct !== DEFAULT_FILTERS.product,
    selectedFarming !== DEFAULT_FILTERS.farming,
  ].filter(Boolean).length;

  const hasActiveSearchOrFilter =
    Boolean(searchQuery.trim()) || activeFilterCount > 0;

  const filteredProvinceCodes = useMemo(
    () =>
      hasActiveSearchOrFilter
        ? filteredProvinces.map((province) => province.code)
        : undefined,
    [filteredProvinces, hasActiveSearchOrFilter],
  );

  const selectedProvinceMatchesFilters =
    !selectedProvince ||
    filteredProvinces.some(
      (province) => province.code === selectedProvince.code,
    );

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedRegion(DEFAULT_FILTERS.region);
    setSelectedProduct(DEFAULT_FILTERS.product);
    setSelectedFarming(DEFAULT_FILTERS.farming);
    setDraftFilters(DEFAULT_FILTERS);
  }, []);

  const openFilterPanel = () => {
    setDraftFilters({
      region: selectedRegion,
      product: selectedProduct,
      farming: selectedFarming,
    });
    setSearchOpen(false);
    setFilterOpen(true);
  };

  const applyDraftFilters = () => {
    setSelectedRegion(draftFilters.region);
    setSelectedProduct(draftFilters.product);
    setSelectedFarming(draftFilters.farming);
    setFilterOpen(false);
  };

  const selectProvince = useCallback((province: VietnamProvince) => {
    setSelectedProvince(province);
    setSearchOpen(false);
  }, []);

  const selectSuggestedProvince = (province: VietnamProvince) => {
    setSearchQuery(province.nameVi);
    selectProvince(province);
  };

  const applyQuickProduct = (product: string) => {
    setSearchQuery("");
    setSelectedProduct(product);
    setSearchOpen(false);
  };

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const firstResult = filteredProvinces[0];
    if (firstResult) selectProvince(firstResult);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-canvas">
      <Navbar />

      <main className="relative min-h-0 flex-1 overflow-hidden bg-[#eef1ec]">
        <ResilientVietnamMap
          mapStyle={mapStyle}
          selectedProvinceCode={selectedProvince?.code ?? null}
          visibleProvinceCodes={filteredProvinceCodes}
          onMapboxReadyChange={setIsMapboxReady}
          onProvinceClick={(code) => {
            const province = vietnamProvinces.find(
              (item) => item.code === code,
            );
            if (province) selectProvince(province);
          }}
        />

        <div
          ref={searchAreaRef}
          className="absolute left-3 right-3 top-3 z-40 max-w-2xl sm:left-4 sm:right-auto sm:top-4 sm:w-[min(640px,calc(100%-32px))]"
        >
          <form
            onSubmit={submitSearch}
            className="flex min-h-14 items-center gap-2 rounded-2xl border border-hairline bg-white p-1.5 shadow-[0_12px_32px_rgba(27,67,50,0.16)]"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <Search
                aria-hidden="true"
                className="shrink-0 text-muted"
                size={20}
              />
              <input
                type="search"
                role="combobox"
                aria-label="Tìm tỉnh thành hoặc loại nông sản"
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setSearchOpen(true);
                }}
                placeholder="Tìm tỉnh thành, nông sản..."
                autoComplete="off"
                aria-autocomplete="list"
                aria-controls="map-search-suggestions"
                aria-expanded={searchOpen}
                className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchOpen(true);
                  }}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-muted hover:bg-surface-soft hover:text-ink"
                  aria-label="Xóa nội dung tìm kiếm"
                >
                  <X aria-hidden="true" size={18} />
                </button>
              ) : null}
            </div>

            <Button
              type="submit"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-xl"
              aria-label="Tìm trên bản đồ"
            >
              <Search aria-hidden="true" size={19} />
            </Button>

            <button
              type="button"
              onClick={openFilterPanel}
              className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary text-primary transition-colors hover:bg-surface-green active:translate-y-px"
              aria-label={
                activeFilterCount
                  ? `Mở bộ lọc, đang áp dụng ${activeFilterCount} lựa chọn`
                  : "Mở bộ lọc"
              }
            >
              <Filter aria-hidden="true" size={19} />
              {activeFilterCount ? (
                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>
          </form>

          {searchOpen ? (
            <section
              id="map-search-suggestions"
              className="mt-2 overflow-hidden rounded-2xl border border-hairline bg-white shadow-[0_16px_40px_rgba(27,67,50,0.18)]"
              aria-label="Gợi ý tìm kiếm"
            >
              {!searchQuery.trim() ? (
                <div className="border-b border-hairline p-4">
                  <p className="mb-3 text-sm font-bold text-ink">Tìm nhanh</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_PRODUCTS.map((product) => (
                      <button
                        key={product}
                        type="button"
                        onClick={() => applyQuickProduct(product)}
                        className="min-h-10 rounded-full border border-hairline px-4 text-sm font-semibold text-body-text transition-colors hover:border-primary hover:text-primary active:translate-y-px"
                      >
                        {product}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="p-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <p className="text-sm font-bold text-ink">
                    {searchQuery.trim() ? "Kết quả phù hợp" : "Gợi ý tỉnh thành"}
                  </p>
                  <span className="text-sm font-semibold text-primary">
                    {filteredProvinces.length} tỉnh
                  </span>
                </div>

                {filteredProvinces.length ? (
                  filteredProvinces.slice(0, 5).map((province) => (
                    <button
                      key={province.code}
                      type="button"
                      onClick={() => selectSuggestedProvince(province)}
                      className="flex min-h-14 w-full items-center gap-3 rounded-xl px-3 text-left transition-colors hover:bg-surface-green active:translate-y-px"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-ultra-light text-primary">
                        <MapPin aria-hidden="true" size={19} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <strong className="block truncate text-sm text-ink">
                          {province.nameVi}
                        </strong>
                        <span className="block truncate text-sm text-muted">
                          {REGION_LABELS_VI[province.region as Region]} ·{" "}
                          {province.products.slice(0, 2).join(", ")}
                        </span>
                      </span>
                      <ChevronRight
                        aria-hidden="true"
                        className="shrink-0 text-muted"
                        size={18}
                      />
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-7 text-center">
                    <p className="font-semibold text-ink">
                      Không tìm thấy tỉnh phù hợp
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Thử từ khóa ngắn hơn hoặc xóa bộ lọc đang áp dụng.
                    </p>
                    {hasActiveSearchOrFilter ? (
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="mt-3 min-h-11 font-semibold text-primary hover:underline"
                      >
                        Xóa tìm kiếm và bộ lọc
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            </section>
          ) : null}

          {!searchOpen && hasActiveSearchOrFilter ? (
            <div className="mt-2 flex min-h-11 items-center justify-between gap-3 rounded-xl border border-hairline bg-white px-3 shadow-sm">
              <span className="truncate text-sm font-semibold text-body-text">
                {filteredProvinces.length} tỉnh phù hợp
              </span>
              <button
                type="button"
                onClick={clearAllFilters}
                className="shrink-0 text-sm font-bold text-primary hover:underline"
              >
                Xóa lọc
              </button>
            </div>
          ) : null}

          {!searchOpen && !filterOpen ? (
            <MapStyleSwitch
              className="ml-auto mt-2 flex w-fit lg:hidden"
              isMapboxReady={isMapboxReady}
              mapStyle={mapStyle}
              onChange={setMapStyle}
            />
          ) : null}
        </div>

        {filterOpen ? (
          <>
            <button
              type="button"
              aria-label="Đóng bộ lọc"
              className="absolute inset-0 z-20 bg-scrim/20 sm:bg-transparent"
              onClick={() => setFilterOpen(false)}
            />
            <section
              role="dialog"
              aria-label="Bộ lọc bản đồ"
              className="absolute bottom-3 left-3 right-3 top-[80px] z-30 flex flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-[0_20px_48px_rgba(27,67,50,0.2)] sm:bottom-auto sm:left-4 sm:right-auto sm:top-[84px] sm:max-h-[calc(100%-100px)] sm:w-[360px]"
            >
              <header className="flex items-center justify-between border-b border-hairline px-5 py-4">
                <div>
                  <h2 className="text-lg font-bold text-ink">
                    Lọc kết quả bản đồ
                  </h2>
                  <p className="mt-0.5 text-sm text-muted">
                    Chỉ chọn những mục bạn thực sự cần.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-muted hover:bg-surface-soft hover:text-ink"
                  aria-label="Đóng bộ lọc"
                >
                  <X aria-hidden="true" size={20} />
                </button>
              </header>

              <div className="flex-1 space-y-6 overflow-y-auto p-5">
                <fieldset>
                  <legend className="mb-3 text-base font-bold text-ink">
                    Vùng miền
                  </legend>
                  <div className="grid grid-cols-2 gap-2">
                    {REGIONS.map((region) => (
                      <SelectableOption
                        key={region.key}
                        active={draftFilters.region === region.key}
                        onClick={() =>
                          setDraftFilters((current) => ({
                            ...current,
                            region: region.key,
                          }))
                        }
                      >
                        {region.label}
                      </SelectableOption>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="mb-3 text-base font-bold text-ink">
                    Loại nông sản
                  </legend>
                  <div className="grid grid-cols-2 gap-2">
                    {PRODUCTS_FILTER.map((product) => (
                      <SelectableOption
                        key={product}
                        active={draftFilters.product === product}
                        onClick={() =>
                          setDraftFilters((current) => ({
                            ...current,
                            product,
                          }))
                        }
                      >
                        {product}
                      </SelectableOption>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="mb-3 text-base font-bold text-ink">
                    Phương thức canh tác
                  </legend>
                  <div className="grid grid-cols-2 gap-2">
                    {FARMING_TYPES.map((farming) => (
                      <SelectableOption
                        key={farming}
                        active={draftFilters.farming === farming}
                        onClick={() =>
                          setDraftFilters((current) => ({
                            ...current,
                            farming,
                          }))
                        }
                      >
                        {farming}
                      </SelectableOption>
                    ))}
                  </div>
                </fieldset>
              </div>

              <footer className="grid grid-cols-[auto_1fr] gap-3 border-t border-hairline bg-surface-soft p-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="px-4"
                  onClick={() => setDraftFilters(DEFAULT_FILTERS)}
                >
                  Xóa chọn
                </Button>
                <Button type="button" onClick={applyDraftFilters}>
                  Áp dụng bộ lọc
                </Button>
              </footer>
            </section>
          </>
        ) : null}

        <MapStyleSwitch
          className="absolute right-4 top-4 z-10 hidden lg:flex"
          isMapboxReady={isMapboxReady}
          mapStyle={mapStyle}
          onChange={setMapStyle}
        />

        {selectedProvince ? (
          <aside className="absolute bottom-3 left-3 right-3 z-20 max-h-[54vh] overflow-y-auto rounded-2xl border border-hairline bg-white shadow-[0_18px_44px_rgba(27,67,50,0.2)] sm:bottom-auto sm:left-auto sm:right-4 sm:top-[136px] sm:w-96 lg:top-20">
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-ink">
                    {selectedProvince.nameVi || selectedProvince.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {selectedProvince.regionVi ||
                      REGION_LABELS_VI[selectedProvince.region as Region]}
                  </p>
                  {selectedProvince.sapNhap &&
                  selectedProvince.sapNhap !== "không sáp nhập" ? (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                      <GitMerge aria-hidden="true" size={14} />
                      {selectedProvince.sapNhap}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProvince(null)}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-muted hover:bg-surface-soft hover:text-ink"
                  aria-label="Đóng thông tin tỉnh"
                >
                  <X aria-hidden="true" size={20} />
                </button>
              </div>

              {!selectedProvinceMatchesFilters ? (
                <div className="mt-4 rounded-xl bg-surface-green px-3 py-2.5 text-sm text-body-text">
                  Tỉnh đang chọn nằm ngoài bộ lọc hiện tại.
                </div>
              ) : null}

              <div className="my-5 grid grid-cols-3 divide-x divide-hairline border-y border-hairline py-3 text-center">
                <div className="px-2">
                  <Users
                    aria-hidden="true"
                    className="mx-auto text-primary"
                    size={17}
                  />
                  <strong className="mt-1 block text-sm text-ink">
                    {selectedProvince.danSo
                      ? `${(selectedProvince.danSo / 1_000_000).toFixed(1)} triệu`
                      : "Chưa có"}
                  </strong>
                  <span className="text-xs text-muted">Dân số</span>
                </div>
                <div className="px-2">
                  <Ruler
                    aria-hidden="true"
                    className="mx-auto text-primary"
                    size={17}
                  />
                  <strong className="mt-1 block text-sm text-ink">
                    {selectedProvince.dienTich
                      ? `${selectedProvince.dienTich.toLocaleString("vi-VN")} km²`
                      : "Chưa có"}
                  </strong>
                  <span className="text-xs text-muted">Diện tích</span>
                </div>
                <div className="px-2">
                  <TrendingUp
                    aria-hidden="true"
                    className="mx-auto text-primary"
                    size={17}
                  />
                  <strong className="mt-1 block text-sm text-ink">
                    {selectedProvince.activeFarms.toLocaleString("vi-VN")}
                  </strong>
                  <span className="text-xs text-muted">Nông trại</span>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-bold text-ink">
                  Nông sản nổi bật
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedProvince.products.slice(0, 4).map((product) => (
                    <Badge key={product} variant="organic">
                      {product}
                    </Badge>
                  ))}
                </div>
              </div>

            </div>
          </aside>
        ) : null}
      </main>
    </div>
  );
}
