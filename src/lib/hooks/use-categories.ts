"use client";

import { useEffect, useState } from "react";
import { apiGet } from "../api";
import type { ApiProductCategory } from "@/types/search";

export function useCategories() {
  const [data, setData] = useState<ApiProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    apiGet<ApiProductCategory[]>("/products/categories/tree", undefined, ac.signal)
      .then((res) => setData(res))
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, []);

  return { data, loading, error };
}
