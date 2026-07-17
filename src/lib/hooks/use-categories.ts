"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../api";
import type { ApiProductCategory } from "@/types/search";

export function useCategories() {
  const query = useQuery({
    queryKey: ["categories", "tree"],
    queryFn: ({ signal }) =>
      apiGet<ApiProductCategory[]>("/products/categories/tree", undefined, signal),
    staleTime: 10 * 60 * 1000,
  });

  return {
    data: query.data ?? [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
