"use client";

import { Search } from "lucide-react";
import { useState } from "react";

interface Props {
  defaultValue?: string;
  onSubmit: (value: string) => void;
}

export function SearchBar({ defaultValue = "", onSubmit }: Props) {
  const [value, setValue] = useState(defaultValue);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value.trim());
      }}
      className="flex items-center gap-2 h-12 px-4 rounded-full border border-hairline bg-white card-shadow w-full"
    >
      <Search size={18} className="text-muted shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tìm sản phẩm, vùng trồng, HTX..."
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-soft"
        aria-label="Tìm kiếm sản phẩm"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            onSubmit("");
          }}
          className="text-xs text-muted hover:text-ink"
        >
          Xoá
        </button>
      )}
    </form>
  );
}
