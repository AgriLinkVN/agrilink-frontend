"use client";

import { cn } from "@/lib/utils";
import type { SortBy, SortOrder } from "@/types/search";

interface Props {
  total: number;
  sortBy: SortBy;
  order: SortOrder;
  onChange: (sortBy: SortBy, order: SortOrder) => void;
}

const OPTIONS: { label: string; sortBy: SortBy; order: SortOrder }[] = [
  { label: "Mới nhất", sortBy: "createdAt", order: "DESC" },
  { label: "Giá tăng dần", sortBy: "pricePerUnit", order: "ASC" },
  { label: "Giá giảm dần", sortBy: "pricePerUnit", order: "DESC" },
];

export function SortBar({ total, sortBy, order, onChange }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
      <p className="text-sm text-muted">
        Tìm thấy <span className="font-semibold text-ink">{total.toLocaleString("vi-VN")}</span> sản phẩm
      </p>
      <div className="flex items-center gap-1 border border-hairline rounded-lg p-1">
        {OPTIONS.map((opt) => {
          const active = opt.sortBy === sortBy && opt.order === order;
          return (
            <button
              key={opt.label}
              onClick={() => onChange(opt.sortBy, opt.order)}
              className={cn(
                "px-3 h-8 rounded text-sm transition-colors",
                active
                  ? "bg-primary text-white"
                  : "text-muted hover:text-ink",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
