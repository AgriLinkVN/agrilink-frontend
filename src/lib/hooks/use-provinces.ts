"use client";

import { useEffect, useState } from "react";
import { apiGet } from "../api";
import type { ApiProvince } from "@/types/search";

export function useProvinces() {
  const [data, setData] = useState<ApiProvince[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    apiGet<ApiProvince[]>("/geography/provinces", undefined, ac.signal)
      .then((res) => setData(res))
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, []);

  return { data, loading, error };
}
