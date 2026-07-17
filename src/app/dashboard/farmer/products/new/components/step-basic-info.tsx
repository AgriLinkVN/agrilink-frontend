"use client";

import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Package, DollarSign, Layers, MapPin,
  Calendar, ArrowRight, Wheat, Ruler,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FARMING_TYPE_OPTIONS,
  UNIT_LABELS,
  FALLBACK_CATEGORIES,
} from "@/lib/products-api";
import { vietnamProvinces } from "@/lib/vietnam-provinces";
import type { ProductFormData } from "../types";

interface StepBasicInfoProps {
  data: ProductFormData;
  onChange: (data: Partial<ProductFormData>) => void;
  onNext: () => void;
}

const UNIT_OPTIONS = Object.entries(UNIT_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function StepBasicInfo({ data, onChange, onNext }: StepBasicInfoProps) {
  const canProceed =
    data.name.trim() !== "" &&
    data.price > 0 &&
    data.unit !== "" &&
    data.availableQuantity > 0;

  return (
    <div>
      <h2 className="text-xl font-bold text-ink mb-1">Thông tin cơ bản</h2>
      <p className="text-sm text-muted mb-6">
        Điền đầy đủ thông tin sản phẩm để người mua dễ dàng tìm kiếm
      </p>

      <div className="flex flex-col gap-5">
        <Input
          label="Tên sản phẩm *"
          placeholder="VD: Xoài cát Hòa Lộc loại 1"
          leftIcon={<Package size={16} />}
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />

        <Textarea
          label="Mô tả sản phẩm"
          placeholder="Mô tả chi tiết về sản phẩm: nguồn gốc, đặc điểm, cách trồng, bảo quản..."
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
        />

        {/* Danh mục */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Danh mục *</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              <Layers size={16} />
            </div>
            <select
              value={data.categoryId}
              onChange={(e) => onChange({ categoryId: e.target.value })}
              className="w-full h-12 pl-10 pr-4 rounded-lg border border-border-strong bg-white text-base text-ink transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none"
            >
              <option value="">Chọn danh mục</option>
              {FALLBACK_CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Phương thức canh tác */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">
            Phương thức canh tác *
          </label>
          <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:grid-cols-4">
            {FARMING_TYPE_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => onChange({ farmingType: value })}
                className={cn(
                  "flex min-w-0 items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                  data.farmingType === value
                    ? "border-primary bg-surface-green text-primary"
                    : "border-hairline bg-white text-muted hover:border-primary-light hover:text-ink"
                )}
              >
                <Wheat size={14} className="shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Giá & Đơn vị */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">Giá bán *</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <DollarSign size={16} />
              </div>
              <input
                type="number"
                min={0}
                placeholder="45,000"
                value={data.price || ""}
                onChange={(e) =>
                  onChange({ price: Number(e.target.value) })
                }
                className="w-full h-12 pl-10 pr-14 rounded-lg border border-border-strong bg-white text-base text-ink placeholder:text-muted-soft transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted">
                VNĐ
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">Đơn vị *</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <Ruler size={16} />
              </div>
              <select
                value={data.unit}
                onChange={(e) => onChange({ unit: e.target.value })}
                className="w-full h-12 pl-10 pr-4 rounded-lg border border-border-strong bg-white text-base text-ink transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none"
              >
                <option value="">Chọn đơn vị</option>
                {UNIT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tồn kho & Đặt hàng tối thiểu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Số lượng tồn kho *"
            type="number"
            min={0}
            placeholder="500"
            leftIcon={<Package size={16} />}
            value={data.availableQuantity || ""}
            onChange={(e) =>
              onChange({ availableQuantity: Number(e.target.value) })
            }
          />
          <Input
            label="Đặt hàng tối thiểu"
            type="number"
            min={0}
            placeholder="10"
            leftIcon={<Package size={16} />}
            hint="Để trống nếu không giới hạn"
            value={data.minOrderQuantity || ""}
            onChange={(e) =>
              onChange({ minOrderQuantity: Number(e.target.value) })
            }
          />
        </div>

        {/* Tỉnh/thành & Ngày thu hoạch */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">
              Tỉnh / Thành phố
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <MapPin size={16} />
              </div>
              <select
                value={data.provinceId}
                onChange={(e) => onChange({ provinceId: e.target.value })}
                className="w-full h-12 pl-10 pr-4 rounded-lg border border-border-strong bg-white text-base text-ink transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none"
              >
                <option value="">Chọn tỉnh / thành</option>
                {vietnamProvinces.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.nameVi}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Ngày thu hoạch (dự kiến)"
            type="date"
            leftIcon={<Calendar size={16} />}
            value={data.harvestDate}
            onChange={(e) => onChange({ harvestDate: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-8">
        <Button
          size="lg"
          className="w-full"
          disabled={!canProceed}
          onClick={onNext}
        >
          Tiếp theo: Upload ảnh <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}
