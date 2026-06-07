"use client";

import { useEffect, useState } from "react";

interface Props {
  min?: number;
  max?: number;
  onChange: (min: number | undefined, max: number | undefined) => void;
}

export function FilterPrice({ min, max, onChange }: Props) {
  const [minStr, setMinStr] = useState(min?.toString() ?? "");
  const [maxStr, setMaxStr] = useState(max?.toString() ?? "");

  useEffect(() => {
    setMinStr(min?.toString() ?? "");
    setMaxStr(max?.toString() ?? "");
  }, [min, max]);

  const commit = () => {
    const minN = minStr === "" ? undefined : Number(minStr);
    const maxN = maxStr === "" ? undefined : Number(maxStr);
    if (minN !== undefined && Number.isNaN(minN)) return;
    if (maxN !== undefined && Number.isNaN(maxN)) return;
    onChange(minN, maxN);
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-ink mb-3">Khoảng giá (đ)</h3>
      <div className="flex gap-2 items-center">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="Từ"
          value={minStr}
          onChange={(e) => setMinStr(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          className="w-full h-9 px-3 text-sm border border-border-strong rounded-lg outline-none focus:border-primary"
        />
        <span className="text-muted shrink-0">—</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="Đến"
          value={maxStr}
          onChange={(e) => setMaxStr(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          className="w-full h-9 px-3 text-sm border border-border-strong rounded-lg outline-none focus:border-primary"
        />
      </div>
    </div>
  );
}
