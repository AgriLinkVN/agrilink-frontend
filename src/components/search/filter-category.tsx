"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ApiProductCategory } from "@/types/search";

interface Props {
  categories: ApiProductCategory[];
  selectedId?: string;
  onChange: (id: string | undefined) => void;
}

export function FilterCategory({ categories, selectedId, onChange }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-ink mb-3">Danh mục</h3>
      <ul className="flex flex-col gap-1">
        <li>
          <button
            onClick={() => onChange(undefined)}
            className={cn(
              "w-full text-left px-2 py-1.5 rounded text-sm transition-colors",
              !selectedId
                ? "bg-primary-ultra-light text-primary font-semibold"
                : "text-muted hover:text-ink hover:bg-surface-soft",
            )}
          >
            Tất cả danh mục
          </button>
        </li>
        {categories.map((root) => {
          const hasChildren = (root.children?.length ?? 0) > 0;
          const isOpen = expanded.has(root.id);
          return (
            <li key={root.id}>
              <div className="flex items-center">
                {hasChildren && (
                  <button
                    type="button"
                    onClick={() => toggle(root.id)}
                    aria-label={isOpen ? "Thu gọn" : "Mở rộng"}
                    className="p-1 text-muted hover:text-ink"
                  >
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                )}
                <button
                  onClick={() => onChange(root.id)}
                  className={cn(
                    "flex-1 text-left px-2 py-1.5 rounded text-sm transition-colors",
                    selectedId === root.id
                      ? "bg-primary-ultra-light text-primary font-semibold"
                      : "text-muted hover:text-ink hover:bg-surface-soft",
                  )}
                >
                  {root.name}
                </button>
              </div>
              {hasChildren && isOpen && (
                <ul className="ml-6 mt-1 flex flex-col gap-0.5">
                  {root.children!.map((child) => (
                    <li key={child.id}>
                      <button
                        onClick={() => onChange(child.id)}
                        className={cn(
                          "w-full text-left px-2 py-1 rounded text-xs transition-colors",
                          selectedId === child.id
                            ? "bg-primary-ultra-light text-primary font-semibold"
                            : "text-muted hover:text-ink hover:bg-surface-soft",
                        )}
                      >
                        {child.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
