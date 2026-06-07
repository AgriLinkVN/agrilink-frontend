"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterCategory } from "./filter-category";
import { FilterProvince } from "./filter-province";
import { FilterPrice } from "./filter-price";
import { FilterFarming } from "./filter-farming";
import type {
  ApiFarmingType,
  ApiProductCategory,
  ApiProvince,
  SearchFilter,
} from "@/types/search";

interface Props {
  filter: SearchFilter;
  categories: ApiProductCategory[];
  provinces: ApiProvince[];
  onChange: (patch: Partial<SearchFilter>) => void;
  onReset: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function FilterPanel({
  filter,
  categories,
  provinces,
  onChange,
  onReset,
  mobileOpen,
  onMobileClose,
}: Props) {
  const body = (
    <div className="flex flex-col gap-6">
      <FilterCategory
        categories={categories}
        selectedId={filter.categoryId}
        onChange={(categoryId) => onChange({ categoryId })}
      />
      <FilterProvince
        provinces={provinces}
        selectedId={filter.provinceId}
        onChange={(provinceId) => onChange({ provinceId })}
      />
      <FilterPrice
        min={filter.minPrice}
        max={filter.maxPrice}
        onChange={(minPrice, maxPrice) => onChange({ minPrice, maxPrice })}
      />
      <FilterFarming
        value={filter.farmingType}
        onChange={(farmingType: ApiFarmingType | undefined) => onChange({ farmingType })}
      />
      <Button variant="secondary" size="sm" onClick={onReset}>
        Xoá bộ lọc
      </Button>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-60 shrink-0 hidden lg:block">
        <div className="sticky top-24">{body}</div>
      </aside>

      {/* Mobile bottom sheet */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onMobileClose}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-white rounded-t-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-ink">Bộ lọc</h2>
              <button onClick={onMobileClose} aria-label="Đóng">
                <X size={20} className="text-muted" />
              </button>
            </div>
            {body}
          </div>
        </div>
      )}
    </>
  );
}
