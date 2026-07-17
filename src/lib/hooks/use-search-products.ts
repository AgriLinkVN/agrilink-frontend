"use client";

import { useCallback, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiGet } from "../api";
import type {
  ProductListResponse,
  SearchFilter,
} from "@/types/search";

const PAGE_SIZE = 20;

function buildParams(filter: SearchFilter, page: number) {
  return {
    search: filter.search,
    categoryId: filter.categoryId,
    provinceId: filter.provinceId,
    minPrice: filter.minPrice,
    maxPrice: filter.maxPrice,
    farmingType: filter.farmingType,
    sortBy: filter.sortBy,
    order: filter.order,
    page,
    limit: PAGE_SIZE,
  };
}

export function useSearchProducts(filter: SearchFilter) {
  const query = useInfiniteQuery({
    queryKey: ["products", "search", filter],
    queryFn: ({ pageParam, signal }) =>
      apiGet<ProductListResponse>(
        "/products",
        buildParams(filter, pageParam),
        signal,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      const loaded = pages.reduce((sum, page) => sum + page.data.length, 0);
      if (lastPage.data.length < PAGE_SIZE || loaded >= lastPage.total) return undefined;
      return pages.length + 1;
    },
    staleTime: 30_000,
  });

  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data],
  );
  const total = query.data?.pages[0]?.total ?? 0;
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = query;

  const loadMore = useCallback(() => {
    if (isPending || isFetchingNextPage || !hasNextPage) return;
    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isPending]);

  return {
    items,
    total,
    page: query.data?.pages.length ?? 0,
    loading: isPending,
    loadingMore: isFetchingNextPage,
    error: query.error instanceof Error ? query.error.message : null,
    hasMore: hasNextPage,
    loadMore,
  };
}
