"use client";

import type { ApiFarmingType } from "@/types/search";

const OPTIONS: { value: ApiFarmingType; label: string }[] = [
  { value: "organic", label: "Hữu cơ" },
  { value: "vietgap", label: "VietGAP" },
  { value: "globalgap", label: "GlobalGAP" },
  { value: "traditional", label: "Truyền thống" },
];

interface Props {
  value?: ApiFarmingType;
  onChange: (value: ApiFarmingType | undefined) => void;
}

export function FilterFarming({ value, onChange }: Props) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-ink mb-3">Loại canh tác</h3>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            name="farming"
            checked={!value}
            onChange={() => onChange(undefined)}
            className="accent-primary"
          />
          <span className="text-sm text-muted group-hover:text-ink">Tất cả</span>
        </label>
        {OPTIONS.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="farming"
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="accent-primary"
            />
            <span className="text-sm text-muted group-hover:text-ink">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
