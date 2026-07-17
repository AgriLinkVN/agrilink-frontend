"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../api";
import type { ApiProvince } from "@/types/search";

export function useProvinces() {
  const query = useQuery({
    queryKey: ["provinces"],
    queryFn: ({ signal }) =>
      apiGet<ApiProvince[]>("/geography/provinces", undefined, signal),
    staleTime: 30 * 60 * 1000,
  });

  return {
    data: query.data ?? [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
