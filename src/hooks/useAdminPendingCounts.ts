"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";

interface PendingCounts {
  profiles: number;
  products: number;
  disputes: number;
}

let cachedCounts: PendingCounts = { profiles: 0, products: 0, disputes: 0 };
const listeners: Set<(c: PendingCounts) => void> = new Set();
let pollTimer: ReturnType<typeof setInterval> | null = null;

function startPolling(token: string) {
  if (pollTimer) return;
  const poll = () => {
    api.get<{
      pendingProfiles?: { total?: number };
      pendingProducts?: number;
      openDisputes?: number;
    }>("/admin/stats", token)
      .then((data) => {
        if (data?.pendingProfiles) {
          const next: PendingCounts = {
            profiles: data.pendingProfiles?.total ?? 0,
            products: data.pendingProducts ?? 0,
            disputes: data.openDisputes ?? 0,
          };
          cachedCounts = next;
          listeners.forEach((fn) => fn(next));
        }
      })
      .catch(() => {});
  };

  poll();
  pollTimer = setInterval(poll, 30000);
}

function subscribe(cb: (c: PendingCounts) => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

export function useAdminPendingCounts() {
  const token = useAuthStore((s) => s.accessToken);
  const cbRef = useRef<((c: PendingCounts) => void) | undefined>(undefined);

  useEffect(() => {
    if (!token) return;
    startPolling(token);
    return subscribe((c) => {
      cbRef.current?.(c);
    });
  }, [token]);

  const setCallback = useCallback((cb: (c: PendingCounts) => void) => {
    cbRef.current = cb;
  }, []);

  return { counts: cachedCounts, setCallback };
}
