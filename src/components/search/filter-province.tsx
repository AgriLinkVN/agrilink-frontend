"use client";

import { cn } from "@/lib/utils";
import type { ApiProvince } from "@/types/search";

interface Props {
  provinces: ApiProvince[];
  selectedId?: string;
  onChange: (id: string | undefined) => void;
}

export function FilterProvince({ provinces, selectedId, onChange }: Props) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-ink mb-3">Tỉnh / vùng</h3>
      <select
        value={selectedId ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className={cn(
          "w-full h-9 px-3 text-sm border border-border-strong rounded-lg outline-none",
          "focus:border-primary bg-white",
        )}
      >
        <option value="">Tất cả</option>
        {provinces.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}
