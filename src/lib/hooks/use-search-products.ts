"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiGet } from "../api";
import type {
  ApiProduct,
  ProductListResponse,
  SearchFilter,
} from "@/types/search";

const PAGE_SIZE = 20;

interface State {
  items: ApiProduct[];
  total: number;
  page: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
}

const initialState: State = {
  items: [],
  total: 0,
  page: 0,
  loading: true,
  loadingMore: false,
  error: null,
  hasMore: true,
};

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
  const [state, setState] = useState<State>(initialState);
  const filterKey = JSON.stringify(filter);
  const abortRef = useRef<AbortController | null>(null);

  // Reset + fetch page 1 whenever filter changes
  useEffect(() => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setState({ ...initialState });

    apiGet<ProductListResponse>(
      "/products",
      buildParams(filter, 1),
      ac.signal,
    )
      .then((res) => {
        setState({
          items: res.data,
          total: res.total,
          page: 1,
          loading: false,
          loadingMore: false,
          error: null,
          hasMore: res.data.length === PAGE_SIZE && res.data.length < res.total,
        });
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        setState((s) => ({ ...s, loading: false, error: e.message }));
      });

    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  const loadMore = useCallback(() => {
    setState((s) => {
      if (s.loading || s.loadingMore || !s.hasMore) return s;
      const nextPage = s.page + 1;

      const ac = new AbortController();
      apiGet<ProductListResponse>(
        "/products",
        buildParams(filter, nextPage),
        ac.signal,
      )
        .then((res) => {
          setState((prev) => {
            const items = [...prev.items, ...res.data];
            return {
              ...prev,
              items,
              page: nextPage,
              loadingMore: false,
              hasMore: res.data.length === PAGE_SIZE && items.length < res.total,
            };
          });
        })
        .catch((e) => {
          if (e.name === "AbortError") return;
          setState((prev) => ({ ...prev, loadingMore: false, error: e.message }));
        });

      return { ...s, loadingMore: true };
    });
  }, [filter]);

  return { ...state, loadMore };
}
